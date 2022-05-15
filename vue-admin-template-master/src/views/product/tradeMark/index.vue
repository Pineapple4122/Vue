<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px" @click="showDialog">添加</el-button>
    <!-- 
      表格组件
      data:表格组件将来需要展示的数据---数组类型
      border：是给表格添加边框
      label：显示标题
      width：对应列的宽度
      align：标题的对齐方式
     -->
     <el-table style="width: 100%" border :data="list">
       <el-table-column type="index" label="序号" width="80px" align="center">
       </el-table-column>
       <el-table-column prop="tmName" label="品牌名称" width="width">
       </el-table-column>
       <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
         <!-- row是table表格list遍历中的每一行数据，{}是解构
         通过Scoped slot可以获取到row,column,$index和store（table内部的状态管理）的数据 -->
         <template slot-scope="{row,$index}">
           <img :src="row.logoUrl" style="width:100px;height:100px">
         </template>
       </el-table-column>
       <el-table-column prop="prop" label="操作" width="width">
         <template slot-scope="{row,$index}">
           <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
           <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
         </template>
       </el-table-column>
     </el-table>
     <!-- 分页器
      @size-change="handleSizeChange"：pageSize改变时会触发，回调参数-点击的page-size
      @current-change="handleCurrentChange"：currentPage改变时会触发，回调参数-点击的页数
      page-size:代表的是每一页展示多少条数据
      page-sizes：代表可以设置的page-size
      layout：可以实现分页器布局
      pager-count：按钮的数量 如果是9 则连续页码为7（减去开头和结尾的）
      -->
     <el-pagination style="margin-top:20px;textAlign:center"
       :current-page="page"
       :page-sizes="[3, 5, 10]"
       :page-size="limit"
       :pager-count="7"
       layout="prev, pager, next, jumper, ->, sizes, total"
       :total="total"
       @current-change="getPageList"
       @size-change="handleSizeChange">
     </el-pagination>
     <!-- 对话框
     :visible.sync：控制对话框显示与隐藏
     :visible.sync="dialogFormVisible" 等价于 
     :visible="dialogFormVisible" @update:visible="dialogFormVisible=$event"
     父组件通过绑定属性的方式向子组件传值，而在子组件中可以通过$emit向父组件通信，
     通过这种间接的方式改变父组件的data，从而实现子组件改变props的值 -->
     <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
       <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
       并将 Form-Item 的 prop 属性设置为需校验的字段名即可。 -->
      <el-form style="width:80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'tradeMark',
  data() {
    // 自定义校验规则
    var validateTmName = (rule,value,callback) => {
      if(value.length < 2 || value.length > 10){
        callback(new Error("品牌名称2-10位"))
      }else{
        callback()
      }
    };
    return {
      page: 1, //代表分页器第几页
      limit: 3, //当前页数展示数据条数
      total: 0, // 总共数据条数
      list: [], // 列表展示的数据
      dialogFormVisible: false, // 对话框显示与隐藏控制的属性
      imageUrl: '',
      tmForm: { // 弹出框品牌表单
        tmName: '',
        logoUrl: '',
      },
      rules: { // 验证规则
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { validator: validateTmName, trigger: 'change' } //自定义校验规则
        ],
        logoUrl: [
          { required: true, message: '请选择品牌的图片'}
        ],
      },

    }
  },

  // 组件挂载完毕发请求
  mounted() {
    this.getPageList()
  },

  methods: {
    // 获取品牌列表数据
    async getPageList(pager = 1){
      this.page = pager
      const {page,limit} = this
      let result = await this.$API.trademark.reqTradeMarkList(page,limit)
      if(result.code === 200){
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    // 当分页器某一页需要展示数据条数发生变化的时候会触发
    handleSizeChange(limit){
      this.limit = limit
      this.getPageList()
    },
    showDialog(){
      this.dialogFormVisible = true // 显示对话框
      // 结束对话框时进行清除
      this.tmForm = {tmName:'',logoUrl:''}
    },
    updateTradeMark(row){
      this.dialogFormVisible = true // 显示对话框
      // 这里要用深拷贝，这样点取消按钮的时候，tmForm的值不会影响到row
      // row中的值都是基本数据类型，所以...row是深拷贝
      this.tmForm = {...row}
    },
    // 品牌logo图片上传成功
    handleAvatarSuccess(res, file) {
      // res.data里面是服务器返回的logo图片地址
      this.tmForm.logoUrl = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 弹出框确定按钮点击事件
    addOrUpdateTradeMark(){
      // 表单规则验证，验证后执行回调，成功返回true作为参数
      this.$refs.ruleForm.validate(async (success)=>{
        if(success){
          this.dialogFormVisible = false
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if(result.code === 200){
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改品牌成功':'添加品牌成功'
            })
            this.getPageList(this.tmForm.id?this.page:1)
          }
        }else{
          console.log('error submit!!');
          return false;
        }
      })
    },
    deleteTradeMark(row){
      // 删除确认弹窗
      this.$confirm(`你确定删除${row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        //点击确定按钮触发
        let result = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if(result.code === 200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getPageList(this.list.length>1 ? this.page:this.page-1)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  },
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>