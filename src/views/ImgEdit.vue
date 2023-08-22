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
            <div style="text-align: center; position: relative; bottom: 50px; width: 500px; margin: auto;">
                <div style="display: inline-block;">
                    <div class="pointer"
                        style="display: inline-block; margin-right: 10px; background-color: #1113; border-radius: 20px; padding: 5px 18px; font-weight: bold;">
                        风格调整
                    </div>
                    <div class="pointer"
                        style="display: inline-block; background-color: #1113; border-radius: 20px; padding: 5px 18px; font-weight: bold;">
                        参数调整
                    </div>
                </div>

            </div>
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


                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="flex-direction: column; display: flex; padding: 1rem;">
                <PromotInputMain @on-gen-img="OnGenImg"></PromotInputMain>
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
import { genPercentage, genState, CurrentGenImageList, CurrentSelectedImgURL } from '@/assets/GlobalStatus.js'



function OnGenImg() {
    console.log('回调 OnGenImg');


}


</script>
