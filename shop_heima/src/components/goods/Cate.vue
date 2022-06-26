<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
         <el-col>
            <el-button type="primary" @click="showAddCateDialog">添加商品</el-button>
         </el-col>
      </el-row>
      <tree-table :data="cateList" :columns="columns" show-index
       border :expand-type="false" :selection-type="false" class="treeTable">
         <template v-slot:isok="{row}">
            <i class="el-icon-success" v-if="row.cat_deleted===false"
             style="color:lightgreen;"></i>
            <i class="el-icon-error" v-else style="color:red;"></i>
         </template>
         <template v-slot:order="{row}">
            <el-tag v-if="row.cat_level===0">一级</el-tag>
            <el-tag type="success" v-else-if="row.cat_level===1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
         </template>
         <template v-slot:opt="{row}">
            <el-button type="primary" icon='el-icon-edit' size="mini">编辑</el-button>
            <el-button type="danger" icon='el-icon-delete' size="mini">删除</el-button>
         </template>
      </tree-table>

      <el-pagination
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="queryInfo.pagenum"
         :page-sizes="[3,5,10, 15]"
         :page-size="queryInfo.pagesize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="total">
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%">
      <el-form :model="addCateForm" ref="addCateFormRef"
       label-width="100px" :rules="addCateFormRules">
         <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
         </el-form-item>
         <el-form-item label="父级分类">
            <el-select v-model="addCateForm.cat_pid" placeholder="">
               <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
               </el-option>
            </el-select>
         </el-form-item>
      </el-form>
      <div slot="footer">
         <el-button @click="addCateDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
   name: 'Category',
   data() {
      return {
         cateList: [],
         columns: [
            {
               label: '分类名称',
               prop: 'cat_name',
            },
            {
               label: '是否有效',
               type: 'template',
               template: 'isok'
            },
            {
               label: '排序',
               type: 'template',
               template: 'order'
            },
            {
               label: '操作',
               type: 'template',
               template: 'opt'
            }
         ],
         queryInfo: {
            type: 3,
            pagenum: 1,
            pagesize: 5,
         },
         total: 0,
         addCateDialogVisible: false,
         addCateForm: {
            cat_name: '',
            cat_pid: 0,
            cat_level: 0
         },
         addCateFormRules: {
            cat_name: [
               {required: true, message:'请输入分类名称', trigger: 'blur'},
            ],
         }
      }
   },
   created() {
      this.getCateList()
   },
   methods: {
      async getCateList(){
         const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
         if(res.meta.status !== 200){
            return this.$message.error('请求商品数据列表失败！')
         }
         this.cateList = res.data.result
         this.total = res.data.total
      },
      handleSizeChange(newSize){
         this.queryInfo.pagesize = newSize
         this.getCateList()
      },
      handleCurrentChange(newPage){
         this.queryInfo.pagenum = newPage
         this.getCateList()
      },
      showAddCateDialog(){
         this.addCateDialogVisible = true
      }
   },
}
</script>

<style lang="less" scoped>
.treeTable{
   margin-top: 15px;
}
</style>