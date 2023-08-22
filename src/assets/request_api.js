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


/*
阿里API
请保存或发送 AccessKey 至对应用户。当前窗口关闭后，无法再次查询 Secret。如果您遗失这个 AccessKey，可以创建新的来替代。
AccessKey ID
LTAI5tP6BVS32ReEBojGRwMf
AccessKey Secret
iUZ9udccL1q5nJgkr2gBJNGrtu0BrN
*/

