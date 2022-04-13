import { reqGoodsInfo,reqAddOrUpdateShopCart } from "@/api"
import { getUUID } from "@/utils/uuit_token"

const state = {
   goodInfo: {},
   //游客临时身份
   uuit_token: getUUID()
}

const actions = {
   //获取商品信息
   async getGoodInfo({ commit }, skuId) {
      let result = await reqGoodsInfo(skuId)
      if (result.code === 200) {
         commit('GETGOODINFO', result.data)
      }
   },

   //通过请求将加入购物车商品的参数带给服务器
   async addOrUpdateShopCart({commit},{skuId,skuNum}){
      let result = await reqAddOrUpdateShopCart(skuId,skuNum)
      if(result.code == 200){
         return 'ok'
      }else{
         return Promise.reject(new Error('fail'))
      }
   }
}

const mutations = {
   GETGOODINFO(state, goodInfo) {
      state.goodInfo = goodInfo
   }
}

const getters = {
   categoryView(state){
      return state.goodInfo.categoryView || {}
   },

   //商品信息数据简化
   skuInfo(state){
      return state.goodInfo.skuInfo || {}
   },

   //商品售卖属性数据简化
   spuSaleAttrList(state){
      return state.goodInfo.spuSaleAttrList || []
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}