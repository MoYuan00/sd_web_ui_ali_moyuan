<!-- 参数面板 -->
<template>
    <div class="imageHistory" v-show="is_show">
        <space style="height: 50px; display: block;"></space>
        <div style="text-align: left;">历史画面</div>
        <div class="plane">
            <viewer style="width: 100%; height: 100%;" :images="props.historyImages">
                <div class="historyImage" v-for="imageInfo of historyImages">
                    <img v-if="imageInfo.imageType == 'base64'" :src="'data:image/png;base64,' + imageInfo.image" />
                    <img v-else :src="'data:image/png;base64,' + imageInfo.image" />
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

const imageList = computed(()=>{
    let images = []
    for(let imgInfo of props.historyImages) {
        if(imgInfo.imageType == 'base64') {
            images.shift('data:image/png;base64,' + imgInfo.image );
        }
    }
    return images
})

const isShow = ref(props.is_show)

onMounted(() => {

    $(".imageHistory").click(() => {
        console.log('.imageHistory click');
        // event.stopPropagation(); // 阻止事件冒泡
        return false;
    })


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
}</style>