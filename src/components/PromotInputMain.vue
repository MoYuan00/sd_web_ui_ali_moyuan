<template>
    <!-- <el-input v-model="input_value" maxlength="30" placeholder="Please input" show-word-limit type="textarea" /> -->
    <el-row justify="center" align="middle" style="width: 100%; height: 100%;">
        <el-col :span="24">
            <el-row>
                <div class="textarea-close" v-loading="genState" element-loading-text="正在生成...">
                    <div >
                        <textarea class="input-close" v-model="promt_input"> </textarea>


                        <div style="position: absolute; bottom: 8px; right: 8px;">
                            <span style="height: 50px; position: absolute;left: -100px; line-height: 50px; width: 100px; display: inline-block; background: linear-gradient(to right, rgba(255, 255, 255, 0),  var(--color-gray-ui-bg-2));">
                            </span>
                            <button class="button font-key pointer" @click="onClick">
                                生成渲染
                            </button>
                        </div>
                        <!-- ParamsPlane按钮 -->
                        <div class="cursor-pointer params-plane-button" style="position: absolute; bottom: 8px; left: 8px;">
                            <div style="border-radius: 30px; background-color: #3333; padding: 0px; line-height: 0;">
                                <img src="../assets/icon/icon1.png" style="height: 50px;">
                            </div>
                        </div>
                    </div>
                </div>

            </el-row>
            <el-row>
                <div style="width: 650px; height: 50px; margin: auto; color: #3333; font-size: small;">
                    {{ promt_input_en }}
                </div>
            </el-row>
            <div style="width: 650px; height: 50px; margin: auto; color: #3333; font-size: small;">
                <template v-for="item in loras">
                    <span style="color: gray; margin-right: 10px; font-size: 10px;">
                        {{ item.name }} : {{ item.weight }}
                    </span> |
                </template>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import { ref, watch, computed, onMounted, defineEmits } from 'vue'
import $ from 'jquery'

</script>

<script setup>
import { genState, ParamsPlaneIsShow } from '@/assets/GlobalStatus.js'
import { promt_input, promt_input_en, loras } from '@/assets/ImgParams'
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

const tags_sp = computed(() => {
    return promt_input.value.replace(/  /g, ' ').split(/\s*[,，]/).filter(s => s.trim().length > 0)
})

</script>

<style scoped>
.button {
    height: 52px;
    width: 187px;
    border-width: 0px;
    background: linear-gradient(to right, #009fff, #0000ff);
    border-radius: 50px;
    color: white;
}

.textarea {
    position: relative;
    min-width: 800px;
    width: 800px;
    margin: auto;
    padding: 30px;
    border-radius: 30px;
    border-width: 0px;


    font-size: 15px;
    font-weight: bolder;

    background-color: var(--color-gray-ui-bg-2);
}

.textarea-close {
    position: relative;
    min-width: 800px;
    width: 800px;
    margin: auto;
    padding: 0px;
    border-radius: 40px;
    border-width: 0px;

    min-height: 66px;


    font-size: 15px;
    font-weight: bolder;


    background-color: var(--color-gray-ui-bg-2);
}

.input-close {
    background-color: #0000;
    font-size: 18px;
    font-weight: bold;
    border: none;

    outline: none;
    width: 500px;
    
    position: relative;
    left: 100px;
    top: 25px;

    display: block;
    resize: none;


    display: inline-block;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow:ellipsis;
}

.input {
    background-color: #0000;
    font-size: 15px;
    font-weight: bold;
    border: none;

    outline: none;
    width: 100%;
    height: 150px;
    margin-top: 20px;
    resize: none;
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


/* 胶囊颜色 */
.sp {
    background: linear-gradient(to right, #3333, #aaaa);
    color: white;
    display: inline-block;
    border-radius: 20px;
    padding: 5px 8px;
    font-size: 15px;
    margin-right: 3px;
    margin-top: 3px;
    margin-bottom: 3px;
}
</style>