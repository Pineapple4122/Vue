<template>
  <div>
    <h1>{{ id ? "编辑" : "新建" }}文章</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="所属分类">
        <el-select v-model="model.categories">
          <el-option
            v-for="item in categories"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="详情">
        <vue-editor
          v-model="model.body"
          useCustomImageHandler
          @image-added="handleImageAdded"
        ></vue-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//引入富文本框
import { VueEditor } from "vue2-editor";

export default {
  data() {
    return {
      model: {},
      categories: [],
    };
  },

  props: ["id"], //路由中props传来的

  components: { VueEditor },

  methods: {
    //保存数据
    async save() {
      let res;
      if (this.id) {
        //根据ID修改
        res = await this.$http.put(`/rest/articles/${this.id}`, this.model);
      } else {
        //新增
        res = await this.$http.post("/rest/articles", this.model);
      }
      this.$router.push("/articles/list");
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    //通过ID获取数据
    async fetch() {
      const res = await this.$http.get(`/rest/articles/${this.id}`);
      this.model = res.data;
    },
    //获取上级分类
    async fetchCategories() {
      const res = await this.$http.get(`/rest/categories`);
      this.categories = res.data;
    },
    //富文本框中上传图片
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await this.$http.post('/upload',formData)
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();
    },
  },

  created() {
    this.fetchCategories();
    this.id && this.fetch();
  },
};
</script>

<style>
</style>