<template>
  <div class="bottomBar">
    <!-- 歌曲Url -->
    <audio
      :src="$store.state.songUrl"
      autoplay
      @play="changeState(true)"
      @pause="changeState(false)"
      @ended="Songswitching('right')"
      ref="audioPlayer"
      @timeupdate="timeupdate"
    ></audio>
    <!-- 左-图片 歌曲名称和歌手名 -->
    <div class="left">
      <div class="leftImg" @click="musicCard">
        <img
          :src="$store.state.songDetails.al.picUrl"
          alt=""
          v-if="$store.state.songDetails.al"
        />
        <img src="@/assets/img/test.jpg" alt="" v-else />
      </div>
      <div class="leftFont">
        <div
          class="fontTop"
          v-if="$store.state.songDetails && $store.state.songDetails.name"
        >
          {{ $store.state.songDetails.name }}
        </div>
        <div
          class="fontBottom"
          v-if="$store.state.songDetails && $store.state.songDetails.name"
        >
          {{ $store.state.songDetails.ar[0].name }}
        </div>
      </div>
    </div>
    <!-- 中间 -->
    <div class="center">
      <!-- 按鈕 -->
      <div class="button">
        <span>
          <i class="iconfont icon-liebiaoxunhuan"></i>
        </span>
        <span
          @click="
            $store.state.musicList.length != 0 ? Songswitching('left') : ''
          "
        >
          <i class="iconfont icon-shangyiqu"></i>
        </span>
        <span @click="$store.state.musicList.length != 0 ? changePlay() : ''">
          <i
            class="iconfont icon-bofangzhong"
            v-if="this.$store.state.isPlay"
          ></i>
          <i class="iconfont icon-zanting" v-else></i>
        </span>
        <span
          @click="
            $store.state.musicList.length != 0 ? Songswitching('right') : ''
          "
        >
          <i class="iconfont icon-xiayiqu"></i>
        </span>
        <span>
          <i class="iconfont icon-bofangduilie"></i>
        </span>
      </div>
      <!-- 进度条 -->
      <div class="progress">
        <span class="currentTime">{{ currentTime | playbackTime }}</span>
        <!-- :value 是单向的  要实现双向要v-model -->
        <el-slider
          class="progressSlider"
          v-model="timeProgress"
          :show-tooltip="false"
          @change="changeProgress"
          :disabled="musicList.length == 0"
        >
        </el-slider>
        <span class="totalTime">{{ duration }}</span>
      </div>
    </div>
    <!-- 右-音量和歌单 -->
    <div class="right">
      <div class="volumeControl">
        <i class="iconfont icon-yinliang" @click="handleVolume"></i>
        <el-slider
          class="volumeSlider"
          v-model="volume"
          @input="InputVolume"
          :show-tooltip="false"
        ></el-slider>
      </div>
      <div class="playList" @click="openDrawer">
        <i class="iconfont icon-bofangliebiao"></i>
      </div>
    </div>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="drawer" :with-header="false">
      <div class="current">当前播放</div>
      <div class="drawerHeader">总{{ musicList.length }}首</div>
      <el-table
        :data="musicList"
        stripe
        style="width: 100%"
        :show-header="false"
        @row-dblclick="clickRow"
        highlight-current-row
        lazy
      >
        <el-table-column prop="name" width="150px"> </el-table-column>
        <el-table-column prop="ar[0].name" width="80px"> </el-table-column>
        <el-table-column prop="dt" width="70px"> </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import http from '@/util/http'
