import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'views/recommend/recommend'
// import Rank from 'views/rank/rank'
// import Search from 'views/search/search'
// import Singer from 'views/singer/singer'
// import SingerDetail from 'views/singer-detail/singer-detail'
// import Disc from 'views/disc/disc'
// import TopList from 'views/top-list/top-list'
// import UserCenter from 'views/user-center/user-center'
import Loading from 'components/loading/loading'
import NoResult from 'components/no-result/no-result'

Vue.use(Router)

const Recommend = () => ({
  component: import('views/recommend/recommend'),
  loading: Loading,
  error: NoResult
})

const Search = () => ({
  component: import('views/search/search'),
  loading: Loading,
  error: NoResult
})

const Rank = () => ({
  component: import('views/rank/rank'),
  loading: Loading,
  error: NoResult
})

const Singer = () => ({
  component: import('views/singer/singer'),
  loading: Loading,
  error: NoResult
})

const SingerDetail = () => ({
  component: import('views/singer-detail/singer-detail'),
  loading: Loading,
  error: NoResult
})

const Disc = () => ({
  component: import('views/disc/disc'),
  loading: Loading,
  error: NoResult
})

const UserCenter = () => ({
  component: import('views/user-center/user-center'),
  loading: Loading,
  error: NoResult
})

const TopList = () => ({
  component: import('views/top-list/top-list'),
  loading: Loading,
  error: NoResult
})

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
