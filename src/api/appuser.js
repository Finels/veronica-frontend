import request from '@/utils/request'

export function fetchList(conditionLike, page, limit) {
  return request({
    url: 'http://localhost:8080/business/appUser/list',
    method: 'get',
    params: { conditionLike: conditionLike, page: page, limit: limit }
  })
}
export function fetchUnbindList(conditionLike, page, limit) {
  return request({
    url: 'http://localhost:8080/business/appUser/unbind',
    method: 'get',
    params: { conditionLike: conditionLike, page: page, limit: limit }
  })
}
export function fetchDetail(id) {
  return request({
    url: 'http://localhost:8080/business/appUser',
    method: 'get',
    params: { id: id }
  })
}
export function updateBind(id) {
  return request({
    url: 'http://localhost:8080/business/appUser',
    method: 'put',
    params: { userId: id }
  })
}

export function upsertAppUser(data) {
  return request({
    url: 'http://localhost:8080/business/appUser',
    method: 'post',
    data: data
  })
}

