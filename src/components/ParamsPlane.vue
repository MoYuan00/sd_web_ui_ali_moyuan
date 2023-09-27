<!-- 参数面板 -->
<template>
    <div id="right-plane" style="position: fixed; top: 150px; right: 0px; bottom: 0px; width: 468px; z-index: 2001; ">
        <div class="params bg-contain" style="border-radius: 40px 0px 0px; height: 100%; padding: 30px 30px; ">

            <div style="border-radius: 0px 30px 30px 0px;">
                <div style="text-align: center; margin: 25px 0px 10px 0px">
                    2D画面风格
                </div>
                <template v-for="(item, idx) of modelList" :key="item.model_name">
                    <div class="bg-ui align-center-v align-center-h"
                        :class="{ 'model-picker': PickerModelSelectedIdx != idx, 'model-picker-selected': PickerModelSelectedIdx == idx }"
                        @click="OnModelPickerClick(idx, { 'width': 512, 'height': 512 })">
                        {{ item.model_name }}
                    </div>
                </template>
            </div>

            <div style="text-align: left;">画面大小</div>
            <div style="height: 10px; display: block;"></div>
            <div>
                <div class="bg-ui align-center-v align-center-h"
                    :class="{ 'size-picker': sizePickerSelectedIdx != 1, 'size-picker-selected': sizePickerSelectedIdx == 1 }"
                    style="width: 52px;" @click="OnSizePickerClick(1, { 'width': 512, 'height': 512 })">
                    1:1
                </div>
                <div class="bg-ui align-center-v align-center-h"
                    :class="{ 'size-picker': sizePickerSelectedIdx != 2, 'size-picker-selected': sizePickerSelectedIdx == 2 }"
                    style="width: 62px; margin-left: 30px;" @click="OnSizePickerClick(2, { 'width': 768, 'height': 512 })">
                    3:2
                </div>
                <div class="bg-ui align-center-v align-center-h"
                    :class="{ 'size-picker': sizePickerSelectedIdx != 3, 'size-picker-selected': sizePickerSelectedIdx == 3 }"
                    style="width: 80px; margin-left: 30px;" @click="OnSizePickerClick(3, { 'width': 768, 'height': 960 })">
                    4:5
                </div>
                <div class="bg-ui align-center-v align-center-h"
                    :class="{ 'size-picker': sizePickerSelectedIdx != 4, 'size-picker-selected': sizePickerSelectedIdx == 4 }"
                    style="width: 92px; margin-left: 30px;" @click="OnSizePickerClick(4, { 'width': 1024, 'height': 576 })">
                    16:9
                </div>
                <div class="bg-ui align-center-v align-center-h"
                    :class="{ 'size-picker': sizePickerSelectedIdx != 5, 'size-picker-selected': sizePickerSelectedIdx == 5 }"
                    style="width: 122px; margin-top: 10px;" @click="OnSizePickerClick(5, { 'width': 1024, 'height': 428 })">
                    21:9
                </div>
                <div class="bg-ui align-center-v align-center-h"
                    :class="{ 'size-picker': sizePickerSelectedIdx != 6, 'size-picker-selected': sizePickerSelectedIdx == 6 }"
                    style="width: 222px; margin-left: 30px;  margin-top: 10px;" @click="OnSizePickerClick(6, txt2img_data)">
                    自定义
                    <input style="width: 50px;  border: 0px; padding: 1px;" v-model="txt2img_data.width" />
                    x
                    <input style="width: 50px; border: 0px; padding: 1px;" v-model="txt2img_data.height" />
                </div>
            </div>

            <div style="margin: 30px;"> </div>
            <div>


                <div>画面变化参数微调</div>
                <div>
                    <div v-for="item in loras" :key="item.name" style="margin-top: 10px; position: relative;">
                        <process v-model="item.weight" :min="0" :max="100" :title="item.name" :val_suffix="'%'"></process>
                    </div>
                    <!-- <div>
            </div> -->
                </div>
                <div style="margin: 30px;"> </div>
                <div>画面参数微调</div>
                <div style="margin: 10px;"> </div>
                <div>
                    <process v-model="txt2img_data.cfg_scale" :min="1" :max="30" :title="'文字随机性(CFG)'"></process>
                </div>

                <div style="margin-top: 10px;">
                    <div>
                        <process v-model="txt2img_data.batch_size" :max="20" :min="1" :title="'图片数量'"></process>
                    </div>
                </div>

                <div style="margin: 30px;"> </div>

                <div>默认参数控制</div>
                <div style="max-height: 100px; overflow-y: scroll; scrollbar-color: var(--color-gray-ui-bg);">

                    <div class="bg-ui" style="border-radius: 10px; padding: 5px;">
                        默认关键词：
                        <input v-model="defautParams.prompt_pre">
                    </div>
                    <div style="margin: 10px;"> </div>
                    <div class="bg-ui" style="border-radius: 10px; padding: 5px;">
                        Lora名称对应范围控制:
                        <template v-for="item in defautParams.loras_control">
                            <div>
                                <div>
                                    名称：
                                    <input v-model="item.name">
                                </div>
                                <div>
                                    默认值：
                                    <input type="number" min="0" max="2" step="0.01" v-model="item.default">
                                </div>
                                <div>
                                    最小值：
                                    <input type="number" min="0" max="2" step="0.01" v-model="item.min">
                                </div>
                                <div>
                                    最大值：
                                    <input type="number" min="0" max="2" step="0.01" v-model="item.max">
                                </div>
                            </div>
                            <div style="margin: 8px;">

                            </div>
                        </template>
                    </div>
                    <div style="margin: 10px;"> </div>

                    <div class="bg-ui " style="border-radius: 10px; padding: 5px;">
                        默认关键词：
                        <input v-model="defautParams.prompt_pre">
                    </div>
                </div>
            </div>

            <div style=" position: absolute; bottom: 30px; left: calc(50% - 175px / 2);">
                <div class="pointer font-normal"
                    style="width: 175px; height: 30px; border-radius: 40px; background-color: #e0e0e0 ; color: #adadad; text-align: center;">
                    恢复默认
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import $ from 'jquery'
import { loras, txt2img_data, enable_hr, modelList } from '@/assets/ImgParams.js'
import { ParamsPlaneIsShow, loading, loadingEnd, reflush_options,sd_options } from '@/assets/GlobalStatus.js'
import api from '../assets/request_api.js'
import { defautParams } from '../assets/DefaultConfig.js'

