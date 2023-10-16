import { ref, watch, computed, onMounted } from 'vue'

export const defautParams = ref({
    prompt_pre: 'tmall',

    loras_control: [
        {
            name: '3d_render',
            min: 0.2,
            max: 0.4,
            default: 0.3,
            order: 1,
        },
        {
            name: 'blindbox_v1_mix',
            min: 0.2,
            max: 0.4,
            default: 0.3,
            order: 2,
        },
        {
            name: 'others',
            min: 0.2,
            max: 0.4,
            default: 0.3,
            order: 3,
        },
        {
            name: 'tmall4',
            min: 0.2,
            max: 0.4,
            default: 0.3,
            order: 4,
        },
        {
            name: 'tmall4',
            min: 0.2,
            max: 0.4,
            default: 0.3,
            order: 5,
        }
    ]
})


let defaultParams_str = localStorage.getItem('defaultParams')
if(defaultParams_str && defaultParams_str.length > 0) {
    defautParams.value = JSON.parse(defaultParams_str)
}