import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'http://localhost:8080/record/pagination',
    method: 'post',
    // headers: { 'Content-Type': 'application/json' },
    data: query
  })
}

