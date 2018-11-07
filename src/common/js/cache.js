import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

export function saveSearch (query) {
  query = query && query.trim()
  const searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function deleteSearch (query) {
  const searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, query)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

function insertArray (arr, val, maxLen) {
  const index = arr.findIndex((item) => {
    return item === val
  })
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray (arr, val) {
  const index = arr.findIndex((item) => {
    return item === val
  })
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}
