<template>
  <div class="MusicDetailCard">
    <div class="leftImg" @click="$store.commit('changeMusicDetailCardState')">
      <i class="iconfont icon-moreunfold"></i>
    </div>
    <div class="MusicDetailCardCenter">
      <!-- 歌词 -->
      <div class="top">
        <div class="left">
          <div class="musicImg">
            <div
              class="needle"
              :class="$store.state.isPlay ? 'needleRotate' : ''"
              ref="needle"
            >
              <img src="@/assets/img/MusicDetailCard/needle.png" alt="" />
            </div>
            <!-- 通过音乐的加载时差删除discAnimation类名再添加,达到重置动画的效果 -->
            <div
              class="disc"
              :class="[
                $store.state.isPlay ? '' : 'pause',
                $store.state.isMusicLoad ? '' : 'discAnimation',
              ]"
              ref="disc"
            >
              <img src="@/assets/img/MusicDetailCard/disc.png" alt="" />
              <img
                src="@/assets/img/test.jpg"
                alt=""
                class="musicAvatar"
                v-if="!musicInfo.al"
              />
              <img
                :src="musicInfo.al.picUrl"
                alt=""
                class="musicAvatar"
                v-else
              />
            </div>
          </div>
        </div>
        <div class="right">
          <div class="title">
            <div class="musicName">{{ musicInfo.name }}</div>
            <div class="album">
              {{ musicInfo.al.name }}
            </div>
            <div
              class="singer"
              @click="goToDetailPage('singerDetail', musicInfo.ar[0].id)"
            >
              {{ musicInfo.ar[0].name }}
            </div>
          </div>
          <lyrics-scrolling
            :lyric="lyric"
            class="LyricsScrolling"
          ></lyrics-scrolling>
        </div>
      </div>
      <!-- 评论 -->
      <div
        class="bottom"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="#fff"
      >
        <!-- 热门评论 -->
        <div class="hot" v-if="this.currentCommentPage == 1">
          <div class="commentHeader">热门评论</div>
          <div
            class="commentItem"
            v-for="(item, index) in hotComments"
            :key="index"
          >
            <div class="commentCreatorAvatar">
              <img
                :src="item.user.avatarUrl + '?param=100y100'"
                alt=""
                @click="goToPersonal(item.user.userId)"
              />
            </div>
            <div class="commentMain">
              <div class="commentContent">
                <span
                  class="commentUserNickName"
                  @click="goToPersonal(item.user.userId)"
                  >{{ item.user.nickname }}:&nbsp;</span
                >
                <span>{{ item.content }}</span>
              </div>
              <div class="replied">
                <div
                  class="repliedItem"
                  v-for="(item1, index1) in item.beReplied"
                  :key="index1"
                >
                  <span
                    class="repliedUser"
                    @click="goToPersonal(item.user.userId)"
                    >@{{ item1.user.nickname }}:&nbsp;</span
                  >
                  <span class="repliedContent">{{ item1.content }}</span>
                </div>
              </div>
              <div class="commentBottom">
                <div class="commentCreatedTime">
                  {{ item.time | showDate }}
                </div>
                <div class="commentButtons">
                  <div
                    @click="likeCurrentComment(item.liked, item.commentId)"
                    :class="item.liked ? 'likeCurrentComment' : ''"
                  >
                    <i class="iconfont icon-good"></i> {{ item.likedCount }}
                  </div>
                  <div><i class="iconfont icon-zhuanfa"></i></div>
                  <div>
                    <i
                      class="iconfont icon-pinglun"
                      @click="floorComment(item.commentId, item.user.nickname)"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 全部评论 -->
        <div class="query">
          <div class="commentHeader">全部评论({{ total }})</div>
          <div
            class="commentItem"
            v-for="(item, index) in comment"
            :key="index"
          >
            <div class="commentCreatorAvatar">
              <img
                :src="item.user.avatarUrl + '?param=100y100'"
                alt=""
                @click="goToPersonal(item.user.userId)"
              />
            </div>
            <div class="commentMain">
              <div class="commentContent">
                <span
                  class="commentUserNickName"
                  @click="goToPersonal(item.user.userId)"
                  >{{ item.user.nickname }}:&nbsp;</span
                >
                <span>{{ item.content }}</span>
              </div>
              <div class="replied">
                <div
                  class="repliedItem"
                  v-for="(item1, index1) in item.beReplied"
                  :key="index1"
                >
                  <span
                    class="repliedUser"
                    @click="goToPersonal(item.user.userId)"
                    >@{{ item1.user.nickname }}:&nbsp;</span
                  >
                  <span class="repliedContent">{{ item1.content }}</span>
                </div>
              </div>
              <div class="commentBottom">
                <div class="commentCreatedTime">
                  {{ item.time | showDate }}
                </div>
                <div class="commentButtons">
                  <div
                    @click="likeCurrentComment(item.liked, item.commentId)"
                    :class="item.liked ? 'likeCurrentComment' : ''"
                  >
                    <i class="iconfont icon-good"></i> {{ item.likedCount }}
                  </div>
                  <div><i class="iconfont icon-zhuanfa"></i></div>
                  <div>
                    <i
                      class="iconfont icon-pinglun"
                      @click="floorComment(item.commentId, item.user.nickname)"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 评论分页 -->
        <div class="page">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            small
            :page-size="20"
            :current-page="currentCommentPage"
            @current-change="commentPageChange"
          >
          </el-pagination>
        </div>
      </div>
      <!-- 回到顶部 -->
      <el-backtop
        target=".MusicDetailCardCenter"
        :visibility-height="600"
        :bottom="100"
      ></el-backtop>
    </div>
  </div>
