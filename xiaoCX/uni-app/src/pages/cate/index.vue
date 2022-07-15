<template>
  <view class="scroll-view-container">
    <scroll-view class="left-scroll-view" scroll-y :style="{height:wh+'px'}">
      <view class="left-scroll-view-item active"></view>
    </scroll-view>
    <scroll-view class="right-scroll-view" scroll-y :style="{height:wh+'px'}">
      <view class="right-scroll-view-item"></view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  components: {},
  data: () => ({}),
  computed: {},
  methods: {},
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {},
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
}
</style>