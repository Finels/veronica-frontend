import request from '@/utils/request'

export function fetchNums(query) {
  return request({
    url: 'http://116.63.132.6:8080/dashboard/nums',
    method: 'get'
    // headers: { 'Content-Type': 'application/json' },
  })
}

export function fetchList(data) {
  return request({
    url: 'http://116.63.132.6:8080/dashboard/list',
    method: 'get'
  })
}

export function fetchTops(data) {
  return request({
    url: 'http://116.63.132.6:8080/dashboard/tops',
    method: 'get'
  })
}