import playbackTime from '@/util/playbackTime'
import returnSecond from '@/util/returnSecond'
// 初始时间
let lastSecond = 0
// 总时长的秒数
let durationNum = 0
// 保存当前音量
let volumeSave = 0
export default {
  data () {
    return {
      // 歌单
      musicList: [],
      // 歌曲索引
      currentMusicIndex: 0,
      // 时长
      duration: '00:00',
      // 当前播放时间位置
      currentTime: 0,
      // 进度条的位置
      timeProgress: 0,
      // 初始音量
      volume: 100,
      // 是否静音
      isMuted: false,
      // 抽屉是否被打开过（如果没打开过，里面的数据是不会渲染的）
      hasDrawerOpend: false,
      // 打开抽屉
      drawer: false
    }
  },
  methods: {
    // 上一曲,下一曲和抽屉歌单
    Songswitching (type, id) {
      // 上一曲
      if (type === 'left') {
        this.$store.commit('updateLastSon')

        http({
          url: '/song/url',
          params: {
            id: this.$store.state.thisMUsicId
          }
        }).then((res) => {
          // 歌曲URl
          this.$store.commit('songUrl', res.data.data[0].url)
          // this.$store.commit('isplaybofang')
          // 歌曲详情
          var songdetails = this.musicList[this.$store.state.currentIndex]
          this.$store.commit('songDetails', songdetails)
          // 歌单id
          this.$store.commit('SongId', this.$store.state.thisMUsicId)
          // 时长
          var myTime = this.musicList[this.$store.state.currentIndex].dt
          this.$store.commit('Duration', myTime)
        })
        // 下一曲
      } else if (type === 'right') {
        this.$store.commit('updateNextSon')

        http({
          url: '/song/url',
          params: {
            id: this.$store.state.thisMUsicId
          }
        }).then((res) => {
          // 歌曲URl
          this.$store.commit('songUrl', res.data.data[0].url)
          // this.$store.commit('isplaybofang')
          // 歌曲详情
          var songdetails = this.musicList[this.$store.state.currentIndex]
          this.$store.commit('songDetails', songdetails)
          // 歌曲id
          this.$store.commit('SongId', this.$store.state.thisMUsicId)
          // 时长
          var myTime = this.musicList[this.$store.state.currentIndex].dt
          this.$store.commit('Duration', myTime)
        })
      } else if (type === 'click') {
        // 点击抽屉row进行切歌
        this.$store.commit('songUrl', id)
      }
    },
    // 歌曲歌词和评论
    musicCard () {
      this.$store.commit('changeMusicDetailCardState')
    },
    // 点击播放键的回调
    changePlay () {
      !this.$store.state.isPlay ? this.playMusic() : this.pauseMusic()
    },
    // 播放音乐的函数
    playMusic () {
      this.$refs.audioPlayer.play()
    },
    // 暂停音乐的函数
    pauseMusic () {
      this.$refs.audioPlayer.pause()
    },
    // audio开始或暂停播放的回调  在vuex中改变状态
    changeState (state) {
      this.$store.commit('changeState', state)
    },
    // 音乐进度条滚动
    timeupdate () {
      // 节流
      let time = this.$refs.audioPlayer.currentTime
      // 将当前播放时间保存到vuex  如果保存到vuex这步节流,会导致歌词不精准,误差最大有1s
      this.$store.commit('updateCurrentTime', time)

      time = Math.floor(time)
      if (time !== lastSecond) {
        // console.log(time);
        lastSecond = time
        this.currentTime = time
        // 计算进度条的位置
        this.timeProgress = Math.floor((time / durationNum) * 100)
        // console.log(this.timeProgress);
      }
    },
    // 拖动进度条的回调
    changeProgress (e) {
      // console.log(e)
      // 修改当前播放时间
      this.currentTime = this.$store.state.currentTime
      this.currentTime = Math.floor((e / 100) * durationNum)
      // 改变audio的实际当前播放时间
      this.$refs.audioPlayer.currentTime = this.currentTime
    },
    // 点击小喇叭的回调 （切换静音状态）
    handleVolume () {
      if (this.isMuted) {
        this.volume = volumeSave
      } else {
        volumeSave = this.volume
        this.volume = 0
      }
      // console.log(volumeSave, this.isMuted)
      this.isMuted = !this.isMuted
    },
    // 拖动音量条的回调
    InputVolume (e) {
      // 改变audio的音量
      this.$refs.audioPlayer.volume = e / 100
      if (this.isMuted && e > 0) {
        this.isMuted = false
      } else if (e === 0 && this.isMuted === false) {
        this.isMuted = true
      }
    },
    // 点击打开抽屉的回调
    openDrawer () {
      // 关闭也是这个回调，所以直接取反
      this.drawer = !this.drawer
      this.hasDrawerOpend = true
      this.handleDrawerListDOM(this.currentMusicIndex)
    },
    // 双击抽屉列表中的row的回调
    clickRow (row) {
      // console.log(row.id)
      this.Songswitching('click', row.id)
      this.$store.commit('SongId', row.id)
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
          this.Songswitching('right')
        } else {
          this.$store.commit('songUrl', res.data.data[0].url)
          // 时长
          this.$store.commit(
            'Duration',
            this.musicList[this.$store.state.currentIndex].dt
          )
        }
      })
    },
    // 根据id找到 musicList中对应的musicDetail
    getMusicDetailFromMusicList () {
      const index = this.$store.state.currentIndex
      console.log(index)
      if (index !== -1) {
        // 记录当前音乐的index
        this.currentMusicIndex = index
        // 将索引传至vuex
        this.$store.commit('updateCurrentIndex', index)
        // 直接从audio标签中的duration属性拿时长会有请求时差问题，所以直接在musicInfo中拿
        this.duration = this.$store.state.duration
      }
    },
    // 操作drawerList中DOM的函数
    handleDrawerListDOM (currentIndex, lastIndex) {
      // 目前没什么好思路 直接操作原生DOM
      this.$nextTick(() => {
        const tableRows = document
          .querySelector('.bottomBar')
          .querySelectorAll('.el-table__row')
        // // 直接修改dom样式的颜色无效  可能是因为第三方组件 style scoped的原因
        // // 通过引入全局样式解决
        if (tableRows[currentIndex]) {
          tableRows[currentIndex].children[0]
            .querySelector('.cell')
            .classList.add('currentRow')
          tableRows[currentIndex].children[1]
            .querySelector('.cell')
            .classList.add('currentRow')
        }
        if (
          (lastIndex && lastIndex !== -1 && tableRows[lastIndex]) ||
          lastIndex === 0
        ) {
          // 将上一首的类名删掉
          tableRows[lastIndex].children[0]
            .querySelector('.cell')
            .classList.remove('currentRow')
          tableRows[lastIndex].children[1]
            .querySelector('.cell')
            .classList.remove('currentRow')
        }
      })
    },
    // 歌曲为空时,跳过
    Url404 () {
      if (this.$store.state.songUrl == null) {
        this.$message.error('该歌曲暂无版权，将为您播放下一首歌曲')
        this.Songswitching('right')
      }
    }
  },
  mounted () {},
  watch: {
    // 监听vuex中songUrl( 歌曲url)的变化
    '$store.state.songUrl' () {
      console.log('vuex中的歌曲url发生了变化')
      // 先暂停当前播放的音乐
      this.pauseMusic()
      this.duration = this.$store.state.duration
      this.musicList = this.$store.state.musicList
      this.getMusicDetailFromMusicList()
      this.Url404()
      durationNum = returnSecond(this.duration)
    },
    // 监听currentIndex的变化
    '$store.state.currentIndex' (currentIndex, lastIndex) {
      // if (this.hasDrawerOpend) {
      this.handleDrawerListDOM(currentIndex, lastIndex)
    },
    // 监听播放状态
    '$store.state.isPlay' (isPlay) {
      if (isPlay) {
        this.playMusic()
      } else {
        this.pauseMusic()
      }
    }
  },
  filters: {
    playbackTime
  }
}
</script>

