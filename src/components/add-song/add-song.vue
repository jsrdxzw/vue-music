<template>
<transition name="slide">
  <div class="add-song" v-show="showFlag" @click.stop>
    <div class="header">
      <h1 class="title">添加歌曲到列表</h1>
      <div class="close" @click="hide">
        <i class="icon-close"></i>
      </div>
    </div>
    <div class="search-box-wrapper">
      <search-box placeholder="搜索歌曲" @query="onQueryChange" ref="searchBox"></search-box>
    </div>
    <div class="shortcut" v-show="!query">
      <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
      <div class="list-wrapper">
        <scroll v-if="currentIndex===0" :data="playHistory" class="list-scroll" ref="songList">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="clickSong"></song-list>
          </div>
        </scroll>
        <scroll v-if="currentIndex===1" :data="searchHistory" class="list-scroll" ref="searchList">
          <div class="list-inner">
            <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
          </div>
        </scroll>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" :showSinger="showSinger" @select="selectSong" @listScroll="blurInput"></suggest>
    </div>
    <top-tip ref="topTip">
      <div class="tip-title">
        <i class="icon-ok"></i>
        <span class="text">添加播放队列成功</span>
      </div>
    </top-tip>
  </div>
</transition>
</template>

<script>
import SearchBox from 'components/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import { searchMixin } from 'common/js/mixin'
import Switches from 'components/switches/switches'
import Scroll from 'components/scroll/scroll'
import { mapGetters, mapActions } from 'vuex'
import SongList from 'components/song-list/song-list'
import Song from 'common/js/song'
import SearchList from 'components/search-list/search-list'
import TopTip from 'components/top-tip/top-tip'

export default {
  name: 'add-song',
  mixins: [searchMixin],
  components: { TopTip, SearchBox, Suggest, Switches, Scroll, SongList, SearchList },
  computed: {
    ...mapGetters(['playHistory', 'searchHistory'])
  },
  data () {
    return {
      showFlag: false,
      showSinger: false,
      currentIndex: 0,
      switches: [{ name: '最近播放' }, { name: '搜索历史' }]
    }
  },
  methods: {
    show () {
      this.showFlag = true
      if (this.currentIndex === 0) {
        setTimeout(() => {
          this.$refs.songList.refresh()
        }, 20)
      } else {
        setTimeout(() => {
          this.$refs.searchList.refresh()
        }, 20)
      }
    },
    hide () {
      this.showFlag = false
    },
    selectSong () {
      this.saveSearchHistory(this.query)
      this.$refs.topTip.show()
    },
    switchItem (index) {
      this.currentIndex = index
    },
    clickSong (song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song))
        this.$refs.topTip.show()
      }
    },
    ...mapActions(['insertSong'])
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
