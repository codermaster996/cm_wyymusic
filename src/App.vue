<template>
  <div id='app' v-if="isRouterAlive">
    <!-- 路由容器 -->
    <router-view></router-view>
  </div>
</template>

<script>
  import Vue from 'vue'
  import ElementUI from 'element-ui'
  import Vant from 'vant'
  Vue.use(ElementUI, Vant) // Vue.compoent(全局定义组件)
  // 解决笔记本电脑 缩放与布局 125% 的问题
  import ScreenResolution from './util/screenResolution'

  export default {
    name: 'App',
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true
      }
    },
    // 在vue生命周期created中添加
    created() {
      new ScreenResolution().init()
    },
    methods: {
      reload() {
        this.isRouterAlive = false
        this.$nextTick(() => {
          this.isRouterAlive = true
        })
      }
    }
  }

</script>
<style lang="scss">
  * {
    padding: 0;
    margin: 0;
  }

  html,
  body {
    width: 100%;
  }

  ul,
  li {
    list-style: none;
  }

</style>
