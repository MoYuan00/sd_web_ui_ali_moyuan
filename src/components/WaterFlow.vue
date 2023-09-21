<!-- 瀑布流 -->
<template>
    <div :id="uuid" style="width: 75%; margin: auto;">
        <!-- 瀑布流 -->
        <div class="box-wrapper-0">
            <div class="box-wrapper">
                <div class="box-col" v-for="col in waterFlowData">
                    <div class="box-item" v-for="(item, i) in  col">
                        <ImgShow :path="item.fullpath"></ImgShow>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>



<script setup>
import { ref, watch, computed, onMounted, reactive, defineAsyncComponent, toRaw } from 'vue'
import { FlushHistoryImages, HistoryGenImageInfoList } from '@/assets/GlobalStatus.js'
import api from './../assets/request_api'
import utils from '@/assets/utils.js'

const ImgShow = defineAsyncComponent({
    loader: () => import('../components/ImgShow.vue')

})

const props = defineProps(['max_count'])

let waterFlowData = ref([[{ fullpath: '' }]])
window.waterFlowData = waterFlowData

function onDownloadImg(url) {
    api.downloadImage(url, 'download');
}

function getElWidth(gap, colCount) {
    let contain = document.getElementById(uuid)
    const el_width = (contain.clientWidth - (colCount - 1) * gap) / colCount
    return el_width
}

let uuid = utils.uuid()
onMounted(() => {
    let loadState = false

    // 获取列表起始位置，用于计算列表在视窗内的位置
    let el = document.getElementById(uuid)
    let startTopOffset = el.offsetTop + el.offsetParent.offsetTop

    // 获取浏览器高度，用于计算可以显示的区域大小
    let viewHeight = document.documentElement.clientHeight

    // 添加可滚动的高度 - 当前滚动条滚动到哪里了
    let scrollOffset = document.documentElement.scrollTop

    let topOffset = 0;
    // 计算出当前组件可以显示的高度
    if (scrollOffset < startTopOffset) // 没有完全滚动到组件位置 可见区域要减去 startTopOffset
    {
        topOffset = startTopOffset - scrollOffset;
    } else {
        topOffset = 0;
    }

    // 可见区域大小
    let thatViewHeight = viewHeight - topOffset;
    // 当前组件顶部到可视区域结尾 需要填充的高度
    let comFillContentHeight = viewHeight - topOffset + scrollOffset;



    const gap = 15 // 缝隙的宽度

    const colCount = 3

    // let rowCount = (arrLen / colCount).toFixed(0)
    // let divSubCount = arrLen % colCount // 余数
    let idx = 0
    for (let c = 0; c < colCount; c++) {
        waterFlowData.value[c] = []
    }
    // 计算一个元素的宽度
    const elWidth = getElWidth(gap, colCount)

    const elHeights = [] // 每一列的高度
    for (let i = 0; i < colCount; i++) elHeights[i] = 0

    function getHeight(data, elWidth) { // 从图片数据中获取图片的高度信息，宽度信息
        let path = data.fullpath
        let t = path.substring(path.lastIndexOf('_') + 1, path.lastIndexOf('.')).split('x')
        let width = t[0]
        let height = t[1]

        // 由于元素会被缩放，所以实际高度也会缩放
        let elHeight = elWidth / width * height
        return elHeight
    }
    let arr = HistoryGenImageInfoList.value
    let arrLen = arr.length


    // 1、先填充第一排的元素
    function addToCol(colIdx, data) {
        let height = getHeight(data, elWidth);
        elHeights[colIdx] += height
        waterFlowData.value[colIdx].push(data)
    }

    function getLessHeightColIdx() {
        let t = 0;
        let tHeight = elHeights[0]
        for (let index = 0; index < colCount; index++) {
            if (elHeights[index] < tHeight) {
                t = index
                tHeight = elHeights[index]
            }
        }
        return { idx: t, height: tHeight }
    }

    function fillHeight(maxHeight) { // 一直填充到某个高度
        // 不断找最短的那一列进行添加 --- 直到填充完成
        for (; idx < arrLen; idx++) {
            let colIdx = getLessHeightColIdx()
            if (colIdx.height > maxHeight) break;
            // console.log(colIdx.height);
            let data = arr[idx]
            addToCol(colIdx.idx, data)
        }
    }


    FlushHistoryImages(() => {
        arr = HistoryGenImageInfoList.value
        arrLen = arr.length

        for (let c = 0; c < colCount; c++) {
            if (idx >= arrLen) break;
            addToCol(c, arr[idx])
            idx++
        }

        loadState = true

        fillHeight(comFillContentHeight)
        // TODO 如何动态加载实现

        // 1、向下滚动时需要更新
        // 2、网页窗口变动时
        // 3、刷新网页时
        console.log('刷新, idx:' + idx + ' len:' + arrLen);
    })


    // 浏览器大小变更事件进行监听
    window.onresize = function () {
        viewHeight = document.documentElement.clientHeight;
        thatViewHeight = viewHeight - topOffset;
        comFillContentHeight = viewHeight - topOffset + scrollOffset;
        if (!loadState) return
        fillHeight(comFillContentHeight)
    }
    window.addEventListener('scroll', () => {
        scrollOffset = document.documentElement.scrollTop
        // 计算出当前组件可以显示的高度
        if (scrollOffset < startTopOffset) // 没有完全滚动到组件位置 可见区域要减去 startTopOffset
        {
            topOffset = startTopOffset - scrollOffset;
        } else {
            topOffset = 0;
        }
        // 可见区域大小
        thatViewHeight = viewHeight - topOffset;
        comFillContentHeight = viewHeight - topOffset + scrollOffset;

        if (!loadState) return
        fillHeight(comFillContentHeight)
    });

})


function log(obj) {
    if (!obj) {
        console.log(obj);
        return
    }
    console.log(obj);
    console.log(toRaw(obj).fullpath);
}

</script>






<style>
/* 瀑布流布局 */
.box-wrapper-0 {
    width: 100%;
}

.box-wrapper {
    width: 100%;
    gap: 15px;
    display: flex;
    box-sizing: border-box;
}

.box-col {
    width: 33%;
    gap: 1rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.box-item>div {
    /* min-height: 110px; */
}

.box-col img {
    border-radius: 1rem;

    cursor: pointer;
    width: 100%;
    position: relative;
}
</style>