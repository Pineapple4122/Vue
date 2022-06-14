<template>
  <el-container class="home-container">
    <el-header>
       <div>
          <img src="../assets/heima.png">
          <span>电商后台管理系统</span>
       </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
         <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" unique-opened>
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
               <template slot="title">
                  <i :class="iconsObj[item.id]"></i>
                  <span>{{item.authName}}</span>
               </template>
               <el-menu-item :index="subItem.id+''" v-for="subItem in item.children" :key="subItem.id">
                  <template slot="title">
                     <i class="el-icon-menu"></i>
                     <span>{{subItem.authName}}</span>
                  </template>
               </el-menu-item>
            </el-submenu>
         </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
       menuList: {}, // 左侧菜单数据
       iconsObj: {
          '125': 'iconfont icon-users',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao',
       }
    };
  },
  created() {
     this.getMenuList()
  },

  methods: {
    // 退出按钮
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取左侧菜单数据
    async getMenuList(){
       const {data:res} = await this.$http.get('menus')
       if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
       this.menuList = res.data
    }
  },
};
</script>

<style scoped lang="less">
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  div{
     display: flex;
     align-items: center;
     span{
        margin-left: 15px;
     }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
     border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
   margin-right: 10px;
}
</style>