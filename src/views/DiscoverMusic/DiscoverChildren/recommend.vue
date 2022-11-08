<template>
  <div class="recommend">
    <!-- 轮播图 -->
    <div class="centerRotation">
      <el-carousel :interval="4000" type="card" height="240px">
        <el-carousel-item v-for="item in rotation" :key="item.encodeId">
          <img :src="item.pic" alt="" class="rotation" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 推荐歌单 -->
    <div class="recommendMusicList">
      <h2>推荐歌单<i class="iconfont icon-more"></i></h2>
      <div class="musiclistContent">
        <div
          v-for="data in musicList"
          :key="data.id"
          @click="MusicList(data.id)"
          class="musiclistSubject"
        >
          <div class="image">
            <img :src="data.picUrl" alt="" />
          </div>
          <!-- <div class="lcon">
            <i class="iconfont icon-iconfontplay2"></i>
          </div> -->
          <div class="name">{{ data.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import http from '@/util/http'

export default {
  data () {
    return {
      // 轮播图
      rotation: [],
      // 推荐歌单
      musicList: []
    }
  },
  methods: {
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
    // 轮播图
    http({
      url: '/homepage/block/page'
    }).then((res) => {
      //   console.log(res.data.data.blocks[0].extInfo.banners)
      this.rotation = res.data.data.blocks[0].extInfo.banners
    })
    // 歌单详情
    http({
      url: '/personalized?limit=10'
    }).then((res) => {
      // console.log(res.data)
      this.musicList = res.data.result
    })
  }
}
</script>
<style scoped>
.recommend {
  padding-top: 75px;
  padding-left: 50px;
  width: 1200px;
}

.centerRotation {
  width: 1100px;
  text-align: center;
}

.rotation {
  width: 100%;
  border-radius: 8px;
}

.recommendMusicList {
  width: 1100px;
  margin: 20px 0px 20px 3px;
  padding-right: 3px;
}

.recommendMusicList h2 {
  color: #373737;
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

</style>
