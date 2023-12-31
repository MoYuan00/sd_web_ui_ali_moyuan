import { ref, watch, computed, onMounted } from 'vue'
import api from './request_api'
import { isUseControlNet } from './ImgParams'




export const ControlNetImg_Base64 = ref('')


// 所有历史生成的图片列表

export const HistoryGenImageInfoList = ref([]); // 历史生成的图片列表
export function FlushHistoryImages(callback = null, immediate = false) {
    api.txt2imgFiles().then((data) => {
        new Promise(() => {
            let t = 2000
            if(immediate) {
                t = 0
            }
            setTimeout(() => {
                HistoryGenImageInfoList.value.splice(0, HistoryGenImageInfoList.value.length)
                for (const image of data.files) {
                    HistoryGenImageInfoList.value.unshift(image);
                }
                console.log('FlushHistoryImages:' + t)
                // console.log(HistoryGenImageInfoList.value);
                if (callback && callback != null) {
                    callback()
                }
            }, t);
        })
    })

}

window.HistoryGenImageInfoList = HistoryGenImageInfoList


// 状态
export const genState = ref(false); // 是否正在生成
export const genPercentage = ref(0.0); // 生成进度 0 ~ 1







export const paramButtonIsShow = ref(false)

// params plane
export const ParamsPlaneIsShow = ref(false)
export const ControlNetIsShow = ref(false)


// v-loading="genState" element-loading-text="正在生成..."

export const loadingState = ref(false)
export const loadingText = ref('正在处理...')

export function loading(text = '正在处理...') {
    loadingText.value = text
    loadingState.value = true
}
export function loadingTextTo(text = '正在处理...') {
    loadingText.value = text
}
export function loadingEnd() {
    loadingState.value = false
}






// sd 目前的配置
export const sd_options = ref({})

export async function reflush_options() {

    await api.get_options().then(data => {
        sd_options.value = data
    })
}