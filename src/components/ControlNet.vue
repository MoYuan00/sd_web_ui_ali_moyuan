<template>
    <div style="text-align: center;">
        <div style="cursor: move;">
            <!-- <div style="background-color: var(--color-gray-ui-bg-2);"> -->
            <!-- 画板， 绘制图片，隐藏 -->
            <canvas id="canvas" height="512" width="512" style=" display: none;"> </canvas>
            <!-- <img :src="selectedFile" style="max-height: 512px;" /> -->
            <!-- 显示绘制结果，可以控制 -->
            <div class="align-center-v" style="color: white; position: relative; vertical-align: middle;"
                :style="{ 'height': style_max_height + 'px' }">
                <img :id="uuid" class="canvas-event" :src="ControlNetImg_Base64" draggable="false" />
                <!-- <a download="下载名称" :href="ControlNetImg_Base64">下载</a> -->
            </div>
            <div style="position: absolute; right: 3px; top: 3px; z-index: 1000; 
                    display: flex; justify-content: center; align-items: center;">
                
                <div style="display: flex;">
                    <el-tooltip class="box-item" effect="dark" content="打开或关闭线框图控制" placement="top">
                        <el-switch v-model="isUseControlNet" size="small" width="35" inline-prompt active-text="开"
                            inactive-text="关"
                            style="--el-switch-on-color: #999 ; --el-switch-off-color: #999" />
                    </el-tooltip>
                </div>

                <div style="display: flex; margin-left: 5px;">
                    <el-tooltip class="box-item" effect="dark" content="在画布上鼠标左键拖拽位置，右键拖拽切换视角，滚轮缩放" placement="top">
                        <el-icon class="pointer" color="#0006" size="18">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>


            </div>
            <slot></slot>
        </div>
    </div>
</template>



<script setup>
import { ref, watch, computed, onMounted, defineProps } from 'vue'
import { ControlNetImg_Base64 } from '@/assets/GlobalStatus.js'
import { txt2img_data } from '@/assets/ImgParams.js'
import { VerticalRotate, HorizontalRotate, imageShowSize, VerticalPosition, HorizontalPosition, isUseControlNet } from '@/assets/ImgParams'
import utils from '@/assets/utils.js'
const props = defineProps({
    'style_max_height': {
        type: Number,
        default: 300
    },
    'style_max_width': {
        type: Number,
        default: 300
    }
})

// 控制图片

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

let uuid = utils.uuid()

let dir = [
    [0, 1],
    [0, 1],
    [0, 1],
    [0, -1],
    [0, -1],
    [0, -1],
    [1, 0],
    [1, 0],
    [1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [1, 1],
    [-1, 1],
    [-1, -1],
    [1, -1],
]
var invert = function (imgData) {
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
    }
};

var light = function (imgData) {
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] > 0 ? 255 : 0; // red
        data[i + 1] = data[i + 1] > 0 ? 255 : 0; // green
        data[i + 2] = data[i + 2] > 0 ? 255 : 0; // blue
        data[i + 3] = data[i + 3] > 0 ? 255 : 0; // blue
    }
};
var fixbgroundcolor = function (imgData) {
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] == 255 ? 245 : 0; // red
        data[i + 1] = data[i + 1] == 255 ? 245 : 0; // green
        data[i + 2] = data[i + 2] == 255 ? 245 : 0; // blue
    }
};
let blur = function (imgData) {
    const data = imgData.data;
    const width = imgData.width;
    const height = imgData.height;

    const pixes = new Uint8ClampedArray(imgData.data)
    const getPixel = (x, y) => {
        if (x < 0 || x >= width || y < 0 || y >= height) {
            return null;
        }
        let p = (x + y * width) * 4;
        return pixes.subarray(p, p + 4);
    }

    let i = 0, xx = 0, yy = 0, x = 0, y = 0;
    let r = 0, g = 0, b = 0, a = 0;
    let d = 0;
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            //写回imgData
            r = 0, g = 0, b = 0, a = 0;

            for (d = 0; d < dir.length; d++) {
                xx = x + dir[d][0];
                yy = y + dir[d][1];
                if (xx < 0 || xx >= width || yy < 0 || yy >= height) {
                    continue;
                }
                let p = getPixel(xx, yy);
                if (p == null) continue;
                r += p[0];
                g += p[1];
                b += p[2];
                a += p[3];
            }
            let p = getPixel(x, y);
            // if(p[0] > 0)
            // console.log(p);
            // data.set(p.map(v=> v > 0 ? 255 : 0), i);
            data.set([r, g, b, a].map(v => v / dir.length), i);
            i += 4;
        }
    }

}

