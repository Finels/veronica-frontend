import request from '@/utils/request'

export function fetchList(page, limit) {
  return request({
    url: 'http://39.106.220.164:8090/business/learn/video/list',
    method: 'get',
    params: { page: page, limit: limit }
  })
}

export function fetchDetail(id) {
  return request({
    url: 'http://39.106.220.164:8090/business/learn/video',
    method: 'get',
    params: { id: id }
  })
}

export function upsertLearn(data) {
  return request({
    url: 'http://39.106.220.164:8090/business/learn/video',
    method: 'post',
    data: data
  })
}

export function deleteVideo(id) {
  return request({
    url: 'http://39.106.220.164:8090/business/learn/video',
    method: 'delete',
    params: { id: id }
  })
}

