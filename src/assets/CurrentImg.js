// 当前生成的图片列表
import { ref, watch, computed, onMounted } from 'vue'


// 当前生成的图片
export const CurrentGenImageList = ref([]) // 存放 name，img
export const selectedCurrentImgIndex = ref(0)

export const CurrentSelectedImgURL = computed(()=>{
    if(CurrentGenImageList.value.length == 0) {
        return 'https://picsum.photos/1022/571';
    }
    let imgInfo = CurrentGenImageList.value[selectedCurrentImgIndex.value]
    let img = imgInfo.img
    if(imgInfo.type == 'url') {
        return img;
    }
    return 'data:image/png;base64, ' + img;
})

function parseImg(imgs, imgNames, isUseControlNet, size) {
    let newImgs = []
    let count = 0
    let length = imgs.length;
    imgs.forEach(element => {
        count++;
        // 如果生成多个图片会第一张返回多个图片的预览，如果开启control会额外返回一个image
        // if (data.batch_size > 1 && count == 1) return;
        // if (isUseControlNet && count == length) return;
        if(count > size) return

        newImgs.unshift({ img: imgs[count - 1], name: imgNames[count - 1] })
    });
    return newImgs
}

export function processTxt2ImgResponse(data, isUseControlNet, size) {
    let imgs = data.images;
    let infoJson = data.info;
    let info = JSON.parse(infoJson)
    let all_img_name = info.all_img_name; // array str

    CurrentGenImageList.value.splice(0, CurrentGenImageList.value.length)
    parseImg(imgs, all_img_name, isUseControlNet, size).forEach(element => {
        CurrentGenImageList.value.unshift(element)
    });

}

