<template>
    <div
        style="width: 650px; border-radius: 25px; background-color: #ccc; 
    padding: 5px 5px 5px 90px; position: relative; margin: auto; display: block; min-height: 136px; overflow-x: hidden;">


        <div @click="rollLast"
        style="line-height: 0; position: absolute; left: 0px; top: 0px; height: 100%; display: inline-block;
             vertical-align: middle; z-index: 100;">
            <div class="pointer"
                style="height: 100%; position: relative; border-radius: 25px 0px 0px 25px;">
                <div style=" top: calc(50% - 12px);  position: relative;">
                    <el-icon :size="25">
                        <ArrowLeftBold />
                    </el-icon>
                </div>
            </div>

        </div>

        <!-- 显示图片 -->
        <div style="position: relative;">
            <div v-for="(src, idx) in CurrentGenImageList" class="img-container-item" style="position:absolute;">
                <div :class="{ 'selectedImg': selectedCurrentImgIndex == idx, 'pointer': true }"
                    style="line-height: 0; padding: 5px; display: inline-block;" @click="OnChangeSelectedImg(idx)">
                    <img v-if="src.type == 'url'"
                        style="border-radius: 33px; width: 130px; height: 115px; object-fit: cover;" :src="src.img">
                    <img v-else style="border-radius: 33px; width: 130px; height: 115px; object-fit: cover;"
                        :src="'data:image/png;base64,' + src.img">
                </div>
            </div>
        </div>

        <div
            @click="rollNext"
            style="line-height: 0; position: absolute; right: 0px; top: 0px; height: 100%; display: inline-block; 
            vertical-align: middle; z-index: 100;">
            <div class="pointer"
                style="height: 100%; position: relative;  border-radius: 0px 25px 25px 0px;">
                <div style=" top: calc(50% - 12px);  position: relative;">
                    <el-icon :size="25">
                        <ArrowRightBold />
                    </el-icon>
                </div>
            </div>

        </div>
    </div>
</template>


<script setup>
import '../assets/Main.vue.css'

import { ref, watch, computed, onMounted } from 'vue'
import { CurrentGenImageList, CurrentSelectedImgURL, selectedCurrentImgIndex } from '@/assets/CurrentImg.js'
import { reflushImages,rollNext, rollLast } from '@/assets/ImgViewRoll.js'
import { bus } from '@/assets/EventCenter.js'

onMounted(() => {
    // bus.on('gen-img', () => {
    //     console.log('gen-img 事件触发');
    //     reflushImages()
    // })
    reflushImages()
})

watch(CurrentGenImageList, async (newVal, oldVal) => {
    console.log('watch(CurrentGenImageList' +  newVal.length);
    reflushImages(newVal.length)
},
    { deep: true, flush: 'post' }
)

function OnChangeSelectedImg(idx) {
    selectedCurrentImgIndex.value = idx;
}



</script>


<style scoped>
img.center {
    border-radius: 20px;
    object-fit: cover;


    position: absolute;
    top: 50%;
    left: 50%;
    max-height: 100%;
    max-width: 100%;

    --tw-translate-y: -50%;
    --tw-translate-x: -50%;
    --tw-skew-x: 0;
    --tw-skew-y: 0;
    --tw-scale-x: 1;
    --tw-scale-y: 1;
    --tw-rotate: 0;

    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));

}


.selectedImg {
    background-color: #fffa;
    border-radius: 33px;
}
</style>
