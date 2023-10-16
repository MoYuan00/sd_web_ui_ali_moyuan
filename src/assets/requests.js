import axios from "axios"
import _ from "lodash"

// axios.defaults.withCredentials = true// Cookie跨域

const baseURL = 'http://30.13.114.5:7860/'
const instance = axios.create({
    baseURL: baseURL,
    timeout: 1000,
    headers: {
        'X-Custom-Header': 'foobar',
        // 'Access-Control-Allow-Private-Network': true,
        // 'Access-Control-Allow-Credentials': true,
        'vary':'Accept-Encoding'
    },
    // withCredentials: true,
    crossDomain: true,
    timeout: 100000000
});



function getURL(path) {
    return baseURL + path;
}

// 处理请求参数
// const coverFormData = (obj) => {
//     let data = Object.keys(obj.data).map(item => {
//         let value = obj.data[item];
//         if (_.isArray(value) || _.isObject(value)) {
//             value = JSON.stringify(value)
//         }
//         return encodeURIComponent(item) + '=' + encodeURIComponent(value);
//     }).join('&');

//     return { data: data, url: obj.url };
// }


const coverFormData = (obj) => {
    let data = Object.keys(obj).map(item => {
        let value = obj[item];
        if (_.isArray(value) || _.isObject(value)) {
            value = JSON.stringify(value)
        }
        return encodeURIComponent(item) + '=' + encodeURIComponent(value);
    }).join('&');

    return data;
}

function post(url, data) {
    // const { data, url } = coverFormData(obj);
    console.log("post " + url);
    return new Promise((resolve, reject) => {
        instance.post(url, data)
            .then(res => {
                // obj.success ? obj.success(res) : null
                console.group("post response " + url);
                console.log(res.data);
                console.groupEnd();
                resolve(res.data);
            })
            .catch(error => {
                // obj.error ? obj.error(error) : null;
                console.group("post response error " + url);
                console.error(error);
                console.groupEnd();
                reject(error);
            })
    })

}

function get(url, data) {
    // const { data, url } = coverFormData(obj);
    console.log("get " + url);
    return new Promise((resolve, reject) => {
        instance.get(url, {params: data})
            .then(res => {
                // obj.success ? obj.success(res) : null
                console.group("get response " + url);
                console.log(res.data);
                console.groupEnd();
                resolve(res.data);
            })
            .catch(error => {
                // obj.error ? obj.error(error) : null;
                console.group("post response error " + url);
                console.error(error);
                console.groupEnd();
                reject(error);
            })
    })

}

function getBlob(url, data) {
    // const { data, url } = coverFormData(obj);
    console.log("get " + url);
    return new Promise((resolve, reject) => {
        instance.get(url, {params: data,  responseType:'blob'})
            .then(res => {
                // obj.success ? obj.success(res) : null
                console.group("get response " + url);
                console.log(res.data);
                console.groupEnd();
                resolve(res.data);
            })
            .catch(error => {
                // obj.error ? obj.error(error) : null;
                console.group("post response error " + url);
                console.error(error);
                console.groupEnd();
                reject(error);
            })
    })

}

let requests = {}
requests.post = post
requests.get = get
requests.getURL = getURL
requests.getBlob = getBlob
requests.coverFormData = coverFormData

export default requests