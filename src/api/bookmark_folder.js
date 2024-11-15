import request from '@/utils/request'

export function query(data) {
  return request({
    url: '/bookmarkFolder/query',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/bookmarkFolder/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/bookmarkFolder/update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/bookmarkFolder/delete',
    method: 'post',
    data
  })
}
