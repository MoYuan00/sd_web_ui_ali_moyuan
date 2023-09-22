<!-- 参数面板 -->
<template>
    <div v-show="ControlNetIsShow" style="position: fixed; left: 0px; bottom: 0px; ">
        <div class="bg-contain" style="padding: 30px 30px; border-radius: 0px 40px 0px 0px; ">
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

const seedIsRandom = ref(false)

let refushLoras = function () {
    api.reflush_loras()
}
refushLoras()

let getLoras = function () {
    api.loras().then((response) => {
        loras.value = response;
    }).catch(function (err) {
    })
}
getLoras();

let getModelList = function () {
    api.reflush_model().then(data => {
        api.model_list().then(data => {
            modelList.value = data
        })
    })
}
getModelList()

// reflushOptions()


const getUsedLorasString = computed(() => {

    // 功能 对lora进行权重再分配，让lora总和不超过1
    let weightSum = 0;
    for (const item of loras.value) {
        if (item.weight > 0) {
            weightSum += item.weight;
        }
    }
    console.log('LORA weight sum:' + weightSum)


    let loraStr = ""
    for (const item of loras.value) {
        let weight = item.weight;
        if (weightSum > 100) {
            weight = weight * (100 / weightSum);
        }
        weight = (weight / 100).toFixed(2);
        if (weight > 0) {
            loraStr = loraStr + "<lora:" + item.name + ":" + (weight);
            loraStr += ">";
        }
    }
    return loraStr
})

let seedCache = "-1"
watch(seedIsRandom, (newVal, oldVal) => {
    if (newVal) {
        seedCache = txt2img_data.value.seed
        txt2img_data.value.seed = "-1"
    } else {
        txt2img_data.value.seed = seedCache
    }
})

watch(() => txt2img_data, () => {
    seedIsRandom.value = false
})

onMounted(() => {

    $(".params").click(() => {
        console.log('.params click');
        // event.stopPropagation(); // 阻止事件冒泡
        return false;
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

<style scoped>



.model-picker {
    height: 32px;
    width: 160px;
    margin-right: 30px;
    margin-bottom: 10px;

    border-radius: 40px;
    display: inline-block;
}



.model-picker:hover {
    background-color: #fff8;
    border-radius: 40px;
    display: inline-block;
    cursor: pointer;
}


.model-picker-selected {
    height: 32px;
    cursor: pointer;
    width: 160px;
    margin-right: 30px;
    margin-bottom: 10px;

    background-color: var(--color-gray-ui-active);
    color: var(--color-gray-font-white);

    border-radius: 40px;
    display: inline-block;
}
</style>