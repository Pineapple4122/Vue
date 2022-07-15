<template>
  <view>
    <swiper indicator-dots autoplay circular :interval="3000" :duration="1000">
      <swiper-item v-for="(item,i) in swiperList" :key="i">
        <navigator class="swiper-item"
         :url="'/subpkg/goods_detail/index?goods_id=' + item.goods_id">
          <image :src="item.image_src"/>
        </navigator>
      </swiper-item>
    </swiper>

    <view class="nav-list">
      <view class="nav-item" v-for="(item,i) in navList" :key="i"
       @click="navClickHandler(item)">
        <image :src="item.image_src" class="nav-img"/>
      </view>
    </view>

    <view class="floor-list">
      <view class="floor-item" v-for="(item,i) in floorList" :key="i">
          <image :src="item.floor_title.image_src" class="floor-title"/>
          <view class="floor-img-box">
            <navigator class="left-img-box" :url="item.product_list[0].url">
              <image :src="item.product_list[0].image_src"
               :style="{width:item.product_list[0].image_width+'rpx'}"
               mode="widthFix"/>
            </navigator>
            <view class="right-img-box">
              <navigator class="right-img-item" v-for="(item2,i2) in item.product_list"
               :key="i2" v-show="i2 !== 0" :url="item2.url">
                <image :src="item2.image_src" mode="widthFix"
                 :style="{width:item2.image_width+'rpx'}"/>
              </navigator>
            </view>
          </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data: () => ({
    swiperList: [],
    navList: [],
    floorList: []
  }),
  computed: {},
  methods: {
    async getSwiperList() {
      const {data:res} = await uni.$http.get('/api/public/v1/home/swiperdata')
      if(res.meta.status !== 200) {
        return uni.$showMsg()
      }
      this.swiperList = res.message
      uni.$showMsg('数据请求中！')
    },
    async getNavList() {
      const {data:res} = await uni.$http.get('/api/public/v1/home/catitems')
      if(res.meta.status !== 200) {
        return uni.$showMsg()
      }
      this.navList = res.message
    },
    navClickHandler(item) {
      if(item.name === '分类') {
        uni.switchTab({ url: '/pages/cate/index' })
      }
    },
    async getFloorList() {
      const {data:res} = await uni.$http.get('/api/public/v1/home/floordata')
      if(res.meta.status !== 200) {
        return uni.$showMsg()
      }
      res.message.forEach(floor => {
        floor.product_list.forEach(prod => {
          prod.url = '/subpkg/goods_list/index?' + prod.navigator_url.split('?')[1]
        })
      });
      this.floorList = res.message
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {
    this.getSwiperList(),
    this.getNavList(),
    this.getFloorList()
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

<style lang="scss" scoped>
swiper {
  height: 330rpx;
  .swiper-item,image {
    width: 100%;
    height: 100%;
  }
}

.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}

.floor-title {
  width: 100%;
  height: 60rpx;
  display: flex;
}
.floor-img-box {
  display: flex;
  padding-left: 12rpx;
  .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
}
</style>