<!-- 参数面板 -->
<template>
    <div id="plane" style="position: fixed; left: 0px; bottom: 0px; ">
        <div class="bg-contain" style="padding: 30px 30px; border-radius: 0px 40px 0px 0px; ">
            <div>
                风格参考
            </div>
            <div class="four-corners-border" style="width: 400px; margin: auto; position: relative;">
                <ContolNet :style_max_height="200"></ContolNet>
            </div>
            <div style="margin-top: 20px; ">
                <span style="margin-right: 20px;">
                    样板选择
                </span>
                <div
                    style="display: inline-block; border-radius: 40px; background-color: white; padding: 8px 10px 8px 25px; line-height: 40px;">
                    <span style="min-width: 220px; display: inline-block;">
                        天猫模型12
                    </span>
                    <span class="pointer" style="float: right; line-height: 0;">
                        <img src="../assets/icon/icon4.png" style="height: 40px;">
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import $ from 'jquery'
import { loras, txt2img_data, modelList } from '@/assets/ImgParams.js'
import { ControlNetIsShow, loading, loadingEnd } from '@/assets/GlobalStatus.js'
import ContolNet from './ControlNet.vue'
import api from '../assets/request_api.js'
import { anime } from '../assets/animejs'

onMounted(() => {

    $(".params").click(() => {
        console.log('.params click');
        // event.stopPropagation(); // 阻止事件冒泡
        return false;
    })

    watch(ControlNetIsShow, (newVal, oldVal) => {
        if (newVal) {
            // 显示，窗口，使用动画
            anime({
                targets: '#plane',
                translateX: 0,
                easing: 'easeInOutExpo',
                duration: 300
            })
        } else {
            anime({
                targets: '#plane',
                translateX: -500,
                easing: 'easeInOutExpo',
                duration: 300
            })
        }
    })
    anime({
        targets: '#plane',
        translateX: -500,
        duration: 0
    })

})



// 选择面板
let PickerModelSelectedIdx = ref(2)
function OnModelPickerClick(idx, value) {
    // 切换模型
    loading('正在切换模型...')
    api.change_model(modelList.value[idx].title).then(() => {
        PickerModelSelectedIdx.value = idx
        loadingEnd()
    })
}

</script>

<style scoped></style>