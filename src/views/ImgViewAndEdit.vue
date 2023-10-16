<template>
    <div style="position: relative; height: 100%; width: 100%;">
        <div class="flex-contain-img">
            <div ref="img_contain"  class="flex-img shrink glow " style="max-width: 80%;">
                <div  style="display: flex; margin: 0 auto; position: relative; ">
                    <div  style="display: flex ;  position: relative; max-height: 100%; max-width: 100%;">

                        <!-- <template v-if="CurrentGenImageList[selectedCurrentImgIndex].hr_enable_size == 1">
                            <img :src="CurrentSelectedImgURL" style="position: relative; left: 0px; width: 700px; height: auto; object-fit: contain;">
                        </template> -->
                        <!-- <template v-else> -->
                        <div style="display: flex; flex-direction: column;">
                            <div style="display: flex; flex-grow: 1;"></div>

                            <div id="img-parent" style="position: relative; margin: auto;">
                                <img :src="CurrentSelectedImgURL">
                                <div class="tools" @click="gallery.view(0)"
                                    style="position: absolute; bottom: 0px; right: 0px; height: 100%; width: 100%;">
                                    <div style="position: absolute; bottom: 10px; right: 10px;">
                                        <div class="cursor-pointer tools-item"
                                            style="display: inline-block; background-color: #333d; margin: 0 10px; padding: 8px; line-height: 0; border-radius: 30px;">
                                            <a :href="CurrentSelectedImgURL" download="AI creative engine">


                                                <el-tooltip effect="dark" content="下载图片" placement="top"
                                                    style="font-size: 20px;">
                                                    <el-icon color="#fffd" :size="25">
                                                        <Download />
                                                    </el-icon>
                                                </el-tooltip>

                                            </a>
                                        </div>

                                        <div class="cursor-pointer tools-item"
                                            style="display: inline-block; background-color: #333d; margin: 0; padding: 8px; line-height: 0; border-radius: 30px;">
                                            <div @click="hr()">
                                                <el-tooltip effect="dark" content="高清放大此图" placement="top"
                                                    style="font-size: 20px;">
                                                    <el-icon color="#fffd" :size="25">
                                                        <Search />
                                                    </el-icon>
                                                </el-tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="display: flex; flex-grow: 1;"></div>
                        </div>
                        <!-- </template> -->
                        <!-- <img src="../assets/png/769x960.png" > -->
                        <!-- <img src="../assets/png/1022x571.jpg" > -->


                    </div>
                </div>
            </div>

            <div class="flex-img shrink-0" style="flex-direction: column; height: 100%;">
                <div style="margin-bottom: 20px;">
                    <PromotInputMain></PromotInputMain>
                </div>
                <ImgContainer></ImgContainer>
            </div>
        </div>
    </div>
</template>


<script setup>
// import PromotInput from '../components/PromotInput.vue'
import PromotInputMain from '../components/PromotInputMain.vue'
import ImgContainer from '../components/ImgContainer.vue'
import '../assets/Main.vue.css'
import Viewer from 'viewerjs';
import { ref, watch, computed, onMounted } from 'vue'
import $ from 'jquery'
import { onSubmit } from '@/assets/GenImage.js'
import { CurrentGenImageList, CurrentSelectedImgURL, selectedCurrentImgIndex } from '@/assets/CurrentImg.js'
import { reflushImages } from '@/assets/ImgViewRoll.js'
import { paramButtonIsShow } from '@/assets/GlobalStatus.js'
paramButtonIsShow.value = true
let gallery = null
let img_contain = ref(null)
onMounted(() => {
    gallery = new Viewer(document.getElementById('img-parent'), {
        toolbar: {
            prev: 0,
            next: 0
        },
        title: false,
        navbar: false
    });
    $('.tools-item').click(() => {
        event.stopPropagation()
    })
    // 
    
})  
function hr() {
    onSubmit(true, null, CurrentGenImageList.value[selectedCurrentImgIndex.value].seed,
        CurrentGenImageList.value[selectedCurrentImgIndex.value].hr_enable_size)
}

watch(CurrentGenImageList, (newVal, oldVal) => {
    if (CurrentGenImageList.value[selectedCurrentImgIndex.value].hr_enable_size > 1) {
        img_contain.value.style["max-width"] = '70%';
    } else {
        img_contain.value.style["max-width"] = '40%';
    }
    // gallery.update() // 可以更新组件

}, {deep: true, flush: 'post'})

watch(selectedCurrentImgIndex, (newVal, oldVal) => {
    if (CurrentGenImageList.value[selectedCurrentImgIndex.value].hr_enable_size > 1) {
        img_contain.value.style["max-width"] = '70%';
    } else {
        img_contain.value.style["max-width"] = '40%';
    }
    gallery.update()
}, { flush: 'post'})

</script>


<style scoped>
.selectedImg {
    background-color: #fffa;
    border-radius: 10px;
}

.img_contain_sm {
    max-height: 50%;
    top: 20%;
}

.flex-contain-img {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    flex-wrap: nowrap;

    align-items: center;
}

.flex-img {
    display: flex;
    margin: 10px;
    padding: 10px;

    height: 30px;
    max-height: 100%;
    flex-basis: 30px;
    align-content: center;
}

.flex-img img {
    /* display: flex; */
    /* background-color: #ccc; */

    /* height: 100px; */
    /* flex-basis: 100px; */
    max-width: 100%;
    max-height: 100%;

    border-radius: 40px;
}

.shrink {
    flex-shrink: 1;
}

.shrink-0 {
    flex-shrink: 0;
}


.glow {
    flex-grow: 1;
}


.tools {
    display: flex;
    max-height: 100%;
    max-width: 100%;
    opacity: 0;
}

.tools:hover {
    opacity: 1;
    cursor: pointer;
}

.tools-item {
    color: gray;
}

.tools-item:hover {
    color: white;
    cursor: pointer;
}
</style>
