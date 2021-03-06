import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import './assets/scss/style.scss'
import './assets/iconfont/iconfont.css'

// swiper轮播图
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
Vue.use(VueAwesomeSwiper)

import Card from './components/Card'
Vue.component('m-card',Card)
import ListCard from './components/ListCard'
Vue.component('m-list-card',ListCard)

import Axios from 'axios'
Vue.prototype.$http = Axios.create({
  // baseURL: 'http://localhost:3000/web/api'
  baseURL: process.env.VUE_APP_API_URL || '/web/api'
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
