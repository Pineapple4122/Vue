//对于axios进行二次封装
import axios from 'axios'
//引入进度条
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'

//创建axios实例，request就是axios，只不过稍微配置一下
const requests = axios.create({
   //配置对象
   baseURL: '/mock',
   timeout: 5000
})

//请求拦截器
requests.interceptors.request.use((config)=>{
   //进度条开始动
   nprogress.start()
   return config
})
//响应拦截器
requests.interceptors.response.use((res)=>{
   //进度条结束
   nprogress.done()
   return res.data
},(error)=>{
   return Promise.reject(new Error('fail'))
})

export default requests