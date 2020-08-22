import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'http://localhost:8080/accident/pagination',
    method: 'post',
    // headers: { 'Content-Type': 'application/json' },
    data: query
  })
}

export function persist(data) {
  return request({
    url: 'http://localhost:8080/accident',
    method: 'post',
    data: data
  })
}

