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
      <el-aside :width="isCollapse ? '64px':'200px'">
         <div class="toggle-button" @click="toggleCollapse">|||</div>
         <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff"
          unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
               <template slot="title">
                  <i :class="iconsObj[item.id]"></i>
                  <span>{{item.authName}}</span>
               </template>
               <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                  <template slot="title">
                     <i class="el-icon-menu"></i>
                     <span>{{subItem.authName}}</span>
                  </template>
               </el-menu-item>
            </el-submenu>
         </el-menu>
      </el-aside>
      <el-main>
         <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
       menuList: [], // 左侧菜单数据
       iconsObj: {
          '125': 'iconfont icon-users',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao',
       },
       isCollapse: false, // 左侧菜单折叠
       activePath: '', // 被激活的链接地址
    };
  },
  created() {
     this.getMenuList()
     this.activePath = window.sessionStorage.getItem('activePath')
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
    },
    // 左侧菜单折叠控制按钮
    toggleCollapse(){
       this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath){
       window.sessionStorage.setItem('activePath',activePath)
       this.activePath = activePath
    },
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
.toggle-button {
   background-color: #4a5064;
   font-size: 10px;
   line-height: 24px;
   text-align: center;
   color: #fff;
   letter-spacing: 0.2em;
   cursor: pointer;
}
</style>