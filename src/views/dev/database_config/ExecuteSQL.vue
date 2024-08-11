<template>
  <div>
    <el-input type="textarea" v-model="sql" rows="5" placeholder="输入 SQL 语句" style="margin-bottom: 20px;"></el-input>
    <el-button type="primary" @click="executeSQL">执行</el-button>

    <el-table :data="queryResult" style="width: 100%; margin-top: 20px;" v-if="queryResult.length > 0">
      <el-table-column v-for="col in columns" :key="col" :prop="col" :label="col"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { executeSQL } from '@/api/database_config';

export default {
  props: ['configId', 'dbName'],
  data() {
    return {
      sql: '',
      queryResult: [],
      columns: []
    };
  },
  methods: {
    executeSQL() {
      executeSQL(this.configId, this.dbName, { sql: this.sql }).then(response => {
        if (response.data.length > 0) {
          this.columns = Object.keys(response.data[0]);
        }
        this.queryResult = response.data;
      });
    }
  }
};
</script>