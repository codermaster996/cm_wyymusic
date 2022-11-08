<template>
  <div class="header">
    <div class="left">
      <img src="@/assets/img/logo.png" alt="" />
    </div>
    <div class="center">
      <div class="button">
        <i class="iconfont icon-back" @click="hanleBack"></i>
        <i class="iconfont icon-more"></i>
      </div>
      <div class="search">
        <el-popover
          placement="bottom"
          width="300"
          trigger="focus"
          popper-class="search"
          v-model="isSearchPopover"
          transition="fade-in-linear"
        >
          <el-input
            class="el-input"
            size="small"
            prefix-icon="el-icon-search"
            v-model="searchInput"
            placeholder="请输入内容"
            :trigger-on-focus="false"
            slot="reference"
            @input="handleInput"
            @keyup.enter.native="onSubmit"
          >
          </el-input>
          <!-- 热搜榜 -->
          <div class="hotSearchList" v-show="searchInput.length == 0">
            <div class="hotSearch">热搜榜</div>
            <div
              class="hotSearchItem"
              v-for="(item, index) in hotSearchList"
              :key="index"
              @click="cilckHotSearchItem(item.searchWord)"
            >
              <div class="hotSearchIndex" :class="index < 3 ? 'topRed' : ''">
                {{ index + 1 }}
              </div>
              <div class="hotSearchName">
                <div
                  class="hotSearchWord"
                  :class="index < 3 ? 'hotSearchWordtopRed' : ''"
                >
                  {{ item.searchWord }}
                </div>
                <div class="hotSearchContent">
                  {{ item.content }}
                </div>
              </div>
            </div>
          </div>
          <!-- 搜索列表 -->
          <div class="SearchSuggestions" v-show="searchInput.length !== 0">
            <!-- 单曲 -->
            <div
              class="SearchSuggSongs"
              v-if="SearchSuggList.songs && SearchSuggList.songs.length !== 0"
            >
              <div class="singleName">
                <div class="el-icon-moon-night Single"></div>
                单曲
              </div>
              <div
                class="SearchSuggItem"
                v-for="(item, index) in SearchSuggList.songs"
                :key="index"
                @click="clickSuggestSong(item.id)"
              >
                {{ item.name + " - " + item.artists[0].name }}
              </div>
            </div>
            <!-- 歌手 -->
            <div
              class="SearchSuggSongs"
              v-if="
                SearchSuggList.artists && SearchSuggList.artists.length !== 0
              "
            >
              <div class="singleName">
                <div class="el-icon-s-custom Single"></div>
                歌手
              </div>
              <div
                class="SearchSuggItem"
                v-for="(item, index) in SearchSuggList.artists"
                :key="index"
                @click="SearchSuggArtists(item.id)"
              >
                {{ item.name }}
              </div>
            </div>
            <!-- 专辑 -->
            <div
              class="SearchSuggSongs"
              v-if="SearchSuggList.albums && SearchSuggList.albums.length !== 0"
            >
              <div class="singleName">
                <div class="el-icon-help Single"></div>
                专辑
              </div>
              <div
                class="SearchSuggItem"
                v-for="(item, index) in SearchSuggList.albums"
                :key="index"
                @click="SearchSuggAlbums(item.id)"
              >
                {{ item.name + " - " + item.artist.name }}
              </div>
            </div>
          </div>
        </el-popover>
      </div>
    </div>
    <div class="right">
      <!-- 未登陆文字以及logo -->
      <div class="user">
        <div class="avatar">
          <el-button
            type="text"
            @click="centerDialogVisible = true"
            v-if="$store.state.avatarUrl == ''"
          >
            <img src="@/assets/img/test.jpg" class="userImg" />
          </el-button>
          <img
            :src="$store.state.avatarUrl"
            class="userImg"
            @click="hanldAvatar"
            v-else
          />
        </div>
        <!-- 用户名称 -->
        <div class="userName" v-if="$store.state.nickName == ''">
          点击头像登陆
        </div>
        <div class="userName" v-else>
          <el-dropdown @command="handleCommand">
            <div>
              {{ $store.state.nickName
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-dialog
        :visible.sync="centerDialogVisible"
        width="400px"
        :modal="false"
        center
      >
        <!-- 头部图片 -->
        <img src="@/assets/img/LoginPicture.png" class="LonginPicture" />
        <!-- 中间输入框 -->
        <el-form class="form">
          <el-form-item>
            <el-input
              placeholder="请输入手机号"
              v-model="accountNumber"
              prefix-icon="el-icon-mobile-phone"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="请输入密码"
              v-model="password"
              prefix-icon="el-icon-lock"
              show-password
            >
            </el-input>
          </el-form-item>
        </el-form>
        <!-- 底部登陆按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="handleLand"> 登 陆 </el-button>
          <div>
            <el-button type="text" @click="centerDialogVisible = false"
              >取消登陆</el-button
            >
          </div>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import http from '@/util/http'
import playbackTime from '@/util/playbackTime'

export default {
  inject: ['reload'],
  data () {
    return {
      // 显示隐藏serachPopover
      isSearchPopover: false,
      // 热搜榜数据列表
      hotSearchList: [],
      // 搜索框的内容
      searchInput: '',
      // 搜索建议列表
      SearchSuggList: {},
      // 登陆界面显示和隐藏
      centerDialogVisible: false,
      // 账号和密码
      accountNumber: '',
      password: '',
      // 时长
      time: ''
    }
  },
  methods: {
    hanldAvatar () {
      this.centerDialogVisible = false
      console.log(1)
    },
    hanleBack () {
      this.$router.back() // 返回上一个页面
    },
    // 搜索列表
    handleInput () {
      // 搜索建议
      http({
        url: `/search/suggest?keywords= ${this.searchInput}`
      }).then((res) => {
        console.log(res.data)
        this.SearchSuggList = res.data.result
      })
    },
    // 登陆按钮
    handleLand () {
      // 登陆
      http({
        url: `/login/cellphone?phone=${this.accountNumber}&password=${this.password}`
      }).then((res) => {
        console.log(res.data)
        if (res.data.code === 502) {
          this.$message({
            message: '牛蛙,密码你都能给输错了',
            type: 'warning'
          })
        } else if (res.data.code === 400) {
          this.$message.error('请输入正确的账号和密码')
        } else if (
          this.accountNumber.length === 0 ||
          this.password.length === 0
        ) {
          this.$message.error('请输入您的账号或者密码')
        } else if (res.data.code === 200) {
          // console.log(res.data.profile)
          this.$message({
            message: '恭喜你，还记得账号密码',
            type: 'success'
          })
          this.accountNumber = ''
          this.password = ''
          this.centerDialogVisible = false
          this.userAvatarName = false

          this.$store.commit('isLand')
          this.$store.commit('myUserId', res.data.profile.userId)
          this.$store.commit('clickAvatarUrl', res.data.profile.avatarUrl)
          this.$store.commit('clickNickname', res.data.profile.nickname)
          // 控制歌单显示隐藏isCreatedFavorite
          this.$store.commit('DataisCreatedFavorite', true)
          // cookie值
          window.localStorage.setItem('cookie', res.data.cookie)
          // 刷新页面
          this.reload()
        }
      })
    },
    // 退出
    handleCommand () {
      this.$store.commit('clickQuit')
    },
    // 根据id获取歌曲详情和url
    getMusicInfo (id) {
      // 上传歌曲id
      this.$store.commit('SongId', id)
      // 上传歌曲详情
      http({
        url: '/song/detail',
        params: {
          ids: id
        }
      }).then((res) => {
        res.data.songs[0].dt = playbackTime(res.data.songs[0].dt)
        // 歌曲详情
        this.$store.commit('songDetails', res.data.songs[0])
        // 时长
        this.$store.commit('Duration', res.data.songs[0].dt)
      })
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
        }
      })
    },
    // 点击搜索单曲
    clickSuggestSong (id) {
      const row = this.getMusicInfo(id)
      this.isSearchPopover = false
      // 首先获取当前的歌单列表和歌曲索引
      const musicList = this.$store.state.musicList
      const currentIndex = this.$store.state.currentIndex
      // 先判断该歌曲是否已经在歌单中存在，避免重复点击导致歌单出现相同歌曲
      const isExist = musicList.find((item) => item.id === row.id)
      if (isExist) {
        // 如果已经存在 则只提交歌曲id并return出去
        this.$store.commit('SongId', row.id)
        return
      }
      this.$store.commit('changeState', false)
      // 将请求到的歌曲详情插入到歌单对应位置并提交至vuex
      musicList.splice(currentIndex + 1, 0, row)
      this.$store.commit('currentMusicList', {
        musicList,
        musicListId: this.$store.state.musicListId
      })
    },
    // 跳转至搜索详情页面
    goSearch () {
      this.isSearchPopover = false
      this.$router.push({
        name: 'search',
        params: {
          id: this.searchInput
        }
      })
    },
    // 回车
    onSubmit (e) {
      if (e.keyCode === 13 && this.searchInput !== '') {
        this.goSearch()
      }
    }
  },
  mounted () {
    // console.log(this.$store.state.land)
    // 热搜
    http({
      url: '/search/hot/detail'
    }).then((res) => {
      // console.log(res.data.data)
      this.hotSearchList = res.data.data
    })
    // 歌曲URL
    // http({
    //   url: '/search/hot/detail'
    // }).then((res) => {
    //   console.log(res.data.data)
    //   this.hotSearchList = res.data.data
    // })
  }
}
</script>
<style  scoped>
@import "./HeaderCss.css";
.form .el-input /deep/ input {
  background-color: white !important;
  border: 1px solid #ccc !important;
  margin: 10px 0;
  color: rgb(95, 95, 95) !important;
}

