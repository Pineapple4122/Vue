import Vue from 'vue'
import App from './App.vue'
import router from './router'

// import './plugins/element.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)

// 导入全局样式表
import './assets/css/global.css'

// 导入阿里图标
import './assets/fonts/iconfont.css'

import moment from 'moment'
Vue.filter('dateFormat',function(val){
  return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')
})

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  NProgress.start()
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
