import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  // 保存数据
  plugins: [createPersistedState({
    reducer: (state) => {
      return {
        avatarUrl: state.avatarUrl,
        nickName: state.nickName,
        land: state.land,
        userId: state.userId,
        isCreatedFavorite: state.isCreatedFavorite
      }
    }
  })],

  // state 公共状态
  state: {
    // 用户登陆后图片和名称
    avatarUrl: '',
    nickName: '',
    // 用户id
    userId: '',
    // 点击头像的状态
    isPopoverShow: false,
    userAvatarName: true,
    // 登陆状态
    land: '',
    // 创建和收藏的歌单的显示隐藏
    isCreatedFavorite: false,
    // 歌曲的id和url
    songId: '',
    songUrl: '',
    // 当前的歌单和歌单id
    musicList: [],
    musicListId: '',
    // 当前歌曲索引(index)
    currentIndex: -1,
    // 歌曲详情
    songDetails: {},
    // 播放状态
    isPlay: false,
    // 歌曲时长
    duration: '00:00',
    // 当前歌曲的id
    thisMUsicId: null,
    // 当前的时间
    currentTime: 0,
    // 音乐详情卡片的显隐
    isMusicDetailCardShow: false,
    // 音乐是否在加载中
    isMusicLoad: false
  },

  // 只能支持同步
  mutations: {
    // 用户登陆后图片和名称
    clickAvatarUrl (state, avatarUrl) {
      state.avatarUrl = avatarUrl
    },
    clickNickname (state, nickName) {
      state.nickName = nickName
    },
    // 登陆状态
    isLand (state) {
      state.land = 200
    },
    // 用户id
    myUserId (state, userId) {
      state.userId = userId
    },
    // 显示和隐藏歌单
    DataisCreatedFavorite (state, isCreatedFavorite) {
      state.isCreatedFavorite = isCreatedFavorite
    },
    // 歌曲id
    SongId (state, songid) {
      state.songId = songid
    },
    // 歌曲Url
    songUrl (state, songUrl) {
      state.songUrl = songUrl
    },
    // 更新歌单列表和歌单id
    currentMusicList (state, current) {
      // 当歌单id发生变化时,重置当前播放音乐索引
      if (current.musicListId !== state.musicListId) {
        state.musicListId = current.musicListId
        state.currentIndex = -1
      }
      // 对歌单进行拷贝之后再赋值
      const musicList = current.musicList.slice(0)
      state.musicList = musicList
    },
    // 歌曲详情
    songDetails (state, songDetail) {
      state.songDetails = songDetail
    },
    // 当前的歌曲索引
    updateCurrentIndex (state, index) {
      state.currentIndex = index
    },
    // 歌曲时长
    Duration (state, duration) {
      state.duration = duration
    },
    // 上一曲
    updateLastSon (state) {
      // 循环结构
      if (state.currentIndex - 1 < 0) {
        var length = state.musicList.length
        length--
        state.currentIndex = length
        state.thisMUsicId = state.musicList[length].id
      } else if (state.currentIndex - 1 >= 0) {
        var index = state.currentIndex
        index--
        state.currentIndex = index
        state.thisMUsicId = state.musicList[index].id
      }
    },
    // 下一曲
    updateNextSon (state) {
      // 循环结构
      if (state.currentIndex + 1 === state.musicList.length) {
        var length = 0
        state.currentIndex = length
        state.thisMUsicId = state.musicList[length].id
      } else if (state.currentIndex + 1 < state.musicList.length) {
        var index = state.currentIndex
        index++
        state.currentIndex = index
        state.thisMUsicId = state.musicList[index].id
      }
    },
    // 播放状态
    changeState (state, isPlay) {
      state.isPlay = isPlay
    },
    // 当前的时间
    updateCurrentTime (state, currentTime) {
      state.currentTime = currentTime
    },
    // 音乐详情卡片的显隐
    changeMusicDetailCardState (state) {
      state.isMusicDetailCardShow = !state.isMusicDetailCardShow
    },
    // 更新音乐的加载状态
    updateMusicLoadState (state, isLoad) {
      state.isMusicLoad = isLoad
    },
    // 退出
    clickQuit (state) {
      state.avatarUrl = ''
      state.nickName = ''
      state.land = null
      state.isCreatedFavorite = false
    }
  }
})
