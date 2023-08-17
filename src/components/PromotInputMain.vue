<template>
    <!-- <el-input v-model="input_value" maxlength="30" placeholder="Please input" show-word-limit type="textarea" /> -->
    <el-row justify="center" align="middle" style="width: 100%; height: 100%;">
        <el-col :span="24">
            <el-row>
                <div class="input" v-loading="genState" element-loading-text="正在生成...">
                    <textarea v-model="promt_input" style="width: 100%; height: 200px;"> </textarea>
                    <div style="position: absolute; bottom: 10px; right: 5px;">
                        <button  class="submit pointer" @click="onSubmit"
                            style="height: 45px; width: 130px; background-color: #33d; border-style: solid; border-color: white; border-width: 1px; border-radius: 50px; color: white; font-size: 20px; font-weight: 600;">
                            随机生成
                        </button>
                    </div>
                    <!-- ParamsPlane按钮 -->
                    <div class="cursor-pointer params-plane-button" @click="ParamsPlaneIsShow = !ParamsPlaneIsShow"
                        style="position: absolute; bottom: 10px; left: 5px;">
                        <div style="border-radius: 30px; background-color: #3333; padding: 10px; line-height: 0;">
                            <el-icon :size="30" color="#3338">
                                <Expand />
                            </el-icon>
                        </div>
                    </div>
                </div>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
import { ref, watch, computed, onMounted, defineEmits } from 'vue'
import api from '../assets/request_api.js'
import sd_config from '../assets/sd.config.js'
import ParamsPlane from './ParamsPlane.vue'
import ImageHistoryPlane from './ImageHistoryPlane.vue'
import ControlNet from './ControlNet.vue'
import $ from 'jquery'
</script>

<script setup>
import UploadFile from './UploadFile.vue'
import ImageView from './ImageView.vue'
import { ControlNetImg_Base64, FlushHistoryImages, genState, genPercentage, processTxt2ImgResponse, ParamsPlaneIsShow } from '@/assets/GlobalStatus.js'
import { GetImgData, loras, txt2img_data, promt_input, txt2img_alwayson_scripts, isUseControlNet } from '@/assets/ImgParams'
import utils from '@/assets/utils'

const emit = defineEmits(['on-gen-img'])

console.log("执行script PromoInput");
console.log(window.vue);


const genImageList = ref([]); // 生成的图片列表
const genImageInfoList = ref([]); // 生成的图片列表 - 包括详细信息



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


let onSubmit = function () {
    emit('on-gen-img')

    genState.value = true;

    let data = utils.deepClone(txt2img_data.value)
    data.prompt = promt_input.value + getUsedLorasString.value
    if (isUseControlNet.value) {
        txt2img_alwayson_scripts.value.controlnet.args[0].input_image = ControlNetImg_Base64.value
    } else {
        txt2img_alwayson_scripts.value.controlnet.args[0].input_image = ''
    }
    data.alwayson_scripts = txt2img_alwayson_scripts.value

    // 图片信息
    data.custom_info_str = GetImgData()

    api.txt2img(data).then((response) => {
        let count = 0
        let length = response.images.length;
        genImageList.value.splice(0, genImageList.value.length)
        genImageInfoList.value.splice(0, genImageInfoList.value.length)

        response.images.forEach(element => {
            // 如果生成多个图片会第一张返回多个图片的预览，如果开启control会额外返回一个image
            count++;
            if (data.batch_size > 1 && count == 1) return;
            if (isUseControlNet.value && count == length) return;

            genImageList.value.unshift(element)
            genImageInfoList.value.unshift({ image: element, parmas: data, imageType: 'base64' })
        });
        processTxt2ImgResponse(response)
        FlushHistoryImages()
        console.log('window.router')
        window.router.push({ name: 'sd-view' })
        genState.value = false;
    }).catch(function (err) {
        genState.value = false;
    })

    function queryProgress() {
        let t = setInterval(function () {
            api.progress().then((response) => {
                genPercentage.value = (response.progress * 100).toFixed(1);
                if (!genState.value) {
                    clearInterval(t);
                }
            }).catch(function (err) {
                if (!genState.value) {
                    clearInterval(t);
                }
            })
        }, 1000, 1000)

    }

    queryProgress();
}




onMounted(() => {
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

    $('.params-plane-button').click(() => {
        console.log('.params-plane-button click');
        // ParamsPlaneIsShow.value =  (Number)(ParamsPlaneIsShow.value) + 1
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
    border-width: 0px;
    background-color: #aaa5;

    resize: none;

    font-size: 15px;
    font-weight: bolder;
}

div.params {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(100, 100, 100, 0.6) 40%);

    border-radius: 40px 0px 0px 40px;
    border-width: 0px;
    border-color: white;
    /* border-style: solid; */
    padding: 20px;
    color: rgba(255, 255, 255, 0.6);
    width: 450px;
    position: absolute;
    right: 0px;
    top: 0px;
    height: 100%;
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