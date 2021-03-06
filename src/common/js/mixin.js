import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import * as types from 'store/mutation-types'

export const playlistMixin = {
  computed: {
    ...mapGetters(['playlist'])
  },
  mounted () {
    this.handlePlaylist()
  },
  activated () {
    this.handlePlaylist()
  },
  methods: {
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist method')
    }
  },
  watch: {
    playlist () {
      this.handlePlaylist()
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    favoriteIcon () {
      return this.getFavoriteIcon(this.currentSong)
    },
    ...mapGetters(['sequenceList', 'currentSong', 'mode', 'playlist', 'favoriteList'])
  },
  methods: {
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    resetCurrentIndex (list) {
      const index = list.findIndex((item) => item.id === this.currentSong.id)
      this.setCurrentIndex(index)
    },
    getFavoriteIcon (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    toggleFavorite (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite (song) {
      return this.favoriteList.findIndex((item) => item.id === song.id) > -1
    },
    ...mapMutations({
      setCurrentIndex: types.SET_CURRENT_INDEX,
      setPlayMode: types.SET_PLAY_MODE,
      setPlaylist: types.SET_PLAYLIST,
      setPlayingState: types.SET_PLAYING_STATE
    }),
    ...mapActions(['saveFavoriteList', 'deleteFavoriteList'])
  }
}

export const searchMixin = {
  computed: {
    ...mapGetters(['searchHistory'])
  },
  data () {
    return {
      query: ''
    }
  },
  methods: {
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange (query) {
      this.query = query
    },
    blurInput () {
      this.$refs.searchBox.blur()
    },
    select () {
      this.saveSearchHistory(this.query)
    },
    ...mapActions(['deleteSearchHistory', 'saveSearchHistory'])
  }
}
