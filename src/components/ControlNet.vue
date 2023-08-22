<template>
    <div style="text-align: center;">
        <!-- <p style="color: white;">
            {{ currentImgUrl }}
            显示image base64 url: {{ selectedFile }}
        </p> -->

        <!-- <div style="width: 200px; display: inline-block; color: white;">
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
        </div> -->
        <div style="display: inline-block;">
            <!-- 画板， 绘制图片，隐藏 -->
            <canvas id="canvas" height="512" width="512" style="background-color: #fff2; display: none">
            </canvas>
            <!-- <img :src="selectedFile" style="max-height: 512px;" /> -->
            <!-- 显示绘制结果，可以控制 -->
            <div style="color: white;  background-color: #fffa; ">
                <img id="canvas-event" :src="ControlNetImg_Base64" style="max-height: 300px;" draggable="false" />
                <!-- <a download="下载名称" :href="ControlNetImg_Base64">下载</a> -->
            </div>
            <div style="position: absolute; right: 5px; top: 0px; z-index: 1000;">
                <el-tooltip class="box-item" effect="dark" content="在画布上鼠标左键拖拽位置，右键拖拽切换视角，滚轮缩放" placement="top">
                    <el-icon class="pointer" >
                        <InfoFilled />
                    </el-icon>
                </el-tooltip>
            </div>
            <slot></slot>
        </div>
    </div>
</template>



<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { ControlNetImg_Base64 } from '@/assets/GlobalStatus.js'
import { VerticalRotate, HorizontalRotate, imageShowSize, VerticalPosition, HorizontalPosition } from '@/assets/ImgParams'
const selectedFile = ref('')

// 控制图片

const RotateVerticalStep = 1
const RotateVerticalMin = 1
const RotateVerticalMax = 4

const RotateHorizontalStep = 5
const RotateHorizontalMin = 0
const RotateHorizontalMax = 15


const currentImgUrl = computed(() => {
    let imgName = 1 + '_' + ('' + VerticalRotate.value).padStart(4, '0');

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
let canvas = {};

function drawImg(dataurl) {
    // let canvas = document.getElementById("canvas");
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
        let img_show_x = HorizontalPosition.value * canvas.width - img_show_width * 0.5;
        let img_show_y = VerticalPosition.value * canvas.height - img_show_height * 0.5;


        ctx.drawImage(img, img_show_x, img_show_y, img_show_width, img_show_height);
        const dataURL = canvas.toDataURL("image/jpeg", 1); //可选取多种模式
        ControlNetImg_Base64.value = dataURL
        // callback.call(this, dataURL); //回掉函数获取Base64编码
    };
}

let movePositionState = false;
let moveRotationState = false;
let mouseLastX = -1;
let mouseLastY = -1;
let mouseDownX = -1;
let mouseDownY = -1;
let moveSpeed = 0.003;
let rotateXSpeed = 0.5;
let rotateYSpeed = 0.1;

let rotateStartValX = 0;
let rotateStartValY = 0;

function OnCanvasDown() {
    console.log('down canvas')
    event.preventDefault(); // 让浏览器不要执行默认的鼠标按下事件，这会导致图片被拖动
    if (event.button == 0) {
        movePositionState = true;
    }
    if (event.button == 2) { // 右键
        moveRotationState = true;
    }

    mouseLastX = mouseDownX = event.offsetX;
    mouseLastY = mouseDownY = event.offsetY;

    rotateStartValY = VerticalRotate.value;
    rotateStartValX = HorizontalRotate.value;
}

function OnCanvasMouseover() {
    console.log('OnCanvasMouseover')
}
function OnCanvasMouseexit() {
    console.log('OnCanvasMouseexit') // 放在在外进行移动和鼠标释放
    movePositionState = false;
    moveRotationState = false;
}
function OnCanvasUp() {
    console.log('up canvas')
    movePositionState = false;
    moveRotationState = false;
}

function OnCanvasDrag() {

    // console.log('drag canvas')

    let x_dir = (event.offsetX) - mouseLastX;
    let y_dir = (event.offsetY) - mouseLastY;
    let x_offset = (event.offsetX) - mouseDownX;
    let y_offset = (event.offsetY) - mouseDownY;
    // console.log('dir:' + x_dir + ", " + y_dir);
    // console.log('offset:' + x_offset + ", " + y_offset);
    // console.log('event: ' + 'position' + movePositionState + " rotate " + moveRotationState); 
    if (movePositionState) {
        VerticalPosition.update(VerticalPosition.value + y_dir * moveSpeed);
        HorizontalPosition.update(HorizontalPosition.value + x_dir * moveSpeed);
    }
    if (moveRotationState) {
        VerticalRotate.update(rotateStartValY + y_offset * rotateYSpeed);
        HorizontalRotate.update(rotateStartValX + x_offset * rotateXSpeed);
    }



    mouseLastX = event.offsetX;
    mouseLastY = event.offsetY;
}

function OnMousewheel() {
    // console.log('OnMousewheel canvas')
    // console.log(event.wheelDelta ); // 滚动值 正数表示向上，负数向下 。 下=>放大，上缩小
    imageShowSize.update(imageShowSize.value + 0.0005 * (-event.wheelDelta));
    event.preventDefault(); // 阻止浏览器默认行为向下滑动
    return false
}

onMounted(() => {
    canvas = document.getElementById("canvas");
    let canvasEvent = document.getElementById("canvas-event");

    drawImg()
    canvasEvent.addEventListener('mousedown', OnCanvasDown);
    canvasEvent.addEventListener('mouseup', OnCanvasUp);
    canvasEvent.addEventListener('mousemove', OnCanvasDrag);
    canvasEvent.addEventListener('mousewheel', OnMousewheel);
    canvasEvent.addEventListener('mouseover', OnCanvasMouseover);
    canvasEvent.addEventListener('mouseleave', OnCanvasMouseexit);
    canvasEvent.oncontextmenu = () => {
        console.log('contextmenu');
        return false;
    };
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
