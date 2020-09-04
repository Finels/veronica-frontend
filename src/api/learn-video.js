import request from '@/utils/request'

export function fetchDetail() {
  return request({
    url: 'http://39.106.220.164:8090/business/learn/video',
    method: 'get'
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

