<template>
  <div>
    <h1>{{ id ? "编辑" : "新建" }}管理员</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="用户名">
        <el-input v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="model.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {},
    };
  },

  props: ["id"], //路由中props传来的

  methods: {
    //保存数据
    async save() {
      let res;
      if (this.id) {
        //根据ID修改
        res = await this.$http.put(`/rest/admin_users/${this.id}`, this.model);
      } else {
        //新增
        res = await this.$http.post("/rest/admin_users", this.model);
      }
      this.$router.push("/admin_users/list");
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    //通过ID获取数据
    async fetch() {
      const res = await this.$http.get(`/rest/admin_users/${this.id}`);
      this.model = res.data;
    },
  },

  created() {
    this.id && this.fetch();
  },
};
</script>

<style>
</style>