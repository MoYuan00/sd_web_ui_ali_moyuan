import { ref, watch, computed, onMounted } from 'vue'
import api from './request_api'
import { isUseControlNet } from './ImgParams'



export const ControlNetImg_Base64 = ref('')


// 所有历史生成的图片列表

export const HistoryGenImageInfoList = ref([]); // 历史生成的图片列表
export function FlushHistoryImages(callback = null) {
    api.txt2imgFiles().then((data) => {
        HistoryGenImageInfoList.value.splice(0, HistoryGenImageInfoList.value.length)
        for (const image of data.files) {
            HistoryGenImageInfoList.value.unshift(image);
        }
        console.log(HistoryGenImageInfoList.value);
        if(callback && callback != null) {
            callback()
        }
    })

}

window.HistoryGenImageInfoList = HistoryGenImageInfoList

// 当前生成的图片
export const CurrentGenImageList = ref([])
export const selectedCurrentImgIndex = ref(0)

export const CurrentSelectedImgURL = computed(()=>{
    if(CurrentGenImageList.value.length == 0) {
        return 'https://picsum.photos/1022/571';
    }
    let imgInfo = CurrentGenImageList.value[selectedCurrentImgIndex.value]
    let img = CurrentGenImageList.value[selectedCurrentImgIndex.value].img
    if(imgInfo.type == 'url') {
        return img;
    }
    return 'data:image/png;base64, ' + img;
})

function parseImg(imgs, imgNames) {
    let newImgs = []
    let count = 0
    imgs.forEach(element => {
        count++;
        // 如果生成多个图片会第一张返回多个图片的预览，如果开启control会额外返回一个image
        // if (data.batch_size > 1 && count == 1) return;
        if (isUseControlNet.value && count == length) return;

        newImgs.unshift({ img: imgs[count - 1], name: imgNames[count - 1] })
    });
    return newImgs
}

export function processTxt2ImgResponse(data) {
    let imgs = data.images;
    let infoJson = data.info;
    let info = JSON.parse(infoJson)
    let all_img_name = info.all_img_name; // array str

    CurrentGenImageList.value.splice(0, CurrentGenImageList.value.length)
    parseImg(imgs, all_img_name).forEach(element => {
        CurrentGenImageList.value.unshift(element)
    });

}



// 状态
export const genState = ref(false); // 是否正在生成
export const genPercentage = ref(0.0); // 生成进度 0 ~ 1









// params plane
export const ParamsPlaneIsShow = ref(true)

