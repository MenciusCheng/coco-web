<template>
  <section>
    <el-form :inline="true" :model="actJsonConfQueryForm" size="small" @submit.native.prevent>
      <el-form-item label="名称">
        <el-input v-model="actJsonConfQueryForm.name"></el-input>
      </el-form-item>
      <el-form-item label="扩展配置">
        <el-input v-model="actJsonConfQueryForm.extend"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="queryActJsonConf(1)" type="primary">查询</el-button>
        <el-button @click="openActJsonConfDialog(false)" type="primary">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="actJsonConfTableLoading" :data="actJsonConfTableData" border>
      <el-table-column align="center" label="ID" prop="id"></el-table-column>
      <el-table-column align="center" label="名称" prop="name"></el-table-column>
      <el-table-column align="center" label="扩展配置" prop="extend"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createdAt"></el-table-column>
      <el-table-column align="center" label="更新时间" prop="updatedAt"></el-table-column>
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
          <el-button @click="openActJsonConfDialog(true, scope.row)">修改</el-button>
          <el-button @click="deleteActJsonConf(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :current-page="actJsonConfPagination.page" :page-size="actJsonConfPagination.size"
      :total="actJsonConfPagination.total" @current-change="queryActJsonConf" background
      layout="prev, pager, next, total, jumper" style="padding-top: 20px"></el-pagination>

    <el-dialog :before-close="resetActJsonConfDialog" :title="actJsonConfDialog.title"
      :visible.sync="actJsonConfDialog.visible" width="800px">
      <el-form :model="actJsonConf" :rules="actJsonConfRules" label-width="150px" ref="actJsonConf">
        <el-row>
          <el-form-item label="名称" prop="name">
            <el-input v-model="actJsonConf.name"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="扩展配置" prop="extend">
            <el-input v-model="actJsonConf.extend"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="resetActJsonConfDialog">取消</el-button>
        <el-button @click="submitActJsonConfDialog" type="primary">确认</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import * as apiActJsonConfConf from '@/api/act_json_conf';
import { dateFormat } from '@/utils/timeUtil';

export default {
  data() {
    return {
      actJsonConf: {
        id: 0,
        name: '',
        extend: '',
      },
      actJsonConfDialog: {
        isEdit: false,
        title: '',
        visible: false
      },
      actJsonConfPagination: {
        page: 1,
        size: 20,
        total: 0
      },
      actJsonConfQueryForm: {
        name: '',
        extend: '',
      },
      actJsonConfRules: {
        id: [],
        name: [],
        extend: [],
      },
      actJsonConfTableData: [],
      actJsonConfTableLoading: false
    }
  },
  methods: {
    queryActJsonConf(page) {
      let param = {
        page: page,
        size: this.actJsonConfPagination.size,
        name: this.actJsonConfQueryForm.name,
        extend: this.actJsonConfQueryForm.extend,
      }
      this.actJsonConfTableLoading = true;
      apiActJsonConfConf.query(param).then(res => {
        let { list, total } = res.data;
        for (let i = 0; i < list.length; i++) {
          let record = list[i];
          record.createdAt = dateFormat(new Date(record.createdAt), 'yyyy-MM-dd HH:mm:ss');
          record.updatedAt = dateFormat(new Date(record.updatedAt), 'yyyy-MM-dd HH:mm:ss');
        }
        this.actJsonConfTableData = list;
        this.actJsonConfPagination.total = total;
        this.actJsonConfPagination.page = page;
        this.actJsonConfTableLoading = false;
      }).catch(err => {
        console.log(err);
        this.actJsonConfTableLoading = false;
      });
    },
    deleteActJsonConf(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          id: row.id,
        }
        apiActJsonConfConf.del(param).then(res => {
          this.$message.success('删除成功');
          this.queryActJsonConf(this.actJsonConfPagination.page);
        })
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    openActJsonConfDialog(isEdit, row) {
      if (isEdit) {
        this.actJsonConfDialog.title = '修改数据';
        this.actJsonConf = {
          id: row.id,
          name: row.name,
          extend: row.extend,
        };
        this.actJsonConfDialog.isEdit = true;
      } else {
        this.actJsonConfDialog.title = '添加数据';
        this.actJsonConfDialog.isEdit = false;
      }
      this.actJsonConfDialog.visible = true;
    },
    resetActJsonConfDialog() {
      this.actJsonConf = {
        id: 0,
        name: '',
        extend: '',
      }
      this.actJsonConfDialog.visible = false;
    },
    submitActJsonConfDialog() {
      this.$refs['actJsonConf'].validate((valid) => {
        if (valid) {
          let param = Object.assign({}, this.actJsonConf);
          if (this.actJsonConfDialog.isEdit) {
            this.updateActJsonConf(param)
          } else {
            this.insertActJsonConf(param)
          }
        } else {
          this.$message.warning('请检查参数');
          return false;
        }
      });
    },
    insertActJsonConf(param) {
      this.$confirm('此操作将新增记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiActJsonConfConf.create(param).then(res => {
          this.$message.success('添加成功');
          this.queryActJsonConf(this.actJsonConfPagination.page);
          this.resetActJsonConfDialog();
        })
      }).catch(() => {
        this.$message.info('已取消添加');
      });
    },
    updateActJsonConf(param) {
      this.$confirm('此操作将修改该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiActJsonConfConf.update(param).then(res => {
          this.$message.success('修改成功');
          this.queryActJsonConf(this.actJsonConfPagination.page);
          this.resetActJsonConfDialog();
        })
      }).catch(() => {
        this.$message.info('已取消修改');
      });
    },
  },
  async mounted() {
    this.queryActJsonConf();
  }
}
</script>

<style scoped></style>