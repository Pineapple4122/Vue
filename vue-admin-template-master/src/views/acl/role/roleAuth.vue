<template>
  <div>
     <el-input disabled></el-input>
     <el-tree
      style="margin:20px 0"
      :data="data"
      show-checkbox
      node-key="id"
      :default-expanded-keys="[2, 3]"
      :default-checked-keys="[5]"
      :props="defaultProps">
     </el-tree>
     <el-button type="primary" :loading="loading">保存</el-button>
     <el-button>取消</el-button>
  </div>
</template>

<script>
export default {
   name: 'roleAuth',
}
</script>

<style>

</style>