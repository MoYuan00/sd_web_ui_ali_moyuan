<template>
    <!-- <el-input v-model="input_value" maxlength="30" placeholder="Please input" show-word-limit type="textarea" /> -->
    <el-row justify="center" align="middle" style="width: 100%; height: 100%;">
        <el-col :span="24">
            <el-row>
                <div class="input" v-loading="genState" element-loading-text="正在生成...">
                    <textarea v-model="promt_input" style="width: 100%; height: 200px;"> </textarea>
                    <div style="position: absolute; bottom: 10px; right: 5px;">
                        <button  class="submit pointer" @click="onSubmit(false)"
                            style="height: 45px; width: 130px; background-color: #33d; border-style: solid; border-color: white; border-width: 1px; border-radius: 50px; color: white; font-size: 20px; font-weight: 600;">
                            随机生成
                        </button>
                    </div>
                    <!-- ParamsPlane按钮 -->
                    <div class="cursor-pointer params-plane-button"
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
import $ from 'jquery'
</script>

<script setup>
import {  genState,  ParamsPlaneIsShow } from '@/assets/GlobalStatus.js'
import {   promt_input } from '@/assets/ImgParams'
import {  onSubmit } from '@/assets/GenImage'

const emit = defineEmits(['on-gen-img'])

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