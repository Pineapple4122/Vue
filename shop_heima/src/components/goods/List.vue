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
                  <el-button size="mini" type="primary" icon="el-icon-edit"
                   @click="editById(row.goods_id)"></el-button>
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

      <el-dialog
         title="提示"
         :visible.sync="editDialogVisible"
         width="50%"
         @close="$refs.editFormRef.resetFields()">
         <el-form :model="editForm" label-width="80px" status-icon :rules="editFormRules" ref="editFormRef">
         <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editForm.goods_name"></el-input>
         </el-form-item>
         <el-form-item label="价格" prop="goods_price">
            <el-input v-model="editForm.goods_price"></el-input>
         </el-form-item>
         <el-form-item label="数量" prop="goods_number">
            <el-input v-model="editForm.goods_number"></el-input>
         </el-form-item>
         <el-form-item label="重量" prop="goods_weight">
            <el-input v-model="editForm.goods_weight"></el-input>
         </el-form-item>
         <el-form-item label="介绍" prop="goods_introduce">
            <el-input v-model="editForm.goods_introduce"></el-input>
         </el-form-item>
         <el-form-item label="图片">
            <el-upload
               class="upload-demo"
               action="https://lianghj.top:8888/api/private/v1/upload/"
               :on-remove="handleRemove"
               list-type="picture"
               :file-list="fileList"
               :on-success="handleSuccess"
               :headers="headerObj">
               <el-button size="small" type="primary">点击上传</el-button>
               <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
         </el-form-item>
         </el-form>
         <div slot="footer">
         <el-button @click="editDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="editGoods">确 定</el-button>
         </div>
      </el-dialog>
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
         editDialogVisible: false,
         editForm: {},
         editFormRules: {
            goods_name: [{required: true, message:'请输入商品名称', trigger: 'blur'}],
            goods_price: [{required: true, message:'请输入商品价格', trigger: 'blur'}],
            goods_number: [{required: true, message:'请输入商品数量', trigger: 'blur'}],
            goods_weight: [{required: true, message:'请输入商品重量', trigger: 'blur'}],
            goods_introduce: [{required: true, message:'请输入商品介绍', trigger: 'blur'}],
         },
         fileList: [],
         headerObj: {
            Authorization: window.sessionStorage.getItem('token')
         },
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
      },
      async editById(id){
         const {data:res} = await this.$http.get(`goods/${id}`)
         if(res.meta.status !== 200){
            return this.$message.error('查询商品信息失败！')
         }
         this.editForm = res.data
         res.data.pics.forEach(item => {
            const picInfo = {
               name: item.pics_id,
               url: item.pics_sma
            }
            this.fileList.push(picInfo)
         });
         this.editDialogVisible = true
      },
      handleSuccess(response){
         const picInfo = {pic: response.data.tmp_path}
         this.editForm.push(picInfo)
      },
      handleRemove(file){
         const i = this.editForm.pics.findIndex(x => x.pics_id===file.name)
         this.editForm.pics.splice(i,1)
      },
      editGoods(){
         this.$refs.editFormRef.validate(async valid => {
            if(!valid) {
               return this.$message.error('请填写必要的表单项！')
            }
            const {data:res} = await this.$http.put('goods/'+this.editForm.goods_id,this.editForm)
            if(res.meta.status !== 200){
               return this.$message.error('编辑商品信息失败！')
            }
            this.editDialogVisible = false
            this.getGoodsList()
         })
      },
   },
}
</script>

<style>

</style>