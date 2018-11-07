<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll" @pullingUp="pullingUp" :listenPullingUp="listenPullingUp">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item" :key="item.dissid" @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.imgurl" alt="" height="60" width="60" @load="loadImg">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Slider from 'components/slider/slider'
import Scroll from 'components/scroll/scroll'
import Loading from 'components/loading/loading'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import * as types from 'store/mutation-types'
import { playlistMixin } from 'common/js/mixin'

export default {
  name: 'recommend',
  mixins: [playlistMixin],
  components: { Slider, Scroll, Loading },
  created () {
    this._getRecommend()
    this._getDiscList()
    this.listenPullingUp = true
    this.currentPageIndex = 0
  },
  computed: {
    ...mapGetters(['discList'])
  },
  data () {
    return {
      recommends: [],
      checkLoaded: false
    }
  },
  methods: {
    selectItem (item) {
      this.$router.push({
        path: `recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    _getRecommend () {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList () {
      this.getDiscListByPageIndex({ pageIndex: this.currentPageIndex })
    },
    loadImg () {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    pullingUp () {
      this.currentPageIndex += 1
      this.getDiscListByPageIndex({ pageIndex: this.currentPageIndex }).then((res) => {
        this.$refs.scroll.finishPullUp()
      })
    },
    handlePlaylist () {
      this.$refs.recommend.style.bottom = this.playlist.length > 0 ? '60px' : ''
      this.$refs.scroll.refresh()
    },
    ...mapMutations({
      setDisc: types.SET_DISC
    }),
    ...mapActions(['getDiscListByPageIndex'])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
