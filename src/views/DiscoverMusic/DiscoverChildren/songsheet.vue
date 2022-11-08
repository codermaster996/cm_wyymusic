<template>
  <div class="musicListContainer">
    <div class="musicList">
      <song-sheet></song-sheet>
    </div>
  </div>
</template>
<script>
import SongSheet from '@/mycomponents/discoverMusic/SongSheet.vue'

export default {
  components: {
    SongSheet
  }
}
</script>

<style lang="scss" scoped>
.musicListContainer {
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 75px;
}

.musicList {
  width: 1200px;
}
</style>
