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
            <el-button type="primary" icon='el-icon-edit' size="mini" @click="showEditDialog(row.cat_id)">编辑</el-button>
            <el-button type="danger" icon='el-icon-delete' size="mini" @click="removeCateById(row.cat_id)">删除</el-button>
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
      width="50%" @close="addCateDialogClosed">
      <el-form :model="addCateForm" ref="addCateFormRef"
       label-width="100px" :rules="addCateFormRules">
         <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
         </el-form-item>
         <el-form-item label="父级分类">
            <el-cascader
               v-model="selectedKeys"
               :options="parentCateList"
               :props="{ expandTrigger: 'hover', ...cascaderProps, checkStrictly:'true' }"
               @change="parentCateChanged" clearable></el-cascader>
         </el-form-item>
      </el-form>
      <div slot="footer">
         <el-button @click="addCateDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="$refs.editFormRef.resetFields()">
      <el-form :model="editForm" label-width="80px" status-icon :rules="editFormRules" ref="editFormRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
          <el-input v-model="editForm.cat_pid" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
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
         },
         parentCateList: [],
         cascaderProps: {
            value: 'cat_id',
            label: 'cat_name',
            children: 'children'
         },
         selectedKeys: [],
         editDialogVisible: false,
         editForm: {},
         editFormRules: {
            cat_name: [{required: true, message:'请输入商品分类名称', trigger: 'blur'}]
         },
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
         this.getParentCateList()
         this.addCateDialogVisible = true
      },
      async getParentCateList(){
         const {data:res} = await this.$http.get('categories',{
            params: {type:2}
         })
         if(res.meta.status !== 200){
            return this.$message.error('获取父级分类数据失败！')
         }
         this.parentCateList = res.data
      },
      parentCateChanged(){
         if(this.selectedKeys.length>0){
            this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
            this.addCateForm.cat_level = this.selectedKeys.length
            return
         }else{
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
         }
      },
      addCateDialogClosed(){
         this.$refs.addCateFormRef.resetFields()
         this.selectedKeys = []
         this.addCateForm.cat_pid = 0
         this.addCateForm.cat_level = 0
      },
      addCate(){
         this.$refs.addCateFormRef.validate(async valid => {
            if(!valid) return
            const {data:res} = await this.$http.post('categories',this.addCateForm)
            if(res.meta.status !== 201){
               return this.$message.error('添加分类失败！')
            }
            this.$message.success('添加分类成功！')
            this.getCateList()
            this.addCateDialogVisible = false
         })
      },
      removeCateById(id){
         this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
         }).then(async () => {
            const {data:res} = await this.$http.delete('categories/'+id)
            if(res.meta.status !== 200){
               return this.$message.error('删除分类失败！')
            }
            this.getCateList()
            this.$message({
               type: 'success',
               message: '删除成功!'
            });
         }).catch(() => {
            this.$message({
               type: 'info',
               message: '已取消删除'
            });          
         });
      },
      async showEditDialog(id){
         const {data:res} = await this.$http.get('categories/'+id)
         if(res.meta.status !== 200){
            return this.$message.error('获取商品分类失败！')
         }
         this.editForm = res.data
         this.editDialogVisible = true
         this.$message.success('获取商品分类成功！')
      },
      editCate(){
         this.$refs.editFormRef.validate(async valid => {
            if(!valid) return
            const {data:res} = await this.$http.put('categories/'+this.editForm.cat_id,{
               cat_name: this.editForm.cat_name 
            })
            if(res.meta.status !== 200){
               return this.$message.error('更新商品分类失败！')
            }
            this.$message.success('更新商品分类成功！')
            this.editDialogVisible = false
            this.getCateList()
         })
      },
   }
}
</script>

<style lang="less" scoped>
.treeTable{
   margin-top: 15px;
}

.el-cascader{
   width: 100%;
}
</style>