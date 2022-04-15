import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import routes from './routes'
import store from '@/store'

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

let router = new VueRouter({
   routes,
   //滚动行为
   scrollBehavior(to, from, savedPosition) {
      //返回y=0表示滚动条在最上方
      return { y: 0 }
   }
})

//全局守卫：前置守卫（在路由跳转之前进行判断）
router.beforeEach(async (to, from, next) => {
   // to and from are both route objects. must call `next`.
   //to:可以获取到你要跳转到哪个路由信息
   //from:可以获取到你从哪个路由来的信息
   //next:放行函数  next()放行  next(path)放行到指定路由  next(false)中断当前导航
   let token = store.state.user.token
   let name = store.state.user.userInfo.name
   if (token) {
      //用户登录了但仍然想去login(不能去login)
      if (to.path == '/login') {
         next('/home')
      } else {
         //已登录去的不是login，判断是否有用户信息
         if (name) {
            next()
         } else {
            //没有用户信息，派发action让仓库存储用户信息再跳转
            try {
               //获取用户信息成功
               await store.dispatch('getUserInfo')
               next()
            } catch (error) {
               //token失效获取不到用户信息，重新登录并清除token
               await store.dispatch('userLogout')
               next('/login')
            }
         }
      }
   }else{
      //未登录
      next()
   }
})

export default router