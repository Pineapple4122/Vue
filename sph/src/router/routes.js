//路由配置信息
//引入一级路由组件
// import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import PaySuccess from '@/pages/PaySuccess'
import Center from '@/pages/Center'
//引入一级路由组件
import MyOrder from '@/pages/Center/myOrder'
import GroupOrder from '@/pages/Center/groupOrder'

export default [
   {
      path: '/center',
      component: Center,
      meta:{show:true},
      //二级路由组件
      children: [
         {
            path: 'myorder',
            component: MyOrder,
         },
         {
            path: 'grouporder',
            component: GroupOrder,
         },
         //重定向
         {
            path: '/center',
            component: '/center/myorder'
         }
      ]
   },
   {
      path: '/paysuccess',
      component: PaySuccess,
      meta:{show:true}
   },
   {
      path: '/pay',
      component: Pay,
      meta:{show:true},
      beforeEnter: (to,from,next)=>{
         if(from.path == '/trade'){
            next()
         }else{
            next(false)
         }
      }
   },
   {
      path: '/trade',
      component: Trade,
      meta:{show:true},
      //路由独享守卫
      beforeEnter: (to, from, next) => {
         //去交易页面，必须是从购物车来的
         if(from.path == '/shopcart'){
            next()
         }else{
            //从其它路由组件来的，停留在当前
            next(false)
         }
      }
   },
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
      // component: Home,
      //路由懒加载:只有当路由被访问时才加载相应组件
      //最好用路由懒加载
      // import('@/pages/Home')返回的是promise对象
      component: ()=>import('@/pages/Home'),
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