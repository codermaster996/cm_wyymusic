<template>
  <div class="SongSheet-Main">
    <!-- 精品歌单-- 图片加文字 -->
    <div class="top">
      <img :src="topImg.coverImgUrl" alt="" class="backgroundImg" />
      <div class="topLeftImg">
        <img :src="topImg.coverImgUrl" alt="" />
      </div>
      <div class="topRight">
        <div class="font">
          <i class="iconfont icon-remind1 img"></i>精品歌单
        </div>
        <div class="name">{{ topImg.name }}</div>
      </div>
    </div>
    <!-- 精品歌单-- 导航 -->
    <div class="center">
      <div class="cneterLeft">
        {{ tag }}
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="cneterRight">
        <div
          v-for="(data, index) in centerNavigation"
          :key="data.id"
          @click="navigation(data.name, index)"
          :class="index == activeNum ? 'active' : ''"
          class="centerRightMain"
        >
          {{ data.name }}
        </div>
      </div>
    </div>
    <!-- 精品歌单-- 主体内容 -->
    <div class="bottom">
      <div class="musiclistContent">
        <div
          v-for="item in bottomMusicList"
          :key="item.id"
          @click="MusicList(item.id)"
          class="musiclistSubject"
        >
          <div class="image">
            <img :src="item.coverImgUrl" alt="" />
          </div>
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="50"
        :current-page="pageNumber"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import http from '@/util/http'

export default {
  data () {
    return {
      // 头部内容
      topImg: {},
      tag: '华语',
      // 中间导航栏
      centerNavigation: [],
      activeNum: 0,
      // 底部歌单
      bottomMusicList: [],
      // 分页
      total: null,
      pageNumber: 1
    }
  },
  methods: {
    // 导航点击
    navigation (name, index) {
      this.tag = name
      this.activeNum = index
      this.pageNumber = 1
      // 头部图片和文字
      http({
        url: '/top/playlist/highquality',
        params: {
          limit: 1,
          cat: this.tag
        }
      }).then((res) => {
      //   console.log(res.data)
        this.topImg = res.data.playlists[0]
      })
      // 底部歌单
      http({
        url: '/top/playlist',
        params: {
          limit: 50,
          cat: this.tag
        }
      }).then((res) => {
        // console.log(res.data.playlists)
        this.bottomMusicList = res.data.playlists
        this.total = res.data.total
      })
    },
    // 分页点击
    pageChange (page) {
      this.pageNumber = page
      console.log(this.pageNumber)
      // console.log(page)
      // 底部歌单
      http({
        url: '/top/playlist',
        params: {
          cat: this.tag,
          offset: 50 * (this.pageNumber - 1)
        }
      }).then((res) => {
        // console.log(res.data.playlists)
        this.bottomMusicList = res.data.playlists
        this.total = res.data.total
      })
    },
    // 跳转页面
    MusicList (id) {
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
    // 头部图片和文字
    http({
      url: '/top/playlist/highquality',
      params: {
        limit: 1,
        cat: this.tag
      }
    }).then((res) => {
      //   console.log(res.data)
      this.topImg = res.data.playlists[0]
    })
    // 中间导航内容
    http({
      url: '/playlist/hot'
    }).then((res) => {
      //   console.log(res.data.tags)
      this.centerNavigation = res.data.tags
      this.centerNavigation[2].name = '古风'
      this.centerNavigation[7].name = '古典'
    })
    // 底部歌单
    http({
      url: '/top/playlist',
      params: {
        limit: 50,
        cat: this.tag
      }
    }).then((res) => {
      // console.log(res.data.playlists)
      this.bottomMusicList = res.data.playlists
      this.total = res.data.total
    })
  }
}
</script>

<style lang="scss" scoped>
.top {
  position: relative;
  width: 1120px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  margin-left: 45px;
}
.backgroundImg {
  position: absolute;
  left: 0;
  top: 0;
  width: 1100px;
  transform: translateY(-80px);
  filter: blur(30px) brightness(70%);
}
.topLeftImg {
  width: 120px;
  height: 120px;
  margin: 15px;
  z-index: 1;
}
.topLeftImg img {
  border-radius: 5px;
  width: 100%;
}
.topRight {
  z-index: 1;
  .font {
    color: rgb(231, 170, 90);
    border: 1px solid rgb(231, 170, 90);
    padding: 5px 10px;
    width: 95px;
    font-size: 12px;
    margin-top: 30px;
    border-radius: 15px;
    .img {
      padding-right: 5px;
    }
  }
  .name {
    color: #fff;
    padding-top: 20px;
  }
}

.center {
  padding: 15px 45px;
  display: flex;
  justify-content: space-between;
  height: 60px;
  .cneterLeft {
    text-align: center;
    width: 100px;
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 20px;
    font-size: 16px;
  }
  .cneterLeft:hover {
    background-color: #ddd;
  }
}
.cneterRight {
  display: flex;
  flex-wrap: wrap;
  .centerRightMain {
    margin: 4px -2px;
    padding: 6px 10px;
    font-size: 14px;
    text-align: center;
    box-sizing: content-box;
    transform: scale(0.9, 0.9);
    cursor: pointer;
  }
  .active {
    background-color: #fdf5f5;
    color: #ec4747;
    border-radius: 12px;
  }
}

.bottom {
  width: 1120px;
  margin: 20px 0px 20px 3px;
  margin-left: 46px;
}

.musiclistContent {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;
}

.musiclistSubject {
  width: 18.4%;
  margin: 0 2% 20px 0;
  overflow: hidden;
  cursor: pointer;
}
.musiclistSubject:nth-child(5n) {
  margin-right: 0;
}
.image {
  width: 100%;
  padding-bottom: 100%;
  height: 0;
  position: relative;
}

.image img {
  width: 100%;
  border-radius: 5px;

}
.name {
  margin-top: 8px;
  padding: 0 2px;
  font-size: 14px;
  letter-spacing:1px;
  color: black;
  line-height: 16px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.page {
  width: 100%;
  text-align: center;
}
</style>
