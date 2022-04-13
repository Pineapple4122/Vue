import {v4 as uuitv4} from 'uuit'

//要生成一个随机字符串，且每次执行不能发生变化，游客身份持久存储
export const getUUID = ()=>{
    //先从本地存储获取uuid
    let uuit_token = localStorage.getItem('UUIDTOKEN')
    //判断有没有
    if(!uuit_token){
        //生成游客临时身份
        uuit_token = uuitv4()
        //本地存储
        localStorage.setItem('UUIDTOKEN',uuit_token)
    }
    return uuit_token
}