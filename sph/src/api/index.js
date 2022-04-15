//当前这个模块：API进行统一管理
import requests from "./request";
import mockRequests from './mockAjax'

//三级联动接口
//  /api/product/getBaseCategoryList  get  无参数
//发请求：axios发请求返回结果Promise对象
export const reqCategoryList = ()=>requests({url:'/product/getBaseCategoryList',method:'get'})
//获取banner（Home首页轮播图接口）
export const reqGetBannerList = ()=>mockRequests.get('/banner')
//获取floor数据
export const reqFloorList = ()=>mockRequests.get('/floor')
//搜索接口
export const reqGetSearchInfo = (params)=>requests({url:'/list',method:'post',data:params})
//商品详情接口
export const reqGoodsInfo = (skuId)=>requests({url:`/item/${skuId}`,method:'get'})
//加入、更新购物车接口
export const reqAddOrUpdateShopCart = (skuId,skuNum)=>requests({url:`/cart/addToCart/${skuId}/${skuNum}`,method:'post'})
//获取购物车列表数据接口
export const reqShopCart = ()=>requests({url:'/cart/cartList',method:'get'})
//删除购物产品的接口
export const reqDeleteCartById = (skuId)=>requests({url:`/cart/deleteCart/${skuId}`,method:'delete'})
//切换商品选中状态的接口
export const reqUpdateCheckedById = (skuId,isChecked)=>requests({url:`cart/checkCart/${skuId}/${isChecked}`,method:'get'})
//获取手机验证码的接口
export const reqGetCode = (phone)=>requests({url:`/user/passport/sendCode/${phone}`,method:'get'})
//注册接口
export const reqUserRegister = (data)=>requests({url:'/user/passport/register',data,method:'post'})
//登录接口
export const reqUserLogin = (data)=>requests({url:'/user/passport/login',data,method:'post'})
//获取用户信息（需要带着用户的token向服务器要用户信息，token通过拦截器放在请求头中）
export const reqUserInfo = ()=>requests({url:'/user/passport/auth/getUserInfo',method:'get'})
//退出登录接口
export const reqLogout = ()=>requests({url:'/user/passport/logout',method:'get'})