import { reqGoodsInfo } from "@/api"

const state = {
   goodInfo: {}
}

const actions = {
   async getGoodInfo({ commit }, skuId) {
      let result = await reqGoodsInfo(skuId)
      if (result.code === 200) {
         commit('GETGOODINFO', result.data)
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