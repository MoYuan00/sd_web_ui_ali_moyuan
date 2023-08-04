import requests from "./requests";
// import ali_Client from "./ali-translate-api";

const api = {}

api.txt2img =
    function (json) {
        return window.$axios.post('sdapi/v1/txt2img', json);
    }

api.progress =
    function () {
        return window.$axios.get('sdapi/v1/progress');
    }

api.loras =
    function () {
        return window.$axios.get('sdapi/v1/loras');
    }


api.txt2imgFiles =
    function (folder_path) {
        return window.$axios.get('infinite_image_browsing/files', { "folder_path": folder_path })
    }

api.img2img = 
    function(scale_value, step, upscaler_name) {
        let data = {
            
        }
        
    }

// api.translate_text = (text) =>{
//     ali_Client.PostTransloate(text)
// }

export default api


/*
阿里API
请保存或发送 AccessKey 至对应用户。当前窗口关闭后，无法再次查询 Secret。如果您遗失这个 AccessKey，可以创建新的来替代。
AccessKey ID
LTAI5tP6BVS32ReEBojGRwMf
AccessKey Secret
iUZ9udccL1q5nJgkr2gBJNGrtu0BrN
*/

