<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe >
        <el-table-column type="expand">
        </el-table-column>
        <el-table-column type="index" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" >
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" >
        </el-table-column>
        <el-table-column label="操作" width="333px" align="center">
          <template slot-scope="{row}">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="提示"
      :visible.sync="addDialogVisible"
      width="50%"
      @closed="addDialogClosed"
      :before-close="handleClose">
      <el-form :model="addForm" label-width="80px" status-icon :rules="addFormRules" ref="addFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
     return {
        roleList: [],
        addDialogVisible: false,
        addForm: {
          roleName: '',
          roleDesc: '',
        },
        addFormRules: {
          roleName: [
            {required: true, message:'请输入角色名称', trigger: 'blur'},
            {min:2,max:8,message:'角色名称的长度在2~8个字符之间',trigger: 'blur'}
          ],
          roleDesc: [
            {required: true, message:'请输入角色描述', trigger: 'blur'}
          ],
        },
     }
  },
  created() {
     this.getRolesList()
  },

  methods: {
    async getRolesList(){
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !== 200){
        return this.$message.error('获取用户列表失败！')
      }
      this.roleList = res.data
      this.$message.success('获取用户列表成功！')
    },
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    addRole(){
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return
        const {data:res} = await this.$http.post('roles',this.addForm)
        if(res.meta.status !== 201){
          return this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功！')
        this.addDialogVisible = false
        this.getRolesList()
      })
    },
    handleClose(done){
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {})
    }
  },
};
</script>

<style>
</style>