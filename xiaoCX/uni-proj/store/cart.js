export default {
  namespace: true,
  state: () => ({
    cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
  }),
  mutations: {
    addToCart(state,goods) {
      const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
      if(!findResult) {
        state.cart.push(goods)
      }else {
        findResult.goods_count++
      }
      this.commit('m_cart/saveToStorage')
    },
    saveToStorage(state) {
      uni.setStorageSync('cart',JSON.stringify(state.cart))
    }
  },
  getters: {
    total(state) {
      let c = 0
      state.cart.forEach(goods => c += goods.goods_count)
    }
  },
}