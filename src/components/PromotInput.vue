<template>
    <!-- <el-input v-model="input_value" maxlength="30" placeholder="Please input" show-word-limit type="textarea" /> -->
    <div style="position: relative; width: 650px;">
        <textarea v-model="txt2img_data.prompt" style="width: 100%;">
        </textarea>
        <div style="position: absolute; bottom: 20px; right: 20px;">
            <button class="submit" @click="onSubmit"
                style="height: 60px; width: 130px; background-color: var(--color-primary); border-style: solid; border-color: white; border-width: 1px; border-radius: 50px; color: white; font-size: 20px; font-weight: 600;">
                随机生成
            </button>
        </div>
        <div style="position: absolute; bottom: 30px; right: 230px; font-size: 18px; font-weight: bold;">
            <!-- 提示 -->
            输⼊想要的天猫超级符号创意
        </div>
        <!-- <div>
            这里回显输入的字符：
            {{ txt2img_data.prompt }}
        </div> -->
    </div>
    <div>
        <el-row :gutter="20">
            <el-col :span="10">
                <div class="params" style="color: black;">
                    <div style="text-align: center;">-基础参数-</div>
                    <div>
                        <span>step(步数)</span>
                        <el-slider v-model="txt2img_data.steps" show-input size="small" :max="150" />
                    </div>
                    <div>
                        <span>width(步数)</span>
                        <el-slider v-model="txt2img_data.width" show-input size="small" :max="1024" />
                    </div>
                    <div>
                        <span>height(步数)</span>
                        <el-slider v-model="txt2img_data.height" show-input size="small" :max="1024" />
                    </div>
                    <div>
                        <span>图片数量</span>
                        <el-slider v-model="txt2img_data.batch_size" show-input size="small" :min="1" :max="20" />
                    </div>

                    <div style="margin: 30px;"> </div>

                    <div style="text-align: center;">-画面变化参数微调-</div>
                    <div>
                        <div>Lora</div>
                        <div v-for="item in loras" :key="item.name" style="margin-top: 10px; position: relative;">
                            <el-progress :stroke-width="30" :percentage="0" :color="'#ffffff'">
                            </el-progress>
                            <span style="position: absolute; top: 0px; left: 10px;">
                                <span>
                                    {{ item.name }}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </el-col>

            <el-col :span="10">
                <div style="color: white;">
                    <span style="font-size: 20px; text-align: center; min-width: 100%" >图片</span>

                    <el-dialog v-model="dialogVisible" title="Tips" width="30%" :before-close="handleClose">
                        <span>This is a message</span>
                        <template #footer>
                            <span class="dialog-footer">
                                <el-button @click="dialogVisible = false">Cancel</el-button>
                                <el-button type="primary" @click="dialogVisible = false">
                                    Confirm
                                </el-button>
                            </span>
                        </template>
                    </el-dialog>
                </div>
                <div>
                    <el-progress v-if="genState" :percentage="genPercentage" />
                </div>
                <viewer :images="genImageList">
                    <img v-if="image_base64.length > 100" class="new_image" :src="'data:image/png;base64,' + image_base64"
                        style="min-width: 100%; max-width: 100%;" />
                    <el-empty v-else description="没有图片" />
                    <!-- <img class="old_image" src="https://picsum.photos/250/200"> -->
                    <!-- <img class="old_image" src="https://picsum.photos/250/200"> -->
                    <img class="old_image" v-for="src in genImageList" :src="'data:image/png;base64,' + src">
                </viewer>
                <!-- <textarea v-model="image_base64">
                </textarea>
                <p>{{ image_base64 }}</p> -->
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { ref, watch } from 'vue'
import api from '../assets/request_api.js'
import sd_config from '../assets/sd.config.js'
</script>

<script setup>
console.log("执行script PromoInput");
console.log(window.vue);


const genState = ref(false); // 是否正在生成
const genPercentage = ref(0); // 是否正在生成
const genImageList = ref([]); // 生成的图片列表

const loras = ref([]); // lora列表


const image_base64 = ref('123')
const txt2img_data = ref({
    "denoising_strength": 0,
    "prompt": '2girls',
    "negative_prompt": "",
    "seed": -1,
    "batch_size": 1,
    "n_iter": 1,
    "steps": 10,
    "cfg_scale": 7,
    "width": 512,
    "height": 512,
    "restore_faces": false,
    "tiling": false,
    "sampler_index": "Euler",
    "save_images": true, // 生成后保持
    // "send_images": true, 
})

let onSubmit = function () {
    console.log('点击onSubmit');
    genState.value = true;
    api.txt2img(txt2img_data.value).then((response) => {
        image_base64.value = response.images[response.images.length - 1]; // 更新数据
        response.images.forEach(element => {
            genImageList.value.unshift(element)
        });
        genState.value = false;
    }).catch(function (err) {
        genState.value = false;
    })

    function queryProgress() {
        let t = setInterval(function () {
            api.progress().then((response) => {
                genPercentage.value = response.progress * 100;
                if (!genState.value) {
                    clearInterval(t);
                }
            }).catch(function (err) {
                if (!genState.value) {
                    clearInterval(t);
                }
            })
        }, 1000, 1000)

        // while (genState.value) {

        // }
    }

    queryProgress();
}


let getLoras = function () {
    api.loras().then((response) => {
        loras.value = response;
    }).catch(function (err) {
    })
}
getLoras();



let getTxt2imgFiles = function () {
    api.txt2imgFiles(sd_config.sd_output_root_path_txt2img).then((response) => {
        loras.value = response;
    }).catch(function (err) {
    })
}
getTxt2imgFiles();


</script>

<style scoped>
textarea {
    width: 650px;
    height: 300px;

    padding: 30px;
    border-radius: 40px;

    resize: none;

    font-size: 15px;
    font-weight: bolder;
}

.old_image {
    display: inline-block;
    max-width: 30%;
}

div.params {
    background-color: var(--color-backgrund-transpent-top);
    border-radius: 20px;
    border-width: 1px;
    border-color: white;
    border-style: solid;
    padding: 20px;

}

/*
进度条文字颜色
*/
>>>.el-progress-bar__innerText {
    /* >>> 深度选择，覆盖element的样式*/
    color: black !important;
}
</style>