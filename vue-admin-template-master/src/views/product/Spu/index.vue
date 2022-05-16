<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!show"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 这里有三部分进行切换 -->
      <div>
        <!-- 展示SPU列表的结构 -->
        <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
        <el-table :data="records" style="width: 100%" border >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- 自定义的全局组件 -->
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表"></hint-button>
              <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu"></hint-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="totalCount"
          style="text-align:center">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Spu',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      show: true,  //控制三级联动的可操作性
      page: 1,  //当前页数
      limit: 3,  //页面展示数据条数
      records: [],  //spu列表的数据
      total: 0,  //分页器需要展示的数据条数
    }
  },

  methods: {
    //自定义事件，把子组件相应的id传递给父组件
    getCategoryId({categoryId,level}){
      if(level == 1){
        this.category1Id = categoryId
        //清除2、3级分类的id
        this.category2Id = ''
        this.category3Id = ''
      }else if(level == 2){
        this.category2Id = categoryId
        this.category3Id = ''
      }else{
        this.category3Id = categoryId
        this.getSpuList()
      }
    },
    //获取Spu列表数据
    async getSpuList(pages = 1){
      this.page = pages 
      const {page,limit,category3Id} = this
      let result = await this.$API.spu.reqSpuList(page,limit,category3Id)
      if(result.code === 200){
        this.records = result.data
        this.total = result.total
      }
    },
    // 点击分页器的第几页按钮的回调，也可以通过给上面添加pages默认参数实现
    // handleCurrentChange(page){
    //   this.page = page
    //   this.getSpuList()
    // }

    //当分页器的某一个展示数据条数发生变化的回调
    handleSizeChange(limit){
      this.limit = limit
      this.getSpuList()
    }
  },
}
</script>

<style>

</style>