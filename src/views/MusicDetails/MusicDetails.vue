<template>
  <div class="Musicdetails">
    <!-- 头部歌单 -->
    <div class="MusicListTop">
      <!-- 图片 -->
      <div class="topImg">
        <img :src="musicdetails.coverImgUrl" alt="" />
      </div>
      <!-- 右边内容 -->
      <div class="rightMain">
        <!-- 标题 -->
        <div class="title">
          <div class="titleLeft">歌单</div>
          <div class="titleRight">{{ musicdetails.name }}</div>
        </div>
        <!-- 用户 -->
        <div class="user">
          <div class="userImg">
            <img :src="musicdetails.creator.avatarUrl" alt="" />
          </div>
          <div class="userName">
            {{ musicdetails.creator.nickname }}
          </div>
          <div class="createTime">
            {{ musicdetails.createTime | creationTime }}创建
          </div>
        </div>
        <!-- 按钮 -->
        <div class="button">
          <div class="buttonContent query" @click="query">
            <i class="iconfont icon-creditlevelfilling"></i>播放全部
          </div>
          <div class="buttonContent"><i class="iconfont icon-box"></i>收藏</div>
          <div class="buttonContent">
            <i class="iconfont icon-skip"></i>分享
          </div>
          <div class="buttonContent">
            <i class="iconfont icon-icondownload"></i>下载全部
          </div>
        </div>
        <!-- 标签 -->
        <div class="label">
          标签 :
          <div class="labelItem" v-for="(item, index) in musicdetails.tags" :key="index">
            {{ item }}
          </div>
          <div v-if="musicdetails.tags.length == 0" class="labelItem">
            暂无标签
          </div>
        </div>
        <!-- 歌曲数量和播放量 -->
        <div class="MusicListNumber">
          <div class="musicNum">歌曲 : {{ musicdetails.trackCount }}</div>
          <div class="playCount">
            播放 : {{ myNumber(musicdetails.playCount) }}
          </div>
        </div>
        <div class="desc">
          简介 :
          {{ musicdetails.description ? musicdetails.description : "暂无简介" }}
        </div>
      </div>
    </div>
    <!-- 底部歌曲列表 -->
    <div class="MusicListBottom">
      <el-table :data="allMusicList" stripe style="width: 100%" v-loading="loading" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading" element-loading-background="#fff" highlight-current-row
        @row-dblclick="doubleClick" lazy :row-key="
          (row) => {
            return row.id;
          }
        ">
        <el-table-column label="" width="40" type="index" :index="handleIndex">
        </el-table-column>
        <el-table-column prop="name" label="音乐标题" min-width="350">
        </el-table-column>
        <el-table-column prop="ar[0].name" label="歌手" min-width="120">
        </el-table-column>
        <el-table-column prop="al.name" label="专辑" min-width="170">
        </el-table-column>
        <el-table-column prop="dt" label="时间" min-width="100">
        </el-table-column>
      </el-table>
    </div>
    <!-- 回到顶部 -->
    <el-backtop target=".Musicdetails" :visibility-height="400" :bottom="100"></el-backtop>
  </div>
</template>

<script>
import Vue from 'vue'
import http from '@/util/http'
import quantity from '@/util/quantity'
import playbackTime from '@/util/playbackTime'
import moment from 'moment'

// 处理时间
moment.locale('zh-cn')
Vue.filter('creationTime', (data) => {
  return moment(data).format('YYYY-MM-DD')
})

