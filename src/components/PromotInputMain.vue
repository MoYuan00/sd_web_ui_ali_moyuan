<template>
    <!-- <el-input v-model="input_value" maxlength="30" placeholder="Please input" show-word-limit type="textarea" /> -->
    <el-row justify="center" align="middle" style="width: 100%; height: 100%;">
        <el-col :span="24">
            <el-row>
                <div class="input" v-loading="genState" element-loading-text="正在生成...">
                    <textarea v-model="promt_input" style="width: 100%; height: 200px;"> </textarea>
                    <div style="position: absolute; bottom: 10px; right: 5px;">
                        <button class="button font-key pointer" @click="onClick">
                            生成渲染
                        </button>
                    </div>
                    <!-- ParamsPlane按钮 -->
                    <div class="cursor-pointer params-plane-button" style="position: absolute; bottom: 10px; left: 5px;">
                        <div style="border-radius: 30px; background-color: #3333; padding: 0px; line-height: 0;">
                            <img src="../assets/icon/icon1.png" style="height: 50px;">
                            <!-- <el-icon :size="30" color="#3338">
                                <Expand />
                            </el-icon> -->
                        </div>
                    </div>

                </div>
                
            </el-row>
            <el-row>
                <div style="width: 650px; height: 50px; margin: auto; color: #3333; font-size: small;">
                    {{ promt_input_en }}
                </div>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
import { ref, watch, computed, onMounted, defineEmits } from 'vue'
import $ from 'jquery'
</script>

<script setup>
import { genState, ParamsPlaneIsShow } from '@/assets/GlobalStatus.js'
import { promt_input,promt_input_en } from '@/assets/ImgParams'
import { onSubmit } from '@/assets/GenImage'
import { bus } from '@/assets/EventCenter'
import api from '../assets/request_api.js'

function onClick() {
    onSubmit(false, () => {
        bus.emit('gen-img')
    })
}

let translateTask = null;
function updateTranaslate() {
    clearTimeout(translateTask);
    translateTask = setTimeout(() => {
        api.translate(promt_input.value).then(data => {
            promt_input_en.value = data.text
        })
    }, 2000);
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
        let t = !ParamsPlaneIsShow.value;
        ParamsPlaneIsShow.value = t
        // ParamsPlaneIsShow.value =  (Number)(ParamsPlaneIsShow.value) + 1
        return false;
    })
    updateTranaslate()
})

watch(promt_input, () => {
    updateTranaslate()
})

</script>

<style scoped>
.input {
    position: relative;
    min-width: 800px;
    margin: auto;
}

.button {
    height: 52px;
    width: 187px;
    border-width: 0px;
    background: linear-gradient(to right, #009fff, #0000ff);
    border-radius: 50px;
    color: white;
}

textarea {
    padding: 30px;
    border-radius: 30px;
    border-width: 0px;

    resize: none;

    font-size: 15px;
    font-weight: bolder;

    background-color: var(--color-gray-ui-bg-2);
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