.header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  position: relative;
  z-index: 30000;
}

.left {
  float: left;
  width: 130px;
  margin-top: 4px;
}

.left img {
  width: 100%;
}

.center {
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin-left: 100px;
}
.button {
  color: #fff;
  height: 22px;
}
.button i {
  background-color: #e13e3e;
  text-align: center;
  font-size: 16px;
  transform: scale(0.8);
  padding: 5px;
  height: 22px;
  width: 22px;
  border-radius: 50%;
  margin: 0 3px;
}

.el-input {
  transform: scale(0.9);
  margin-top: -5px;
}

.hotSearchList {
  height: 400px;
  width: 280px;
  overflow: auto;
}
.hotSearch {
  font-size: 13px;
  margin: 10px 0 5px 20px;
}

.hotSearchItem {
  display: flex;
  align-items: center;
  padding: 6.5px 15px;
  cursor: pointer;
}

.hotSearchItem:hover {
  background-color: #f2f2f2;
}

.hotSearchIndex {
  margin-right: 15px;
  color: #aaa;
}

.topRed {
  color: #e13e3e;
}

.hotSearchWord {
  font-size: 12px;
  color: rgb(51, 51, 51);
}

.hotSearchWordtopRed {
  font-weight: 600;
  color: black;
}

.hotSearchContent {
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
}

.singleName {
  color: #aaa;
}

.Single {
  font-size: 18px;
  margin: 5px;
}

.SearchSuggItem {
  padding: 4px 27px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.SearchSuggItem:hover {
  background-color: #f2f2f2;
}

.SearchSuggSongs {
  cursor: pointer;
}

.right {
  margin-top: -10px;
}

.LonginPicture {
  width: 360px;
  text-align: center;
}

.user {
  margin-top: -52px;
}
.userImg {
  width: 35px;
  height: 35px;
  border-radius: 25px;
  cursor: pointer;
  margin-top: 65px;
  margin-left: 80px;
}

.userName {
  position: fixed;
  top: 17px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  width: 100px;
  margin-left: 125px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-dropdown {
  display: inline-block;
  position: relative;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}
</style>
