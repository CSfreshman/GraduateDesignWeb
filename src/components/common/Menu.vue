<template>
  <div class="menu">
    <el-aside width="200px">
      <el-menu
          router
          default-active="2"
          class="el-menu"
          background-color="#2578b5"
          text-color="#F2F6FC"
          active-text-color="#606266"
          >
        <el-menu-item index="/home">
          <span>个人信息</span>
        </el-menu-item>
<!--        通过遍历来动态的添加侧边栏界面-->
        <template v-for="(item, index) in menus">
          <el-submenu :index="index + ''" :key='index' v-if="!item.hidden">
            <template slot="title">
              <i :class="item.iconClass"></i>
              <span>{{item.name}}</span>
            </template>

            <el-menu-item-group v-for="(child, index) in item.children" :key='index'>
              <el-menu-item :index="child.path">
                <i :class="child.iconClass"></i>
                {{child.name}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

        </template>
        <el-menu-item index="/selectedTopic">
          <span>选题情况</span>
        </el-menu-item>
        <el-menu-item index="/score">
            <span>成绩管理</span>
        </el-menu-item>
        <el-menu-item index="/midcheck">
          <span>中期检查</span>
        </el-menu-item>
        <el-menu-item index="/defense">
          <span>答辩情况</span>
        </el-menu-item>


      </el-menu>
    </el-aside>
  </div>
</template>

<script>
export default {
  name: "Menu",
  data () {
    return {
      menus: []
    }
  },
  methods: {

  },
  created() {
    console.log(this.$router.options.routes)
    this.menus = this.$router.options.routes
  }
}
</script>

<style lang="scss">
.menu {
  .el-aside {
    padding-top: 0;
    height: 100%;
    .el-menu {
      height: 100%;
    }
    .el-submenu .el-menu-item {
      min-width: 0;
    }
  }
}
</style>
