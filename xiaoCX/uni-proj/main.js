import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import store from './store/store.js'
Vue.config.productionTip = false
import {$http} from '@escook/request-miniprogram'
uni.$http = $http
// $http.baseUrl = 'https://applet-base-api-t.itheima.net'
$http.baseUrl = 'http://api-ugo-web.itheima.net'
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '数据加载中...'
  })
}
$http.afterRequest = function () {
  uni.hideLoading()
}
uni.$showMsg = function (title='数据请求失败！',duration=1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}
App.mpType = 'app'
const app = new Vue({
    ...App,
    store,
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif