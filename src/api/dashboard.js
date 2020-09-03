import request from '@/utils/request'

export function fetchNums(query) {
  return request({
    url: 'http://localhost:8090/business/dashboard',
    method: 'get'
    // headers: { 'Content-Type': 'application/json' },
  })
}

export function fetchList(data) {
  return request({
    url: 'http://localhost:8090/dashboard/list',
    method: 'get'
  })
}

export function fetchTops(data) {
  return request({
    url: 'http://localhost:8090/dashboard/tops',
    method: 'get'
  })
}

