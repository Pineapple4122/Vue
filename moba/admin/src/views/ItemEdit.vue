<template>
  <div>
    <h1>{{ id ? "编辑" : "新建" }}物品</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="图标">
        <!-- action上传的地址 -->
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'" 
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <img v-if="model.icon" :src="model.icon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
    //上传图片
    afterUpload(res){
      //this.model.icon = res.url  有时普通添加属性不一定可以
      this.$set(this.model,'icon',res.url)
    },
    //保存数据
    async save() {
      let res;
      if (this.id) {
        //根据ID修改
        res = await this.$http.put(`/rest/items/${this.id}`, this.model);
      } else {
        //新增
        res = await this.$http.post("/rest/items", this.model);
      }
      this.$router.push("/items/list");
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    //通过ID获取数据
    async fetch() {
      const res = await this.$http.get(`/rest/items/${this.id}`);
      this.model = res.data;
    },
  },

  created() {
    this.id && fetch();
  },
};
</script>

<style>

</style>