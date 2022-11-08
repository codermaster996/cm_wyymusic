<template>
  <div class="mydiscover">
    <div class="headerdiscover">
      <el-menu
        :default-active="$route.path"
        mode="horizontal"
        text-color="balck"
        class="el-menu-demo"
        router
      >
        <el-menu-item index="/index/discover/recommend">个性推荐</el-menu-item>
        <el-menu-item index="/index/discover/songsheet"> 歌单 </el-menu-item>
        <el-menu-item index="/index/discover/ranking"> 排行榜 </el-menu-item>
        <el-menu-item> 歌手 </el-menu-item>
        <!-- <el-menu-item index="/index/discover/singer"> 歌手 </el-menu-item> -->

      </el-menu>
    </div>

    <router-view class="discover"></router-view>
  </div>
</template>

<style scoped>
@import "./Discover.css";
.mydiscover{
  background-color: #fff;
}
.el-menu.el-menu--horizontal {
  border: none !important;
}
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 4px solid #ec4141;
  color: #303133;
  font-size: 18px;
  font-weight: bold;
}

.el-menu--horizontal > .el-menu-item {
  color: black;
}

.discover {
  margin: auto;
  overflow: scroll;
  padding: 0 15px;
  padding-bottom: 30px;
}

.el-menu-demo {
  position: fixed;
  z-index: 1000;
  width: 100%;
}
</style>
