import { CurrentGenImageList } from '@/assets/CurrentImg'
import api from '@/assets/request_api.js'
import { DecodeImgData, DeCodeCustomInfo } from '@/assets/ImgParams'


// 点击还原参数
export function OnReduce(imagefullpath) {
    console.log(' OnReduce ' + imagefullpath)
    let imgName = imagefullpath.substring(imagefullpath.lastIndexOf('\\') + 1)
    api.image_info(imagefullpath).then(data => {
        console.log(data)
        let str = DecodeImgData(data)
        console.log(str)
        DeCodeCustomInfo(str)
    })

    // 跳转
    // 将图片设置为要编辑的图片
    CurrentGenImageList.value.splice(0, CurrentGenImageList.value.length)
    CurrentGenImageList.value.push({img: api.image_file_url(imagefullpath), name: imgName, type: 'url'})
    window.router.push({ name: 'sd-view' })
}