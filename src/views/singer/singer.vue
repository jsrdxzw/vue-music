<template>
    <div class="singer" ref="singer">
        <list-view :data="singers" @select="selectSinger" ref="list"></list-view>
        <router-view></router-view>
    </div>
</template>

<script>
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'components/listview/listview'
import { mapMutations } from 'vuex'
import * as types from 'store/mutation-types'
import { playlistMixin } from 'common/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  name: 'singer',
  mixins: [playlistMixin],
  components: { ListView },
  data () {
    return {
      singers: []
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    ...mapMutations({
      setSinger: types.SET_SINGER
    }),
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    handlePlaylist () {
      this.$refs.singer.style.bottom = this.playlist.length > 0 ? '60px' : ''
      this.$refs.list.refresh()
    },
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger (list) {
      const map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({ id: item.Fsinger_mid, name: item.Fsinger_name }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({ id: item.Fsinger_mid, name: item.Fsinger_name }))
      })
      // 得到有序列表
      const hot = []
      const ret = []
      const notRecognized = []
      for (const key in map) {
        if (map.hasOwnProperty(key)) {
          const val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          } else {
            notRecognized.push({ ...val, title: '#' })
          }
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret, notRecognized)
    }
  }
}
</script>

<style scoped lang="stylus">
.singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
