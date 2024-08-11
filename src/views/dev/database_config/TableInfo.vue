<template>
  <div>
    <el-table :data="tableInfo" style="width: 100%">
      <el-table-column prop="Field" label="字段"></el-table-column>
      <el-table-column prop="Type" label="类型"></el-table-column>
      <el-table-column prop="Null" label="允许为空"></el-table-column>
      <el-table-column prop="Key" label="键"></el-table-column>
      <el-table-column prop="Default" label="默认值"></el-table-column>
      <el-table-column prop="Extra" label="额外"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getTableInfo } from '@/api/database_config';

export default {
  props: ['configId', 'dbName', 'tableName'],
  data() {
    return {
      tableInfo: []
    };
  },
  watch: {
    tableName(newValue) {
      if (newValue) {
        this.fetchTableInfo();
      }
    }
  },
  methods: {
    fetchTableInfo() {
      getTableInfo(this.configId, this.dbName, this.tableName).then(response => {
        this.tableInfo = response.data;
      });
    }
  }
};
</script>