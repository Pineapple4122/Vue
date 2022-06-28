<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false">
      </el-alert>
      <el-row class="cat_opt">
         <el-col>
            <span>选择商品分类 </span>
            <el-cascader
               v-model="selectedCateKeys"
               :options="cateList"
               :props="{ expandTrigger: 'hover', ...cateProps, checkStrictly:'true' }"
               @change="handleChange" clearable></el-cascader>
         </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
         <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini"
             :disabled="isBtnDisabled">添加参数</el-button>
         </el-tab-pane>
         <el-tab-pane label="静态参数" name="only">
            <el-button type="primary" size="mini"
             :disabled="isBtnDisabled">添加属性</el-button>
         </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
   name: 'Params',
   data() {
      return {
         cateList: [],
         cateProps: {
            value: 'cat_id',
            label: 'cat_name',
            children: 'children'
         },
         selectedCateKeys: [],
         activeName: 'many',
      }
   },
   created() {
      this.getCateList()
   },
   computed: {
      isBtnDisabled(){
         if(this.selectedCateKeys.length !== 3){
            return true
         }
         return false
      },
      cateId(){
         if(this.selectedCateKeys.length === 3){
            return this.selectedCateKeys[2]
         }
         return null
      },
   },
   methods: {
      async getCateList(){
         const {data:res} = await this.$http.get('categories')
         if(res.meta.status !== 200){
            return this.$message.error('获取商品分类列表失败！')
         }
         this.cateList = res.data
      },
      async handleChange(){
         if(this.selectedCateKeys.length !== 3){
            this.selectedCateKeys = []
            return
         }
         const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
            params: {sel: this.activeName}
         })
         console.log(res);
         if(res.meta.status !== 200){
            return this.$message.error('获取参数列表失败！')
         }

      }
   },
}
</script>

<style scoped lang="less">
.cat_opt{
   margin: 15px 0;
}
</style>