<template>
 <view>
  <my-search @click="gotoSearch"></my-search>
  <view class="scroll-view-container">
    <scroll-view class="left-scroll-view" scroll-y :style="{height:wh+'px'}">
      <block v-for="(item,i) in cateList" :key="i">
        <view :class="['left-scroll-view-item', i===active ? 'active':'']"
         @click="activeChanged(i)">{{item.cat_name}}</view>
      </block>
    </scroll-view>
    <scroll-view class="right-scroll-view" scroll-y :style="{height:wh+'px'}"
     :scroll-top="scrollTop">
      <view class="cate-lv2" v-for="(item2,i2) in cateLevel2" :key="i2">
        <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
        <view class="cate-lv3-list">
          <view class="cate-lv3-item" @click="gotoGoodsList(item3)"
           v-for="(item3,i3) in item2.children" :key="i3">
            <image :src="item3.cat_icon"/>
            <text>{{item3.cat_name}}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</view>
</template>

<script>
import badgeMix from '@/mixins/tabbar-badge.js'
export default {
  components: {},
  mixins: [badgeMix],
  data: () => ({
    wh: 0,
    cateList: [],
    active: 0,
    cateLevel2: [],
    scrollTop: 0,
  }),
  computed: {},
  methods: {
    async getCateList() {
      const {data:res} = await uni.$http.get('/api/public/v1/categories')
      if(res.meta.status !== 200) {
        return uni.$showMsg()
      }
      this.cateList = res.message
      this.cateLevel2 = res.message[0].children
    },
    activeChanged(i) {
      this.active = i
      this.cateLevel2 = this.cateList[i].children
      this.scrollTop = this.scrollTop ? 0:0.1
    },
    gotoGoodsList(item3) {
      uni.navigateTo({
        url: '/subpkg/goods_list/index?cid=' + item3.cat_id
      })
    },
    gotoSearch() {
      uni.navigateTo({
        url: '/subpkg/search/index'
      })
    }
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {
    const sysInfo = uni.getSystemInfoSync()
    this.wh = sysInfo.windowHeight - 50
    this.getCateList()
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
.scroll-view-container {
  display: flex;
  .left-scroll-view {
    width: 120px;
    .left-scroll-view-item {
      line-height: 60px;
      text-align: center;
      background-color: #f7f7f7;
      font-size: 12px;
      &.active {
        background-color: #fff;
        position: relative;
        &::before {
          content: '';
          display: block;
          position: absolute;
          top: 50%;
          left: 0;
          width: 3px;
          height: 30px;
          transform: translateY(-50%);
          color: #C00000;
        }
      }
    }
  }
  .cate-lv2-title {
    font-size: 12px;
    text-align: center;
    font-weight: bold;
    padding: 15px 0;
  }
  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;
    .cate-lv3-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
      margin-bottom: 10px;
      image {
        width: 60px;
        height: 60px;
      }
      text {
        font-size: 12px;
      }
    }
  }
}
</style>