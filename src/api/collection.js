import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'http://116.63.132.6:8080/collection/pagination',
    method: 'post',
    // headers: { 'Content-Type': 'application/json' },
    data: query
  })
}

export function fetchDetail(id) {
  return request({
    url: 'http://116.63.132.6:8080/collection',
    method: 'get',
    params: { id: id }
  })
}

export function upsertCollection(data) {
  return request({
    url: 'http://116.63.132.6:8080/collection',
    method: 'post',
    data: data
  })
}

export function deleteCollection(id) {
  return request({
    url: 'http://116.63.132.6:8080/collection',
    method: 'delete',
    params: { id: id }
  })
}
