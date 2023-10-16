<template>
    <div :id="uuid" style="width: 100%; position: relative; line-height: 0;">
        <div  ref="img" v-viewer>
                <img :src="api.image_file_url(path)">
        </div>

        <div class="img-mask" @click="showImg">
            <div
                style="bottom: 50px; height: 40px; width: 100%; position: absolute;color: white; line-height: 1; overflow: hidden;">
                <div class="text-overflow" style="font-size: 15px; color: #fff; padding: 0px 20px; line-height: 20px;">
                    {{ img_promot }}
                </div>
                <div>

                </div>
            </div>
            <el-tooltip class="box-item" effect="dark" content="下载" placement="top-start">
                <div class="cursor-pointer"
                    style="display: inline; position: absolute; bottom: 20px; right: 20px; background-color: #333d; padding: 2px 10px; line-height: 0; border-radius: 5px;">
                    <div @click="onDownloadImg(api.image_file_url(path))">
                        <el-icon color="#fffd" :size="20">
                            <Download />
                        </el-icon>
                    </div>
                </div>
            </el-tooltip>

            <el-tooltip class="box-item" effect="dark" content="点击还原参数" placement="top-start">
                <div class="cursor-pointer" @click="OnReduce(path)"
                    style="position: absolute; bottom: 20px; right: 70px; border-radius: 20px; background-color: #333d; line-height: 0; padding: 2px 10px; border-radius: 5px;">
                    <el-icon color="#fffd" :size="20">
                        <Promotion />
                    </el-icon>
                </div>
            </el-tooltip>

        </div>

    </div>
</template>



<script setup>
import { ref, watch, computed, onMounted, reactive, defineProps } from 'vue'
import api from './../assets/request_api'
import { OnReduce } from '@/assets/ReduceImg'
import { DecodeImgData } from '@/assets/ImgParams'
import $ from 'jquery'
import utils from '@/assets/utils.js'
let uuid = utils.uuid()

const props = defineProps(['path'])

function onDownloadImg(url) {
    api.downloadImage(url, 'download');
}

let img = ref(null)
function showImg() {
    img.value.$viewer.show()
}

const img_info = ref('')
let img_promot = ref('')
onMounted(() => {
    $('#' + uuid + ' .img-mask').on('mouseenter', () => {
        if (img_info.value == '')
            api.image_info(props.path).then(data => {
                img_info.value = data

                let img_data = DecodeImgData(data)


                let custom_info_str = img_data.custom_info_str;
                let custom_info = JSON.parse(custom_info_str)
                custom_info = JSON.parse(custom_info)

                console.log(custom_info);
                img_promot.value = custom_info.text2Img.input
            })
    })
})

</script>









<style>
.img-mask {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    bottom: 0px;
}

.img-mask:hover {
    opacity: 1;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    bottom: 0px;
    background: linear-gradient(to bottom, #0005 50%, #000f);
    border-radius: 1rem;
}

.text-overflow {
    /*需要展示行高度*/
    display: -webkit-box;
    /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。*/
    -webkit-box-orient: vertical;
    /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 。*/
    text-overflow: ellipsis;
    /* 可以用来多行文本的情况下，用省略号“…”隐藏超出范围的文本 。*/
    -webkit-line-clamp: 2;
    overflow: hidden;
}



</style>