import process from '@/components/process.vue'
import { anime } from '../assets/animejs'


const seedIsRandom = ref(false)

await reflush_options()

let PickerModelSelectedIdx = ref(2)
function OnModelPickerClick(idx, value) {
    // 切换模型
    loading('正在切换模型...')
    api.change_model(modelList.value[idx].title).then(() => {
        PickerModelSelectedIdx.value = idx
        loadingEnd()
    })
}

let model_list = function () {
    api.model_list().then(data=>{
        data = data.sort((p1, p2) =>{ // 对数据排序 保证每次都顺序相同
            return p1.title.localeCompare( p2.title)
        })
        modelList.value = data

        // 匹配选项
        for(let i = 0; i < modelList.value.length; i++) {
            if(modelList.value[i].title == sd_options.value.sd_model_checkpoint) {
                PickerModelSelectedIdx.value = i
                break;
            }
        }
    })
}
model_list()

let refushLoras = function () {
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
    $("body").click(() => {
        // 隐藏窗口
        ParamsPlaneIsShow.value = false
    })

    watch(ParamsPlaneIsShow, (newVal, oldVal) => {
        if (newVal) {
            anime({
                targets: '#right-plane',
                translateX: 0,
                easing: 'easeInOutExpo',
                duration: 300
            })
        } else {
            anime({
                targets: '#right-plane',
                translateX: 500,
                easing: 'easeInOutExpo',
                duration: 300
            })
        }
        
    })
    anime({
            targets: '#right-plane',
            translateX: 500,
            duration: 0
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
.size-picker {
    height: 52px;

    border-radius: 10px;
    display: inline-block;
}



.size-picker:hover {
    background-color: #fff8;
    border-radius: 10px;
    display: inline-block;
    cursor: pointer;
}


.size-picker-selected {
    height: 52px;
    cursor: pointer;

    background-color: var(--color-gray-ui-active);
    color: var(--color-gray-font-white);

    border-radius: 10px;
    display: inline-block;
}


.model-picker {
    height: 32px;
    width: 170px;
    margin-right: 30px;
    margin-bottom: 10px;

    border-radius: 40px;
    display: inline-block;
}



.model-picker:hover {
    background-color: #fff8;
    border-radius: 40px;
    display: inline-block;
    cursor: pointer;
}


.model-picker-selected {
    height: 32px;
    cursor: pointer;
    width: 170px;
    margin-right: 30px;
    margin-bottom: 10px;

    background-color: var(--color-gray-ui-active);
    color: var(--color-gray-font-white);

    border-radius: 40px;
    display: inline-block;
}
</style>