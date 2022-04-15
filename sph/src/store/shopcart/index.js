import { reqShopCart, reqDeleteCartById, reqUpdateCheckedById } from "@/api"

const state = {
   cartList: []
}

const actions = {
   //获取购物车列表数据
   async getCartList({ commit }) {
      let result = await reqShopCart()
      commit('GETCARTLIST', result.data)
   },

   //删除购物车某一商品
   async deleteCartListBySkuId({ commit }, skuId) {
      let result = await reqDeleteCartById(skuId)
      if (result.code == 200) {
         return 'ok'
      } else {
         return Promise.reject(new Error('fail'))
      }
   },

   //修改购物车某一产品的选中状态
   async updateCheckedById({ commit }, { skuId, isChecked }) {
      let result = await reqUpdateCheckedById(skuId, isChecked)
      if (result.code == 200) {
         return 'ok'
      } else {
         return Promise.reject(new Error('fail'))
      }
   },

   //删除选中商品（可能有多个）
   deleteAllCheckedCart({ dispatch, getters }) {
      let promiseAll = []
      getters.cartList.cartInfoList.forEach(item => {
         let promise = item.isChecked == 1 ? dispatch('deleteCartListBySkuId', item.skuId) : ''
         promiseAll.push(promise)
      });
      //数组里promise状态都为成功，才返回true，不是promise会被转化为成功的promise
      return Promise.all(promiseAll)
   },

   //修改后台商品全选状态
   updateAllCartIsChecked({dispatch,getters},isChecked){
      let promiseAll = []
      getters.cartList.cartInfoList.forEach((item)=>{
         let promise = dispatch('updateCheckedById',{skuId:item.skuId,isChecked:isChecked})
         promiseAll.push(promise)
      })
      return Promise.all(promiseAll)
   }
}

const mutations = {
   GETCARTLIST(state, cartList) {
      state.cartList = cartList
   }
}

const getters = {
   cartList(state) {
      return state.cartList[0] || {}
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}