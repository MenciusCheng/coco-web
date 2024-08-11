<template>
  <div>
    <el-table :data="tableData" style="width: 100%" v-if="tableData.length > 0">
      <el-table-column v-for="col in columns" :key="col" :prop="col" :label="col"></el-table-column>
    </el-table>
    <div v-else>请选择表</div>
  </div>
</template>

<script>
import { getTableData } from '@/api/database_config';

export default {
  props: ['configId', 'dbName', 'tableName'],
  data() {
    return {
      tableData: [],
      columns: []
    };
  },
  watch: {
    tableName(newValue) {
      if (newValue) {
        this.fetchTableData();
      }
    }
  },
  methods: {
    fetchTableData() {
      getTableData(this.configId, this.dbName, this.tableName).then(response => {
        if (response.data.length > 0) {
          this.columns = Object.keys(response.data[0]);
        }
        this.tableData = response.data;
      });
    }
  }
};
</script>
