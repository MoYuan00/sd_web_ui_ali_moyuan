import { ref, watch, computed, onMounted } from 'vue'
import $ from 'jquery'

const width = 130  + 5
const span = 5

const bias_idx = 0

const kIndex = ref(0)
window.kIndex = kIndex

export const ImgViewRollLength = ref(0)

// 计算images的位置
// 当前显示的是哪个image_name
const getImagePositionX = (index) => {
    if (kIndex.value >= ImgViewRollLength.value - 1) kIndex.value = ImgViewRollLength.value - 1
    if (kIndex.value <= 0) kIndex.value = 0

    let index_offset = index - kIndex.value;
    let offsetX = (width + span) * index_offset;
    // console.log('offset:' + index_offset + " - x:" + offsetX);
    return offsetX;
}


export const reflushImages = function (length) {

    $(".img-container-item").stop();
    // console.log($(".normal"));
    if(length && length > 0)
        ImgViewRollLength.value = length
    else ImgViewRollLength.value = 0
    let len = $(".img-container-item").length
    for (let i = 0; i <len; i++ ) {
        let idx = i
        // console.log(idx + ' - ' + getImagePositionX(idx));
        $(".img-container-item").eq(idx).animate({ 'left': getImagePositionX(idx) + 'px', speed: 200 })
    }
}

export const rollNext = function () {
    kIndex.value++
    console.log('rollNext: ' + kIndex.value + '  length:' + ImgViewRollLength.value);
    if (kIndex.value >= ImgViewRollLength.value - 1)
        kIndex.value = ImgViewRollLength.value - 1
    reflushImages(ImgViewRollLength.value)
}

export const rollLast = function () {
    kIndex.value--
    console.log('rollLast: ' + kIndex.value + '  length:' + ImgViewRollLength.value);
    if (kIndex.value <= 0) kIndex.value = 0
    reflushImages(ImgViewRollLength.value)
}

export const rollIdx = function (idx) {
    if(idx >= 0 && idx <= ImgViewRollLength.value - 1) {
        kIndex.value = idx
        if (kIndex.value <= 0) kIndex.value = 0
        reflushImages(ImgViewRollLength.value)
    }
}



