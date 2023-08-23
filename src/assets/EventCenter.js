// 配置事件中心
import mitt from 'mitt'
export const bus = mitt()
window.bus = bus

// app.config.globalProperties.$bus = bus //相当于Vue2中的:Vue.prototype.$bus = bus
/* 使用 - 在事件的触发之前，要确定事件已经被绑定，否则是找不到触发事件的
import { getCurrentInstance,onMounted,onBeforeUnmount } from 'vue'
const cxt = getCurrentInstance()
const bus = cxt.appContext.config.globalProperties.$bus
bus.emit('printMessage','我是B组件，我被A组件触发了')

监听
const bus = cxt.appContext.config.globalProperties.$bus
bus.on('printMessage',(message)=>{
    alert(message)
})
移除
bus.off('printMessage')
*/
//  ----------