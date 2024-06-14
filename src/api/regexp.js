import request from '@/utils/request'

export function postFind(data) {
  return request({
    url: '/regexp/find',
    method: 'post',
    data
  })
}

export function postReplace(data) {
  return request({
    url: '/regexp/replace',
    method: 'post',
    data
  })
}