import { ControlNetImg_Base64, FlushHistoryImages, genState, genPercentage, loading, loadingEnd,loadingTextTo  } from '@/assets/GlobalStatus.js'
import { GetImgData, loras, txt2img_data, promt_input, promt_input_en, txt2img_alwayson_scripts, isUseControlNet, shuffle_img } from '@/assets/ImgParams'
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

export const onSubmit = function (enable_hr, callback) {
    loading('正在生成')
    genState.value = true;

    let data = utils.deepClone(txt2img_data.value)
    data.prompt = promt_input_en.value + getUsedLorasString.value
    if (isUseControlNet.value) {
        txt2img_alwayson_scripts.value.controlnet.args[0].input_image = ControlNetImg_Base64.value
        txt2img_alwayson_scripts.value.controlnet.args[0].enabled = true
    } else {
        txt2img_alwayson_scripts.value.controlnet.args[0].enabled = false
        txt2img_alwayson_scripts.value.controlnet.args[0].input_image = ''
    }
// 
    if(shuffle_img.value.length > 0) {
        txt2img_alwayson_scripts.value.controlnet.args[1].input_image = shuffle_img.value
        txt2img_alwayson_scripts.value.controlnet.args[1].enabled = true
    } else{
        txt2img_alwayson_scripts.value.controlnet.args[1].input_image = ''
        txt2img_alwayson_scripts.value.controlnet.args[1].enabled = false
    }

    data.alwayson_scripts = txt2img_alwayson_scripts.value

    // 图片信息
    data.custom_info_str = GetImgData();
    data.enable_hr = (Boolean)(enable_hr)

    api.txt2img(data).then((response) => {
        processTxt2ImgResponse(response, isUseControlNet.value)
        FlushHistoryImages()
        genState.value = false;
        if(callback) callback()
        loadingEnd()
    }).catch(function (err) {
        genState.value = false;
    })

    function queryProgress() {
        let t = setInterval(function () {
            api.progress().then((response) => {
                genPercentage.value = (response.progress * 100).toFixed(1);
                // loadingTextTo('正在生成...' + genPercentage.value + '%')
                loadingEnd()
                loading('正在生成...' + genPercentage.value + '%')
                if (!genState.value) {
                    loadingEnd()
                    clearInterval(t);
                }
            }).catch(function (err) {
                if (!genState.value) {
                    clearInterval(t);
                    loadingEnd()
                }
            })
        }, 1000, 1000)

    }

    queryProgress();
}
