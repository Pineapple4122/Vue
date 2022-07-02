<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>商品管理</el-breadcrumb-item>
         <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
         <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
         </el-alert>
         <el-steps :active="1" finish-status="success" :space="200">
            <el-step title="已完成"></el-step>
            <el-step title="进行中"></el-step>
            <el-step title="步骤 3"></el-step>
         </el-steps>
      </el-card>
  </div>
</template>

<script>
export default {
   name: 'Add',
}
</script>

<style>

</style>