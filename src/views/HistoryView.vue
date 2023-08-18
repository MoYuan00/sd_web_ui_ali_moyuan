<script setup>
// import PromotInput from '../components/PromotInput.vue'
import PromotInputMain from '../components/PromotInputMain.vue'
import ControlNet from '../components/ControlNet.vue'
import WaterFlow from '../components/WaterFlow.vue'
import ImageView from '../components/ImageView.vue'
import '../assets/Main.vue.css'
</script>

<template>
    <el-row>
        <el-col>
            <div style="text-align: center; margin-bottom: 3rem;">
                <h1 style="font-weight: bold; color: gray;">
                    Hsitory
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
