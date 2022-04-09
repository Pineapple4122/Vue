import Vue from 'vue'
import App from './App.vue'
//引入路由
import router from '@/router'
//引入仓库
import store from '@/store'

Vue.config.productionTip = false

//三级联动组件---全局组件
import TypeNav from '@/components/TypeNav'
//第一个参数：全局组件的名字 第二个参数：哪一个组件
Vue.component(TypeNav.name,TypeNav)

import '@/mock/mockServe.js'
//引入swiper样式
import 'swiper/css/swiper.css'

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
