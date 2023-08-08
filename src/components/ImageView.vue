
<template >
    <div class="ImageView" v-if="images && images.length > 0" id="imageView" style="width: 100%;">
        <!-- component -->
        <viewer style="width: 100%; height: 100%;" :images="props.images">
            <!-- <div class="normal">
                <img src="../assets/png/1.png">
            </div>
            <div class="normal">
                <img src="../assets/png/2.png">
            </div>
            <div class="normal">
                <img src="../assets/png/3.png">
            </div>
            <div class="normal">
                <img src="../assets/png/3.png">
            </div> -->
            <div class="normal" v-for="(src, i) in images">
                <img :src="'data:image/png;base64,' + src">
                <div class="cursor-pointer" style="display: inline; position: absolute; bottom: 15px; right: 30px; background-color: #333d; margin: 0; padding: 8px; line-height: 0; border-radius: 30px;">
                    <a :href="'data:image/png;base64,' + src" download="下载名称">
                        <el-icon color="#fffd" :size="25">
                            <Download />
                        </el-icon>
                    </a>
                </div>
            </div>
        </viewer>

        <div style="position: absolute; top: 50%; width: 100%;">
            <div style="position: relative; top: -35px;">
                <div class="cursor-pointer" style="display: inline-block; position: absolute; left: 10%;">
                    <el-icon :size="100" @click="kIndex = kIndex < 1 ? 0 : kIndex - 1" color="rgba(255, 255, 255, 0.8)">
                        <ArrowLeftBold />
                    </el-icon>
                </div>
                <div class="cursor-pointer" style="display: inline-block; position: absolute; left:  80%; ">
                    <el-icon :size="100" @click="kIndex = kIndex + 1" color="rgba(255, 255, 255, 0.8)">
                        <ArrowRightBold />
                    </el-icon>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import $ from 'jquery'
const props = defineProps(['images', 'image_base64'])
const kIndex = ref(0)
window.kIndex = kIndex
window.images = props.images


// 计算images的位置
// 当前显示的是哪个image_name
const getImagePositionX = (index) => {
    let index_offset = index - kIndex.value;
    let offsetX = (650 + 30) * index_offset;



    var intViewportWidth = window.innerWidth;
    var intViewportWidth = window.innerWidth;

    return offsetX + (intViewportWidth / 2 - 650 / 2);
}


const reflushImages = function () {
    $(".normal").stop();
    // console.log($(".normal"));
    for (const i in $(".normal")) {
        // console.log(i + getImagePositionX(i));
        $(".normal").eq(i).animate({ 'left': getImagePositionX(i) + 'px' })
    }
}

onMounted(() => {


    setTimeout(() => {
        reflushImages();
    }, 1000);

    // console.log(window.innerWidth)
    // console.log(document.documentElement.clientWidth)
    // console.log($('#imageView').width())
    // console.log(window.outerWidth)

    window.onresize = function () {
        reflushImages();
    }


    $('.ImageView').on("scroll", function (e) {
        console.log(e)
        console.log('mousewheel')
    })
    $('.ImageView').scroll(function (e) {
        console.log(e)
        console.log('mousewheel')
    })


})

watch(kIndex, async function (newVal, oldVal) {
    reflushImages();
}
)

watch(() => props.images, async function (newVal, oldVal) {
    console.log('watch ()=>props.images');
    reflushImages();
},
    { deep: true, flush: 'post' }
)




</script>

<style scoped>
#imageView {
    white-space: nowrap;
    height: 300px;
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    position: relative;

    margin-bottom: 30px;
}

.normal {
    display: inline-block;
    margin: 0px 0px 0px 0px;
    position: absolute;
    left: 0px;
    white-space: nowrap;
}

.normal img {
    width: 650px;
    height: 300px;
    /* https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit */
    /* 自适应图片填充 */
    object-fit: cover;
    border-radius: 25px;
}
</style>