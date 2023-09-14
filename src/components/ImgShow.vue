<template>
    <div :id="uuid" style="width: 100%; position: relative; line-height: 0;">

        <img :src="api.image_file_url(path)">

        <div class="img-mask">
            <span style="top: 50%; position: relative;color: white;">
                描述词:
            </span>
            <el-tooltip class="box-item" effect="dark" content="下载" placement="top-start">
                <div class="cursor-pointer"
                    style="display: inline; position: absolute; bottom: 10px; right: 10px; background-color: #333d; padding: 5px; line-height: 0; border-radius: 30px;">
                    <div @click="onDownloadImg(api.image_file_url(path))">
                        <el-icon color="#fffd" :size="15">
                            <Download />
                        </el-icon>
                    </div>
                </div>
            </el-tooltip>

            <el-tooltip class="box-item" effect="dark" content="点击还原参数" placement="top-start">
                <div class="cursor-pointer" @click="OnReduce(path)"
                    style="position: absolute; bottom: 10px; right: 40px; border-radius: 20px; background-color: #333d; line-height: 0; padding: 5px;">
                    <el-icon color="#fffd" size="15">
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
import $ from 'jquery'
import utils from '@/assets/utils.js'
let uuid = utils.uuid()

const props = defineProps(['path'])

function onDownloadImg(url) {
    api.downloadImage(url, 'download');
}

const img_info = ref('')
onMounted(() => {
    $('#' + uuid + ' .img-mask').on('mouseenter', () => {
        if (img_info.value == '')
            api.image_info(props.path).then(data => {
                img_info.value = data
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
    background: linear-gradient(to bottom, #fff0 30%, #000f);
    border-radius: 1rem;
}
</style>