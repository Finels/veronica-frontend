import request from '@/utils/request'

export function fetchMenus() {
  return request({
    url: 'http://116.63.132.6:8080/business/store/current',
    method: 'get',
    // headers: { 'Content-Type': 'application/json' },
    params: {}
  })
}

