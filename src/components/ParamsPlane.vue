<!-- 参数面板 -->
<template>
    <div class="params" v-show="ParamsPlaneIsShow" style="background-color: #111a; color: #333f;
            border-radius: 40px 0px 0px; padding: 30px 30px; ">
        <div style="text-align: left;">画面大小</div>
        <space style="height: 10px; display: block;"></space>
        <div>
            <div :class="{'size-picker': sizePickerSelectedIdx != 1, 'size-picker-selected': sizePickerSelectedIdx == 1}"
                @click="OnSizePickerClick(1, {'width': 512, 'height': 512})">
                1:1
            </div>
            <div :class="{'size-picker': sizePickerSelectedIdx != 2, 'size-picker-selected': sizePickerSelectedIdx == 2}" 
                @click="OnSizePickerClick(2, {'width': 768, 'height': 512})">
                3:2
            </div>
            <div :class="{'size-picker': sizePickerSelectedIdx != 3, 'size-picker-selected': sizePickerSelectedIdx == 3}" 
                @click="OnSizePickerClick(3, {'width': 768, 'height': 960})">
                4:5
            </div>
            <div :class="{'size-picker': sizePickerSelectedIdx != 4, 'size-picker-selected': sizePickerSelectedIdx == 4}" 
                @click="OnSizePickerClick(4, {'width': 1024, 'height': 576})">
                16:9
            </div>
            <div :class="{'size-picker': sizePickerSelectedIdx != 5, 'size-picker-selected': sizePickerSelectedIdx ==5}"  
                @click="OnSizePickerClick(5, {'width': 1024, 'height': 428})">
                21:9
            </div>
            <div :class="{'size-picker': sizePickerSelectedIdx != 6, 'size-picker-selected': sizePickerSelectedIdx == 6}" 
                @click="OnSizePickerClick(6, txt2img_data)">
                自定义
                <div>
                    <input style="width: 50px;  border: 0px; padding: 1px;" v-model="txt2img_data.width" />
                    x
                    <input style="width: 50px; border: 0px; padding: 1px;" v-model="txt2img_data.height" />
                </div>
            </div>
        </div>

        <div style="margin: 30px;"> </div>
        <div style="color: #fffd;">


            <div>画面变化参数微调</div>
            <div>
                <div v-for="item in loras" :key="item.name" style="margin-top: 10px; position: relative;">
                    <span>
                        {{ item.name }}
                    </span>

                    <el-slider v-model="item.weight" size="small" :min="0" :max="100" />
                    <!-- <el-progress :stroke-width="30" :percentage="0" :color="'#ffffff'">
                    </el-progress> -->
                    <!-- <span style="position: absolute; top: 0px; left: 10px;"> -->

                    <div style="float: right;">
                        <el-tooltip class="box-item" effect="dark" placement="right-start">
                            <template #content>
                                <template v-for="(value, key) in lora_mult_weight">
                                    <div style="min-width: 50px; text-align: center;">
                                        {{ key }}
                                    </div>
                                    <div v-for="(v) in value" style="min-width: 200px;">
                                        <div>
                                            {{ v.name }}
                                        </div>
                                        <el-slider v-model="item.weight" size="small" :step="v.value" :min="0" :max="1" />
                                    </div>
                                </template>
                            </template>
                        </el-tooltip>
                    </div>
                    <!-- </span> -->
                </div>
                <!-- <div>
                <span>输出lora：{{ getUsedLorasString }}</span>
            </div> -->
            </div>
            <div style="margin: 30px;"> </div>
            <div>画面参数微调</div>
            <div style="margin: 10px;"> </div>
            <div>
                <span>文字随机性(CFG)</span>
                <el-slider v-model="txt2img_data.cfg_scale" size="small" :min="1" :max="30" :step="0.5" />

            </div>

            <div>
                <span>图片数量</span>
                <el-slider v-model="txt2img_data.batch_size" size="small" :min="1" :max="20" />
            </div>

            <div>默认参数</div>
            <div>
                <span>step(步数)</span>
                <el-slider v-model="txt2img_data.steps" size="small" :max="150" />
            </div>
            <div>
                <span>Seed:</span>

                <div>
                    <el-switch v-model="seedIsRandom" active-text="随机" inactive-text="固定" />
                    <span style="padding-left: 20px; color: white;">
                        {{ txt2img_data.seed }}
                    </span>
                </div>
            </div>
            <div>
                <span>高清修复:</span>
                <div>
                    <el-switch v-model="enable_hr" active-text="开启" inactive-text="关闭" />
                    <span style="padding-left: 20px; color: white;">
                        {{ enable_hr }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import $ from 'jquery'
import { loras, txt2img_data,enable_hr } from '@/assets/ImgParams.js'
import { ParamsPlaneIsShow } from '@/assets/GlobalStatus.js'
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

let sizePickerSelectedIdx = ref(6)
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
    padding: 8px 15px;
    margin: 0px 20px 20px 0px;
    background-color: #fff3;
    border-radius: 10px;
    display: inline-block;
}
.size-picker:hover{
    padding: 8px 15px;
    margin: 0px 20px 20px 0px;
    background-color: #fff8;
    border-radius: 10px;
    display: inline-block;
    cursor: pointer;
}


.size-picker-selected {
    cursor: pointer;
    padding: 8px 15px;
    margin: 0px 20px 20px 0px;
    background-color: #fffd;
    border-radius: 10px;
    display: inline-block;
}
</style>