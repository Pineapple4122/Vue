<template>
  <view class="my-search-container" :style="{'background-color':bgcolor}">
    <view class="my-search-box" :style="{'border-radius':radius+'px'}"
     @click="searchBoxHandler">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
import {uniIcons} from '@dcloudio/uni-ui'
export default {
  props: {
    bgcolor: {
      type: String,
      default: '#C00000'
    },
    radius: {
      type: Number,
      default: 18
    }
  },
  components: {uniIcons},
  data: () => ({}),
  computed: {},
  methods: {
    searchBoxHandler() {
      this.$emit('click')
    }
  },
  watch: {},

  // 组件周期函数--监听组件挂载完毕
  mounted() {},
  // 组件周期函数--监听组件数据更新之前
  beforeUpdate() {},
  // 组件周期函数--监听组件数据更新之后
  updated() {},
  // 组件周期函数--监听组件激活(显示)
  activated() {},
  // 组件周期函数--监听组件停用(隐藏)
  deactivated() {},
  // 组件周期函数--监听组件销毁之前
  beforeDestroy() {},
}
</script>

<style scoped lang="scss">
.my-search-container {
  // background-color: #C00000;
  height: 50px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  .my-search-box {
    height: 36px;
    background-color: #fff;
    // border-radius: 15px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .placeholder {
      font-size: 15px;
      margin-left: 5px;
    }
  }
}
</style>