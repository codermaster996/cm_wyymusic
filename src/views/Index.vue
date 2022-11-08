<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <header-bar></header-bar>
    </el-header>
    <!-- 中间内容 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="220px">
        <el-menu
          :default-active="activeIndex"
          active-text-color="black"
          class="side"
        >
          <el-menu-item index="1" @click="Discover">
            发现音乐
          </el-menu-item>
          <el-menu-item>
            博客
          </el-menu-item>
          <el-menu-item>
            视频
          </el-menu-item>
          <el-menu-item>
            关注
          </el-menu-item>
          <el-menu-item>
            主播
          </el-menu-item>
          <el-menu-item>
            私人FM
          </el-menu-item>
          <!-- 创建的歌单 -->
          <el-menu-item-group v-if="$store.state.isCreatedFavorite">
            <div class="groupTitle">创建的歌单</div>
            <el-menu-item
              :index="data.id"
              v-for="data in createdMusicList"
              :key="data.id"
              @click="handleMusicDeatils(data.id)"
              class="userName"
            >
              <i class="iconfont icon-bofangduilie"></i>{{data.name}}
            </el-menu-item>
          </el-menu-item-group>
          <!-- 收藏的歌单 -->
          <el-menu-item-group v-if="$store.state.isCreatedFavorite">
            <div class="groupTitle">收藏的歌单</div>
            <el-menu-item
              :index="data.id"
              v-for="data in collectedMusicList"
              :key="data.id"
              @click="handleMusicDeatils(data.id)"
              class="userName"
            >
              <i class="iconfont icon-bofangduilie"></i>{{data.name}}
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-aside>
      <!-- 主要区域内容 -->
      <el-main>
        <router-view class="routerView" :key="$route.fullPath"></router-view>
      </el-main>
    </el-container>
    <!-- 底部 -->
    <bottom-bar></bottom-bar>
    <transition name="bounce">
      <music-detail-card v-show="$store.state.isMusicDetailCardShow"></music-detail-card>
    </transition>
  </el-container>
</template>

<script>
import http from '@/util/http'
import HeaderBar from '@/mycomponents/index/headerbar/HeaderBar.vue'
import BottomBar from '@/mycomponents/index/bottombar/BottomBar.vue'
import MusicDetailCard from '@/views/MusicDetailCard/MusicDetailCard.vue'

export default {
  components: {
    HeaderBar,
    BottomBar,
    MusicDetailCard
  },
  data () {
    return {
      activeIndex: '1',
      // 创建的歌单
      createdMusicList: [],
      // 收藏的歌单
      collectedMusicList: []
    }
  },
  methods: {
    Discover () {
      this.$router.push('/index/discover/recommend')
    },
    handleMusicDeatils (id) {
      // 通过命名路由来跳转
      this.$router.push({
        name: 'MusicDetails',
        params: {
          id
        }
      })
    }
  },
  mounted () {
    // 创建的歌单
    http({
      url: `/user/playlist?uid=${this.$store.state.userId}`

    }).then((res) => {
      const index = res.data.playlist.findIndex((item) => item.subscribed === true)
      this.createdMusicList = res.data.playlist.slice(0, index)
      this.collectedMusicList = res.data.playlist.slice(index)
      this.createdMusicList[0].name = '我喜欢的音乐'
      // 将歌单上传至vuex
      // this.$store.commit('dataCreatedFavoriteSongList', res.data.playlist)
    })
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #ec4141;
  height: 50px !important;
  padding: 0;
  margin: 0;
  z-index: 100;
}
.side{
  padding-bottom: 40px;
}
.el-aside {
  height: 700px !important;
  border-right: 1px solid #ccc;
  height: calc(80vh - 105px);
}

.el-menu {
  border: none;
}

.el-menu-item:hover {
  background-color: #f5f5f6 !important;
}

.el-menu-item {
  padding: 0 0 0 10px !important;
  margin: 5px 0 !important;
  height: 30px;
  line-height: 30px;
}

.is-active {
  background-color: #f5f5f6;
  font-size: 18px;
  font-weight: bold;
}

.iconfont {
  font-size: 14px;
  margin: 5px !important;
}

.groupTitle {
    padding: 7px 0 7px 20px;
    line-height: normal;
    font-size: 14px;
    color: #909399;
}

.routerView {
  padding: 0 15px;
  margin: 0;
  width: 100%;
  height: calc(80vh - 105px);
}
.userName{
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bounce-enter-active {
  animation: bounce-in 0.3s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0%);
  }
}
</style>
