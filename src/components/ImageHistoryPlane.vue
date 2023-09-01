<!-- 参数面板 -->
<template>
    <div class="imageHistory" v-show="is_show">
        <div style="height: 50px; display: block;"></div>
        <div style="text-align: left;">历史画面</div>
        <div class="plane">
            <viewer style="width: 100%; height: 100%;" :images="HistoryGenImageInfoList">
                <!-- <div class="historyImage" v-for="imageInfo of historyImages">
                    <img v-if="imageInfo.imageType == 'base64'" :src="'data:image/png;base64,' + imageInfo.image" />
                    <img v-else :src="'data:image/png;base64,' + imageInfo.image" />
                </div> -->

                <div class="historyImage" v-if="HistoryGenImageInfoList && HistoryGenImageInfoList.length > 0"
                    v-for="imageInfo of HistoryGenImageInfoList">
                    <img :src="api.image_file_url(imageInfo.fullpath)" loading="lazy" />

                    <el-tooltip class="box-item" effect="dark" content="下载" placement="top-start">
                        <div class="cursor-pointer"
                            style="display: inline; position: absolute; bottom: 10px; right: 40px; background-color: #333d; padding: 5px; line-height: 0; border-radius: 30px;">
                            <div @click="onDownloadImg(api.image_file_url(imageInfo.fullpath))">
                                <el-icon color="#fffd" :size="15">
                                    <Download />
                                </el-icon>
                            </div>
                        </div>
                    </el-tooltip>




                    <!-- <img :src="imageInfo.fullpath" /> -->
                    <el-tooltip class="box-item" effect="dark" content="点击还原参数" placement="top-start">
                        <div class="cursor-pointer" @click="OnReduce(imageInfo.fullpath)"
                            style="position: absolute; bottom: 10px; right: 10px; border-radius: 20px; background-color: #333d; line-height: 0; padding: 5px;">
                            <el-icon color="#fffd" size="15">
                                <Promotion />
                            </el-icon>
                        </div>
                    </el-tooltip>
                </div>
            </viewer>
        </div>
        <div style="text-align: center;">
            <div class="button">
                回到顶部
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { FlushHistoryImages, HistoryGenImageInfoList } from '@/assets/GlobalStatus'
import { DecodeImgData, DeCodeCustomInfo } from '@/assets/ImgParams'
import api from './../assets/request_api'
import $ from 'jquery'
const props = defineProps({
    'historyImages': {
        type: Array,
        default: [
            { image: "./src/assets/png/1.png" },
            { image: "./src/assets/png/1.png" },
            { image: "./src/assets/png/2.png" },
            { image: "./src/assets/png/4.jpg" },
            { image: "./src/assets/png/2.png" },
            { image: "./src/assets/png/2.png" },
            { image: "./src/assets/png/2.png" },
            { image: "./src/assets/png/3.png" },
            { image: "./src/assets/png/3.png" },
            { image: "./src/assets/png/4.jpg" },
            { image: "./src/assets/png/1.png" },
            { image: "./src/assets/png/3.png" },
            { image: "./src/assets/png/4.jpg" },
            { image: "./src/assets/png/4.jpg" },
            { image: "./src/assets/png/4.jpg" },
        ]
    },
    'is_show': {
        type: Boolean,
        default: true
    }
})


const isShow = ref(props.is_show)

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

function onDownloadImg(url) {
    api.downloadImage(url, 'download');
}

onMounted(() => {

    $("a").click((event) => {
        console.log('a click');
        // event.stopPropagation();
        // return false;
    })

    $(".imageHistory").click(() => {
        console.log('.imageHistory click');
        event.stopPropagation(); // 阻止事件冒泡，不会阻止默认行为
        // return false; // 会阻止默认行为，比如a标签跳转
        // event.stopPropagation();
    })

    FlushHistoryImages()
})

</script>

<style scoped>
div.imageHistory {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(100, 100, 100, 0.6) 40%);

    border-radius: 0px 40px 40px 0px;
    border-width: 0px;
    border-color: white;
    border-style: solid;
    padding: 20px;
    color: rgba(255, 255, 255, 0.6);
    width: 450px;
    position: absolute;
    left: 0px;
    top: 0px;
    height: 100%;

}

/* image plane */
.plane {
    margin-bottom: 30px;
    max-height: 85%;
    min-height: 85%;
    overflow: auto;
    border-radius: 15px;
}

/* // 滚动条宽度 */
.plane::-webkit-scrollbar {
    width: 6px;
}

/* // 滚动条轨道 */
.plane::-webkit-scrollbar-track {
    background: rgba(239, 239, 239, 0.1);
    border-radius: 2px;
}

/* // 小滑块 */
.plane::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.6);
    border-radius: 10px;
}

.plane::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 1);
}



.historyImage {
    width: 180px;
    height: 180px;
    display: inline-block;
    margin-right: 15px;
    margin-bottom: 15px;
    position: relative;
}

.historyImage img {
    border-radius: 20px;

    width: 180px;
    height: 180px;
    overflow: hidden;
    object-fit: cover;
}

.button {
    background-color: rgba(255, 255, 255, .3);
    width: 150px;
    height: 30px;
    border-radius: 20px;
    display: inline-block;
    line-height: 30px;
}

.button:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.5);
    color: rgba(255, 255, 255, 1);
}
</style>