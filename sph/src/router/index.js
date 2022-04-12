import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import routes from './routes'

let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace

VueRouter.prototype.push = function (location, resolve, reject) {
   if (resolve && reject) {
      originPush.call(this, location, resolve, reject)
   } else {
      originPush.call(this, location, () => { }, () => { })
   }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
   if (resolve && reject) {
      originReplace.call(this, location, resolve, reject)
   } else {
      originReplace.call(this, location, () => { }, () => { })
   }
}

export default new VueRouter({
   routes,
   //滚动行为
   scrollBehavior(to,from,savedPosition) {
      //返回y=0表示滚动条在最上方
      return { y: 0 }
   }
})