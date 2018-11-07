<template>
    <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType">
        <ul>
            <li v-for="group in data" class="list-group" :key="group.title" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="item in group.items" :key="item.id" class="list-group-item" @click="selectItem(item)">
                        <img v-lazy="item.avatar" alt="" class="avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
          <ul>
            <li v-for="(item,index) in shortcutList" :key="item" class="item" :data-index="index" :class="{current:currentIndex===index}">{{item}}</li>
          </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
          <h1 class="fixed-title">{{fixedTitle}}</h1>
        </div>
        <loading v-show="!data.length" class="loading-container"></loading>
    </scroll>
</template>

<script>
import Scroll from 'components/scroll/scroll'
import Loading from 'components/loading/loading'
import { getData } from 'common/js/dom'
const ANTHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  name: 'listview',
  components: { Scroll, Loading },
  created () {
    this.touch = {}
    this.listenScroll = true
    this.probeType = 3
    this.listHeight = []
  },
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  computed: {
    shortcutList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? (this.currentIndex === this.data.length - 1 ? this.data[this.currentIndex - 1].title : this.data[this.currentIndex].title) : ''
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    onShortcutTouchStart (event) {
      const anchorIndex = getData(event.target, 'index')
      this.touch.startY = event.touches[0].pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      this.touch.moveY = e.touches[0].pageY
      const delta = Math.floor((this.touch.moveY - this.touch.startY) / ANTHOR_HEIGHT)
      const anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    _scrollTo (anchorIndex) {
      if (!anchorIndex) return
      if (anchorIndex < 0) {
        anchorIndex = 0
      } else if (anchorIndex > this.listHeight.length - 2) {
        anchorIndex = this.listHeight.length - 2
      }
      this.currentIndex = parseInt(anchorIndex)
      this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    refresh () {
      this.$refs.listview.refresh()
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      list.forEach((item) => {
        height += item.clientHeight
        this.listHeight.push(height)
      })
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        const current = listHeight[i]
        const next = listHeight[i + 1]
        if ((-newY >= current && -newY < next)) {
          this.currentIndex = i
          this.diff = next + newY
          return
        }
      }
      this.currentIndex = 0
    },
    diff (newVal) {
      let fixedTop = 0
      if (newVal > 0 && newVal < TITLE_HEIGHT) {
        fixedTop = TITLE_HEIGHT - newVal
      } else {
        fixedTop = 0
      }
      if (this.fixedTop === fixedTop) return
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${-fixedTop}px,0)`
    }
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
