<template>

    <div id="canvas-3d" style="height: 100%; width: 100%;">
    </div>
</template>

<script setup >
import { ref, watch, computed, onMounted } from 'vue'
import {InitFrame} from '@/assets/threejs/threejsFrame.js'

onMounted(()=>{
    InitFrame()
})

</script>