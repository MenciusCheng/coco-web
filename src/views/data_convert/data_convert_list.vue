<template>
  <section>
    <el-form :inline="true" :model="dataConvertQueryForm">
      <el-form-item label="配置名称">
        <el-input v-model="dataConvertQueryForm.confName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="queryDataConvert(1)" type="primary">查询</el-button>
        <el-button @click="openDataConvertDialog(false)" type="primary">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="dataConvertTableLoading" :data="dataConvertTableData" border>
      <el-table-column align="center" label="ID" prop="id"></el-table-column>
      <el-table-column align="center" label="配置名称" prop="confName"></el-table-column>
      <el-table-column align="center" label="配置内容" prop="confContent"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createdAt"></el-table-column>
      <el-table-column align="center" label="更新时间" prop="updatedAt"></el-table-column>
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
          <el-button @click="openDataConvertDialog(true, scope.row)">修改</el-button>
          <el-button @click="deleteDataConvert(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :current-page="dataConvertPagination.page" :page-size="dataConvertPagination.size"
      :total="dataConvertPagination.total" @current-change="queryDataConvert" background
      layout="prev, pager, next, total, jumper" style="padding-top: 20px"></el-pagination>

    <el-dialog :before-close="resetDataConvertDialog" :title="dataConvertDialog.title"
      :visible.sync="dataConvertDialog.visible" width="800px">
      <el-form :inline="true" :model="dataConvert" :rules="dataConvertRules" label-width="150px" ref="dataConvert">
        <el-row>
          <el-form-item label="配置名称" prop="confName">
            <el-input v-model="dataConvert.confName"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="配置内容" prop="confContent">
            <el-input v-model="dataConvert.confContent"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="resetDataConvertDialog">取消</el-button>
        <el-button @click="submitDataConvertDialog" type="primary">确认</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import * as data_convert from '@/api/data_convert';
import { dateFormat } from '@/utils/timeUtil';

export default {
  data() {
    return {
      dataConvert: {
        confContent: '',
        confName: '',
        id: 0,
      },
      dataConvertDialog: {
        isEdit: false,
        title: '',
        visible: false
      },
      dataConvertPagination: {
        page: 1,
        size: 20,
        total: 0
      },
      dataConvertQueryForm: {
        confName: ''
      },
      dataConvertRules: {
        confContent: [],
        confName: [],
        createdAt: [],
        id: [],
        updatedAt: []
      },
      dataConvertTableData: [],
      dataConvertTableLoading: false
    }
  },
  methods: {
    queryDataConvert(page) {
      let param = {
        page: page,
        size: this.dataConvertPagination.size,
        confName: this.dataConvertQueryForm.confName,
      }
      this.dataConvertTableLoading = true;
      data_convert.postList(param).then(res => {
        let { records, total } = res.data;
        for (let i = 0; i < records.length; i++) {
          let record = records[i];
          record.createdAt = dateFormat(new Date(record.createdAt), 'yyyy-MM-dd HH:mm:ss');
          record.updatedAt = dateFormat(new Date(record.updatedAt), 'yyyy-MM-dd HH:mm:ss');
        }
        this.dataConvertTableData = records;
        this.dataConvertPagination.total = total;
        this.dataConvertPagination.page = page;
        this.dataConvertTableLoading = false;
      }).catch(err => {
        console.log(err);
        this.dataConvertTableLoading = false;
      });
    },
    deleteDataConvert(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          id: row.id,
        }
        data_convert.del(param).then(res => {
          this.$message.success('删除成功');
          this.queryDataConvert(this.dataConvertPagination.page);
        })
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    openDataConvertDialog(isEdit, row) {
      if (isEdit) {
        this.dataConvertDialog.title = '修改数据';
        this.dataConvert = {
          id: row.id,
          confName: row.confName,
          confContent: row.confContent,
        };
        this.dataConvertDialog.isEdit = true;
      } else {
        this.dataConvertDialog.title = '添加数据';
        this.dataConvertDialog.isEdit = false;
      }
      this.dataConvertDialog.visible = true;
    },
    resetDataConvertDialog() {
      this.dataConvert = {
        id: 0,
        confName: '',
        confContent: '',
      }
      this.dataConvertDialog.visible = false;
    },
    submitDataConvertDialog() {
      this.$refs['dataConvert'].validate((valid) => {
        if (valid) {
          let param = Object.assign({}, this.dataConvert);
          if (this.dataConvertDialog.isEdit) {
            this.updateDataConvert(param)
          } else {
            this.insertDataConvert(param)
          }
        } else {
          this.$message.warning('请检查参数');
          return false;
        }
      });
    },
    insertDataConvert(param) {
      this.$confirm('此操作将新增记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        data_convert.create(param).then(res => {
          this.$message.success('添加成功');
          this.queryDataConvert(this.dataConvertPagination.page);
          this.resetDataConvertDialog();
        })
      }).catch(() => {
        this.$message.info('已取消添加');
      });
    },
    updateDataConvert(param) {
      this.$confirm('此操作将修改该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        data_convert.update(param).then(res => {
          this.$message.success('修改成功');
          this.queryDataConvert(this.dataConvertPagination.page);
          this.resetDataConvertDialog();
        })
      }).catch(() => {
        this.$message.info('已取消修改');
      });
    },
  },
  async mounted() {
    this.queryDataConvert();
  }
}
</script>

<style scoped></style>
