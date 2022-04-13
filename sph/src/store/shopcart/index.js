import { reqShopCart } from "@/api"

const state = {
   
}

const actions = {
   async getCartList({commit}){
      let result = await reqShopCart()
   }
}

const mutations = {
   
}

const getters = {
   
}

export default {
   state,
   actions,
   mutations,
   getters
}