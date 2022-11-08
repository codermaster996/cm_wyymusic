<template>
  <div class="SearchSong">
    <div class="tip">找到 {{ songCount }} 首单曲</div>
    <div class="multiMatch" v-if="multiMatch.artist && currentPage == 1">
      <div class="matchTitle">最佳匹配</div>
      <div
        class="matchResult"
        @click="goToSingerDetail(multiMatch.artist[0].id)"
      >
        <div class="matchCover">
          <img
            :src="multiMatch.artist[0].img1v1Url + '?param==200y200'"
            alt=""
          />
        </div>
        <div class="matchName">歌手：{{ multiMatch.artist[0].name }}</div>
        <i class="iconfont icon-arrow-right-bold"></i>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="searchSongList"
      size="mini"
      style="width: 100%"
      @row-dblclick="clickRow"
      @cell-click="clickCell"
      highlight-current-row
      stripe
    >
      <el-table-column label="" width="30" type="index" :index="handleIndex">
      </el-table-column>
      <el-table-column prop="name" label="音乐标题" min-width="200">
      </el-table-column>
      <el-table-column prop="ar[0].name" label="歌手" min-width="100">
      </el-table-column>
      <el-table-column prop="al.name" label="专辑" min-width="170">
      </el-table-column>
      <el-table-column prop="dt" label="时长" min-width="60"> </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="page" v-if="searchSongList.length != 0">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="songCount"
        small
        :page-size="30"
        :current-page="currentPage"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import playbackTime from '@/util/playbackTime'
import http from '@/util/http'

export default {
  name: 'SearchSong',
  data () {
    return {
      multiMatch: {},
      searchSongList: [],
      songCount: 0,
      currentPage: 1
    }
  },
  methods: {
    // 事件响应
    // 处理索引
    handleIndex (index) {
      // console.log(index);
      index = index + 1 + 30 * (this.currentPage - 1)
      if (index < 10) {
        return '0' + index
      } else {
        return index
      }
    },
    // 双击table的row的回调
    clickRow (row) {
      this.getMusicInfo(row.id)
      // 这里双击应该是要把当前双击的歌曲插入到当前的歌单中
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
      this.$store.commit('SongId', row.id)
      this.$store.commit('currentMusicList', {
        musicList,
        musicListId: this.$store.state.musicListId
      })
    },
    // 评论点击翻页的回调
    pageChange (page) {
      this.currentPage = page
      this.searchSongList = []
      this.getSearchSong()
    },
    // 点击最佳匹配的回调
    goToSingerDetail (id) {
      this.$router.push({ name: 'singerDetail', params: { id } })
    },
    // 请求搜索单曲
    getSearchSong () {
      // 请求搜索单曲
      http({
        url: '/cloudsearch',
        params: {
          keywords: this.$route.params.id,
          offset: 30 * (this.currentPage - 1)
        }
      }).then((res) => {
        console.log(res)
        this.songCount = res.data.result.songCount
        this.searchSongList = res.data.result.songs
        // 对数据的音乐时长进行处理
        this.searchSongList.forEach((item, index) => {
          this.searchSongList[index].dt = playbackTime(item.dt)
        })
      })
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
    }
  },
  mounted () {
    // 请求
    // 获取最佳匹配
    http({
      url: '/search/multimatch',
      params: {
        keywords: this.$route.params.id
      }
    }).then((res) => {
      this.multiMatch = res.data.result
    })

    // 请求搜索单曲
    this.getSearchSong()
  },
  watch: {}
}
</script>

<style scoped>
@import "./Discover.css";
.SearchSong {
  padding: 0 15px;
}

.tip {
  font-weight: bold;
  color: rgb(34, 34, 34);
  margin-bottom: 10px;
}

.matchTitle {
  font-size: 12px;
  color: rgb(34, 34, 34);
  margin: 5px 0;
}

.matchResult {
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  background-color: #f4f4f4;
  width: 270px;
  height: 65px;
  margin-bottom: 20px;
  cursor: pointer;
}

.matchCover {
  width: 65px;
  height: 65px;
}

.matchCover img {
  width: 100%;
  height: 100%;
}

.matchName {
  font-size: 13px;
  color: rgb(31, 31, 31);
  margin-left: 10px;
}

.multiMatch i {
  position: absolute;
  transform: translateY(-50%);
  right: 15px;
  top: 50%;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 50px;
  margin: 20px 0;
}
</style>
