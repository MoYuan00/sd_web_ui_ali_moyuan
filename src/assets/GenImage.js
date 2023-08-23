import { ControlNetImg_Base64, FlushHistoryImages, genState, genPercentage  } from '@/assets/GlobalStatus.js'
import { GetImgData, loras, txt2img_data, promt_input, txt2img_alwayson_scripts, isUseControlNet } from '@/assets/ImgParams'
import { processTxt2ImgResponse } from '@/assets/CurrentImg'
import utils from '@/assets/utils'
import api from '@/assets/request_api.js'

const getUsedLorasString = () => {

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
}

export const onSubmit = function (enable_hr) {

    genState.value = true;

    let data = utils.deepClone(txt2img_data.value)
    data.prompt = promt_input.value + getUsedLorasString.value
    if (isUseControlNet.value) {
        txt2img_alwayson_scripts.value.controlnet.args[0].input_image = ControlNetImg_Base64.value
    } else {
        txt2img_alwayson_scripts.value.controlnet.args[0].input_image = ''
    }
    data.alwayson_scripts = txt2img_alwayson_scripts.value

    // 图片信息
    data.custom_info_str = GetImgData();
    data.enable_hr = (Boolean)(enable_hr)

    api.txt2img(data).then((response) => {
        processTxt2ImgResponse(response, isUseControlNet.value)
        FlushHistoryImages()
        console.log('window.router')
        window.router.push({ name: 'sd-view' })
        genState.value = false;
    }).catch(function (err) {
        genState.value = false;
    })

    function queryProgress() {
        let t = setInterval(function () {
            api.progress().then((response) => {
                genPercentage.value = (response.progress * 100).toFixed(1);
                if (!genState.value) {
                    clearInterval(t);
                }
            }).catch(function (err) {
                if (!genState.value) {
                    clearInterval(t);
                }
            })
        }, 1000, 1000)

    }

    queryProgress();
}
