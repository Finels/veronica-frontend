import request from '@/utils/request'

export function fetchDetail() {
  return request({
    url: 'http://39.106.220.164:8090/business/org',
    method: 'get'
  })
}

export function upsertOrg(data) {
  return request({
    url: 'http://39.106.220.164:8090/business/org',
    method: 'post',
    data: data
  })
}

