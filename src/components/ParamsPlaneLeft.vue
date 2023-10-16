<!-- 参数面板 -->
<template>
    <div id="plane" style="">
        <div class="" style=" ">
            <div style="margin-bottom: 10px; margin-top: 30px;">
                角度选择
            </div>
            <div class="four-corners-border" style="width: 400px; margin: auto; position: relative;">
                <ContolNet :style_max_height="200"></ContolNet>
            </div>
            <div style="margin-top: 20px; ">
                <span style="margin-right: 20px;">
                    样板选择
                </span>
                <div
                    style="display: inline-block; border-radius: 40px; background-color: white; padding: 8px 10px 8px 25px; line-height: 30px;">
                    <span style="min-width: 200px; display: inline-block;">
                        模型类型
                    </span>
                    <span class="pointer" style="float: right; line-height: 0;">
                        <img src="../assets/icon/icon4.png" style="height: 30px;">
                    </span>
                </div>
            </div>
            <div style="margin-bottom: 10px; margin-top: 30px;">
                参考图添加
            </div>
            <div class="four-corners-border" style="width: 400px; margin: auto; position: relative;">
                <div class="pointer" style="width: 100%; height: 200px; background-color: #f5f5f5; position: relative;; "
                    @click="clickSelectFile">
                    <div style="height: 100%; width: 100%;">
                        <template v-if="shuffle_img.length <= 0">
                            <div
                                style="display: inline-flex; justify-content: center; align-items: center;  height: 100%; width: 100%;">
                                <div style="display: flex;">
                                    <!-- 选择一张图片作为画风参考 -->
                                    <el-icon :size="70" color="#cccc"><Plus /></el-icon>
                                </div>
                            </div>
                        </template>
                        <div style="height: 100%; width: 100%;" :style="selectedFileShow">
                            <img ref="img" style="height: 100%; width: 100%; object-fit: contain;" :src="shuffle_img"
                                alt="" />
                            <div id="img_mask">
                                <div
                                    style="display: inline-flex; justify-content: center; align-items: center; height: 100%; width: 100%; cursor: default;">
                                    <span class="pointer" style="display: flex;" @click="DeleteImg">
                                        <el-tooltip class="box-item" effect="dark" content="删除图片" placement="top">
                                            <el-icon color="#ddd" size="30">
                                                <Delete />
                                            </el-icon>
                                        </el-tooltip>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <input ref="img_file" type="file" accept="image/png,image/jpeg" style="display: none;" @click="e => { e.target.value = ''; }"
                    @change="getFileData">
                <!-- <div style="font-size: small;">
                    (推荐不要使用带透明像素的图片，透明像素将会被黑色像素填充)
                </div> -->
            </div>
            <div style="height: 50px;">
            </div>


            
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, getCurrentInstance } from 'vue'
import $ from 'jquery'
import { loras, txt2img_data, modelList, shuffle_img } from '@/assets/ImgParams.js'
import { ControlNetIsShow, loading, loadingEnd } from '@/assets/GlobalStatus.js'
import ContolNet from './ControlNet.vue'
import api from '../assets/request_api.js'
import { anime } from '../assets/animejs'
import Viewer from 'viewerjs';

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

onMounted(() => {

    $("#plane").click(() => {
        console.log('.params click');
        event.stopPropagation(); // 阻止事件冒泡
        return false;
    })

})

watch(shuffle_img, (newVal, oldVal)=>{
    console.log('watch(shuffle_img');
    if(newVal && newVal.length > 0) {
        selectedFileShow.value.display = 'block'
    }
})


// 选择面板
let PickerModelSelectedIdx = ref(2)
function OnModelPickerClick(idx, value) {
    // 切换模型
    loading('正在切换模型...')
    api.change_model(modelList.value[idx].title).then(() => {
        PickerModelSelectedIdx.value = idx
        loadingEnd()
    })
}

</script>

<style scoped>
#img_mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    z-index: 100;

    background: linear-gradient(to bottom, #fff0, #000f);
    opacity: 0;
}

#img_mask:hover {
    opacity: 1;
}
</style>