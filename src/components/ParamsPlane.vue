<!-- 参数面板 -->
<template>
    <div id="right-plane" class="bg-contain"
        style="position: fixed; top: 150px; right: 0px; bottom: 0px; width: 468px; overflow-y: scroll; border-radius: 40px 0px 0px;">

        <div style="height: 100%; z-index: 2001;  ">
            <div class="params"
                style="border-radius: 40px 0px 0px; height: 100%; padding: 30px 30px;  z-index: 2002; position: relative;   ">

                <div style="border-radius: 0px 30px 30px 0px; ">
                    <div style="text-align: center; margin: 15px 0px 10px 0px">
                        2D画面风格
                    </div>
                    <template v-for="(item, idx) of modelList" :key="item.model_name">
                        <div class="bg-ui align-center-v align-center-h"
                            :class="{ 'model-picker': PickerModelSelectedIdx != idx, 'model-picker-selected': PickerModelSelectedIdx == idx }"
                            @click="OnModelPickerClick(idx)">
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
                    <!-- <div class="bg-ui align-center-v align-center-h"
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
                </div> -->
                    <div class="bg-ui align-center-v align-center-h"
                        :class="{ 'size-picker': sizePickerSelectedIdx != 2, 'size-picker-selected': sizePickerSelectedIdx == 2 }"
                        style="width: 80px; margin-left: 10px;"
                        @click="OnSizePickerClick(2, { 'width': 1024, 'height': 512 })">
                        2:1
                    </div>
                    <div class="bg-ui align-center-v align-center-h"
                        :class="{ 'size-picker': sizePickerSelectedIdx != 3, 'size-picker-selected': sizePickerSelectedIdx == 3 }"
                        style="width: 230px; margin-left: 10px;  margin-top: 10px; "
                        @click="OnSizePickerClick(3, txt2img_data)">
                        自定义
                        <input style="width: 50px;  border: 0px; padding: 1px;" v-model="txt2img_data.width" />
                        x
                        <input style="width: 50px; border: 0px; padding: 1px;" v-model="txt2img_data.height" />
                    </div>
                </div>

                <div style="margin: 20px;"> </div>
                <div>

                    <div>画面参数微调</div>
                    <div>
                        <div v-for="item in loras" :key="item.name" style="margin-top: 10px; position: relative;">
                            <process v-model="item.weight" :min="item.min" :max="item.max" :title="item.name"
                                :val_suffix="'%'" :is_scale_value="false"></process>
                        </div>
                        <!-- <div>
            </div> -->
                    </div>
                    <div style="margin: 20px;"> </div>
                    <div>其他参数</div>
                    <div style="margin: 10px;"> </div>
                    <div>
                        <process v-model="txt2img_data.cfg_scale" :min="1" :max="30" :title="'文字随机性(CFG)'"></process>
                    </div>

                    <div style="margin-top: 10px;">
                        <div>
                            <process v-model="txt2img_data.batch_size" :max="20" :min="1" :title="'图片数量'"></process>
                        </div>
                    </div>

                    <div>

                        <ParamsPlaneLeft></ParamsPlaneLeft>
                    </div>


                    <div style="display: flex;">

                        <div @click.stop="dialogVisible = true" class=" button_white "
                            style=" margin: auto; display: flex; padding: 5px 15px; border-radius: 25px; background-color: var(--color-gray-ui-bg);">
                            默认参数控制
                        </div>
                    </div>

                </div>

                <!-- <div style="margin: auto; display: inline-block;">
                <div class="pointer font-normal"
                    style="width: 175px; height: 30px; border-radius: 40px; background-color: #e0e0e0 ; color: #adadad; text-align: center;">
                    恢复默认
                </div>
            </div> -->
            </div>
        </div>
    </div>

    <el-dialog v-model="dialogVisible" title="默认参数控制" width="30%" @click.stop="1">
        <div>
            <div style="scrollbar-color: var(--color-gray-ui-bg);">

                <div class="bg-ui" style="border-radius: 10px; padding: 5px;">
                    默认关键词前缀（会放在所有关键字前面：
                    <div></div>
                    <textarea v-model="defautParams.prompt_pre" style="width: 100%;"></textarea>
                </div>
                <div style="margin: 10px;"> </div>
                <div class="bg-ui" style="border-radius: 10px; padding: 5px;">
                    Lora名称对应范围控制:
                    <template v-for="(item, idx) in defautParams.loras_control">
                        <div>
                            <div>
                                名称：
                                <select v-model="item.name">
                                    <template v-for="lo in loras">
                                        <option :value="lo.name">{{ lo.name }}</option>
                                    </template>
                                </select>
                            </div>
                            <div>
                                默认值：
                                <input type="number" :min="item.min" :max="item.max" step="0.01" v-model="item.default">
                            </div>
                            <div>
                                最小值：
                                <input type="number" min="0" :max="item.max" step="0.01" v-model="item.min">
                            </div>
                            <div>
                                最大值：
                                <input type="number" :min="item.min" max="2" step="0.01" v-model="item.max">
                            </div>
                            <div>
                                排序值：（越小越靠前）
                                <input type="number" min="0" max="21" step="1" v-model="item.order">
                            </div>
                        </div>
                        <div style="margin: 8px;">

                        </div>
                    </template>
                </div>
                <div style="margin: 10px;"></div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import $ from 'jquery'
