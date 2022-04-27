import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: ()=>import('@/views/Main'),
    children: [
      {path:'/',name:'home',component:()=>import('@/views/Home')}
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
