import { ref, watch, computed, onMounted } from 'vue'
import ImgParams from './ImgParams.js'
import api from './request_api'


export const reflushOptions = function() {
    api.get_options(data=>{
        ImgParams.value = data
    })
}

export const getUsedModelName = computed(()=> {
    return ImgParams.value.sd_model_checkpoint
})




