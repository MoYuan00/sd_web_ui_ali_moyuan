<script setup>
// import PromotInput from '../components/PromotInput.vue'
import PromotInputMain from '../components/PromotInputMain.vue'
import ControlNet from '../components/ControlNet.vue'
import WaterFlow from '../components/WaterFlow.vue'
import ImageView from '../components/ImageView.vue'
import '../assets/Main.vue.css'
</script>

<template>
    <el-row justify="space-between" style="text-align: left; margin-bottom: 3rem; width: 80%;margin: auto;">
        <el-col :span="12">
            <h1 style="font-weight: bold; display: inline-block;">
                History
            </h1>
        </el-col>
        <el-col :span="12">
            <div  style="text-align: right; height: 100%; line-height: 42px; ">
                <div style="display: inline-block; padding: 0px 20px; border-radius: 20px; background-color: var(--color-gray-ui-bg-2); font-size: 15px;">
                    筛选排序
                </div>
            </div>
        </el-col>
    </el-row>
    <div style="margin: 50px;">
    </div>
    <el-row>
        <WaterFlow></WaterFlow>
    </el-row>
</template>


<style scoped></style>

<script>
import { genPercentage, genState,paramButtonIsShow } from '@/assets/GlobalStatus.js'
paramButtonIsShow.value = false
function OnGenImg() {
    console.log('回调 OnGenImg');
}


</script>
