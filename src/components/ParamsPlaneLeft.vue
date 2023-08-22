<!-- 参数面板 -->
<template>
    <div class="params" v-show="ParamsPlaneIsShow" >
        <space style="height: 10px; display: block;"></space>
        <div style="background-color: #111a; color: #333f;
            border-radius: 0px 30px 30px 0px; padding: 30px 30px; ">
            <div :class="{'size-picker': sizePickerSelectedIdx != 1, 'size-picker-selected': sizePickerSelectedIdx == 1}"
                @click="OnSizePickerClick(1, {'width': 512, 'height': 512})">
                模型风格1
            </div>
            <div :class="{'size-picker': sizePickerSelectedIdx != 2, 'size-picker-selected': sizePickerSelectedIdx == 2}"
                @click="OnSizePickerClick(2, {'width': 512, 'height': 512})">
                模型风格1
            </div>
            <div :class="{'size-picker': sizePickerSelectedIdx != 3, 'size-picker-selected': sizePickerSelectedIdx == 3}"
                @click="OnSizePickerClick(3, {'width': 512, 'height': 512})">
                模型风格1
            </div>
            <div :class="{'size-picker': sizePickerSelectedIdx != 4, 'size-picker-selected': sizePickerSelectedIdx == 4}"
                @click="OnSizePickerClick(4, {'width': 512, 'height': 512})">
                模型风格1
            </div>
        </div>

        <div style="margin: 5px;"> </div>
        <div style="background-color: #111a; color: #333f;
            border-radius: 0px 30px 0px 0px; padding: 30px 30px; position: relative; bottom: 0px;">
            <ContolNet></ContolNet>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import $ from 'jquery'
import { loras, txt2img_data } from '@/assets/ImgParams.js'
import { ParamsPlaneIsShow } from '@/assets/GlobalStatus.js'
import  ContolNet  from './ControlNet.vue'
import api from '../assets/request_api.js'

const seedIsRandom = ref(false)

let refushLoras = function() {
    api.reflush_loras()
}
refushLoras()

let getLoras = function () {
    api.loras().then((response) => {
        loras.value = response;
    }).catch(function (err) {
    })
}
getLoras();



const getUsedLorasString = computed(() => {

    // 功能 对lora进行权重再分配，让lora总和不超过1
    let weightSum = 0;
    for (const item of loras.value) {
        if (item.weight > 0) {
            weightSum += item.weight;
        }
    }
    console.log('LORA weight sum:' + weightSum)


    let loraStr = ""
    for (const item of loras.value) {
        let weight = item.weight;
        if (weightSum > 100) {
            weight = weight * (100 / weightSum);
        }
        weight = (weight / 100).toFixed(2);
        if (weight > 0) {
            loraStr = loraStr + "<lora:" + item.name + ":" + (weight);
            loraStr += ">";
        }
    }
    return loraStr
})

let seedCache = "-1"
watch(seedIsRandom, (newVal, oldVal) => {
    if (newVal) {
        seedCache = txt2img_data.value.seed
        txt2img_data.value.seed = "-1"
    } else {
        txt2img_data.value.seed = seedCache
    }
})

watch(() => txt2img_data, () => {
    seedIsRandom.value = false
})

onMounted(() => {

    $(".params").click(() => {
        console.log('.params click');
        // event.stopPropagation(); // 阻止事件冒泡
        return false;
    })


})



// 选择面板

let sizePickerSelectedIdx = ref(2)
function OnSizePickerClick(idx, value) {
    sizePickerSelectedIdx.value = idx
    console.log('OnSizePickerClick');
    txt2img_data.value.width = value.width;
    txt2img_data.value.height = value.height;
}

</script>

<style scoped>
:deep().el-switch__label {
    color: white !important;
}

:deep().el-switch__label.is-active {
    color: var(--el-color-primary) !important;
}



.size-picker {
    padding: 3px 25px;
    margin: 0px 20px 20px 0px;
    background-color: #fff3;
    border-radius: 20px;
    display: inline-block;
}
.size-picker:hover{
    background-color: #fff8;
    border-radius: 10px;
    display: inline-block;
    cursor: pointer;
}


.size-picker-selected {
    padding: 3px 25px;
    margin: 0px 20px 20px 0px;
    background-color: #ffff;
    border-radius: 20px;
    display: inline-block;
}
</style>