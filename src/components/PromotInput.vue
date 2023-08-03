<template>
    <!-- <el-input v-model="input_value" maxlength="30" placeholder="Please input" show-word-limit type="textarea" /> -->
    <el-row justify="center" align="middle" style="width: 100%; height: 100%;">
        <el-col :span="24">
            <el-row>
                <ImageView class="image_top" :images="genImageList" :image_base64="image_base64"></ImageView>
            </el-row>
            <el-row>
                <div class="input">
                    <textarea v-model="promt_input" style="width: 100%; height: 200px;"> </textarea>
                    <div style="position: absolute; bottom: 20px; right: 20px;">
                        <button class="submit" @click="onSubmit"
                            style="height: 60px; width: 130px; background-color: var(--color-primary); border-style: solid; border-color: white; border-width: 1px; border-radius: 50px; color: white; font-size: 20px; font-weight: 600;">
                            随机生成
                        </button>
                    </div>
                    <div style="position: absolute; bottom: 30px; right: 230px; font-size: 18px; font-weight: bold;">
                        输⼊想要的天猫超级符号创意
                    </div>
                    <!-- ParamsPlane按钮 -->
                    <div class="cursor-pointer params-plane-button" @click="ParamsPlaneIsShow = !ParamsPlaneIsShow" style="position: absolute; color: white; bottom: 5px; right: -70px;">
                        <div
                            style="border-radius: 30px; background-color: rgba(200, 200, 200, .5); padding: 10px; line-height: 0;">
                            <el-icon :size="30">
                                <Expand />
                            </el-icon>
                        </div>
                    </div>
                </div>

            </el-row>
        </el-col>
    </el-row>

    <ParamsPlane :txt2img_data="txt2img_data" :loras="loras" :is_show="ParamsPlaneIsShow"></ParamsPlane>
    <div style="position: absolute;">
        <div>
            <el-progress v-if="genState" :percentage="genPercentage" />
        </div>
    </div>
</template>

<script>
import { ref, watch, computed,onMounted } from 'vue'
import api from '../assets/request_api.js'
import sd_config from '../assets/sd.config.js'
import ParamsPlane from './ParamsPlane.vue'
import $ from 'jquery'
</script>

<script setup>
import UploadFile from './UploadFile.vue'
import ImageView from './ImageView.vue'

console.log("执行script PromoInput");
console.log(window.vue);


const genState = ref(false); // 是否正在生成
const genPercentage = ref(0); // 是否正在生成
const genImageList = ref([]); // 生成的图片列表

const loras = ref([]); // lora列表
const image_base64 = ref('123')

const ParamsPlaneIsShow = ref(true)

const promt_input = ref('masterpiece, best quality, 8k, cinematic light, ultra high res, chibi, 1girl, child, pink hair, multicolored hair, long hair, solo, dress, star hair ornament, horns, blue hair, star \, (symbol\), bangs, gradient hair, artist name, gradient, smile, closed mouth, full body, pink background, gradient background')
const txt2img_data = ref({
    "denoising_strength": 0,
    "prompt": 'masterpiece, best quality, 8k, cinematic light, ultra high res, chibi, 1girl, child, pink hair, multicolored hair, long hair, solo, dress, star hair ornament, horns, blue hair, star \, (symbol\), bangs, gradient hair, artist name, gradient, smile, closed mouth, full body, pink background, gradient background',
    "negative_prompt": "",
    "seed": -1,
    "batch_size": 1,
    "n_iter": 1,
    "steps": 10,
    "cfg_scale": 7,
    "width": 512,
    "height": 512,
    "restore_faces": false,
    "tiling": false,
    "sampler_index": "Euler",
    "save_images": true, // 生成后保持
    // "send_images": true, 
})

