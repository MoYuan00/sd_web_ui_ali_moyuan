import requests from "./requests";
// import ali_Client from "./ali-translate-api";

const api = {}

api.txt2img =
    function (json) {
        return requests.post('sdapi/v1/txt2img', json);
    }

api.progress =
    function () {
        return requests.get('sdapi/v1/progress');
    }

api.loras =
    function () {
        return requests.get('sdapi/v1/loras');
    }

api.reflush_loras = function () {
    return requests.post('sdapi/v1/refresh-loras');
}

api.model_list = function () {
    return requests.get('sdapi/v1/sd-models')
}

api.reflush_model = function() {
    return requests.post('sdapi/v1/refresh-checkpoints')
}

api.get_options = function() {
    return requests.get('/sdapi/v1/options')
}

api.change_model = function(model_title) {
    return requests.post('/sdapi/v1/options', {
        // "sd_model_checkpoint":"chosen Irises-mix.safetensors [684006e5fe]"
        "sd_model_checkpoint":model_title
    })
}

api.translate = function(text) {
    return requests.post('/sdapi/v1/translate', {
        text: text
    })
}

api.ali_ai_temp = function(data){
    let json = JSON.stringify(data)
    return requests.post('/sdapi/v1/ali_ai_temp', { text: json})
}


api.controlnet_detect = function(img_base64, size = 512) {
    return requests.post('/controlnet/detect', {
        "controlnet_module": "shuffle",
        "controlnet_input_images": [img_base64],
        "controlnet_processor_res": size
    })
}

// ---------------------------- 文件浏览

api.txt2imgFiles =
    function () {
        let path = 'E:\\StableDiffusioin\\sd-webui-aki-v4.2-test\\outputs\\txt2img-images';
        return requests.get('infinite_image_browsing/files', { "folder_path": path })
    }
// 预览小图
api.image_thumbnail =
    function (filePath) {
        return requests.get('infinite_image_browsing/image-thumbnail', { "path": filePath, size: '512x512' })
    }
// 获取完整图片
api.image_file =
    function (filePath) {
        return requests.get('infinite_image_browsing/file', { "path": filePath, size: '512x512' })
    }

api.image_file_url =
    function (filePath) {
        return requests.getURL('infinite_image_browsing/file?')
            + requests.coverFormData({ "path": filePath, size: '512x512', t: new Date().getTime() });
    }

// 获取图片中的tEXT信息

api.image_info =
    function (filePath) {
        return requests.get('infinite_image_browsing/image_geninfo', { "path": filePath })
    }

// api.translate_text = (text) =>{
//     ali_Client.PostTransloate(text)
// }

api.downloadImage = (imageUrl, name) => {
    requests.getBlob(imageUrl).then((data) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', name + '.png');
        document.body.appendChild(link);
        link.click();
        link.remove();
    });
};

export default api



