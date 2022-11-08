import Vue from 'vue'
import VueRouter from 'vue-router'

const Index = () => import('@/views/Index.vue')
// 发现音乐
const Discover = () => import('@/views/DiscoverMusic/Discover.vue')
const recommend = () => import('@/views/DiscoverMusic/DiscoverChildren/recommend.vue')
const songsheet = () => import('@/views/DiscoverMusic/DiscoverChildren/songsheet.vue')
const ranking = () => import('@/views/DiscoverMusic/DiscoverChildren/ranking.vue')
const singer = () => import('@/views/DiscoverMusic/DiscoverChildren/singer.vue')
// 歌单
const MusicDetails = () => import('@/views/MusicDetails/MusicDetails.vue')
// 搜索列表
const search = () => import('@/views/Search/search.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/index',
    component: Index,
    // 嵌套路由
    children: [
      {
        path: '/index/discover',
        component: Discover,
        children: [
          {
            path: '/index/discover/recommend',
            component: recommend
          },
          {
            path: '/index/discover/songsheet',
            component: songsheet
          },
          {
            path: '/index/discover/ranking',
            component: ranking
          },
          {
            path: '/index/discover/singer',
            component: singer
          }

        ]
      },
      {
        name: 'MusicDetails', // 命名路由
        path: '/index/MusicDetails/:id', // 动态二级路由
        component: MusicDetails
      },
      {
        name: 'search', // 命名路由
        path: '/index/search/:id', // 动态二级路由
        component: search
      },
      {
        // 重定向(优先级最低)
        path: '/index',
        redirect: '/index/discover/recommend'
      }
    ]
  },
  // 重定向
  {
    path: '*',
    redirect: '/index'
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
