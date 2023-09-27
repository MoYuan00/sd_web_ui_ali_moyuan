<template>
    <div :id="uuid" class="process bg-ui"
        style="height: 30px ;width: 100%; position: relative; border-radius: 20px; overflow: hidden; line-height: 0; background-color: #0000;">
        <div class="process_val" :style="{ 'width': process_graph_value + '%' }">
        </div>

        <div
            style="width: 100%; height: 30px; line-height: 0; border-radius: 20px;  overflow: hidden;  border: solid 1px; border-color: var(--color-gray-ui-bg);">
            <div class="process_right">
                <div style="vertical-align: middle; display: inline-block; margin: 0px 8px; ">
                    <span style="user-select: none;">
                        {{ interVal }}{{ val_suffix }} 
                        ({{ props.min }}-{{ props.max }})
                    </span>
                </div>
            </div>
            <div class="process_left">
                <div style="vertical-align: middle; display: inline-block; margin: 0px 8px; ">
                    <span style="user-select: none;">
                        {{ title }}
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
    },
    'is_scale_value': {
        type: Boolean,
        default: true
    },
})
let max = 100
let min = 0
if(props.is_scale_value) {
    max = props.max
    min = props.min
}
let interVal = ref(0)
function ToOuterVal() {
    let val = (interVal.value - min) / (max - min) * (props.max - props.min) + props.min
    return val.toFixed(1)
}

function ToInnerVal() {
    let val = (props.modelValue - props.min) / (props.max - props.min) * (max - min) + min
    return val.toFixed(1)
}
interVal.value = ToInnerVal()
// 用不同的uuid区分不同的组件，放在事件重复 
let uuid = utils.uuid()
// console.log(uuid);

const emits = defineEmits(['update:modelValue'])

const process_graph_value = computed(function () {
    return (interVal.value - min) * (100 / (max - min))
})

let process;
let process_width = 408;
let process_position = 0;

let mouseDownX = -1;
let mouseDownY = -1;
let hold = false;



// 记录全局状态，使得在鼠标移出组件时也能够正常运行
let global_mouse_hold = false;
let global_mouse_x = 0;
let global_mouse_y = 0;
let global_left = 0;

function updateWidth() {
    if (process_width <= 0) {
        process = document.getElementById(uuid);
        process_width = process.clientWidth;
    }
}

function OnMouseDown() {
    mouseDownX = event.offsetX;
    mouseDownY = event.offsetY;
    updateWidth()

    global_left = utils.getElementLeft(event.target)

    process_position = mouseDownX + 1;
    interVal.value = Number.parseInt(((process_position / process_width).toFixed(2) * max).toFixed(0));
    if (interVal.value < min) {
        interVal.value = min
    }
    if (interVal.value > max) {
        interVal.value = max
    }

    let val = ToOuterVal()
    emits('update:modelValue', val);

    hold = true;
}

function OnMouseUp() {

    hold = false;
}

function OnMouseDrag() {
    if (!hold) {
        return false;
    }

    mouseDownX = event.offsetX;
    mouseDownY = event.offsetY;

    global_mouse_x = event.x;
    global_mouse_y = event.y;
    let target = event.target;
    // utils.getElementTop(target)  + event.offsetY)  ==  (global_mouse_y)
    // console.log((utils.getElementTop(target)  + event.offsetY) + " ， " + (global_mouse_y));


    process_position = global_mouse_x - global_left + 1;


    interVal.value = Number.parseInt(((process_position / process_width).toFixed(2) * max).toFixed(0));
    if (interVal.value < min) {
        interVal.value = min
    }
    if (interVal.value > max) {
        interVal.value = max
    }
    let val = ToOuterVal()
    console.log(val + " | " + interVal.value);
    emits('update:modelValue', val);
}




onMounted(() => {
    console.log('process onmounted');
    process = document.getElementById(uuid);
    process_width = process.clientWidth;
    process.addEventListener('mousedown', OnMouseDown, false);

    process.addEventListener('mouseup', OnMouseUp, true);
    process.addEventListener('mousemove', OnMouseDrag);


    document.addEventListener('mousedown', () => {
        if (hold) {
            global_mouse_hold = true;
        }
    }, false);
    document.addEventListener('mouseup', () => {
        global_mouse_hold = false;
        hold = false;
    }, true);
    document.addEventListener('mousemove', () => {
        if (global_mouse_hold) {
            OnMouseDrag()
        }
    }, true);
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

.process_left {
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