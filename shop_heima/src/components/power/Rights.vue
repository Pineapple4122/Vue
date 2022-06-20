<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe >
        <el-table-column type="index" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称" >
        </el-table-column>
        <el-table-column prop="path" label="路径" >
        </el-table-column>
        <el-table-column prop="level" label="等级" >
          <template slot-scope="{row}">
            <el-tag v-if="row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
     return {
        rightsList: [],
     }
  },
  created() {
     this.getRightsList()
  },

  methods: {
    async getRightsList(){
      const {data:res} = await this.$http.get('rights/list')
      if(res.meta.status !== 200){
        return this.$message.error('获取权限列表失败！')
      }
      this.rightsList = res.data
      this.$message.success('获取权限列表成功！')
    }
  },
};
</script>

<style>
</style>