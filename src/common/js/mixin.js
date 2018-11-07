import { mapGetters } from 'vuex'
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
