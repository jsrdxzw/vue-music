<template>
<transition name="slide">
  <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
</transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { getSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { createSong, processSongsUrl, isValidMusic } from 'common/js/song'

import { mapGetters } from 'vuex'
export default {
  name: 'disc',
  components: { MusicList },
  data () {
    return {
      songs: []
    }
  },
  mounted () {
    this._getSongList()
  },
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },
    ...mapGetters(['disc'])
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) return this.$router.push('/recommend')
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs) => {
            this.songs = songs
          }).catch((err) => {
            console.log(err)
            this.$router.back()
          })
        }
      }).catch((err) => {
        console.log(err)
        this.$router.back()
      })
    },
    _normalizeSongs (list) {
      const ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<style scoped lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