export default {
  data () {
    return {
      // 歌单详情
      musicdetails: {},
      // 歌单全部歌曲
      allMusicList: {},
      // 加载
      loading: true
    }
  },
  methods: {
    // 处理数字
    myNumber (value) {
      return quantity(value)
    },
    // 标题数字
    handleIndex (index) {
      index += 1
      if (index < 10) {
        return '0' + index
      } else {
        return index
      }
    },
    // 双击
    doubleClick (row) {
      // 上传歌曲id
      this.$store.commit('SongId', row.id)
      // console.log(this.$store.state.songId)
      // 如果歌单发生变化, 则提交歌单到vuex
      if (this.musicdetails.id !== this.$store.state.musicListId) {
        // 将歌单和歌单id传到vuex
        this.$store.commit('currentMusicList', {
          musicList: this.allMusicList,
          musicListId: this.musicdetails.id
        })
      }
      // 上传歌曲详情
      http({
        url: '/song/detail',
        params: {
          ids: row.id
        }
      }).then((res) => {
        // console.log(res.data)
        this.$store.commit('songDetails', res.data.songs[0])
      })
      // 歌曲url
      http({
        url: '/song/url',
        params: {
          id: row.id
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
    // 点击播放全部按钮的回调
    query () {
      this.$store.commit('songUrl', this.allMusicList[0].url)
      this.$store.commit('currentMusicList', {
        musicList: this.allMusicList,
        musicListId: this.musicdetails.id
      })
    },
    handleDOM (current, last) {
      if (document.querySelector('.Musicdetails')) {
        const tableRows = document
          .querySelector('.Musicdetails')
          .querySelectorAll('.el-table__row')
          // 遍历当前musicList 找到当前播放的index的行进行渲染
          // console.log(tableRows);
        var index = this.allMusicList.findIndex((item) => item.id === current)
        // 将当前歌曲的索引导入vuex
        this.$store.commit('updateCurrentIndex', index)
        index = this.$store.state.currentIndex
        // console.log(index)
        if (index !== -1) {
          // 直接修改dom样式的颜色无效  可能是因为第三方组件的原故
          // 通过引入全局样式解决
          // 将正在播放的音乐前面的索引换成小喇叭
          tableRows[index].children[0].querySelector('.cell').innerHTML =
              '<div><i class="iconfont icon-yinliang"></i></div>'
          tableRows[index].children[0]
            .querySelector('.iconfont')
            .classList.add('currentRow')
          tableRows[index].children[1]
            .querySelector('.cell')
            .classList.add('currentRow')
        }
        // 清除上一首的样式
        if (last !== -1) {
          const lastIndex = this.allMusicList.findIndex(
            (item) => item.id === last
          )
          if (lastIndex !== -1) {
            // 将上一个播放的dom的小喇叭换回索引
            tableRows[lastIndex].children[0].querySelector(
              '.cell'
            ).innerHTML = `<div>${
              lastIndex + 1 < 10 ? '0' + (lastIndex + 1) : lastIndex + 1
            }</div>`

            // 将上一首的类名删掉  小喇叭的html已经被替换了，不需要再还原
            tableRows[lastIndex].children[1]
              .querySelector('.cell')
              .classList.remove('currentRow')
          }
        }
      }
    }
  },
  watch: {
    '$store.state.songId' (current, last) {
      this.handleDOM(current, last)
    }
  },
  mounted () {
    // 歌单详情
    http({
      url: '/playlist/detail',
      params: {
        id: this.$route.params.id
      }
    }).then((res) => {
      console.log(res.data)
      this.musicdetails = res.data.playlist
    })
    // 歌单全部歌曲
    http({
      url: '/playlist/track/all',
      params: {
        id: this.$route.params.id
      }
    }).then((res) => {
      console.log(res.data)
      // 处理播放时间
      // res.data.songs.forEach((item, index) => {
      //   item.dt = playbackTime(item.dt)
      // })
      // const songs = res.data.songs.map(item => {
      //   item.dt = playbackTime(item.dt)
      //   return item
      // })
      this.allMusicList = res.data.songs

      for (let index = 0; index < this.allMusicList.length; index++) {
        this.allMusicList[index].dt = playbackTime(this.allMusicList[index].dt)
      }

      // 取消加载
      this.loading = false
    })
  }
}
</script>
<style lang="scss" scoped>
  @import "./Discover.css";

  body .el-table .el-table__row .currentRow {
    color: #ec4141 !important;
  }

  .Musicdetails {
    padding-bottom: 80px !important;
    overflow-x: hidden;
    height: 700px;
  }

  .MusicListTop {
    display: flex;
    padding: 25px 15px;
    align-items: center;
  }

  .topImg {
    width: 180px;
    height: 180px;
    overflow: hidden;
    border-radius: 5px;
    margin-right: 15px;
    position: relative;

    img {
      position: absolute;
      height: 100%;
      width: 100%;
      border: 0.5px solid rgb(252, 242, 242);
    }
  }

  .title {
    display: flex;
    align-items: center;

    .titleLeft {
      font-size: 16px;
      color: #ec4141;
      border: 1px solid #ec4141;
      padding: 1px 2px;
      border-radius: 2px;
      margin-right: 5px;
      transform: scale(0.8);
    }

    .titleRight {
      font-size: 22px;
      font-weight: bold;
      color: #373737;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .user {
    display: flex;
    align-items: center;
    margin-top: 8px;
    font-size: 12px;
    padding-left: 5px;
  }

  .userImg {
    height: 25px;
    width: 25px;
    margin-right: 8px;

    img {
      width: 100%;
      border-radius: 50%;
    }
  }

  .userName {
    color: #6191c2;
    margin-right: 8px;
    cursor: pointer;
  }

  .userName:hover {
    color: blue;
  }

  .button {
    margin: 8px 0 0 -5px;
    display: flex;
  }

  .buttonContent {
    font-size: 16px;
    padding: 8px 15px;
    border: 1px solid #ddd;
    border-radius: 20px;
    transform: scale(0.9);
  }

  .buttonContent:hover {
    background-color: #d8d8d8;
  }

  .buttonContent i {
    font-size: 16px;
    margin-right: 6px;
    transform: scale(0.9);
  }

  .query {
    background-color: #ec4141;
    color: white;
  }

  .query:hover {
    background-color: #a12b2b;
  }

  .label {
    margin: 8px 0 0 -35px;
    display: flex;
    font-size: 14px;
    transform: scale(0.9);

    .labelItem {
      color: #6191c2;
      margin-left: 5px;
    }

    .labelItem:hover {
      color: blue;
    }
  }

  .MusicListNumber {
    margin: 8px 0 0 -35px;
    display: flex;
    font-size: 14px;
    transform: scale(0.9);
  }

  .musicNum {
    margin-right: 13px;
  }

  .desc {
    margin: 8px 0 0 -35px;
    font-size: 14px;
    transform: scale(0.9);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 800px;
  }

  .MusicListBottom {
    margin: -15px 15px 0;
    padding-top: 10px;
    width: 1260px;
  }
</style>
