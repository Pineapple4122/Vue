<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="tempSearchObj.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
      <el-button @click="resetSearch">清空</el-button>
    </el-form>
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="showAddUser">添 加</el-button>
      <el-button type="danger" :disabled="selectedIds.length===0" @click="removeUsers">批量删除</el-button>
    </div>
    <el-table :data="users" style="width: 100%" v-loading="listLoading" border stripe @selection-change="handleSelectionChange">
       <el-table-column type="selection" width="55">
       </el-table-column>
       <el-table-column type="index" label="序号" width="80" align="center">
       </el-table-column>
       <el-table-column prop="username" label="用户名" width="150">
       </el-table-column>
       <el-table-column prop="nickName" label="用户昵称" width="width">
       </el-table-column>
       <el-table-column prop="roleName" label="权限列表" width="width">
       </el-table-column>
       <el-table-column prop="gmtCreate" label="创建时间" width="180">
       </el-table-column>
       <el-table-column prop="gmtModified" label="更新时间" width="180">
       </el-table-column>
       <el-table-column label="操作" width="230" align="center">
          <template slot-scope="{row}">
             <HintButton type="info" icon="el-icon-solide" size="mini" title="分配角色" @click="showAssignRole(row)"></HintButton>
             <HintButton type="primary" icon="el-icon-edit" size="mini" title="修改用户" @click="showUpdateUser(row)"></HintButton>
             <el-popconfirm :title="`确定删除${row.username}吗？`" @onConfirm="removeUser(row.id)">
                <HintButton slot="reference" type="danger" size="mini" icon="el-icon-delete" title="删除用户" style="margin-left:10px">删除</HintButton>
            </el-popconfirm>
          </template>
       </el-table-column>
    </el-table>
    <el-pagination
       @size-change="handleSizeChange"
       @current-change="getUsers"
       :current-page="page"
       :page-sizes="[3, 10, 20, 30, 40, 50, 100]"
       :page-size="limit"
       layout="prev, pager, next, jumper, ->, total, sizes"
       :total="total"
       style="padding:20px 0">
    </el-pagination>

    <el-dialog :title="user.id ? '修改用户':'添加用户'" :visible.sync="dialogUserVisible">
       <el-form :model="user" label-width="120px" :rules="userRules" ref="userForm">
          <el-form-item label="用户名" prop="username">
             <el-input v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称">
             <el-input v-model="user.nickName"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" v-if="!user.id" prop="password">
             <el-input v-model="user.password"></el-input>
          </el-form-item>
       </el-form>
       <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="addOrUpdate">确 定</el-button>
       </div>
    </el-dialog>

    <el-dialog title="设置角色" :visible.sync="dialogRoleVisible" :before-close="resetRoleData">
       <el-form label-width="80px">
          <el-form-item label="用户名">
             <el-input v-model="user.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色列表">
             <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
             <div style="margin: 15px 0;"></div>
             <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
               <el-checkbox v-for="role in allRoles" :label="role.id" :key="role.id">{{role.roleName}}</el-checkbox>
             </el-checkbox-group>
          </el-form-item>
       </el-form>
       <div slot="footer">
          <el-button type="primary" @click="assignRole" :loading="loading">保存</el-button>
          <el-button @click="resetRoleData">取消</el-button>
       </div>
    </el-dialog>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: "AclUserList",
  data() {
     return {
         listLoading: false, // 是否显示列表加载的提示
         searchObj: { // 包含请求搜索条件数据的对象
         username: ''
         },
         tempSearchObj: { // 收集搜索条件输入的对象
         username: ''
         },
         selectedIds: [], // 所有选择的user的id的数组
         users: [], // 当前页的用户列表
         page: 1, // 当前页码
         limit: 3, // 每页数量
         total: 0, // 总数量
         user: {}, // 当前要操作的user
         dialogUserVisible: false, // 是否显示用户添加/修改的dialog
         userRules: { // 用户添加/修改表单的校验规则
         username: [
            { required: true, message: '用户名必须输入' },
            { min: 4, message: '用户名不能小于4位' }
         ],
         password: [
            { required: true, validator: this.validatePassword }
         ]
         },
         loading: false, // 是否正在提交请求中
         dialogRoleVisible: false, // 是否显示角色Dialog
         allRoles: [], // 所有角色列表
         userRoleIds: [], // 用户的角色ID的列表
         isIndeterminate: false, // 是否是不确定的
         checkAll: false, // 是否全选
     }
  },
  created() {
     this.getUsers()
  },

  methods: {
     //获取用户列表数据
     async getUsers(page=1){
        this.page = page
        const {limit,searchObj} = this
        this.listLoading = true
        let result = await this.$API.user.getPageList(page,limit,searchObj)
        this.listLoading = false
        const {items,total} = result.data
        this.users = items.filter(item => item.username!=='admin')
        this.total = total -1 
        this.selectedIds = []
     },
     //点击分配角色按钮的回调
     showAssignRole(user){
        this.user = user
        this.dialogUserVisible = true
        this.getRoles()
     },
     //获取用户的角色列表
     async getRoles(){
         let result = await this.$API.user.getRoles(this.user.id)
         const {allRolesList, assignRoles} = result.data
         this.allRoles = allRolesList
         this.userRoleIds = assignRoles.map(item => item=item.id)
         this.checkAll = allRolesList.length === assignRoles.length
         this.isIndeterminate = assignRoles.length>0 && assignRoles.length<allRolesList.length
     },
     //查询按钮点击事件
     search(){
        this.searchObj = {...tempSearchObj}
        this.getUsers()
     },
     //点击清空按钮的回调
     resetSearch(){
        this.searchObj = {
           username: ''
        }
        this.tempSearchObj = {
           username: ''
        }
        this.getUsers()
     },
     //表格第一列选择框的回调
     handleSelectionChange(selection){
        this.selectedIds = selection.map(item => item.id)
     },
     //添加按钮的回调
     showAddUser(){
        this.user = {}
        this.dialogUserVisible = true
        this.$nextTick(() => this.$refs.userForm.clearValidate())
     },
     //批量删除按钮的回调
     removeUsers(){
        this.$confirm('确认删除吗？').then(async () => {
           await this.$API.user.removeUsers(this.selectedIds)
           this.$message.success('删除成功')
           this.getUsers()
        }).catch(() => {
           this.$message.info('取消删除')
        })
     },
     //修改用户按钮点击的回调
     showUpdateUser(user){
        this.dialogUserVisible = true
        this.user = cloneDeep(user)
     },
     //删除单个用户按钮的点击事件
     async removeUser(id){
        await this.$API.user.removeById(id)
        this.$message.success('删除成功')
        this.getUsers(this.users.length===1 ? this.page-1:this.page)
     },
     //pagesize发生改变时的回调
     handleSizeChange(pageSize){
        this.limit = pageSize
        this.getUsers()
     },
     //用户对话框取消按钮
     cancel(){
        this.user = {}
        this.dialogUserVisible = false
     },
     //用户对话框保存按钮
     addOrUpdate(){
        this.$refs.userForm.validate(valid => {
           if(valid){
              const {user} = this
              this.loading = true
              this.$API.user[user.id ? 'update':'add'](user).then(result => {
                 this.loading = false
                 this.$message.success('保存成功')
                 this.getUsers(user.id ? this.page:1)
                 this.dialogUserVisible = false
                 this.user = {}
              })
           }
        })
     },
     //角色对话框取消按钮
     resetRoleData(){
        this.dialogRoleVisible = false
        this.allRoles = []
        this.checkAll = false
        this.isIndeterminate = false
        this.userRoleIds = []
     },
     //角色对话框保存按钮
     async assignRole(){
        const userId = this.user.id
        const roleIds = this.userRoleIds.join(',')
        this.loading = true
        const result = await this.$API.user.assignRoles(userId,roleIds)
        this.loading = false
        this.$message.success(result.message || '分配角色成功')
        this.resetRoleData()

        if(this.$store.getters.name === this.user.username){
           window.location.reload()
        }
     },
     //密码校验规则
     validatePassword(rule, value, callback){
        if(!value){
           callback('密码必须输入')
        }else if(!value || value.length < 6){
           callback('密码不能小于6位')
        }else{
           callback()
        }
     },
     //对话框角色列表全选状态改变
     handleCheckAllChange(value){
        // 如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
        this.userRoleIds = value ? this.allRoles.map(item => item.id):[]
        this.isIndeterminate = false
     },
     //对话框角色列表选中项发生改变的监听
     handleCheckedChange(value){
        const {userRoleIds, allRoles} = this
        this.checkAll = userRoleIds.length === allRoles.length && allRoles.length>0
        this.isIndeterminate = userRoleIds.length>0 && userRoleIds.length<allRoles.length
     }
  },
};
</script>

<style>
</style>