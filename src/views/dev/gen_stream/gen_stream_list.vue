<template>
  <section>
    <el-form :inline="true" :model="genStreamQueryForm" size="medium">
      <el-form-item label="配置名称">
        <el-input v-model="genStreamQueryForm.confName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="queryGenStream(1)" type="primary">查询</el-button>
        <el-button @click="openGenStreamDialog(false)" type="primary">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="genStreamTableLoading" :data="genStreamTableData" border>
      <el-table-column align="center" label="ID" prop="id"></el-table-column>
      <el-table-column align="center" label="配置名称" prop="confName"></el-table-column>
      <!-- <el-table-column align="center" label="扩展内容" prop="extend"></el-table-column> -->
      <el-table-column align="center" label="创建时间" prop="createdAt"></el-table-column>
      <el-table-column align="center" label="更新时间" prop="updatedAt"></el-table-column>
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
          <el-button @click="openGenStreamDialog(true, scope.row)">修改</el-button>
          <el-button @click="deleteGenStream(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :current-page="genStreamPagination.page" :page-size="genStreamPagination.size"
      :total="genStreamPagination.total" @current-change="queryGenStream" background
      layout="prev, pager, next, total, jumper" style="padding-top: 20px"></el-pagination>

    <el-dialog :before-close="resetGenStreamDialog" :title="genStreamDialog.title"
      :visible.sync="genStreamDialog.visible" width="800px">
      <el-form :inline="true" :model="genStream" :rules="genStreamRules" label-width="150px" ref="genStream">
        <el-row>
          <el-form-item label="配置名称" prop="confName">
            <el-input v-model="genStream.confName"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="扩展内容" prop="extend">
            <el-input v-model="genStream.extend"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="resetGenStreamDialog">取消</el-button>
        <el-button @click="submitGenStreamDialog" type="primary">确认</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import * as apiGenStreamConf from '@/api/gen_stream_conf';
import { dateFormat } from '@/utils/timeUtil';

export default {
  data() {
    return {
      genStream: {
        extend: '',
        confName: '',
        id: 0,
      },
      genStreamDialog: {
        isEdit: false,
        title: '',
        visible: false
      },
      genStreamPagination: {
        page: 1,
        size: 20,
        total: 0
      },
      genStreamQueryForm: {
        confName: ''
      },
      genStreamRules: {
        extend: [],
        confName: [],
        id: [],
      },
      genStreamTableData: [],
      genStreamTableLoading: false
    }
  },
  methods: {
    queryGenStream(page) {
      let param = {
        page: page,
        size: this.genStreamPagination.size,
        confNameLike: this.genStreamQueryForm.confName,
      }
      this.genStreamTableLoading = true;
      apiGenStreamConf.query(param).then(res => {
        let { list, total } = res.data;
        for (let i = 0; i < list.length; i++) {
          let record = list[i];
          record.createdAt = dateFormat(new Date(record.createdAt), 'yyyy-MM-dd HH:mm:ss');
          record.updatedAt = dateFormat(new Date(record.updatedAt), 'yyyy-MM-dd HH:mm:ss');
        }
        this.genStreamTableData = list;
        this.genStreamPagination.total = total;
        this.genStreamPagination.page = page;
        this.genStreamTableLoading = false;
      }).catch(err => {
        console.log(err);
        this.genStreamTableLoading = false;
      });
    },
    deleteGenStream(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          id: row.id,
        }
        apiGenStreamConf.del(param).then(res => {
          this.$message.success('删除成功');
          this.queryGenStream(this.genStreamPagination.page);
        })
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    openGenStreamDialog(isEdit, row) {
      if (isEdit) {
        this.genStreamDialog.title = '修改数据';
        this.genStream = {
          id: row.id,
          confName: row.confName,
          extend: row.extend,
        };
        this.genStreamDialog.isEdit = true;
      } else {
        this.genStreamDialog.title = '添加数据';
        this.genStreamDialog.isEdit = false;
      }
      this.genStreamDialog.visible = true;
    },
    resetGenStreamDialog() {
      this.genStream = {
        id: 0,
        confName: '',
        extend: '',
      }
      this.genStreamDialog.visible = false;
    },
    submitGenStreamDialog() {
      this.$refs['genStream'].validate((valid) => {
        if (valid) {
          let param = Object.assign({}, this.genStream);
          if (this.genStreamDialog.isEdit) {
            this.updateGenStream(param)
          } else {
            this.insertGenStream(param)
          }
        } else {
          this.$message.warning('请检查参数');
          return false;
        }
      });
    },
    insertGenStream(param) {
      this.$confirm('此操作将新增记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiGenStreamConf.create(param).then(res => {
          this.$message.success('添加成功');
          this.queryGenStream(this.genStreamPagination.page);
          this.resetGenStreamDialog();
        })
      }).catch(() => {
        this.$message.info('已取消添加');
      });
    },
    updateGenStream(param) {
      this.$confirm('此操作将修改该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiGenStreamConf.update(param).then(res => {
          this.$message.success('修改成功');
          this.queryGenStream(this.genStreamPagination.page);
          this.resetGenStreamDialog();
        })
      }).catch(() => {
        this.$message.info('已取消修改');
      });
    },
  },
  async mounted() {
    this.queryGenStream();
  }
}
</script>

<style scoped></style>
