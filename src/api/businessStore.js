import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'http://localhost:8080/business/store/pagination',
    method: 'post',
    // headers: { 'Content-Type': 'application/json' },
    data: query
  })
}

export function fetchBusinessStore(cid, name) {
  return request({
    url: 'http://localhost:8080/business/store/current',
    method: 'get',
    // headers: { 'Content-Type': 'application/json' },
    params: { cid: cid, name: name }
  })
}

export function persist(data) {
  return request({
    url: 'http://localhost:8080/business/store',
    method: 'post',
    data: data
  })
}

export function del(id) {
  return request({
    url: 'http://localhost:8080/business/store',
    method: 'delete',
    params: { id: id }
  })
}

