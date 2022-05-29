<template>
  <div>
     <el-form :inline="true">
        <el-form-item>
           <el-input v-model="tempSearchObj.roleName" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        <el-button @click="resetSearch">清空</el-button>
     </el-form>
     <div style="margin-bottom:20px">
        <el-button type="primary" @click="addRole">添加</el-button>
        <el-button type="danger" @click="removeRoles" :disabled="selectedRoles.length===0">批量删除</el-button>
     </div>
     <el-table :data="roles" style="width:960px" v-loading="listLoading" border stripe
     @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="角色名称" width="width">
           <template slot-scope="{row}">
              <template v-if="row.edit">
                 <el-input v-model="row.roleName" size="small" class="edit-input"></el-input>
                 <el-button type="warning" size="small" icon="el-icon-refresh" class="cancel-btn"
                 @click="cancelEdit(row)">取消</el-button>
              </template>
              <span v-else>{{row.roleName}}</span>
           </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="300" align="center">
           <template slot-scope="{row}">
              <HintButton size="mini" type="info" icon="el-icon-info" title="分配权限"
              @click="$router.push(`/acl/role/auth/${row.id}?roleName=${row.roleName}`)"></HintButton>
              <HintButton size="mini" type="primary" icon="el-icon-check" title="确定" v-if="row.edit"
              @click="updateRole(row)"></HintButton>
              <HintButton size="mini" type="primary" icon="el-icon-edit" title="修改角色" v-if="!row.edit"
              @click="row.edit=true"></HintButton>
              <HintButton size="mini" type="danger" icon="el-icon-delete" title="删除角色"
              @click="removeRole(row)"></HintButton>
           </template>
        </el-table-column>
     </el-table>
     <el-pagination
        @size-change="handleSizeChange"
        @current-change="getRoles"
        :current-page="page"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        :page-size="limit"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        style="padding:20px 0">
     </el-pagination>
  </div>
</template>

<script>
export default {
   name: 'RoleList',
   data() {
      return {
         listLoading: true, // 数据是否正在加载
         roles: [], // 角色列表
         total: 0, // 总记录数
         page: 1, // 当前页码
         limit: 5, // 每页记录数
         tempSearchObj: { // 收集搜索条件数据
         roleName: '',
         },
         searchObj: { // 发送请求的条件参数数据
         roleName: '',
         },
         selectedRoles: [] // 所有选中的角色列表
      }
   },
   mounted() {
      this.getRoles()
   },

   methods: {
      // 异步获取角色分页列表
      getRoles(page=1){
         this.page = page
         this.listLoading = true
         const {limit,searchObj} = this
         this.$API.role.getPageList(page,limit,searchObj).then(result => {
            const {total,items} = result.data
            this.roles = items.map(item => {
               item.edit = false // 用于标识是否显示编辑输入框的属性
               item.originRoleName = item.roleName // 缓存角色名称, 用于取消
               return item
            })
            this.total = total
         }).finally(() => {
            this.listLoading = false
         })
      },
      // 根据搜索条件进行搜索
      search(){
         this.searchObj = {...this.tempSearchObj}
         this.getRoles()
      },
      // 重置查询表单搜索列表
      resetSearch(){
         this.searchObj = {
            roleName: ''
         }
         this.tempSearchObj = {
            roleName: ''
         }
         this.getRoles()
      },
      // 添加角色
      addRole(){
         // 显示添加界面
         this.$prompt('请输入新名称','添加角色',{
            confirmButtonText: '确定',
            cancelButtonText: '取消'
         }).then(({value}) => {
            this.$API.role.save({roleName:value}).then(result => {
               this.$message.success(result.message || '添加角色成功')
               this.getRoles()
            })
         }).catch(() => {
            this.$message.warning('取消添加')
         })
      },
      // 批量删除
      removeRoles(){
         this.$confirm('此操作将永久删除该记录, 是否继续?','提示',{
            type: 'warning'
         }).then(async () => {
            const ids = this.selectedRoles.map(role => role.id)
            const result = await this.$API.role.removeRoles(ids)
            this.getRoles()
            this.$message({
               type: 'success',
               message: '批量删除成功!'
            }).then(result => {}).catch(() => {
               this.$message({
                  type: 'info',
                  message: '已取消删除'
               })
            })
         })
      },
      // 当表格复选框选项发生变化的时候触发
      handleSelectionChange(selection){
         this.selectedRoles = selection
      },
      // 取消修改
      cancelEdit(role){
         role.roleName = role.originRoleName
         role.edit = false
         this.$message.warning('取消角色修改')
      },
      // 更新角色
      updateRole(role){
         this.$API.role.updateById({id:role.id,roleName:role.roleName}).then(result => {
            this.$message.success(result.message || '更新角色成功!')
            this.getRoles(this.page)
         })
      },
      // 删除指定的角色
      removeRoles({id,roleName}){
         this.$confirm(`确定删除 '${roleName}' 吗？`,'提示',{
            type: 'warning'
         }).then(async () => {
            const result = await this.$API.role.removeById(id)
            this.getRoles(this.roles.length===1 ? this.page-1:this.page)
            this.$message.success(result.message || '删除成功!')
         }).catch(() => {
            this.$message.info('已取消删除')
         })
      },
      // 每页数量发生改变的监听
      handleSizeChange(pageSize){
         this.limit = pageSize
         this.getRoles()
      }
   },
}
</script>

<style>
.edit-input{
   padding-right: 100px;
}
.cancel-btn{
   position: absolute;
   right: 15px;
   top: 10px;
}
</style>