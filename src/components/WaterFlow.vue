<!-- 瀑布流 -->
<template>
    <div style="width: 100%;">
        <!-- 瀑布流 -->
        <div class="box-wrapper-0">
            <div class="box-wrapper">
                <div class="box-col" v-for="col of waterFlowData">
                    <div class="box-item" v-for="item in  col">
                        <template v-for="(value, key) in  item">
                            <div v-if="key == 'fullpath'" style="position: relative;">
                                <!-- <span style="color: red; background-color: black;">{{ key }}</span>:<span>{{ value }}</span> -->
                                <img :src="api.image_file_url(value)" loading="lazy">

                                <el-tooltip class="box-item" effect="dark" content="下载" placement="top-start">
                                    <div class="cursor-pointer"
                                        style="display: inline; position: absolute; bottom: 10px; right: 10px; background-color: #333d; padding: 5px; line-height: 0; border-radius: 30px;">
                                        <div @click="onDownloadImg(api.image_file_url(value))">
                                            <el-icon color="#fffd" :size="15">
                                                <Download />
                                            </el-icon>
                                        </div>
                                    </div>
                                </el-tooltip>

                                <el-tooltip class="box-item" effect="dark" content="点击还原参数" placement="top-start">
                                    <div class="cursor-pointer" @click="OnReduce(value)"
                                        style="position: absolute; bottom: 10px; right: 40px; border-radius: 20px; background-color: #333d; line-height: 0; padding: 5px;">
                                        <el-icon color="#fffd" size="15">
                                            <Promotion />
                                        </el-icon>
                                    </div>
                                </el-tooltip>

                            </div>
                        </template>
                    </div>

                </div>
            </div>


            <!-- <div class="box-wrapper">
                <div class="box-col">
                    <div class="box-item">
                        <div>
                            <img src="https://picsum.photos/1022/576">
                        </div>
                    </div>

                </div>

                <div class="box-col">
                    <div class="box-item">
                        <div>
                            <img src="https://picsum.photos/512/522">
                        </div>
                    </div>

                </div>
                <div class="box-col">
                    <div class="box-item">
                        <div>
                            <img src="https://picsum.photos/1024/761">
                        </div>
                    </div>

                </div>

                <div class="box-col">
                    <div class="box-item">
                        <div>
                            <img src="https://picsum.photos/768/512">
                        </div>
                    </div>

                </div>

            </div> -->

        </div>
    </div>
</template>



<script setup>
import { ref, watch, computed, onMounted, reactive } from 'vue'
import { FlushHistoryImages, HistoryGenImageInfoList } from '@/assets/GlobalStatus.js'
import { DecodeImgData, DeCodeCustomInfo } from '@/assets/ImgParams'
import api from './../assets/request_api'


let waterFlowData = reactive([[{ fullpath: '' }]])
window.waterFlowData = waterFlowData

function onDownloadImg(url) {
    api.downloadImage(url, 'download');
}
FlushHistoryImages(() => {


    let arr = HistoryGenImageInfoList.value
    let arrLen = arr.length

    let colCount = 4
    let rowCount = (arrLen / colCount).toFixed(0)
    let divSubCount = arrLen % colCount // 余数

    let colIdx = 0
    let idx = 0

    for (let c = 0; c < colCount; c++) {
        waterFlowData[c] = []
    }

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
            waterFlowData[c].push(arr[idx])
            idx++
        }
    }

})



// 点击还原参数
function OnReduce(imagefullpath) {
    console.log(' OnReduce ' + imagefullpath)
    api.image_info(imagefullpath).then(data => {
        console.log(data)
        let str = DecodeImgData(data)
        console.log(str)
        DeCodeCustomInfo(str)
    })

}



</script>









<style></style>