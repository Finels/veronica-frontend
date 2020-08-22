import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'http://localhost:8080/business/pagination',
    method: 'post',
    // headers: { 'Content-Type': 'application/json' },
    data: query
  })
}

export function persist(data) {
  return request({
    url: 'http://localhost:8080/business/store',
    method: 'post',
    data: data
  })
}

export function inStoreBusiness(data) {
  return request({
    url: 'http://localhost:8080/business/in',
    method: 'post',
    data: data
  })
}

export function outStoreBusiness(data) {
  return request({
    url: 'http://localhost:8080/business/out',
    method: 'post',
    data: data
  })
}

export function moveBusiness(data) {
  return request({
    url: 'http://localhost:8080/business/move',
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
export function listExport(query) {
  return request({
    url: 'http://localhost:8080/business/export',
    method: 'post',
    data: query
  })
}

