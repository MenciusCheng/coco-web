import request from '@/utils/request'

export function postList(data) {
  return request({
    url: '/dataConvert/list',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/dataConvert/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/dataConvert/update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/dataConvert/delete',
    method: 'post',
    data
  })
}
