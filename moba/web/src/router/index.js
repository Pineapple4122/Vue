import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: ()=>import('@/views/Main'),
    children: [
      {path:'/',name:'home',component:()=>import('@/views/Home')},
      {path:'/articles/:id',name:'article',component:()=>import('@/views/Article'),props:true},
    ]
  },
  {path:'/heroes/:id',name:'hero',component:()=>import('@/views/Hero'),props:true}
]

const router = new VueRouter({
  routes
})

export default router
