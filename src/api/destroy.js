import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'http://localhost:8080/destroy/pagination',
    method: 'post',
    // headers: { 'Content-Type': 'application/json' },
    data: query
  })
}

export function persist(data) {
  return request({
    url: 'http://localhost:8080/destroy',
    method: 'post',
    data: data
  })
}

