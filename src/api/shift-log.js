import request from '@/utils/request'

export function fetchList(coachId, startDate, endDate, page, limit) {
  return request({
    url: 'http://39.106.220.164:8090/business/shiftlog',
    method: 'get',
    params: { coachId: coachId, startDate: startDate, endDate: endDate, page: page, limit: limit }
  })
}

