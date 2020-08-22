import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://localhost:8080/auth/login',
    method: 'post',
    // headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

export function getInfo() {
  return request({
    url: 'http://localhost:8080/auth/getInfo',
    method: 'get'
  })
}

export function logout(token) {
  return request({
    url: 'http://localhost:8080/auth/logout',
    method: 'get',
    params: { token: token }
  })
}

export function register(data) {
  return request({
    url: 'http://localhost:8080/auth/register',
    method: 'post',
    // headers: { 'Content-Type': 'application/json' },
    data: data
  })
}
export function del(id) {
  return request({
    url: 'http://localhost:8080/auth/del',
    method: 'get',
    // headers: { 'Content-Type': 'application/json' },
    params: { id: id }
  })
}

export function fetchList(data) {
  return request({
    url: 'http://localhost:8080/auth/list',
    method: 'get',
    // headers: { 'Content-Type': 'application/json' },
    params: data
  })
}
