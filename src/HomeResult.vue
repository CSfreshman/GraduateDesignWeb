<template>
  <div class="home">
    <!--    头部信息-->
    <Header></Header>
    <el-container class="content">
      <!--      导航栏-->
      <Menu></Menu>
      <el-main>
        <!--          主体部分上部小导航栏-->
        <el-card>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index">{{ item.name }}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="cont">
          <!--          这里要把路由放开实现页面转换-->
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>

  </div>
</template>

<script>
import Menu from "@/components/common/Menu";
import Header from "@/components/common/Header";
export default {
  name: "HomeResult",
  components: {
    Header,
    Menu
  },
  data(){
    return {

    }
  }
}
</script>

<style lang="scss">
.home{
  .content{
    height: 600px;
  }
  .cont{
    margin: 20px;
  }
}
</style>
