import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router =  new Router({
    mode: 'hash',
    routes: [
        {
            path: '/login',
            name: 'login',
            component: ()=>import('@/views/Login'),
            meta:{isPublic: true}
        },
        {
            path: '/',
            name: 'main',
            component: ()=>import('@/views/Main'),
            children: [
                //分类
                {
                    path: '/categories/create',
                    component: ()=>import('@/views/CategoryEdit')
                },
                {
                    path: '/categories/edit/:id',
                    component: ()=>import('@/views/CategoryEdit'),
                    props: true
                },
                {
                    path: '/categories/list',
                    component: ()=>import('@/views/CategoryList')
                },
                //物品
                {
                    path: '/items/create',
                    component: ()=>import('@/views/ItemEdit')
                },
                {
                    path: '/items/edit/:id',
                    component: ()=>import('@/views/ItemEdit'),
                    props: true
                },
                {
                    path: '/items/list',
                    component: ()=>import('@/views/ItemList')
                },
                //英雄
                {
                    path: '/heroes/create',
                    component: ()=>import('@/views/HeroEdit')
                },
                {
                    path: '/heroes/edit/:id',
                    component: ()=>import('@/views/HeroEdit'),
                    props: true
                },
                {
                    path: '/heroes/list',
                    component: ()=>import('@/views/HeroList')
                },
                //文章
                {
                    path: '/articles/create',
                    component: ()=>import('@/views/ArticleEdit')
                },
                {
                    path: '/articles/edit/:id',
                    component: ()=>import('@/views/ArticleEdit'),
                    props: true
                },
                {
                    path: '/articles/list',
                    component: ()=>import('@/views/ArticleList')
                },
                //广告位
                {
                    path: '/ads/create',
                    component: ()=>import('@/views/AdEdit')
                },
                {
                    path: '/ads/edit/:id',
                    component: ()=>import('@/views/AdEdit'),
                    props: true
                },
                {
                    path: '/ads/list',
                    component: ()=>import('@/views/AdList')
                },
                //管理员
                {
                    path: '/admin_users/create',
                    component: ()=>import('@/views/AdminUserEdit')
                },
                {
                    path: '/admin_users/edit/:id',
                    component: ()=>import('@/views/AdminUserEdit'),
                    props: true
                },
                {
                    path: '/admin_users/list',
                    component: ()=>import('@/views/AdminUserList')
                },
            ]
        }
    ]
})

router.beforeEach((to,from,next)=>{
    if(!to.meta.isPublic && !localStorage.token){
        return next('/login')
    }
    next()
})

export default router

var trim = function(str){
    return str.replace(/\s*/g,"");
    }
str.replace(/\s*/g,""); //去除字符串内所有的空格
str.replace(/^\s*|\s*$/g,""); //去除字符串内两头的空格
str.replace(/^\s*/,""); //去除字符串内左侧的空格
str.replace(/(\s*$)/g,""); //去除字符串内右侧的空格