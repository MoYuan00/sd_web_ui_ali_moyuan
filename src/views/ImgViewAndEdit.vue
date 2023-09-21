<template>
    <div style="position: relative; height: 100%; width: 100%;">
        <div class="flex-contain-img">
            <div class="flex-img shrink glow ">
                <div style="display: flex; margin: 0 auto; position: relative; max-height: 100%;">
                    <div style="display: flex ;  position: relative; max-height: 100%; max-width: 100%;">
                            <img :src="CurrentSelectedImgURL">
                        <!-- <img src="../assets/png/769x960.png" > -->
                        <!-- <img src="../assets/png/1022x571.jpg" > -->

                        <div class="tools" style="position: absolute; bottom: 0px; right: 0px; height: 100%; width: 100%;">
                            <div style="position: absolute; bottom: 10px; right: 10px;">
                                <div class="cursor-pointer tools-item"
                                    style="display: inline-block; background-color: #333d; margin: 0 10px; padding: 8px; line-height: 0; border-radius: 30px;">
                                    <a :href="CurrentSelectedImgURL" download="AI creative engine">

                                        <el-icon color="#fffd" :size="25">
                                            <Download />
                                        </el-icon>
                                    </a>
                                </div>

                                <div class="cursor-pointer tools-item"
                                    style="display: inline-block; background-color: #333d; margin: 0; padding: 8px; line-height: 0; border-radius: 30px;">
                                    <div @click="onSubmit(true)">
                                        <el-icon color="#fffd" :size="25">
                                            <Search />
                                        </el-icon>
                                    </div>
                                </div>
                            </div>
                        </div>
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
import ControlNet from '../components/ControlNet.vue'
import ImageView from '../components/ImageView.vue'
import '../assets/Main.vue.css'

import { ref, watch, computed, onMounted } from 'vue'

import { onSubmit } from '@/assets/GenImage.js'
import { CurrentGenImageList, CurrentSelectedImgURL, selectedCurrentImgIndex } from '@/assets/CurrentImg.js'
import { reflushImages } from '@/assets/ImgViewRoll.js'


</script>


<style scoped>

.selectedImg {
    background-color: #fffa;
    border-radius: 10px;
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
