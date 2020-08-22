import request from '@/utils/request'

export function fetchDetail(id) {
  return request({
    url: 'http://localhost:8080/business/shift',
    method: 'get',
    params: { id: id }
  })
}
export function fetchList(coachId, page, limit) {
  return request({
    url: 'http://localhost:8080/business/shift/coach',
    method: 'get',
    params: { coachId: coachId, page: page, limit: limit }
  })
}

export function upsertShift(data) {
  return request({
    url: 'http://localhost:8080/business/shift',
    method: 'post',
    data: data
  })
}