const lora_mult_weight = ref({
    "开关": [{ 'name': '启用?', 'value': 1 }],
    "服装": [{ 'name': '服装细节1', 'value': 0.1 }, // 2
    { 'name': '服装细节2', 'value': 0.1 }, // 3
    { 'name': '服装细节3', 'value': 0.1 }], // 4
    "服装姿势": [{ 'name': '背景1', 'value': 0.1 }, // 5
    { 'name': '背景2', 'value': 0.1 }, // 6
    { 'name': '躯干/动作1', 'value': 0.1 }, // 7
    { 'name': '躯干动作', 'value': 0.1 }], // 8
    "服装": [{ 'name': '面部/躯干1', 'value': 0.1 }, // 9
    { 'name': '面部/躯干2', 'value': 0.1 }, // 10
    { 'name': '面部/装饰1', 'value': 0.1 }, // 11
    { '面部/装饰2': 0.1 }], // 12
    "上色风格": [{ 'name': '背景-风格1', 'value': 0.1 }, // 13
    { 'name': '背景-风格2', 'value': 0.1 }, // 14
    { 'name': '背景-风格3', 'value': 0.1 }, // 15
    { 'name': '背景-风格4', 'value': 0.1 }, // 16
    { 'name': '上色风格', 'value': 0.1 }], // 17
})

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
        weight = (weight  / 100 ).toFixed(2);
        if (weight > 0) {
            loraStr = loraStr + "<lora:" + item.name + ":" + (weight);
            loraStr += ">";
        }
    }
    return loraStr
})



let onSubmit = function () {
    console.log('点击onSubmit');
    genState.value = true;
    txt2img_data.value.prompt = promt_input.value + getUsedLorasString.value
    api.txt2img(txt2img_data.value).then((response) => {
        image_base64.value = response.images[response.images.length - 1]; // 更新数据
        response.images.forEach(element => {
            genImageList.value.unshift(element)
        });
        genState.value = false;
    }).catch(function (err) {
        genState.value = false;
    })

    function queryProgress() {
        let t = setInterval(function () {
            api.progress().then((response) => {
                genPercentage.value = response.progress * 100;
                if (!genState.value) {
                    clearInterval(t);
                }
            }).catch(function (err) {
                if (!genState.value) {
                    clearInterval(t);
                }
            })
        }, 1000, 1000)

        // while (genState.value) {

        // }
    }

    queryProgress();
}


let getLoras = function () {
    api.loras().then((response) => {
        loras.value = response;
    }).catch(function (err) {
    })
}
getLoras();


let getTxt2imgFiles = function () {
    api.txt2imgFiles(sd_config.sd_output_root_path_txt2img).then((response) => {
        // loras.value = response;
    }).catch(function (err) {
    })
}
getTxt2imgFiles();

onMounted(()=>{
    $("textarea").click(() => {
        console.log('textarea click');
        return false;
    })
    $("button").click(() => {
        console.log('button click');
        return false;
    })
    $("body").click(() => {
        // 隐藏窗口
        console.log('body click');
        ParamsPlaneIsShow.value = false
    })

    $('.params-plane-button').click(()=>{
        console.log('.params-plane-button click');
        ParamsPlaneIsShow.value = true
        return false;
    })

})

</script>

<style scoped>
.input {
    position: relative;
    width: 650px;
    margin: auto;
}


textarea {
    width: 650px;
    height: 300px;

    padding: 30px;
    border-radius: 30px;

    resize: none;

    font-size: 15px;
    font-weight: bolder;
}

div.params {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(100, 100, 100, 0.6) 40%);

    border-radius: 40px 0px 0px 40px;
    border-width: 0px;
    border-color: white;
    border-style: solid;
    padding: 20px;
    color: rgba(255, 255, 255, 0.6);
    width: 450px;
    position: absolute;
    right: 0px;
    top: 0px;
    height: 100%;
    overflow-y: auto;
}



/*
进度条文字颜色
*/
:deep().el-progress-bar__innerText {
    /* >>>被:deep()替代*/
    /* >>> 深度选择，覆盖element的样式*/
    color: black !important;
}
</style>