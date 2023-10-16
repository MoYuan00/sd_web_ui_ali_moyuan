import { ControlNetImg_Base64, FlushHistoryImages, genState, genPercentage, loading, loadingEnd,loadingTextTo  } from '@/assets/GlobalStatus.js'
import { GetImgData, loras, txt2img_data, promt_input, promt_input_en, txt2img_alwayson_scripts, isUseControlNet, shuffle_img } from '@/assets/ImgParams'
import { processTxt2ImgResponse } from '@/assets/CurrentImg'
import { defautParams } from '@/assets/DefaultConfig'
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


    let loraStrList = []
    for (const item of loras.value) {

        let weight = item.weight;
        if (weightSum > 1) {
            weight = weight * (1 / weightSum);
        }
        weight = (weight / 1).toFixed(2);
        if (weight > 0) {
            loraStrList.push("<lora:" + item.name + ":" + (weight) + ">");
        }
    }
    let loraStr = loraStrList.join(" , ")
    console.log(loraStr);
    return loraStr.trim()
}

export async function onSubmit(enable_hr, callback, seed = -1, hr_enable_size = 1) {
    loading('正在生成')
    genState.value = true;

    let data = utils.deepClone(txt2img_data.value)
    if(defautParams.value.prompt_pre.trim() > 0) {
        // 防止 一个,开头
        data.prompt = defautParams.value.prompt_pre + ', '
    }
    data.prompt = data.prompt + promt_input_en.value 
    let lora = getUsedLorasString()
    if(lora.length > 0) {
        data.prompt = data.prompt + ' , ' + getUsedLorasString()
    }
    if (isUseControlNet.value) {
        txt2img_alwayson_scripts.value.controlnet.args[0].input_image = ControlNetImg_Base64.value
        txt2img_alwayson_scripts.value.controlnet.args[0].enabled = true
    } else {
        txt2img_alwayson_scripts.value.controlnet.args[0].enabled = false
        txt2img_alwayson_scripts.value.controlnet.args[0].input_image = ''
    }
// 
    if(shuffle_img.value.length > 0) {
        txt2img_alwayson_scripts.value.controlnet.args[1].enabled = true
        await api.controlnet_detect(shuffle_img.value, Math.max(data.width, data.height)).then(data=>{
            let img = data.images[0]
            txt2img_alwayson_scripts.value.controlnet.args[1].input_image = shuffle_img.value
        })
    } else{
        txt2img_alwayson_scripts.value.controlnet.args[1].input_image = ''
        txt2img_alwayson_scripts.value.controlnet.args[1].enabled = false
    }

    data.alwayson_scripts = txt2img_alwayson_scripts.value
    
    // 图片信息
    data.custom_info_str = GetImgData();
    data.enable_hr = (Boolean)(enable_hr)
    
    if(enable_hr) // 高清放大一张
    {
        // 获取种子 - 锁定种子
        data.seed = seed
        data.batch_size = 1
        hr_enable_size++;
        data.hr_scale = hr_enable_size; // 高清放大倍数参数
    }

    data.seed = 3070550129
    

    api.txt2img(data).then((response) => {
        processTxt2ImgResponse(response, isUseControlNet.value, data.batch_size, hr_enable_size)
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
