import Vue from 'vue'
import App from './App.vue'
//引入路由
import router from '@/router'
//引入仓库
import store from '@/store'
//引入swiper样式
import 'swiper/css/swiper.css'
//统一接口api文件夹里面全部请求函数
import * as API from '@/api'

Vue.config.productionTip = false

//三级联动组件---全局组件
import TypeNav from '@/components/TypeNav'
//第一个参数：全局组件的名字 第二个参数：哪一个组件
Vue.component(TypeNav.name,TypeNav)
import Carousel from '@/components/Carousel'
Vue.component(Carousel.name,Carousel)
import Pagination from '@/components/Pagination'
Vue.component(Pagination.name,Pagination)

import '@/mock/mockServe.js'

//使用Element UI组件并按需引入
import {MessageBox} from 'element-ui'
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert

//引入图片懒加载插件
import VueLazyLoad from 'vue-lazyload'

//表单验证
import '@/plugins/validate'

new Vue({
  render: h => h(App),
  //全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$API = API
  },
  router,
  store
}).$mount('#app')
