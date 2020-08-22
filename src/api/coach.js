import request from '@/utils/request'

export function fetchDetail(id) {
  return request({
    url: 'http://localhost:8080/business/coach',
    method: 'get',
    params: { id: id }
  })
}
export function fetchList(type) {
  return request({
    url: 'http://localhost:8080/business/coach/type',
    method: 'get',
    params: { type: type }
  })
}

export function upsertCoach(data) {
  return request({
    url: 'http://localhost:8080/business/coach',
    method: 'post',
    data: data
  })
}
