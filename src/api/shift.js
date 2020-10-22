import request from '@/utils/request'

export function fetchDetail(id) {
  return request({
    url: 'http://39.106.220.164:8090/business/shift',
    method: 'get',
    params: { id: id }
  })
}
export function fetchList(coachId, page, limit) {
  return request({
    url: 'http://39.106.220.164:8090/business/shift/coach',
    method: 'get',
    params: { coachId: coachId, page: page, limit: limit }
  })
}
export function fetchList1(param) {
  return request({
    url: 'http://39.106.220.164:8090/business/shift/coach',
    method: 'get',
    params: param
  })
}

export function upsertShift(data) {
  return request({
    url: 'http://39.106.220.164:8090/business/shift',
    method: 'post',
    data: data
  })
}

export function batchUpsertShift(data) {
  return request({
    url: 'http://39.106.220.164:8090/business/shift/batch',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'application/json' }
  })
}

export function delShift(id) {
  return request({
    url: 'http://39.106.220.164:8090/business/shift',
    method: 'delete',
    params: { shiftId: id }
  })
}

