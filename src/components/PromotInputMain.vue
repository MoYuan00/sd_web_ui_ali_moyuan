<template>
    <!-- <el-input v-model="input_value" maxlength="30" placeholder="Please input" show-word-limit type="textarea" /> -->
    <el-row justify="center" style="width: 100%; height: 100%;">
        <el-col :span="24">
            <el-row>
                <div class="textarea" >
                    <textarea class="input" v-model="promt_input"> </textarea>


                    <div style="position: absolute; bottom: 8px; right: 8px;">
                        <button class="button font-key pointer" @click="onClick">
                            生成渲染
                        </button>
                    </div>
                    <!-- ParamsPlane按钮 -->
                    <div class="cursor-pointer params-plane-button" style="position: absolute; bottom: 8px; left: 8px;">
                        <div style="border-radius: 30px; background-color: #3333; padding: 0px; line-height: 0;">
                            <img src="../assets/icon/icon1.png" style="height: 50px;">
                        </div>
                    </div>

                    <div class="info" style="position: absolute;  bottom: 8px; left: 80px;">
                        <div style="width: 450px; height: 30px;  color: #3333; font-size: small; overflow: hidden;">
                            {{ promt_input_en_show }}
                        </div>
                        <div style="width: 450px; height: 20px;  color: #3333; font-size: small;">
                            <template v-for="item in loras">
                                <span style=" margin-right: 10px; font-size: 10px;">
                                    {{ item.name }} : {{ item.weight }}
                                </span> |
                            </template>
                        </div>
                    </div>
                </div>
            </el-row>

        </el-col>
    </el-row>
</template>

<script>
import { ref, watch, computed, onMounted, defineEmits,onUnmounted } from 'vue'
import $ from 'jquery'

</script>

<script setup>
import { genState, ControlNetIsShow, loading, loadingEnd } from '@/assets/GlobalStatus.js'
import { promt_input, promt_input_en, loras } from '@/assets/ImgParams'
import { onSubmit } from '@/assets/GenImage'
import { bus } from '@/assets/EventCenter'
import api from '../assets/request_api.js'
import { anime } from '../assets/animejs.js'
import $ from 'jquery'
import { defautParams } from '@/assets/DefaultConfig'
function onClick() {
    onSubmit(false, () => {
        bus.emit('gen-img')
        console.log('window.router')
        window.router.push({ name: 'sd-view' })
        
    })
}

let translateTask = null;
function updateTranaslate() {
    clearTimeout(translateTask);
    translateTask = setTimeout(() => {
        api.translate(promt_input.value).then(data => {
            promt_input_en.value = data.text
        })
    }, 2000);
}

let promt_input_en_show = computed(()=>{
    return defautParams.value.prompt_pre + ', ' + promt_input_en.value
})


const textarea_anime = function (open) {
    let px = 23
    let input_bottom = 0
    let padding_v = 20
    let padding_h = 100
    let padding_right = 200
    let info = $('.info')
    if (open) {
        px = 150
        padding_v = 30
        padding_right = padding_h = 65
        input_bottom = 25
        info.css('display', 'block')
    } else {
        info.css('display', 'none')

    }
    let el = document.querySelector('.input')
    let el_textarea = document.querySelector('.textarea')
    let a = anime({
        targets: el,
        height: function (el, i) { return px  }, // -> from '28px' to '100%',
        'margin-bottom': function (el, i) { return input_bottom  }, // -> from '28px' to '100%',
        easing: 'easeInOutExpo',
        duration: 500,
        autoplay: false
    })
    let b = anime({
        targets: el_textarea,
        easing: 'easeInOutExpo',
        'padding-top': function () { return padding_v },
        'padding-bottom': function () { return padding_v  },
        'padding-left': function () { return padding_h },
        'padding-right': function () { return padding_right },
        duration: 500,
        autoplay: false
    })
    a.play()
    b.play()
}

onMounted(() => {



    $("textarea").click(() => {
        console.log('textarea click');
        if (promt_input.value.length > 20) {
            textarea_anime(true)
        }
        return false;
    })
    $("button").click(() => {
        console.log('button click');
        return false;
    })
    $("body").click(() => {
        // 隐藏窗口
        console.log('body click');
        ControlNetIsShow.value = false
        textarea_anime(false)
    })

    $('.params-plane-button').click(() => {
        console.log('.params-plane-button click');
        let t = !ControlNetIsShow.value;
        ControlNetIsShow.value = t
        ControlNetIsShow.value = t
        // ParamsPlaneIsShow.value =  (Number)(ParamsPlaneIsShow.value) + 1
        return false;
    })
    updateTranaslate()

    textarea_anime(false)
})

onUnmounted(() => {
    console.log('promoinputmain 组件销毁');
    $("textarea").prop("onclick",null);
    $("button").prop("onclick",null);
    $("body").prop("onclick",null);
    $('.params-plane-button').prop("onclick",null);
})

watch(promt_input, () => {
    updateTranaslate()
    if (promt_input.value.length > 20) {
        textarea_anime(true)
    }
})

const tags_sp = computed(() => {
    return promt_input.value.replace(/  /g, ' ').split(/\s*[,，]/).filter(s => s.trim().length > 0)
})

</script>

<style scoped>
.button {
    height: 52px;
    width: 187px;
    border-width: 0px;
    background: linear-gradient(to right, #009fff, #0000ff);
    border-radius: 50px;
    color: white;
}

.textarea {
    position: relative;
    min-width: 800px;
    width: 800px;
    margin: auto;
    border-radius: 30px;
    border-width: 0px;


    font-size: 15px;
    font-weight: bolder;

    background-color: var(--color-gray-ui-bg-2);

    padding: 20px 200px 20px 100px;
}

.input {
    background-color: #0000;
    font-size: 20px;
    font-weight: bold;
    border: none;

    outline: none;
    width: 100%;
    resize: none;

    height: 23px;

    overflow: hidden;
    margin-bottom: 0px;
}

div.params {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(100, 100, 100, 0.6) 40%);

    border-radius: 40px 0px 0px 40px;
    border-width: 0px;
    border-color: white;
    /* border-style: solid; */
    padding: 20px;
    color: rgba(255, 255, 255, 0.6);
    width: 450px;
    position: absolute;
    right: 0px;
    top: 0px;
    height: 100%;
}



/*
进度条文字颜色
*/
:deep().el-progress-bar__innerText {
    /* >>>被:deep()替代*/
    /* >>> 深度选择，覆盖element的样式*/
    color: black !important;
}


/* 胶囊颜色 */
.sp {
    background: linear-gradient(to right, #3333, #aaaa);
    color: white;
    display: inline-block;
    border-radius: 20px;
    padding: 5px 8px;
    font-size: 15px;
    margin-right: 3px;
    margin-top: 3px;
    margin-bottom: 3px;
}
</style>