const router = require('express').Router()
const axios = require('axios')

router.get('/getDistList', (req, res) => {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/portal/playlist.html'
    },
    params: req.query
  }).then((result) => {
    res.json(result.data)
  }).catch((err) => {
    console.log(err)
    res.json({ err_ok: 1, err_msg: err.message })
  })
})

router.post('/getPurlUrl', (req, res) => {
  const url = 'http://ustbhuangyi.com/music/api/getPurlUrl'
  const { comm, url_mid } = req.body
  axios.post(url, {
    comm,
    url_mid
  }).then((result) => {
    res.json(result.data)
  }).catch((err) => {
    console.log(err)
    res.json({ err_ok: 1, err_msg: err.message })
  })
})

router.get('/lyric', (req, res) => {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((result) => {
    let data = result.data
    if (typeof data === 'string') {
      const reg = /^\w+\((.*)\)$/
      if (data.match(reg)) {
        data = JSON.parse(data.match(reg)[1])
        res.json(data)
      } else {
        res.json({ err_ok: 1, err_msg: '获取失败' })
      }
    }
  }).catch((err) => {
    console.log(err)
    res.json({ err_ok: 1, err_msg: err.message })
  })
})

router.get('/getCdInfo', (req, res) => {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/'
    },
    params: req.query
  }).then((result) => {
    let data = result.data
    const reg = /^\w+\((.*)\)$/
    data = data.match(reg)
    if (data) {
      data = JSON.parse(data[1])
    }
    res.json(data)
  }).catch((err) => {
    console.log(err)
    res.json({ err_ok: 1, err_msg: err.message })
  })
})

router.get('/search', (req, res) => {
  const url = 'https://shc.y.qq.com/soso/fcgi-bin/client_search_cp'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com'
    },
    params: req.query
  }).then((result) => {
    res.json(result.data)
  }).catch((err) => {
    console.log(err)
    res.json({ err_ok: 1, err_msg: err.message })
  })
})

module.exports = router
