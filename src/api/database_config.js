import request from '@/utils/request'

export function createDatabaseConfig(data) {
  return request({
    url: '/db/config',
    method: 'post',
    data
  })
}

export function getAllDatabaseConfigs() {
  return request({
    url: '/db/configs',
    method: 'get'
  })
}

export function getDatabaseConfigByID(id) {
  return request({
    url: `/db/config/${id}`,
    method: 'get'
  })
}

export function updateDatabaseConfig(id, data) {
  return request({
    url: `/db/config/${id}`,
    method: 'put',
    data
  })
}

export function deleteDatabaseConfig(id) {
  return request({
    url: `/db/config/${id}`,
    method: 'delete'
  })
}

export function testDatabaseConnection(data) {
  return request({
    url: `/db/config/test`,
    method: 'post',
    data
  })
}

export function getDatabases(configID) {
  return request({
    url: `/db/config/${configID}/databases`,
    method: 'get'
  })
}

export function getTables(configID, dbName) {
  return request({
    url: `/db/config/${configID}/database/${dbName}/tables`,
    method: 'get'
  })
}

export function getTableInfo(configID, dbName, tableName) {
  return request({
    url: `/db/config/${configID}/database/${dbName}/table/${tableName}/info`,
    method: 'get'
  })
}

export function getTableData(configID, dbName, tableName, params) {
  return request({
    url: `/db/config/${configID}/database/${dbName}/table/${tableName}/data`,
    method: 'get',
    params
  })
}

export function executeSQL(configID, dbName, data) {
  return request({
    url: `/db/config/${configID}/database/${dbName}/execute`,
    method: 'post',
    data
  })
}
