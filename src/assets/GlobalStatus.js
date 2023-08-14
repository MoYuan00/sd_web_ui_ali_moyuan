import { ref, watch, computed, onMounted } from 'vue'
import api from './request_api'



export const ControlNetImg_Base64 = ref('')


// 历史生成的图片列表

export const HistoryGenImageInfoList = ref([]); // 历史生成的图片列表
export function FlushHistoryImages() {
    api.txt2imgFiles().then((data) => {
        HistoryGenImageInfoList.value.splice(0, HistoryGenImageInfoList.value.length)
        for (const image of data.files ) {
            HistoryGenImageInfoList.value.unshift(image);
        }
        console.log(HistoryGenImageInfoList.value);
    })
}

window.HistoryGenImageInfoList = HistoryGenImageInfoList
