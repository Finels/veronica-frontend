import request from '@/utils/request'

export function fetchList(coachId, startDate, endDate, page, limit) {
  return request({
    url: 'http://localhost:8090/business/shiftlog',
    method: 'get',
    params: { coachId: coachId, startDate: startDate, endDate: endDate, page: page, limit: limit }
  })
}

