<template>
<scroll class="suggest" :data="result" :listenPullingUp="pullUp" @pullingUp="searchMore" ref="suggest" :beforeScroll="beforeScroll" @beforeScroll="listScroll">
  <ul class="suggest-list">
    <li class="suggest-item" v-for="(item,index) in result" :key="index" @click="selectItem(item)">
      <div class="icon">
        <i :class="getIconCls(item)"></i>
      </div>
      <div class="name">
        <p class="text" v-html="getDisplayName(item)"></p>
      </div>
    </li>
    <loading v-show="hasMore" title=""></loading>
  </ul>
  <div class="no-result-wrapper" v-show="!hasMore && result.length===0">
    <no-result title="抱歉，暂无搜索结果"></no-result>
  </div>
</scroll>
</template>

<script>
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import Scroll from 'components/scroll/scroll'
import Loading from 'components/loading/loading'
import Singer from 'common/js/singer'
import { mapMutations, mapActions } from 'vuex'
import * as types from 'store/mutation-types'
import NoResult from 'components/no-result/no-result'

const TYPE_SINGER = 'singer'

export default {
  name: 'suggest',
  components: { Scroll, Loading, NoResult },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    },
    pullUp: {
      type: Boolean,
      default: true
    },
    perPage: {
      type: Number,
      default: 20
    },
    beforeScroll: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      hasMore: true
    }
  },
  methods: {
    search () {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, this.perPage).then((result) => {
        if (result.code === ERR_OK) {
          this._genResult(result.data).then((res) => {
            this.result = res
            this._checkMore(result.data)
          }).catch(() => {
            this.hasMore = false
          })
        } else {
          this.hasMore = false
        }
      }).catch(() => {
        this.hasMore = false
      })
    },
    searchMore () {
      if (!this.hasMore) return
      this.page = this.page + 1
      search(this.query, this.page, this.showSinger, this.perPage).then((result) => {
        if (result.code === ERR_OK) {
          this._genResult(result.data).then((res) => {
            this.result = this.result.concat(res)
            this.$refs.suggest.finishPullUp()
            this._checkMore(result.data)
          }).catch(() => {
            this.hasMore = false
          })
        } else {
          this.hasMore = false
        }
      }).catch(() => {
        this.hasMore = false
      })
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singerMID,
          name: item.singerName
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select', item)
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singerName
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.zhida_singer) {
        ret.push({ ...data.zhida.zhida_singer, type: TYPE_SINGER })
      }
      return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
        ret = ret.concat(songs)
        return ret
      }).catch(() => {
        this.hasMore = false
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum * song.curpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    listScroll () {
      this.$emit('listScroll')
    },
    ...mapMutations({
      setSinger: types.SET_SINGER
    }),
    ...mapActions(['insertSong'])
  },
  watch: {
    query () {
      this.search()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
