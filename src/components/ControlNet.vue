<template>
    <div style="text-align: center;">
        文件选择
        <input type="file" @change="OnSelectFile">
        <p style="color: white;">
            {{ currentImgUrl }}
            <!-- 显示image base64 url: {{ selectedFile }} -->
        </p>

        <div style="width: 200px; display: inline-block; color: white;">
            <div style="display: inline-block;">
                <span>水平旋转</span>
                <el-slider v-model="HorizontalRotate" :step="RotateHorizontalStep" :min="RotateHorizontalMin"
                    :max="RotateHorizontalMax" />
            </div>
            <div>
                <span>垂直旋转</span>
                <el-slider v-model="VerticalRotate" :step="RotateVerticalStep" :min="RotateVerticalMin"
                    :max="RotateVerticalMax" />
            </div>

            <div>
                <span>大小</span>
                <el-slider v-model="imageShowSize" :step="0.02" :min="0.05" :max="5" />
            </div>
            <div>
                <span>水平位置</span>
                <el-slider v-model="VerticalPosition" :step="0.02" :min="0" :max="1" />
            </div>
            <div>
                <span>垂直位置</span>
                <el-slider v-model="HorizontalPosition" :step="0.02" :min="0" :max="1" />
            </div>
        </div>
        <div style="display: inline-block;">
            <canvas id="canvas" height="512" width="512" style="background-color: #fff2;">
            </canvas>
            <!-- <img :src="selectedFile" style="max-height: 512px;" /> -->
            <!-- <div style="color: white; display: inline-block;">
                <img :src="ControlNetImg_Base64" />
                <a download="下载名称" :href="ControlNetImg_Base64">下载</a>
            </div> -->
        </div>
    </div>
</template>



<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { ControlNetImg_Base64 } from '@/assets/GlobalStatus.js'
import { VerticalRotate,HorizontalRotate,imageShowSize,VerticalPosition,HorizontalPosition   } from '@/assets/ImgParams'
const selectedFile = ref('')

// 控制图片

const RotateVerticalStep = 1
const RotateVerticalMin = 1
const RotateVerticalMax = 4

const RotateHorizontalStep = 5
const RotateHorizontalMin = 0
const RotateHorizontalMax = 15


const currentImgUrl = computed(() => {
    let imgName = HorizontalRotate.value + '_' + ('' + VerticalRotate.value).padStart(4, '0');

    return '/src/assets/wireframe/' + HorizontalRotate.value + '/' + imgName + '.png'
})


// function OnSelectFile(e) { // 选择文件并转为 base64
//     console.log(e);
//     console.log(e.target.value);
//     console.log(e.target.files);

//     let files = e.target.files
//     let reader = new FileReader();
//     // 新建 FileReader 对象
//     reader.onload = function () {
//         // 当 FileReader 读取文件时候，读取的结果会放在 FileReader.result 属性中
//         selectedFile.value = this.result;
//         drawImg(this.result);
//     };
//     // reader.readAsDataURL(files[0]);
//     reader.readAsDataURL(currentImgUrl.value);
//     // reader.readAsText(files[0]);
// }

function drawImg(dataurl) {
    let canvas = document.getElementById("canvas");
    // canvas.clearRect(0,0,canvas.width,canvas.height);  

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "Anonymous";
    // img.src = url; base64 和 url 都可以

    // img.src = dataurl
    img.src = currentImgUrl.value
    img.onload = function () {
        // canvas.height = img.height;
        // canvas.width = img.width;
        canvas.height = 512;
        canvas.width = 512;

        let img_show_width = img.width * imageShowSize.value;
        let img_show_height = img.height * imageShowSize.value;
        let img_show_x = VerticalPosition.value * canvas.width - img_show_width * 0.5;
        let img_show_y = HorizontalPosition.value * canvas.height - img_show_height * 0.5;


        ctx.drawImage(img, img_show_x, img_show_y, img_show_width, img_show_height);
        const dataURL = canvas.toDataURL("image/jpeg", 1); //可选取多种模式
        ControlNetImg_Base64.value = dataURL
        // callback.call(this, dataURL); //回掉函数获取Base64编码
    };
}

onMounted(() => {
    drawImg()
})

watch(VerticalRotate, () => {
    drawImg(selectedFile.value)
})
watch(HorizontalRotate, () => {
    drawImg(selectedFile.value)
})

watch(imageShowSize, () => {
    drawImg(selectedFile.value)
})
watch(VerticalPosition, () => {
    drawImg(selectedFile.value)
})
watch(HorizontalPosition, () => {
    drawImg(selectedFile.value)
})
</script>



<style></style>
