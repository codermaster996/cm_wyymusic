<template>
  <div class="ranking">
    <div class="title">官方榜</div>
    <!-- 截取数组slice(0,4) -->
    <div class="li">
      <div>
        <div
          class="rankimglist"
          v-for="item in rankinglist.slice(0, 1)"
          :key="item.id"
        >
          <img :src="item.coverImgUrl" alt="" />
        </div>
      </div>

      <div class="songlist">
        <div
          @dblclick="songlisthan(songlist.id, songlist)"
          class="list"
          v-for="(songlist, index) in bsblist.slice(0, 5)"
          :key="songlist.id"
        >
          <div>
            <span>{{ index + 1 }}</span>
            <span>
              {{ songlist.name }}
            </span>
          </div>
          <div>{{ songlist.ar[0].name }}</div>
        </div>
      </div>
    </div>
    <div class="all" @click="all(rankinglist[0].id)">
      查看全部<i class="el-icon-arrow-right"></i>
    </div>
    <div class="li">
      <div
        class="rankimglist"
        v-for="item in rankinglist.slice(1, 2)"
        :key="item.id"
      >
        <img :src="item.coverImgUrl" alt="" />
      </div>
      <div class="songlist">
        <div
          @dblclick="songlisthan(songlist.id, songlist)"
          class="list"
          v-for="(songlist, index) in xgblist.slice(0, 5)"
          :key="songlist.id"
        >
          <div>
            <span>{{ index + 1 }}</span>
            <span>
              {{ songlist.name }}
            </span>
          </div>
          <div>{{ songlist.ar[0].name }}</div>
        </div>
      </div>
    </div>
    <div class="all" @click="all(rankinglist[1].id)">
      查看全部<i class="el-icon-arrow-right"></i>
    </div>
    <div class="li">
      <div
        class="rankimglist"
        v-for="item in rankinglist.slice(2, 3)"
        :key="item.id"
      >
        <img :src="item.coverImgUrl" alt="" />
      </div>
      <div class="songlist">
        <div
          @dblclick="songlisthan(songlist.id, songlist)"
          class="list"
          v-for="(songlist, index) in ycblist.slice(0, 5)"
          :key="songlist.id"
        >
          <div>
            <span>{{ index + 1 }}</span>
            <span>
              {{ songlist.name }}
            </span>
          </div>
          <div>{{ songlist.ar[0].name }}</div>
        </div>
      </div>
    </div>
    <div class="all" @click="all(rankinglist[2].id)">
      查看全部<i class="el-icon-arrow-right"></i>
    </div>
    <div class="li">
      <div
        class="rankimglist"
        v-for="item in rankinglist.slice(3, 4)"
        :key="item.id"
      >
        <img :src="item.coverImgUrl" alt="" />
      </div>
      <div class="songlist">
        <div
          @dblclick="songlisthan(songlist.id, songlist)"
          class="list"
          v-for="(songlist, index) in rgblist.slice(0, 5)"
          :key="songlist.id + 2"
        >
          <div>
            <span>{{ index + 1 }}</span>
            <span>
              {{ songlist.name }}
            </span>
          </div>
          <div>{{ songlist.ar[0].name }}</div>
        </div>
      </div>
    </div>
    <div class="all" @click="all(rankinglist[3].id)">
      查看全部<i class="el-icon-arrow-right"></i>
    </div>
    <div class="ddd"></div>
  </div>
</template>

<script>
import http from '@/util/http'
import playbackTime from '@/util/playbackTime'

export default {
  data () {
    return {
      rankinglist: [],
      bsblist: [],
      xgblist: [],
      ycblist: [],
      rgblist: []
    }
  },
  methods: {
    all (id) {
      // 通过命名路由来跳转
      this.$router.push({
        name: 'MusicDetails',
        params: {
          id
        }
      })
    },
    // 双击
    songlisthan (id, value) {
      // 上传歌曲id
      this.$store.commit('SongId', id)
      // console.log(this.$store.state.songId)
      // 上传歌曲详情
      this.$store.commit('songDetails', value)
      // 歌曲url
      http({
        url: '/song/url',
        params: {
          id: id
        }
      }).then((res) => {
        // console.log(res.data)
        if (res.data.data[0].url == null) {
          this.$message.error('该歌曲暂无版权,请您切换至下一首歌曲')
        } else {
          this.$store.commit('songUrl', res.data.data[0].url)
          // 时长
          this.$store.commit(
            'Duration',
            this.allMusicList[this.$store.state.currentIndex].dt
          )
        }
        // console.log(this.$store.state.duration)
      })
    },
    httpbsblist (id) {
      http({
        url: '/playlist/detail',
        params: {
          id
        }
      }).then((res) => {
        this.bsblist = res.data.playlist.tracks
      })
    },
    httpxgblist (id) {
      http({
        url: '/playlist/detail',
        params: {
          id
        }
      }).then((res) => {
        this.xgblist = res.data.playlist.tracks
      })
    },
    httpycblist (id) {
      http({
        url: '/playlist/detail',
        params: {
          id
        }
      }).then((res) => {
        this.ycblist = res.data.playlist.tracks
        // 处理播放时间
        for (let index = 0; index < res.data.songs.length; index++) {
          this.ycblist[index].dt = playbackTime(res.data.songs[index].dt)
        }
      })
    },
    httprgblist (id) {
      http({
        url: '/playlist/detail',
        params: {
          id
        }
      }).then((res) => {
        this.rgblist = res.data.playlist.tracks
        console.log(this.rgblist)
      })
    }
  },
  mounted () {
    http({
      url: '/toplist'
    }).then((res) => {
      console.log(res)
      this.rankinglist = res.data.list

      this.httpbsblist(this.rankinglist[0].id)
      this.httpxgblist(this.rankinglist[1].id)
      this.httpycblist(this.rankinglist[2].id)
      this.httprgblist(this.rankinglist[3].id)

      // this.httplist(this.rankinglist[2].id,this.ycblist)
      // this.httplist(this.rankinglist[3].id,this.rgblist)

      // console.log(this.bsblist)
    })
    // console.log(this.rankinglist)
    // this.httplist(this.rankinglist[0].id,this.bsblist)
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 20px;
  margin: 10px 10px 10px 0;
  color: black;
  font-weight: bold;
}
.all {
  font-size: 13px;
  color: #666;
  cursor: pointer;
  margin-left: 170px;
}
.ranking {
  padding-top: 75px;
  width: 1200px;
  margin: 0 auto;
  margin-left: 220px;
  .li {
    display: flex;
    width: 800px;
    flex-direction: row;
    margin-top: 20px;
    // justify-content: center;
    // background-color: pink;
    .songlist {
      .list {
        display: flex;
        flex-direction: row;
        width: 600px;
        justify-content: space-between;
        margin-left: 20px;
        border-radius: 5px;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        color: #666;
        font-size: 12px;
      }
      .list:nth-child(-n + 3) {
        span:nth-child(1) {
          color: #e13e3e;
        }
      }
      .list:nth-child(even) {
        background-color: #f9f9f9;
      }
      .list:hover {
        background-color: #f0f1f2;
      }
    }
  }
}
.ddd {
  height: 50px;
}

img {
  width: 150px;
  height: 150px;
  border-radius: 5px;
}
</style>