</template>
<script>
import http from '@/util/http'
import moment from 'moment'
import Vue from 'vue'
// 歌词滚动
import LyricsScrolling from '@/mycomponents/LyricsScrolling/LyricsScrolling.vue'
// 评论
// import Comment from '@/mycomponents/Comment/Comment.vue'
moment.locale('zh-cn')
Vue.filter('showDate', (data) => {
  return moment(data).format('YYYY-MM-DD')
})
// 定时器名称
let timer
export default {
  components: {
    LyricsScrolling
    // Comment
  },
  data () {
    return {
      // 歌词
      lyric: [[0, '正在加载歌词']],
      // 当前评论页数
      currentCommentPage: 1,
      // 评论数据
      comment: {},
      // 当前歌曲信息
      musicInfo: {},
      // 是否删除卡片渲染的内容
      cleanCard: true,
      // 评论是否在加载中
      loading: true,
      // 热门评论
      hotComments: [],
      // 是否显示歌曲详情卡片
      isMusicDetailCardShow: false,
      // 评论数量
      total: null
    }
  },
  methods: {
    // 歌词
    getLyric (id) {
      http({
        url: '/lyric',
        params: {
          id: id
        }
      }).then((res) => {
        // console.log(res.data)
        const lyrics = res.data.lrc.lyric
        // 对获取到的歌词进行处理
        let arr = lyrics.split('\n')
        const array = []
        // let obj = {};
        let time = ''
        let value = ''
        const result = []

        // 去除空行
        arr.forEach((item) => {
          if (item !== '') {
            array.push(item)
          }
        })
        arr = array
        arr.forEach((item) => {
          time = item.split(']')[0]
          value = item.split(']')[1]
          // 去掉时间里的中括号得到xx:xx.xx
          var t = time.slice(1).split(':')
          // 将结果压入最终数组
          result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value])
        })

        this.lyric = result
        console.log(this.lyric)
      })
    },
    // 请求评论数据
    getMusicComment (id, type) {
      // 获取时间戳
      var timestamp = Date.parse(new Date())

      if (type === 'changePage') {
        const MusicDetailCardCenter = document.querySelector(
          '.MusicDetailCardCenter'
        )
        const top = document.querySelector('.top')
        // console.log([musicDetailCardContainer, top]);
        MusicDetailCardCenter.scrollTo({
          behavior: 'smooth',
          top: top.clientHeight
        })
      }

      http({
        url: '/comment/music',
        params: {
          id: id,
          offset: (this.currentCommentPage - 1) * 20,
          timestamp: timestamp
        }
      }).then((res) => {
        console.log(res.data, 888)
        if (res.data.code !== 200) {
          this.$message.error('获取评论失败,请稍后重试!')
        }
        // 热门评论
        if (this.currentCommentPage === 1) {
          this.hotComments = res.data.hotComments
        }
        // 全部评论和评论数量
        this.comment = res.data.comments
        this.total = res.data.total
        this.loading = false
      })
    },
    // 点击分页按钮的回调
    commentPageChange (page) {
      this.currentCommentPage = page
      this.getMusicComment(this.$store.state.songId, 'changePage')
    }
  },
  watch: {
    '$store.state.isMusicDetailCardShow' (isMusicDetailCardShow) {
      this.isMusicDetailCardShow = isMusicDetailCardShow
      //   性能优化
      // 如果卡片没有展示就不发送请求和渲染里面的内容
      //   删除定时器 避免用户在关闭卡片的1s内又打开卡片 导致展示内容被删除
      clearTimeout(timer)
      this.cleanCard = false
      if (isMusicDetailCardShow && !this.comment && this.$store.state.songId !== '') {
        console.log('请求歌词和评论')
        this.getLyric(this.$store.state.songId)
        this.getMusicComment(this.$store.state.songId)
        //   当卡片关闭时 延迟 3s再删除里面渲染的内容 提升体验
      } else if (isMusicDetailCardShow === false) {
        timer = setTimeout(() => {
          this.cleanCard = true
        }, 3000)
      }
    },
    // 当vuex中的歌曲url发生变化时,需要重新获取评论和歌词
    '$store.state.songUrl' () {
      // 清空歌词
      this.lyric = [[0, '正在加载歌词']]
      // 重置评论页数
      this.currentCommentPage = 1
      // 更新当前歌曲信息
      this.musicInfo = this.$store.state.musicList[this.$store.state.currentIndex]
      this.comment = {}
      // 优化性能,仅在卡片展示时才发送请求
      this.getLyric(this.$store.state.songId)
      this.getMusicComment(this.$store.state.songId)
    }
  }
}
</script>
<style scoped>
.MusicDetailCard {
  position: fixed;
  width: 100%;
  height: calc(80vh - -104px);
  bottom: 55px;
  left: 0;
  z-index: 1000;
  transition: bottom 0.5s ease;
  background-color: white;
  background-image: linear-gradient(to bottom, #eae3eb, white, white);
}
.leftImg .iconfont {
  position: absolute;
  top: 15px;
  left: 35px;
  font-size: 30px !important;
}

.MusicDetailCardCenter {
  height: 100%;
  overflow-y: scroll;
}

.top {
  display: flex;
  justify-content: center;
}

.left {
  width: 300px;
  margin: 40px 0 0 -400px;
}

.musicImg {
  margin-top: 30px;
  width: 220px;
  position: relative;
}

.needle {
  position: relative;
  left: 50%;
  width: 150px;
  height: 120px;
  z-index: 10000;
  transition: all 1s;
  transform-origin: 5.3px 5.3px;
}
.needle img {
  width: 100%;
  margin-top: 35px;
  margin-left: 15px;
}

.needleRotate {
  transform-origin: 5.3px 5.3px;
  transform: rotate(22deg);
}

.disc {
  width: 300px;
  height: 300px;
  position: relative;
  top: -12px;
}

.disc img:nth-child(1) {
  width: 100%;
}

.disc .musicAvatar {
  position: absolute;
  top: 58px;
  left: 58px;
  width: 185px;
  z-index: -1;
}

/* 碟子设置旋转动画 */
.discAnimation {
  /* infinite动画无限循环 */
  animation: disc 25s linear infinite;
  /* 动画延迟一秒 */
  animation-delay: 0.8s;
}

@keyframes disc {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.pause {
  animation-play-state: paused;
  -webkit-animation-play-state: paused;
}

.right {
  width: 350px;
}
.title {
  width: 100%;
  text-align: center;
  font-size: 16px;
  margin: 80px 0 15px;
  color: rgb(145, 145, 145);
}

.title div {
  margin: 7px 0;
}

.musicName {
  font-size: 28px;
  color: rgb(22, 22, 22);
}
.LyricsScrolling {
  margin-left: 240px;
}

.bottom {
  margin: 40px auto;
  width: 44vw;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}

.tip {
  font-size: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.changeBackground {
  position: absolute;
  bottom: 10px;
  right: 20px;
  cursor: pointer;
}

.bottom /deep/ .el-loading-spinner {
  top: 40px;
}

.album,
.singer {
  cursor: pointer;
}
/* 评论 */
.commentHeader {
  font-size: 14px;
  color: rgb(26, 26, 26);
  font-weight: 600;
  padding: 10px 0;
}
.commentItem {
  display: flex;
  margin: 5px 0;
  padding: 10px 0 20px;
  border-bottom: 1px solid #eee;
  font-size: 12px;
}

.commentCreatorAvatar {
  width: 35px;
  height: 35px;
  margin: 0px 10px 0 0;
}

.commentCreatorAvatar img {
  width: 100%;
  border-radius: 50%;
  cursor: pointer;
}

.commentMain {
  width: calc(100% - 50px);
}

.commentUserNickName {
  color: #5a8ab9;
  cursor: pointer;
}

.commentBottom {
  margin-top: 2px;
  color: rgb(172, 172, 172);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.commentButtons {
  display: flex;
  align-items: center;
}
.commentButtons div {
  margin-top: -3px;
  padding: 0 8px;
  transform: scale(0.85);
}

.commentButtons div:nth-child(1) {
  font-size: 14px;
}

.replied {
  background-color: #f4f4f4;
  margin: 7px 0;
  border-radius: 5px;
}

.repliedItem {
  padding: 7px 10px;
  line-height: 20px;
}

.repliedUser {
  color: #5a8ab9;
  cursor: pointer;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}

.commentContent > span {
  line-height: 20px;
}

.el-textarea /deep/ .el-textarea__inner {
  height: 65px !important;
  font-size: 12px;
  resize: none;
}

.el-textarea /deep/ .el-textarea__inner:focus {
  border-color: #aaa;
}

.el-textarea /deep/ .el-input__count {
  transform: scale(0.9);
}

.submitCommentButton {
  width: 100%;
  text-align: right;
  margin: 10px 0;
}

.el-button:hover {
  background-color: #f2f2f2;
}

.el-button {
  transform: scale(0.9) translateX(5%);
}

.submitComment:focus {
  background-color: #fff;
}

.commentCardSwitch {
  position: fixed;
  left: 50%;
  top: calc(80vh - 105px);
  transform: translateX(-50%) scale(0.9);
  border: none;
  background-color: #f1f1f1;
  line-height: 15px;
  padding: 10px 10px 10px 30px;
}

.commentCardSwitch:hover {
  background-color: #e1e1e1;
}

.commentCardSwitch i {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
}

.musicTitle {
  width: 100%;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 10px;
}

.musicCommentArea /deep/ .el-textarea__inner {
  height: 110px !important;
}

.musicSubmitComment {
  padding: 8px 20px;
  font-size: 13px;
  background-color: #ec4141;
  color: white;
  border: none;
}

.musicSubmitComment:hover {
  background-color: #eb2e2e;
  color: white;
}

.musicSubmitComment:focus {
  color: white;
  background-color: #ec4141;
}

.commentDialog /deep/ .el-dialog__body {
  padding-bottom: 5px !important;
}

.likeCurrentComment,
.likeCurrentComment i {
  color: #ec4141 !important;
}
</style>
