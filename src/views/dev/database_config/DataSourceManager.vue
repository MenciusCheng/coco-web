<template>
  <div>
    <el-button type="primary" @click="openDialog(null)">新增数据源</el-button>
    <el-table :data="configs" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="host" label="主机" width="180"></el-table-column>
      <el-table-column prop="port" label="端口" width="80"></el-table-column>
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row)" type="primary" size="mini">编辑</el-button>
          <el-button @click="deleteConfig(scope.row.id)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" title="数据源配置">
      <el-form :model="currentConfig" ref="configForm">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="currentConfig.name"></el-input>
        </el-form-item>
        <el-form-item label="主机" :label-width="formLabelWidth">
          <el-input v-model="currentConfig.host"></el-input>
        </el-form-item>
        <el-form-item label="端口" :label-width="formLabelWidth">
          <el-input v-model.number="currentConfig.port" type="number"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="currentConfig.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="currentConfig.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="数据库" :label-width="formLabelWidth">
          <el-input v-model="currentConfig.database"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="testConnection">测试连接</el-button>
        <el-button type="primary" @click="saveConfig">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllDatabaseConfigs,
  createDatabaseConfig,
  updateDatabaseConfig,
  deleteDatabaseConfig,
  testDatabaseConnection
} from '@/api/database_config';

export default {
  data() {
    return {
      configs: [],
      dialogVisible: false,
      currentConfig: {},
      formLabelWidth: '120px',
    };
  },
  methods: {
    fetchConfigs() {
      getAllDatabaseConfigs().then(response => {
        this.configs = response.data;
      });
    },
    openDialog(config) {
      if (config) {
        this.currentConfig = { ...config };
      } else {
        this.currentConfig = {
          name: '',
          host: '',
          port: 3306, // 设置默认端口
          username: '',
          password: '',
          database: ''
        };
      }
      this.dialogVisible = true;
    },
    saveConfig() {
      const form = this.$refs.configForm;
      form.validate(valid => {
        if (valid) {
          if (this.currentConfig.id) {
            updateDatabaseConfig(this.currentConfig.id, this.currentConfig).then(() => {
              this.fetchConfigs();
              this.dialogVisible = false;
            });
          } else {
            createDatabaseConfig(this.currentConfig).then(() => {
              this.fetchConfigs();
              this.dialogVisible = false;
            });
          }
        }
      });
    },
    deleteConfig(id) {
      this.$confirm('此操作将永久删除该数据源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDatabaseConfig(id).then(() => {
          this.fetchConfigs();
        });
      }).catch(() => { });
    },
    testConnection() {
      testDatabaseConnection(this.currentConfig).then(response => {
        this.$message({
          message: '连接成功!',
          type: 'success'
        });
      }).catch(error => {
        this.$message.error('连接失败: ' + error.message);
      });
    }
  },
  mounted() {
    this.fetchConfigs();
  }
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
