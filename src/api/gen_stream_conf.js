import request from '@/utils/request'

export function query(data) {
  return request({
    url: '/genStreamConf/query',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/genStreamConf/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/genStreamConf/update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/genStreamConf/delete',
    method: 'post',
    data
  })
}

export function gen(data) {
  return request({
    url: '/genStreamConf/gen',
    method: 'post',
    data
  })
}