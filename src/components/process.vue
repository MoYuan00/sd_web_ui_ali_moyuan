<template>
    <div :id="uuid" class="process bg-ui"
        style="height: 30px ;width: 100%; position: relative; border-radius: 20px; overflow: hidden; line-height: 0; background-color: #0000;">
        <div class="process_val" :style="{ 'width': process_graph_value + '%' }">
        </div>

        <div style="width: 100%; height: 30px; line-height: 0; border-radius: 20px;  overflow: hidden;  border: solid 1px; border-color: var(--color-gray-ui-bg);">
            <div class="process_right">
                <div style="vertical-align: middle; display: inline-block; margin: 0px 8px; ">
                    <span style="user-select: none;">
                        {{ modelValue }}{{ val_suffix }}
                    </span>
                </div>
            </div>
            <div class="process_left">
                <div style="vertical-align: middle; display: inline-block; margin: 0px 8px; ">
                    <span style="user-select: none;">
                        {{title}}
                    </span>
                </div>
            </div>
        </div>


        <!-- 用于占位，帮助点击事件确定位置 -->
        <div style="width: 100%; height: 100%; z-index: 1000; position: absolute; right: 0; top: 0%;">
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, defineEmits, defineProps } from 'vue'
import utils from '@/assets/utils.js'
const props = defineProps({
    'modelValue': {
        type: Number,
        default: 0
    },
    'max': {
        type: Number,
        default: 100
    },
    'min': {
        type: Number,
        default: 0
    },
    'title': {
        type: String,
        default: ''
    },
    'val_suffix': {
        type: String,
        default: ''
    }
})

// 用不同的uuid区分不同的组件，放在事件重复 
let uuid = utils.uuid()
console.log(uuid);

const emits = defineEmits(['update:modelValue'])

const process_graph_value = computed(function() {
    return props.modelValue * (100 / props.max)
})

let process;
let process_width = 408;
let process_position = 0;

let mouseDownX = -1;
let mouseDownY = -1;
let hold = false;

function updateWidth() {
    if(process_width <= 0) {
        process = document.getElementById(uuid);
        process_width = process.clientWidth;
    }
}

function OnMouseDown() {
    mouseDownX = event.offsetX;
    mouseDownY = event.offsetY;
    updateWidth()

    process_position = mouseDownX + 1;
    let val = Number.parseInt(((process_position / process_width).toFixed(2) * props.max).toFixed(0));
    console.log(val);
    if(val < props.min) {
        val = props.min
    }
    if(val > props.max) {
        val = props.max
    }
    emits('update:modelValue', val);

    hold = true;
    console.log(mouseDownX + ',' + mouseDownY);
}

function OnMouseUp() {

    hold = false;
}

function OnMouseDrag() {
    if(!hold) {
        return false;
    }

    mouseDownX = event.offsetX;
    mouseDownY = event.offsetY;

    process_position = mouseDownX + 1;
    let val = Number.parseInt(((process_position / process_width).toFixed(2) * props.max).toFixed(0));
    if(val < props.min) {
        val = props.min
    }
    if(val > props.max) {
        val = props.max
    }
    emits('update:modelValue', val);
}




onMounted(() => {
    console.log('process onmounted');
    process = document.getElementById(uuid);
    process_width = process.clientWidth;
    process.addEventListener('mousedown', OnMouseDown, false);

    process.addEventListener('mouseup', OnMouseUp, false);
    process.addEventListener('mousemove', OnMouseDrag);
})



</script>

<style scoped>
.process_val {
    width: 50%;
    left: 0%;
    top: 0%;
    height: 100%;
    position: absolute;
    background-color: var(--color-gray-ui-bg);
    border-radius: 20px;
    z-index: 300;

    vertical-align: middle;
}

.process_right {
    top: 0%;
    right: 0%;
    height: 100%;
    position: absolute;
    z-index: 500;
    vertical-align: middle;
}

.process_left{
    top: 0%;
    left: 0%;
    height: 100%;
    position: absolute;
    z-index: 500;
    vertical-align: middle;
}
.process_right::after,
.process_left::after,
.process_val::after {
    /* 帮助内容元素 上下居中对齐 */
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
}

.process {
    cursor: pointer;
}
</style>