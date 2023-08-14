import { ref, watch, computed, onMounted } from 'vue'
import utils from './utils'
// 保存生成一个图片的参数



// 提示词
export const promt_input = ref('masterpiece, best quality, 8k, cinematic light, ultra high res, chibi, 1girl, child, pink hair, multicolored hair, long hair, solo, dress, star hair ornament, horns, blue hair, star \, (symbol\), bangs, gradient hair, artist name, gradient, smile, closed mouth, full body, pink background, gradient background')

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
    "alwayson_scripts": { }
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


// controlnet 参数


// 控制图片
export const VerticalRotate = ref(1)
export const HorizontalRotate = ref(0)

// 控制画板
export const imageShowSize = ref(1)
export const VerticalPosition = ref(0.5)
export const HorizontalPosition = ref(0.5)

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
            VerticalRotate: VerticalRotate.value,
            HorizontalRotate: HorizontalRotate.value,
            imageShowSize: imageShowSize.value,
            VerticalPosition: VerticalPosition.value,
            HorizontalPosition: HorizontalPosition.value
        },
        text2Img : {
            input : promt_input.value,
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
        if(param.startsWith('custom_info_str')) {
            custom_info_str = param.substring(param.indexOf(':') + 1)
            custom_info_str = custom_info_str.trim()
        }
        if(param.startsWith('Seed')) {
            seed = param.substring(param.indexOf(':') + 1)
            seed = seed.trim()
        }
    }
    return {custom_info_str: custom_info_str, seed: seed}
}


export function DeCodeCustomInfo(ImgData) {
    let custom_info_str = ImgData.custom_info_str;
    let custom_info = JSON.parse(custom_info_str)
    custom_info = JSON.parse(custom_info)


    let seed = ImgData.seed

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
        if(lora_weight[lora.name]) {
            lora.weight = lora_weight[lora.name]
        } else {
            lora.weight = 0
        }
    }
}
