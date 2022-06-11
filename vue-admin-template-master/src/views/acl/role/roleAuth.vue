<template>
  <div>
     <el-input disabled :value="$route.query.roleName"></el-input>
     <el-tree
      style="margin:20px 0"
      ref="tree"
      :data="allPermissions"
      show-checkbox
      node-key="id"
      default-expand-all
      :props="defaultProps">
     </el-tree>
     <el-button type="primary" :loading="loading">保存</el-button>
     <el-button>取消</el-button>
  </div>
</template>

<script>
export default {
   name: 'roleAuth',
   data() {
      return {
         loading: false, // 用来标识是否正在保存请求中的标识, 防止重复提交
         allPermissions: [], // 所有
         defaultProps: {
            children: 'children',
            label: 'name'
         },
      }
   },
   created() {
      this.init()
   },

   // 初始化
   init(){
      const roleId = this.$route.params.id
      this.getPermissions(roleId)
   },
   // 获取指定角色的权限列表
   getPermissions(roleId){
      this.$API.permission.toAssign(roleId).then(result => {
         const allPermissions = result.data.children
         this.allPermissions = allPermissions
         const checkedIds = this.getCheckedIds(allPermissions) 
         this.$refs.tree.setCheckedKeys(checkedIds)
      })
   },
   // 得到所有选中的id列表
   getCheckedIds(auths,initArr=[]){
      return auths.reduce((pre,item) => {
         if(item.select && item.level===4){
            pre.push(item.id)
         }else if(item.children){
            this.getCheckedIds(item.children,initArr)
         }
         return pre
      },initArr)
   }
}
</script>

<style>

</style>