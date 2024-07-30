import request from '@/utils/request'

export function query(data) {
  return request({
    url: '/actJsonConf/query',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/actJsonConf/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/actJsonConf/update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/actJsonConf/delete',
    method: 'post',
    data
  })
}
