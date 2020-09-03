import request from '@/utils/request'

export function fetchDetail() {
  return request({
    url: 'http://localhost:8090/business/org',
    method: 'get'
  })
}

export function upsertOrg(data) {
  return request({
    url: 'http://localhost:8090/business/org',
    method: 'post',
    data: data
  })
}

