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
                                <ImgShow :path="value"></ImgShow>
                            </div>
                        </template>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>



<script setup>
import { ref, watch, computed, onMounted, reactive } from 'vue'
import { FlushHistoryImages, HistoryGenImageInfoList } from '@/assets/GlobalStatus.js'
import api from './../assets/request_api'
import { OnReduce } from '@/assets/ReduceImg'
import ImgShow from '@/components/ImgShow.vue'

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




</script>









<style></style>