import { loras, txt2img_data, enable_hr, modelList } from '@/assets/ImgParams.js'
import { ParamsPlaneIsShow, loading, loadingEnd, reflush_options, sd_options } from '@/assets/GlobalStatus.js'
import api from '../assets/request_api.js'
import { defautParams } from '../assets/DefaultConfig.js'
import ParamsPlaneLeft from '@/components/ParamsPlaneLeft.vue'

import process from '@/components/process.vue'
import { anime } from '../assets/animejs'

const dialogVisible = ref(false)
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
    api.model_list().then(data => {
        data = data.sort((p1, p2) => { // 对数据排序 保证每次都顺序相同
            return p1.title.localeCompare(p2.title)
        })
        modelList.value = data

        // 匹配选项
        for (let i = 0; i < modelList.value.length; i++) {
            if (modelList.value[i].title == sd_options.value.sd_model_checkpoint) {
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
        window.loras = loras
        // 将loras的min，max设置进行绑定
        loras.value.forEach(element => {
            defautParams.value.loras_control.forEach(setting => {
                if (setting.name == element.name) {
                    element.min = setting.min
                    element.max = setting.max
                    element.weight = setting.default
                    element.order = setting.order
                }
            })
        });
        loras.value.sort((o, oo)=>{ // 排序
            return o.order - oo.order;
        })
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



const img_file = ref(null)

const selectedFileShow = ref({ display: 'none' })
const img = ref(null)

function clickSelectFile() {
    console.log(img_file.value);
    img_file.value.dispatchEvent(new MouseEvent("click"));
}

function getFileData() {
    let file = img_file.value.files[0]
    console.log(file);

    var reader = new FileReader();
    reader.onload = function (e) {
        console.log(reader.result);  //或者 e.target.result都是一样的，都是base64码
        shuffle_img.value = reader.result
        selectedFileShow.value.display = 'block'
    }
    reader.readAsDataURL(file)
}


function DeleteImg(e) {
    e.stopPropagation()
    shuffle_img.value = ''
    selectedFileShow.value.display = 'none'
}



// 选择面板

let sizePickerSelectedIdx = ref(3)
function OnSizePickerClick(idx, value) {
    sizePickerSelectedIdx.value = idx
    console.log('OnSizePickerClick');
    txt2img_data.value.width = value.width;
    txt2img_data.value.height = value.height;
}

watch(defautParams, (newVal, oldVal) => {
    // 更新lora中的值
    localStorage.setItem('defaultParams', JSON.stringify(newVal))

    console.log('save defaultParams');

}, {
    deep: true
})


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
    width: 160px;
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
}</style>