<template>
  <section>
    <el-form :inline="true" :model="genStreamDetailTmplQueryForm" size="medium" @submit.native.prevent>
      <el-form-item label="名称">
        <el-input v-model="genStreamDetailTmplQueryForm.name"></el-input>
      </el-form-item>
      <el-form-item label="扩展配置">
        <el-input v-model="genStreamDetailTmplQueryForm.extend"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="queryGenStreamDetailTmpl(1)" type="primary">查询</el-button>
        <el-button @click="openGenStreamDetailTmplDialog(false)" type="primary">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="genStreamDetailTmplTableLoading" :data="genStreamDetailTmplTableData" border>
      <el-table-column align="center" label="ID" prop="id"></el-table-column>
      <el-table-column align="center" label="名称" prop="name"></el-table-column>
      <el-table-column align="center" label="扩展配置" prop="extend"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createdAt"></el-table-column>
      <el-table-column align="center" label="更新时间" prop="updatedAt"></el-table-column>
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
          <el-button @click="openGenStreamDetailTmplDialog(true, scope.row)">修改</el-button>
          <el-button @click="deleteGenStreamDetailTmpl(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :current-page="genStreamDetailTmplPagination.page" :page-size="genStreamDetailTmplPagination.size"
      :total="genStreamDetailTmplPagination.total" @current-change="queryGenStreamDetailTmpl" background
      layout="prev, pager, next, total, jumper" style="padding-top: 20px"></el-pagination>

    <el-dialog :before-close="resetGenStreamDetailTmplDialog" :title="genStreamDetailTmplDialog.title"
      :visible.sync="genStreamDetailTmplDialog.visible" width="800px">
      <el-form :inline="true" :model="genStreamDetailTmpl" :rules="genStreamDetailTmplRules" label-width="150px"
        ref="genStreamDetailTmpl">
        <el-row>
          <el-form-item label="名称" prop="name">
            <el-input v-model="genStreamDetailTmpl.name"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="扩展配置" prop="extend">
            <el-input v-model="genStreamDetailTmpl.extend"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="resetGenStreamDetailTmplDialog">取消</el-button>
        <el-button @click="submitGenStreamDetailTmplDialog" type="primary">确认</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import * as apiGenStreamDetailTmplConf from '@/api/gen_stream_detail_tmpl';
import { dateFormat } from '@/utils/timeUtil';

export default {
  data() {
    return {
      genStreamDetailTmpl: {
        id: 0,
        name: '',
        extend: '',
      },
      genStreamDetailTmplDialog: {
        isEdit: false,
        title: '',
        visible: false
      },
      genStreamDetailTmplPagination: {
        page: 1,
        size: 20,
        total: 0
      },
      genStreamDetailTmplQueryForm: {
        name: '',
        extend: '',
      },
      genStreamDetailTmplRules: {
        id: [],
        name: [],
        extend: [],
      },
      genStreamDetailTmplTableData: [],
      genStreamDetailTmplTableLoading: false
    }
  },
  methods: {
    queryGenStreamDetailTmpl(page) {
      let param = {
        page: page,
        size: this.genStreamDetailTmplPagination.size,
        name: this.genStreamDetailTmplQueryForm.name,
        extend: this.genStreamDetailTmplQueryForm.extend,
      }
      this.genStreamDetailTmplTableLoading = true;
      apiGenStreamDetailTmplConf.query(param).then(res => {
        let { list, total } = res.data;
        for (let i = 0; i < list.length; i++) {
          let record = list[i];
          record.createdAt = dateFormat(new Date(record.createdAt), 'yyyy-MM-dd HH:mm:ss');
          record.updatedAt = dateFormat(new Date(record.updatedAt), 'yyyy-MM-dd HH:mm:ss');
        }
        this.genStreamDetailTmplTableData = list;
        this.genStreamDetailTmplPagination.total = total;
        this.genStreamDetailTmplPagination.page = page;
        this.genStreamDetailTmplTableLoading = false;
      }).catch(err => {
        console.log(err);
        this.genStreamDetailTmplTableLoading = false;
      });
    },
    deleteGenStreamDetailTmpl(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          id: row.id,
        }
        apiGenStreamDetailTmplConf.del(param).then(res => {
          this.$message.success('删除成功');
          this.queryGenStreamDetailTmpl(this.genStreamDetailTmplPagination.page);
        })
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    openGenStreamDetailTmplDialog(isEdit, row) {
      if (isEdit) {
        this.genStreamDetailTmplDialog.title = '修改数据';
        this.genStreamDetailTmpl = {
          id: row.id,
          name: row.name,
          extend: row.extend,
        };
        this.genStreamDetailTmplDialog.isEdit = true;
      } else {
        this.genStreamDetailTmplDialog.title = '添加数据';
        this.genStreamDetailTmplDialog.isEdit = false;
      }
      this.genStreamDetailTmplDialog.visible = true;
    },
    resetGenStreamDetailTmplDialog() {
      this.genStreamDetailTmpl = {
        id: 0,
        name: '',
        extend: '',
      }
      this.genStreamDetailTmplDialog.visible = false;
    },
    submitGenStreamDetailTmplDialog() {
      this.$refs['genStreamDetailTmpl'].validate((valid) => {
        if (valid) {
          let param = Object.assign({}, this.genStreamDetailTmpl);
          if (this.genStreamDetailTmplDialog.isEdit) {
            this.updateGenStreamDetailTmpl(param)
          } else {
            this.insertGenStreamDetailTmpl(param)
          }
        } else {
          this.$message.warning('请检查参数');
          return false;
        }
      });
    },
    insertGenStreamDetailTmpl(param) {
      this.$confirm('此操作将新增记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiGenStreamDetailTmplConf.create(param).then(res => {
          this.$message.success('添加成功');
          this.queryGenStreamDetailTmpl(this.genStreamDetailTmplPagination.page);
          this.resetGenStreamDetailTmplDialog();
        })
      }).catch(() => {
        this.$message.info('已取消添加');
      });
    },
    updateGenStreamDetailTmpl(param) {
      this.$confirm('此操作将修改该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiGenStreamDetailTmplConf.update(param).then(res => {
          this.$message.success('修改成功');
          this.queryGenStreamDetailTmpl(this.genStreamDetailTmplPagination.page);
          this.resetGenStreamDetailTmplDialog();
        })
      }).catch(() => {
        this.$message.info('已取消修改');
      });
    },
  },
  async mounted() {
    this.queryGenStreamDetailTmpl();
  }
}
</script>

<style scoped></style>