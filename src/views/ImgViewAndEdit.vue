<script setup>
// import PromotInput from '../components/PromotInput.vue'
import PromotInputMain from '../components/PromotInputMain.vue'
import ControlNet from '../components/ControlNet.vue'
import ImageView from '../components/ImageView.vue'
import '../assets/Main.vue.css'
</script>

<template>
    <div style="position: fixed; top: 100px; left: 0; bottom: 0; right: 0;">
        <div style="display: flex; flex-direction: column; height: 100%; width: 100%;">
            
            <div
                style="flex-direction: column; display: flex; flex: 1 1 0%; position: relative; width: 100%; height: 100%;">
                <div style=" display: flex; margin: auto; width: 100%; height: 100%; position: relative;">
                    <div
                        style=" display: flex; margin: auto; width: 100%; max-width: 700px; height: 100%;  position: relative;">
                        <div
                            style="display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; width: 100%; height: auto;">
                            <div style="position: relative;margin: auto;  display: block; width: 100%; height: 400px; ">
                                <!-- <img class="center" src=" https://picsum.photos/1022/571"> -->
                                <img class="center" :src="CurrentSelectedImgURL">

                                <!-- 下载按钮 -->
                                <div class="cursor-pointer"
                                    style="display: inline; position: absolute; bottom: 15px; right: 30px; background-color: #333d; margin: 0; padding: 8px; line-height: 0; border-radius: 30px;">
                                    <a :href="CurrentSelectedImgURL" download="AI creative engine">
                                        <el-icon color="#fffd" :size="25">
                                            <Download />
                                        </el-icon>
                                    </a>
                                </div>

                                <!-- 放大按钮 -->
                                <div class="cursor-pointer"
                                    style="display: inline; position: absolute; bottom: 15px; right: 80px; background-color: #333d; margin: 0; padding: 8px; line-height: 0; border-radius: 30px;">
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

            <div style="flex-direction: column; display: flex; padding: 1rem;">
                <PromotInputMain @on-gen-img="OnGenImg"></PromotInputMain>
                <div
                    style="width: 700px; border-radius: 25px; background-color: #ccc; padding: 5px 5px 5px 25px; position: relative; margin: auto; display: flex;">
                    <div v-for="src in CurrentGenImageList">
                        <div style="line-height: 0; margin: 5px; display: inline-block; display: flex;">
                            <img v-if="src.type == 'url'"
                                style="border-radius: 20px; width: 150px; height: 100px; object-fit: cover;"
                                :src="src.img">
                            <img v-else style="border-radius: 20px; width: 150px; height: 100px; object-fit: cover;"
                                :src="'data:image/png;base64,' + src.img">
                        </div>
                    </div>
                    <div style=" min-height: 100px;">

                    </div>
                    <!-- TODO 溢出切换未处理 -->

                    <div
                        style="line-height: 0; position: absolute; right: 0px; top: 0px; height: 100%; display: inline-block; vertical-align: middle;">
                        <div class="pointer"
                            style="height: 100%; position: relative; background-color: #1113; border-radius: 0px 25px 25px 0px;">
                            <div style=" top: calc(50% - 12px);  position: relative;">
                                <el-icon :size="25">
                                    <ArrowRightBold />
                                </el-icon>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


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
</style>

<script step>
import { genPercentage, genState} from '@/assets/GlobalStatus.js'
import { onSubmit } from '@/assets/GenImage.js'
import {CurrentGenImageList, CurrentSelectedImgURL } from '@/assets/CurrentImg.js'



function OnGenImg() {
    console.log('回调 OnGenImg');


}


</script>
