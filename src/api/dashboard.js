import request from '@/utils/request'

export function fetchNums(query) {
  return request({
    url: 'http://39.106.220.164:8090/business/dashboard',
    method: 'get'
    // headers: { 'Content-Type': 'application/json' },
  })
}

export function fetchList(data) {
  return request({
    url: 'http://39.106.220.164:8090/dashboard/list',
    method: 'get'
  })
}

export function fetchTops(data) {
  return request({
    url: 'http://39.106.220.164:8090/dashboard/tops',
    method: 'get'
  })
}

