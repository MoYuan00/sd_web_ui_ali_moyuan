import requests from "./requests";

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

export default api