function postprocess(imgData) {
    light(imgData);
    // blur(imgData);
    invert(imgData);
    fixbgroundcolor(imgData);
}

const img = new Image(); // 只需要创建一次，及其耗时
let ctx = null
function drawImgWorker(dataurl, downScale = 3, useProcess = false) {
    // let canvas = document.getElementById("canvas");
    // canvas.clearRect(0,0,canvas.width,canvas.height);  
    if (ctx == null) {
        ctx = canvas.getContext("2d");
    }
    ctx["willReadFrequently"] = true
    img.crossOrigin = "Anonymous";
    // img.src = url; base64 和 url 都可以

    // img.src = dataurl
    img.src = currentImgUrl.value
    img.onload = function () {
        var start = new Date().getTime()
        // canvas.height = img.height / downScale;
        // canvas.width = img.width / downScale;
        // 由于宽高是自定义的，这里只能去记录比例
        canvas.height = txt2img_data.value.height / downScale;
        canvas.width = txt2img_data.value.width / downScale;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        let img_show_width = img.width * imageShowSize.value / downScale;
        let img_show_height = img.height * imageShowSize.value / downScale;
        let img_show_x = HorizontalPosition.value * canvas.width - img_show_width * 0.5;
        let img_show_y = VerticalPosition.value * canvas.height - img_show_height * 0.5;


        ctx.drawImage(img, img_show_x, img_show_y, img_show_width, img_show_height);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        postprocess(imgData)
        ctx.putImageData(imgData, 0, 0);

        const dataURL = canvas.toDataURL("image/jpeg", 1); //可选取多种模式
        ControlNetImg_Base64.value = dataURL
        var end = new Date().getTime()
        console.log('cost is', `${end - start}ms`)
    };
}

function drawImg(dataurl, downScale = 3) {
    drawImgWorker()
}





let movePositionState = false;
let moveRotationState = false;
let mouseLastX = -1;
let mouseLastY = -1;
let mouseDownX = -1;
let mouseDownY = -1;
let moveSpeed = 0.0031;
let rotateXSpeed = 0.5;
let rotateYSpeed = 0.1;

let rotateStartValX = 0;
let rotateStartValY = 0;

function OnCanvasDown() {
    console.log('down canvas')
    event.preventDefault(); // 让浏览器不要执行默认的鼠标按下事件，这会导致图片被拖动
    event.stopPropagation()
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
    return false
}

function OnCanvasMouseover() {
    // console.log('OnCanvasMouseover')
}
function OnCanvasMouseexit() {
    // console.log('OnCanvasMouseexit') // 放在在外进行移动和鼠标释放
    movePositionState = false;
    moveRotationState = false;
}
function OnCanvasUp() {
    // console.log('up canvas')
    movePositionState = false;
    moveRotationState = false;
    return false
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
    console.log('OnMousewheel canvas')
    // console.log(event.wheelDelta ); // 滚动值 正数表示向上，负数向下 。 下=>放大，上缩小
    imageShowSize.update(imageShowSize.value + 0.00003 * (-event.wheelDelta));
    event.preventDefault(); // 阻止浏览器默认行为向下滑动
    return false
}

onMounted(() => {
    canvas = document.getElementById("canvas");
    let canvasEvent = document.getElementById(uuid);

    canvasEvent.addEventListener('mousedown', OnCanvasDown, true);
    canvasEvent.addEventListener('click', () => {
        console.log(' canvasEvent click');
        event.stopPropagation()
        return false;
    }, false);
    canvasEvent.addEventListener('mouseup', OnCanvasUp, false);
    canvasEvent.addEventListener('mousemove', OnCanvasDrag, false);
    canvasEvent.addEventListener('mousewheel', OnMousewheel, false);
    canvasEvent.addEventListener('mouseover', OnCanvasMouseover, false);
    canvasEvent.addEventListener('mouseleave', OnCanvasMouseexit, false);
    canvasEvent.oncontextmenu = () => {
        console.log('contextmenu');
        return false;
    };
    drawImg()
})
watch(txt2img_data, () => {
    drawImg()
}, {
    deep: true
})
watch(VerticalRotate, () => {
    drawImg()
})
watch(HorizontalRotate, () => {
    drawImg()
})
watch(imageShowSize, () => {
    drawImg()
})
watch(VerticalPosition, () => {
    drawImg()
})
watch(HorizontalPosition, () => {
    drawImg()
})
</script>



<style>
.canvas-event {
    object-fit: contain;
    height: 100%;
    width: 100%;
    display: block;
}
</style>
