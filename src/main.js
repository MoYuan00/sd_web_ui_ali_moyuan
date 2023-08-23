import './assets/main.css'
import './assets/theme.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//  ----
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import requests from '@/assets/requests'

import Viewer from 'v-viewer'  //点击图片大图预览
import 'viewerjs/dist/viewer.css'



const app = createApp(App)
window.vue = app
window.$axios = requests

// vue3写法
// app.config.globalProperties.$axios = requests;  //配置axios的全局引用


app.use(router)

// @element-plus/icons-vue
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// ---
app.use(ElementPlus)

app.use(Viewer)

Viewer.setDefaults({
Options: {
    inline: true,
    button: true,
    navbar: true,
    title: true,
    toolbar: true,
    tooltip: true,
    movable: true,
    zoomable: true,
    rotatable: true,
    // "scalable": true,
    transition: true,
    fullscreen: true,
    keyboard: true,
    url: 'data-source'
}
})
  
app.mount('#app')
