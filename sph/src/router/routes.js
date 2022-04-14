//路由配置信息
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'

export default [
   {
      path: '/shopcart',
      component: ShopCart,
      meta:{show:true}
   },
   {
      path: '/addcartsuccess',
      component: AddCartSuccess,
      name: 'addcartsuccess',
      meta:{show:true}
   },
   {
      path: '/detail/:skuId?',
      component: Detail,
      meta:{show:true}
   },
   {
      path: '/home',
      component: Home,
      meta:{show:true}
   },
   {
      name: 'search',
      path: '/search/:keyword?',
      component: Search,
      meta:{show:true}
   },
   {
      path: '/login',
      component: Login,
      meta:{show:false}
   },
   {
      path: '/register',
      component: Register,
      meta:{show:false}
   },
   //重定向
   {
      path: '*',
      redirect: '/home'
   }
]