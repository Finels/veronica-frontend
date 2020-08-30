import request from '@/utils/request'

export function fetchDetail(id) {
  return request({
    url: 'http://localhost:8090/business/coach',
    method: 'get',
    params: { id: id }
  })
}
export function fetchList(type) {
  return request({
    url: 'http://localhost:8090/business/coach/type',
    method: 'get',
    params: { type: type }
  })
}
export function fetchResourceList() {
  return request({
    url: 'http://localhost:8090/business/resource',
    method: 'get'
  })
}

export function upsertCoach(data) {
  return request({
    url: 'http://localhost:8090/business/coach',
    method: 'post',
    data: data
  })
}

export function delCoach(id) {
  return request({
    url: 'http://localhost:8090/business/coach',
    method: 'delete',
    params: { coachId: id }
  })
}

