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
             :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
            <el-table :data="manyTableData" border stripe >
               <el-table-column type="expand">
                  <template slot-scope="{row}">
                     <el-tag closable v-for="(value,i) in row.attr_vals" :key="i"
                      @close="removeTag(i,row)">{{value}}</el-tag>
                     <el-input
                        class="input-new-tag"
                        v-if="row.inputVisible"
                        v-model="row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(row)"
                        @blur="handleInputConfirm(row)"
                        >
                     </el-input>
                     <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
                  </template>
               </el-table-column>
               <el-table-column type="index" label="序号" align="center">
               </el-table-column>
               <el-table-column prop="attr_name" label="属性名称" align="center">
               </el-table-column>
               <el-table-column label="操作" >
                  <template v-slot="{row}">
                     <el-button type="primary" size="mini" icon="el-icon-edit"
                      @click="showEditDialog(row.attr_id)">编辑</el-button>
                     <el-button type="danger" size="mini" icon="el-icon-delete"
                      @click="removeParams(row.attr_id)">删除</el-button>
                  </template>
               </el-table-column>
             </el-table>
         </el-tab-pane>
         <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini"
             :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
            <el-table :data="onlyTableData" border stripe >
               <el-table-column type="expand">
                  <template slot-scope="{row}">
                     <el-tag closable v-for="(value,i) in row.attr_vals" :key="i"
                      @close="removeTag(i,row)">{{value}}</el-tag>
                     <el-input
                        class="input-new-tag"
                        v-if="row.inputVisible"
                        v-model="row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(row)"
                        @blur="handleInputConfirm(row)"
                        >
                     </el-input>
                     <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
                  </template>
               </el-table-column>
               <el-table-column type="index" label="序号" align="center">
               </el-table-column>
               <el-table-column prop="attr_name" label="属性名称" align="center">
               </el-table-column>
               <el-table-column label="操作" >
                  <template v-slot="{row}">
                     <el-button type="primary" size="mini" icon="el-icon-edit"
                      @click="showEditDialog(row.attr_id)">编辑</el-button>
                     <el-button type="danger" size="mini" icon="el-icon-delete"
                      @click="removeParams(row.attr_id)">删除</el-button>
                  </template>
               </el-table-column>
             </el-table>
         </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <el-form ref="addFormRef" :model="addForm" label-width="100px"
       :rules="addFromRules">
         <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
         </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button @click="addDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <el-form ref="editFormRef" :model="editForm" label-width="100px"
       :rules="editFormRules">
         <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
         </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button @click="editDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
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
         manyTableData: [],
         onlyTableData: [],
         addDialogVisible: false,
         addForm: {
            attr_name: ''
         },
         addFromRules: {
            attr_name: [{required: true, message:'请输入属性名称', trigger: 'blur'}]
         },
         editForm: {},
         editFormRules: {
            attr_name: [{required: true, message:'请输入属性名称', trigger: 'blur'}]
         },
         editDialogVisible: false,
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
      titleText(){
         if(this.activeName === 'many'){
            return '动态参数'
         }
         return '静态属性'
      }
   },
   methods: {
      async getCateList(){
         const {data:res} = await this.$http.get('categories')
         if(res.meta.status !== 200){
            return this.$message.error('获取商品分类列表失败！')
         }
         this.cateList = res.data
      },
      handleChange(){
         this.getParamsData()
      },
      handleTabClick(){
         this.getParamsData()
      },
      async getParamsData(){
         if(this.selectedCateKeys.length !== 3){
            this.selectedCateKeys = []
            return
         }
         const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
            params: {sel: this.activeName}
         })
         if(res.meta.status !== 200){
            return this.$message.error('获取参数列表失败！')
         }
         res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
            this.$set(item,'inputVisible',false)
            this.$set(item,'inputValue','')
         });
         if(this.activeName === 'many'){
            this.manyTableData = res.data
         }else{
            this.onlyTableData = res.data
         }
      },
      addDialogClosed(){
         this.$refs.addFormRef.resetFields()
      },
      addParams(){
         this.$refs.addFormRef.validate(async valid => {
            if(!valid) return
            const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
               attr_name: this.addForm.attr_name,
               attr_sel: this.activeName
            })
            if(res.meta.status !== 201){
               this.$message.error(`添加${this.titleText}失败！`)
            }
            this.getParamsData()
            this.addDialogVisible = false
         })
      },
      async showEditDialog(id){
         const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{
            params: {attr_sel: this.activeName}
         })
         if(res.meta.status !== 200){
            return this.$message.error('获取参数信息失败！')
         }
         this.editForm = res.data
         this.editDialogVisible = true
      },
      editDialogClosed(){
         this.$refs.editFormRef.resetFields()
      },
      editParams(){
         this.$refs.editFormRef.validate(async valid => {
            if(!valid) return
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
               attr_name: this.editForm.attr_name,
               attr_sel: this.activeName
            })
            if(res.meta.status !== 200){
               return this.$message.error('修改参数失败！')
            }
            this.getParamsData()
            this.editDialogVisible = false
            this.$message.success('修改参数成功！')
         })
      },
      async removeParams(attr_id){
         const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
         }).catch(err => err)
         if(confirmResult !== 'confirm'){
            return this.$message.info('已取消删除！')
         }
         const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
         if(res.meta.status !== 200){
            return this.$message.error('删除参数失败！')
         }
         this.getParamsData()
      },
      showInput(row){
         row.inputVisible = true
         this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus()
         })
      },
      async handleInputConfirm(row){
         if(row.inputValue.trim().length === 0){
            row.inputValue = ''
            row.inputVisible = false
            return
         }
         row.attr_vals.push(row.inputValue.trim())
         row.inputVisible = false
         row.inputValue = ''
         this.saveAttrVals(row)
      },
      async saveAttrVals(row){
         const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(',')
         })
         if(res.meta.status !== 200){
            return this.$message.error('添加参数失败！')
         }
      },
      removeTag(i,row){
         row.attr_vals.splice(i,1)
         this.saveAttrVals(row)
      },
   },
}
</script>

<style scoped lang="less">
.cat_opt{
   margin: 15px 0;
}

.el-tag{
   margin: 10px;
}

.button-new-tag {
   margin-left: 10px;
   height: 32px;
   line-height: 30px;
   padding-top: 0;
   padding-bottom: 0;
}
.input-new-tag {
   width: 90px;
   margin-left: 10px;
   // vertical-align: bottom;
}
</style>