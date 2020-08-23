import request from '@/utils/request'

export function fetchMenus() {
  return request({
    url: 'http://39.106.220.164:8090/business/store/current',
    method: 'get',
    // headers: { 'Content-Type': 'application/json' },
    params: {}
  })
}

