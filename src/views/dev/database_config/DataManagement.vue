<template>
  <div>
    <!-- 工具栏 -->
    <el-row :gutter="20" class="toolbar">
      <el-col :span="8">
        <el-select v-model="selectedConfigID" placeholder="选择数据源" @change="onConfigChange">
          <el-option v-for="config in configs" :key="config.id" :label="config.name" :value="config.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select v-model="selectedDatabase" placeholder="选择数据库" @change="onDatabaseChange"
          :disabled="!selectedConfigID">
          <el-option v-for="db in databases" :key="db" :label="db" :value="db"></el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select v-model="selectedTable" placeholder="选择表" @change="onTableChange" :disabled="!selectedDatabase">
          <el-option v-for="table in tables" :key="table" :label="table" :value="table"></el-option>
        </el-select>
      </el-col>
    </el-row>

    <!-- Tab 页 -->
    <el-tabs v-model="activeTab">
      <el-tab-pane label="查询表数据" name="data">
        <TableData :config-id="selectedConfigID" :db-name="selectedDatabase" :table-name="selectedTable" />
      </el-tab-pane>
      <el-tab-pane label="查询表信息" name="info">
        <TableInfo :config-id="selectedConfigID" :db-name="selectedDatabase" :table-name="selectedTable" />
      </el-tab-pane>
      <el-tab-pane label="执行 SQL 语句" name="sql">
        <ExecuteSQL :config-id="selectedConfigID" :db-name="selectedDatabase" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getAllDatabaseConfigs, getDatabases, getTables } from '@/api/database_config';
import TableData from './TableData.vue';
import TableInfo from './TableInfo.vue';
import ExecuteSQL from './ExecuteSQL.vue';

export default {
  components: {
    TableData,
    TableInfo,
    ExecuteSQL
  },
  data() {
    return {
      configs: [],
      databases: [],
      tables: [],
      selectedConfigID: null,
      selectedDatabase: null,
      selectedTable: null,
      activeTab: 'data'
    };
  },
  methods: {
    fetchConfigs() {
      getAllDatabaseConfigs().then(response => {
        this.configs = response.data;
      });
    },
    onConfigChange() {
      this.selectedDatabase = null;
      this.selectedTable = null;
      if (this.selectedConfigID) {
        getDatabases(this.selectedConfigID).then(response => {
          this.databases = response.data;
        });
      } else {
        this.databases = [];
      }
    },
    onDatabaseChange() {
      this.selectedTable = null;
      if (this.selectedConfigID && this.selectedDatabase) {
        getTables(this.selectedConfigID, this.selectedDatabase).then(response => {
          this.tables = response.data;
        });
      } else {
        this.tables = [];
      }
    },
    onTableChange() {
      // 触发tab内容更新
    }
  },
  mounted() {
    this.fetchConfigs();
  }
};
</script>

<style scoped>
.toolbar {
  margin-bottom: 20px;
}
</style>