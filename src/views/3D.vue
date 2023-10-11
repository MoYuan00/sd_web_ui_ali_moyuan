<template>
    <div id="canvas-3d" style="max-height: 100%; max-width: 100%; position: relative;display: inline-block;">
        <div class="pointer" style="position: absolute; top: 10px; right: 20px;" @click="OnClickRestore">
            <el-tooltip class="box-item" effect="dark" content="还原姿势" placement="top">
                <el-icon>
                    <Refresh />
                </el-icon>
            </el-tooltip>
        </div>
    </div>
    <canvas id="show-result-3d">

    </canvas>
</template>

<script setup >
import { ref, watch, computed, onMounted } from 'vue'
// import {InitFrame, LoadModel} from '@/assets/threejs/threejsFrame.js'
import { InitFrame, restoreBonePosition } from '@/assets/threejs/RenderGLTFOutLine3.js'

onMounted(() => {
    InitFrame()


})
function OnClickRestore() {
    console.log('点击还原');
    restoreBonePosition()
}
</script>

