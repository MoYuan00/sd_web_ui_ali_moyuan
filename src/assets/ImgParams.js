import { ref, watch, computed, onMounted } from 'vue'
import utils from './utils'
// 保存生成一个图片的参数



// 提示词
export const promt_input = ref('good render, tmall logo, tmall circular,')

export const enable_hr = ref(false) // 高清修复 - 放大图片

export const txt2img_data = ref({
    "denoising_strength": 0,
    "prompt": 'masterpiece, best quality, 8k, cinematic light, ultra high res, chibi, 1girl, child, pink hair, multicolored hair, long hair, solo, dress, star hair ornament, horns, blue hair, star \, (symbol\), bangs, gradient hair, artist name, gradient, smile, closed mouth, full body, pink background, gradient background',
    "negative_prompt": "",
    "seed": -1,
    "batch_size": 1,
    "n_iter": 1,
    "steps": 20,
    "cfg_scale": 7,
    "width": 512,
    "height": 512,
    "restore_faces": false,
    "tiling": false,
    "sampler_index": "Euler",
    "save_images": true, // 生成后保持
    // "send_images": true, 
    "alwayson_scripts": {},


    // 高清修复
    "enable_hr": true,
    "denoising_strength": 0.3,
    "firstphase_width": 0,
    "firstphase_height": 0,
    "hr_scale": 2,
    "hr_upscaler": "4x-UltraSharp",
    "hr_second_pass_steps": 20,
    // "hr_resize_x": 1024,
    // "hr_resize_y": 1024,
    // "hr_sampler_name": "4x-UltraSharp",
    // "hr_prompt": "",
    // "hr_negative_prompt": ""
})

export const txt2img_alwayson_scripts = ref({
    "controlnet": {
        "args": [
            {
                "input_image": "",
                // "model": "control_v11p_sd15_canny [d14c016b]"
                "model": "control_v11p_sd15_lineart [43d4be0d]",
            }
        ]
    }
})

export const loras = ref([]); // lora列表


//  -------------------------- controlnet 参数
export const isUseControlNet = ref(true)

// 控制图片
export const VerticalRotate = ref(1)
export const HorizontalRotate = ref(0)

VerticalRotate.update = (newVal) =>{
    let step = 1;
    let min = 1;
    let max = 17;
    newVal = Math.floor(newVal / step) * step
    newVal = newVal < min ? min : newVal;
    newVal = newVal > max ? max : newVal;
    VerticalRotate.value = newVal;
}

HorizontalRotate.update = (newVal) =>{
    let step = 5;
    let min = 0;
    let max = 175;
    let stepVal = Math.floor(newVal / step) * step
    // console.log('HorizontalRotate newval:' + newVal + ' stepVal:' + stepVal + ' floor:' + Math.floor(newVal / step));
    stepVal = newVal < min ? min : stepVal;
    stepVal = newVal > max ? max : stepVal;
    HorizontalRotate.value = stepVal;
}

// 控制画板
export const imageShowSize = ref(0.3)
export const VerticalPosition = ref(0.5)
export const HorizontalPosition = ref(0.5)

imageShowSize.update = (newVal) => {
    newVal = newVal < 0.2 ? 0.2 : newVal;
    newVal = newVal > 2 ? 2 : newVal;
    imageShowSize.value = newVal;
}

VerticalPosition.update = (newVal) => {
    VerticalPosition.value = newVal < -0.5 ? -0.5 : newVal;
    VerticalPosition.value = newVal > 1 ? 1 : newVal;
}
HorizontalPosition.update = (newVal) => {
    HorizontalPosition.value = newVal < -0.5 ? -0.5 : newVal;
    HorizontalPosition.value = newVal > 1 ? 1 : newVal;
}


// -----------------------  参数还原

export function GetImgData() {
    // lora记录weight和name映射关系
    let lora_weight = {}
    for (const lora of loras.value) {
        lora_weight[lora.name] = lora.weight
    }

    let txt2img = utils.deepClone(txt2img_data.value);


    let json = {
        init: 'Vue js',
        controlnet: {
            isUseControlNet: isUseControlNet.value,
            VerticalRotate: VerticalRotate.value,
            HorizontalRotate: HorizontalRotate.value,
            imageShowSize: imageShowSize.value,
            VerticalPosition: VerticalPosition.value,
            HorizontalPosition: HorizontalPosition.value
        },
        text2Img: {
            input: promt_input.value,
            data: txt2img
        },
        lora_weight: lora_weight
    }
    let jsonStr = JSON.stringify(json);

    // 去掉空格， 防止解析的时候被split
    jsonStr = jsonStr.replace(/, /g, ',')

    console.log(jsonStr);
    return jsonStr
}

export function DecodeImgData(tExtData) {
    let t1 = tExtData.split('\n')
    let prompt = t1[0]
    let paramStr = t1[t1.length - 1]

    let params = paramStr.split(', ')
    console.log('DecodeImgData: ');
    console.log(params);
    let paramsMap = {}

    let custom_info_str = '{}'
    let seed = "-1"
    for (const param of params) {
        if (param.startsWith('custom_info_str')) {
            custom_info_str = param.substring(param.indexOf(':') + 1)
            custom_info_str = custom_info_str.trim()
        }
        if (param.startsWith('Seed')) {
            seed = param.substring(param.indexOf(':') + 1)
            seed = seed.trim()
        }
    }
    return { custom_info_str: custom_info_str, seed: seed }
}


export function DeCodeCustomInfo(ImgData) {
    let custom_info_str = ImgData.custom_info_str;
    let custom_info = JSON.parse(custom_info_str)
    custom_info = JSON.parse(custom_info)


    let seed = ImgData.seed

    isUseControlNet.value = custom_info.controlnet.isUseControlNet
    VerticalRotate.value = custom_info.controlnet.VerticalRotate
    HorizontalRotate.value = custom_info.controlnet.HorizontalRotate
    imageShowSize.value = custom_info.controlnet.imageShowSize
    VerticalPosition.value = custom_info.controlnet.VerticalPosition
    HorizontalPosition.value = custom_info.controlnet.HorizontalPosition

    promt_input.value = custom_info.text2Img.input
    txt2img_data.value = custom_info.text2Img.data
    // 设置种子
    txt2img_data.value.seed = seed

    let lora_weight = custom_info.lora_weight
    for (const lora of loras.value) {
        if (lora_weight[lora.name]) {
            lora.weight = lora_weight[lora.name]
        } else {
            lora.weight = 0
        }
    }
}

