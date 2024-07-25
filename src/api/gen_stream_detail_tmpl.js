import request from '@/utils/request'

export function query(data) {
  return request({
    url: '/genStreamDetailTmpl/query',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/genStreamDetailTmpl/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/genStreamDetailTmpl/update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/genStreamDetailTmpl/delete',
    method: 'post',
    data
  })
}
