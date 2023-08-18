<script setup>
// import PromotInput from '../components/PromotInput.vue'
import PromotInputMain from '../components/PromotInputMain.vue'
import ControlNet from '../components/ControlNet.vue'
import ImageView from '../components/ImageView.vue'
import WaterFlow from '../components/WaterFlow.vue'
import '../assets/Main.vue.css'
</script>

<template>
    <el-row style="text-align: center;">
        <el-col>
            <h1 style="color: black; font-weight: bold;display: block;">AI Creative Engine</h1>
        </el-col>
    </el-row>


    <el-row>
        <el-col>
            <div style="margin: 20px; ">
                <div class="four-corners-border" style="width: 600px; margin: auto; position: relative;">
                    <ControlNet>
                        <div v-if="genState"
                            style="position: absolute; left: 0; right: 0; top: 0; bottom: 0; background-color: var(--el-mask-color);">
                            <div style="position: relative; width: 100%; top: 50%; margin-top: calc((0px - 126px)/ 2);">
                                <el-progress color="var(--el-color-primary)" :percentage="genPercentage" :show-text="true"
                                    :stroke-linecap="'round'" :stroke-width="15" type="circle">
                                    <template #default="{ percentage }">
                                        <div style="font-size: 1.5rem; margin-bottom: 5px;">{{ percentage }}%</div>
                                        <span style="font-size: 0.5rem;">正在生成...</span>
                                    </template>
                                </el-progress>
                            </div>
                        </div>
                    </ControlNet>
                </div>
            </div>
        </el-col>
    </el-row>

    <el-row>
        <PromotInputMain @on-gen-img="OnGenImg" :txt2img_data="txt2img_data" :loras="loras" ></PromotInputMain>
    </el-row>

    <div style="margin-bottom: 100px;"></div>

    <el-row>
        <el-col>
            <div style="text-align: center; margin-bottom: 3rem;">
                <h1 style="font-weight: bold; color: gray;">
                    Explore More
                </h1>
            </div>

            <WaterFlow></WaterFlow>
        </el-col>
    </el-row>
</template>


<style scoped></style>

<script>
import { genPercentage, genState } from '@/assets/GlobalStatus.js'

function OnGenImg() {
    console.log('回调 OnGenImg');
}


</script>
