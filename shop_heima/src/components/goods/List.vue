<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>商品管理</el-breadcrumb-item>
         <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
         <el-row :gutter="20">
            <el-col :span="8">
                 <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable
                  @input="getGoodsList">
                     <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                  </el-input>
            </el-col>
            <el-col :span="4">
               <el-button type="primary" @click="goAddpage">添加商品</el-button>
            </el-col>
         </el-row>

         <el-table :data="goodsList" border stripe >
            <el-table-column align="center" type="index" label="序号" >
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称">
            </el-table-column>
            <el-table-column align="center" prop="goods_price" label="商品价格" width="95px">
            </el-table-column>
            <el-table-column align="center" prop="goods_weight" label="商品重量" width="140px">
            </el-table-column>
            <el-table-column align="center" prop="add_time" label="创建时间" width="140px">
               <template slot-scope="{row}">
                  {{row.add_time | dateFormat}}
               </template>
            </el-table-column>
            <el-table-column label="操作" width="130px" align="center">
               <template v-slot="{row}">
                  <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete"
                   @click="removeById(row.goods_id)"></el-button>
               </template>
            </el-table-column>
         </el-table>

         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5,10, 20, 50]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background>
         </el-pagination>
      </el-card>
  </div>
</template>

<script>
export default {
   name: 'List',
   data(){
      return {
         queryInfo: {
            query: '',
            pagenum: 1,
            pagesize: 5
         },
         total: 0,
         goodsList: [],
      }
   },
   created() {
      this.getGoodsList()
   },
   methods: {
      async getGoodsList(){
         const {data:res} = await this.$http.get('goods',{
            params: this.queryInfo
         })
         if(res.meta.status !== 200){
            return this.$message.error('请求商品列表数据失败！')
         }
         this.goodsList = res.data.goods
         this.total = res.data.total
      },
      goAddpage(){
         this.$router.push('goods/add')
      },
      async removeById(id){
         const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
         }).catch(err => err)
         if(confirmResult !== 'confirm'){
            return this.$message.info('已取消删除！')
         }
         const {data:res} = await this.$http.delete(`goods/${id}`)
         if(res.meta.status !== 200){
            return this.$message.error('删除失败！')
         }
         this.getGoodsList()
      },
      handleCurrentChange(newPage){
         this.queryInfo.pagenum = newPage
         this.getGoodsList()
      },
      handleSizeChange(newSize){
         this.queryInfo.pagesize = newSize
         this.getGoodsList()
      }
   },
}
</script>

<style>

</style>