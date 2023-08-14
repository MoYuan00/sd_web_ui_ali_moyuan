<!-- 参数面板 -->
<template>
    <div class="params" v-show="is_show">
        <space style="height: 50px; display: block;"></space>
        <h1 style="color:rgba(200, 200, 200, 1); font-weight: 600; text-align: center;">AI Creative Engine</h1>
        <space style="height: 50px; display: block;"></space>
        <div style="text-align: left;">画面大小</div>
        <div>
            <span>width(步数)</span>
            <el-slider v-model="txt2img_data.width" show-input size="small" :max="1024" />
        </div>
        <div>
            <span>height(步数)</span>
            <el-slider v-model="txt2img_data.height" show-input size="small" :max="1024" />
        </div>

        <div style="margin: 30px;"> </div>

        <div>画面变化参数微调</div>
        <div>
            <div v-for="item in loras" :key="item.name" style="margin-top: 10px; position: relative;">
                <span>
                    {{ item.name }}
                </span>

                <el-slider v-model="item.weight" show-input size="small" :min="0" :max="100" />
                <!-- <el-progress :stroke-width="30" :percentage="0" :color="'#ffffff'">
                    </el-progress> -->
                <!-- <span style="position: absolute; top: 0px; left: 10px;"> -->

                <div style="float: right;">
                    <el-tooltip class="box-item" effect="dark" placement="right-start">
                        <template #content>
                            <template v-for="(value, key) in lora_mult_weight">
                                <div style="min-width: 50px; text-align: center;">
                                    {{ key }}
                                </div>
                                <div v-for="(v) in value" style="min-width: 200px;">
                                    <div>
                                        {{ v.name }}
                                    </div>
                                    <el-slider v-model="item.weight" size="small" :step="v.value" :min="0" :max="1" />
                                </div>
                            </template>
                        </template>
                    </el-tooltip>
                </div>
                <!-- </span> -->
            </div>
            <div>
                <span>输出lora：{{ getUsedLorasString }}</span>
            </div>
        </div>
        <div>画面参数微调</div>
        <div>
            <span>文字随机性(CFG)</span>
            <el-slider v-model="txt2img_data.cfg_scale" show-input size="small" :min="1" :max="30" :step="0.5" />

        </div>

        <div>
            <span>图片数量</span>
            <el-slider v-model="txt2img_data.batch_size" show-input size="small" :min="1" :max="20" />
        </div>

        <div>默认参数</div>
        <div>
            <span>step(步数)</span>
            <el-slider v-model="txt2img_data.steps" show-input size="small" :max="150" />
        </div>
        <div>
            <span>Seed:</span>

            <div>
                <el-switch v-model="seedIsRandom" active-text="随机" inactive-text="固定" />
                <span style="padding-left: 20px; color: white;">
                    {{ txt2img_data.seed }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import $ from 'jquery'
const props = defineProps({
    'txt2img_data': {
        type: Object,
        default: {}
    },
    'loras': {
        type: Array,
        default: []
    },
    'is_show': {
        type: Boolean,
        default: true
    }
})

const isShow = ref(props.is_show)
const seedIsRandom = ref(false)


const getUsedLorasString = computed(() => {

    // 功能 对lora进行权重再分配，让lora总和不超过1
    let weightSum = 0;
    for (const item of props.loras) {
        if (item.weight > 0) {
            weightSum += item.weight;
        }
    }
    console.log('LORA weight sum:' + weightSum)


    let loraStr = ""
    for (const item of props.loras) {
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
watch(seedIsRandom, (newVal, oldVal)=>{
    if(newVal) {
        seedCache = props.txt2img_data.seed
        props.txt2img_data.seed = "-1"
    } else {
        props.txt2img_data.seed = seedCache
    }
})

watch(()=>props.txt2img_data, ()=>{
    seedIsRandom.value = false
})

onMounted(() => {

    $(".params").click(() => {
        console.log('.params click');
        // event.stopPropagation(); // 阻止事件冒泡
        return false;
    })


})

</script>

<style scoped>

:deep().el-switch__label{
    color: white !important;
}
:deep().el-switch__label.is-active {
    color: var(--el-color-primary) !important;
}
</style>