<style lang="scss" scoped>
@import "./bottom.css";

body .el-table .el-table__row .currentRow {
  color: #ec4141 !important;
}

.bottomBar {
  border-top: 1px solid #ddd;
  width: 100%;
  height: 80px;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  z-index: 10000;
  background-color: #fff;
}

.left {
  display: flex;
  align-items: center;
  width: 240px;
}

.leftImg {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  overflow: hidden;
  margin-right: 10px;
  cursor: pointer;
  border: 0.5px solid #ddd;
  img {
    width: 100%;
  }
}

.leftFont {
  color: rgb(37, 37, 37);
  font-size: 14px;
  width: 70px;
  margin-left: 4px;
  .fontTop {
    margin-bottom: 4px;
    width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .fontBottom {
    transform: scale(0.8);
    margin-left: -7px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
}
.center {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.button {
  display: flex;
  align-items: center;
  height: 20px;
}
.button span {
  display: inline-block;
  width: 65px;
  box-sizing: border-box;
  text-align: center;
}

.button i {
  font-size: 28px;
  color: #313131;
}

.button span:nth-child(3) i {
  font-size: 40px;
}
.icon-bofangduilie:before {
  content: "\e699";
  font-size: 25px;
}

.progress {
  display: flex;
  align-items: center;
  margin-top: 8px;
}
.progressSlider {
  text-align: center;
  width: 600px;
}
.currentTime {
  font-size: 16px;
  transform: scale(0.85);
  color: #aaa;
  margin-right: 20px;
  width: 30px;
  text-align: center;
}
.totalTime {
  font-size: 16px;
  transform: scale(0.85);
  color: #aaa;
  margin: 0 5px;
  width: 30px;
  text-align: center;
}

.right {
  display: flex;
  align-items: center;
  position: relative;
}
.volumeControl {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.icon-yinliang:before {
  content: "\e698";
  font-size: 22px;
  margin-right: 7px;
}

.volumeSlider {
  width: 100px;
}

.icon-bofangliebiao {
  font-size: 22px;
  margin-right: 10px;
}
.current {
  margin: 10px;
  font-size: 20px;
  font-weight: bold;
  color: black;
}
.drawerHeader {
  font-size: 14px;
  transform: scale(0.92);
  color: #aaa;
}
</style>
