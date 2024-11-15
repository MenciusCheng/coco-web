import request from '@/utils/request'

export function query(data) {
  return request({
    url: '/bookmark/query',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/bookmark/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/bookmark/update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/bookmark/delete',
    method: 'post',
    data
  })
}
