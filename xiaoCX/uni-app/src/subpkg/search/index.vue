<template>
  <view>
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100" focus cancelButton="none">
        <template v-slot:searchIcon>
          <uni-icons color="#999999" size="18" type="search"/>
        </template>
        <template v-slot:clearIcon>
          <uni-icons color="#999999" size="18" type="closeempty"/>
        </template>
      </uni-search-bar>
    </view>

    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item,i) in searchResults" :key="i"
       @click="gotoDetail(item.goods_id)">
        <text class="goods-name">{{item.goods_name}}</text>
        <uni-icons type="forward" size="16"></uni-icons>
      </view>
    </view>

    <view class="history-box" v-else>
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <view class="history-list">
        <uni-tag :text="item" v-for="(item,i) in historys" :key="i"
         @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
import {uniSearchBar,uniIcons,uniTag} from '@dcloudio/uni-ui'
export default {
  components: {uniSearchBar,uniIcons,uniTag},
  data: () => ({
    timer: null,
    kw: '',
    searchResults: [],
    historyList: []
  }),
  computed: {
    historys() {
      return [...this.historyList].reverse()
    }
  },
  methods: {
    input(e) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.kw = e
        this.getSearchList()
      },500)
    },
    async getSearchList() {
      if(this.kw === '') {
        this.searchResults = []
        return
      }
      const {data:res} = await uni.$http.get('/api/public/v1/goods/qsearch',{query:this.kw})
      if(res.meta.status !== 200) {
        return uni.$showMsg()
      }
      this.searchResults = res.message
      this.saveSearchHistory()
    },
    gotoDetail(goods_id) {
      uni.navigateTo({
        url: '/subpkg/goods_detail/index?goods_id=' + goods_id
      })
    },
    saveSearchHistory() {
      // this.historyList.push(this.kw)
      const set = new Set(this.historyList)
      set.delete(this.kw)
      set.add(this.kw)
      this.historyList = Array.from(set)
      uni.setStorageSync('kw', JSON.stringify(this.historyList))
    },
    cleanHistory() {
      this.historyList = []
      uni.setStorageSync('kw','[]')
    },
    gotoGoodsList(kw) {
      uni.navigateTo({
        url: '/subpkg/goods_list/index?query=' + kw
      })
    }
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {
    this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
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
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}

.sugg-list {
  padding: 0 5px;
  .sugg-item {
    display: flex;
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    align-items: center;
    justify-content: space-between;
    .goods-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}

.history-box {
  padding: 0 5px;
  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    height: 40px;
    border-bottom: 1px solid #efefef;
  }
  .history-list {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>