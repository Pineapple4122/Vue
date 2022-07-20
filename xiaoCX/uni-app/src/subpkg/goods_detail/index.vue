<template>
  <view v-if="goods_info.goods_name" class="goods-detail-container">
    <swiper indicator-dots autoplay circular :interval="3000" :duration="1000">
      <swiper-item v-for="(item,i) in goods_info.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"/>
      </swiper-item>
    </swiper>

    <view class="goods-info-box">
      <view class="price">￥{{goods_info.goods_price}}</view>
      <view class="goods-info-body">
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <view class="yf">快递：免运费</view>
    </view>

    <rich-text :nodes="goods_info.goods_introduce"></rich-text>

    <view class="goods_nav">
      <!-- fill 控制右侧按钮的样式 -->
      <!-- options 左侧按钮的配置项 -->
      <!-- buttonGroup 右侧按钮的配置项 -->
      <!-- click 左侧按钮的点击事件处理函数 -->
      <!-- buttonClick 右侧按钮的点击事件处理函数 -->
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup"
       @click="onClick" @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data: () => ({
    goods_info: [],
    options: [{
      icon: 'shop',
      text: '店铺'
    },{
      icon: 'cart',
      text: '购物车',
      info: 2
    }],
    buttonGroup: [{
      text: '加入购物车',
      backgroundColor: '#ff0000',
      color: '#fff'
    },{
      text: '立即购买',
      backgroundColor: '#ffa200',
      color: '#fff'
    }]
  }),
  computed: {},
  methods: {
    async getGoodsDetail(goods_id) {
      const {data:res} = await uni.$http.get('/api/public/v1/goods/detail',{goods_id})
      if(res.meta.status !== 200) {
        return uni.$showMsg()
      }
      res.message.goods_introduce = res.message.goods_introduce
       .replace(/<img /g,'<img style="display:block;" ').replace(/webp/g,'jpg')
      this.goods_info = res.message
    },
    preview(i) {
      uni.previewImage({
        urls: this.goods_info.pics.map(x => x.pics_big),
        current: i
      })
    },
    onClick(e) {
      if(e.content.text === '购物车') {
        uni.switchTab({ url: '/pages/cart/index' })
      }
    }
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad(options) {
    const goods_id = options.goods_id
    this.getGoodsDetail(goods_id)
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {},
  // 页面周期函数--监听页面隐藏
  onHide() {},
  // 页面周期函数--监听页面卸载
  onUnload() {},
  // 页面处理函数--监听用户下拉动作
  // onPullDownRefresh() { uni.stopPullDownRefresh(); },
  // 页面处理函数--监听用户上拉触底
  // onReachBottom() {},
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
} 
</script>

<style scoped lang="scss">
swiper {
  height: 750rpx;
  image {
    width: 100%;
    height: 100%;
  }
}

.goods-info-box {
  padding: 10px;
  padding-right: 0;
  .price {
    color: #c00000;
    font-size: 18px;
    margin: 10px 0;
  }
  .goods-info-body {
    display: flex;
    justify-content: space-between;
    .goods-name {
      font-size: 13px;
      padding-right: 10px;
    }
    .favi {
      width: 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-left: 1px solid #efefef;
      color: gray;
    }
  }
  .yf {
    font-size: 12px;
    margin: 10px 0;
    color: gray;
  }
}

.goods-detail-container {
  padding-bottom: 50px;
}

.goods_nav {
  display: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>