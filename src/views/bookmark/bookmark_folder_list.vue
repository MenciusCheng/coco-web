<template>
  <section>
    <el-form :inline="true" :model="bookmarkFolderQueryForm" size="small" @submit.native.prevent>
      <el-form-item label="文件夹名称">
        <el-input v-model="bookmarkFolderQueryForm.name"></el-input>
      </el-form-item>
      <el-form-item label="父文件夹ID">
        <el-input-number v-model="bookmarkFolderQueryForm.parentId"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button @click="queryBookmarkFolder(1)" type="primary">查询</el-button>
        <el-button @click="openBookmarkFolderDialog(false)" type="primary">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="bookmarkFolderTableLoading" :data="bookmarkFolderTableData" border>
      <el-table-column align="center" label="ID" prop="id"></el-table-column>
      <el-table-column align="center" label="文件夹名称" prop="name"></el-table-column>
      <el-table-column align="center" label="父文件夹ID" prop="parentId"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createdAt"></el-table-column>
      <el-table-column align="center" label="更新时间" prop="updatedAt"></el-table-column>
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
          <el-button @click="openBookmarkFolderDialog(true, scope.row)">修改</el-button>
          <el-button @click="deleteBookmarkFolder(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :current-page="bookmarkFolderPagination.page" :page-size="bookmarkFolderPagination.size"
                   :total="bookmarkFolderPagination.total" @current-change="queryBookmarkFolder" background
                   layout="prev, pager, next, total, jumper" style="padding-top: 20px"></el-pagination>

    <el-dialog :before-close="resetBookmarkFolderDialog" :title="bookmarkFolderDialog.title"
               :visible.sync="bookmarkFolderDialog.visible" width="800px">
      <el-form :model="bookmarkFolder" :rules="bookmarkFolderRules" label-width="150px"
               ref="bookmarkFolder">
        <el-row>
          <el-form-item label="文件夹名称" prop="name">
            <el-input v-model="bookmarkFolder.name"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="父文件夹ID" prop="parentId">
            <el-input-number v-model="bookmarkFolder.parentId"></el-input-number>
          </el-form-item>
        </el-row>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="resetBookmarkFolderDialog">取消</el-button>
        <el-button @click="submitBookmarkFolderDialog" type="primary">确认</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import * as apiBookmarkFolderConf from '@/api/bookmark_folder';
import { dateFormat } from '@/utils/timeUtil';

export default {
  data() {
    return {
      bookmarkFolder: {
        id: 0,
        name: '',
        parentId: 0,
      },
      bookmarkFolderDialog: {
        isEdit: false,
        title: '',
        visible: false
      },
      bookmarkFolderPagination: {
        page: 1,
        size: 20,
        total: 0
      },
      bookmarkFolderQueryForm: {
        name: '',
        parentId: 0,
      },
      bookmarkFolderRules: {
        id: [],
        name: [],
        parentId: [],
      },
      bookmarkFolderTableData: [],
      bookmarkFolderTableLoading: false
    }
  },
  methods: {
    queryBookmarkFolder(page) {
      let param = {
        page: page,
        size: this.bookmarkFolderPagination.size,
        name: this.bookmarkFolderQueryForm.name,
        parentId: this.bookmarkFolderQueryForm.parentId,
      }
      this.bookmarkFolderTableLoading = true;
      apiBookmarkFolderConf.query(param).then(res => {
        let { list, total } = res.data;
        for (let i = 0; i < list.length; i++) {
          let record = list[i];
          record.createdAt = dateFormat(new Date(record.createdAt), 'yyyy-MM-dd HH:mm:ss');
          record.updatedAt = dateFormat(new Date(record.updatedAt), 'yyyy-MM-dd HH:mm:ss');
        }
        this.bookmarkFolderTableData = list;
        this.bookmarkFolderPagination.total = total;
        this.bookmarkFolderPagination.page = page;
        this.bookmarkFolderTableLoading = false;
      }).catch(err => {
        console.log(err);
        this.bookmarkFolderTableLoading = false;
      });
    },
    deleteBookmarkFolder(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          id: row.id,
        }
        apiBookmarkFolderConf.del(param).then(res => {
          this.$message.success('删除成功');
          this.queryBookmarkFolder(this.bookmarkFolderPagination.page);
        })
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    openBookmarkFolderDialog(isEdit, row) {
      if (isEdit) {
        this.bookmarkFolderDialog.title = '修改数据';
        this.bookmarkFolder = {
          id: row.id,
          name: row.name,
          parentId: row.parentId,
        };
        this.bookmarkFolderDialog.isEdit = true;
      } else {
        this.bookmarkFolderDialog.title = '添加数据';
        this.bookmarkFolderDialog.isEdit = false;
      }
      this.bookmarkFolderDialog.visible = true;
    },
    resetBookmarkFolderDialog() {
      this.bookmarkFolder = {
        id: 0,
        name: '',
        parentId: 0,
      }
      this.bookmarkFolderDialog.visible = false;
    },
    submitBookmarkFolderDialog() {
      this.$refs['bookmarkFolder'].validate((valid) => {
        if (valid) {
          let param = Object.assign({}, this.bookmarkFolder);
          if (this.bookmarkFolderDialog.isEdit) {
            this.updateBookmarkFolder(param)
          } else {
            this.insertBookmarkFolder(param)
          }
        } else {
          this.$message.warning('请检查参数');
          return false;
        }
      });
    },
    insertBookmarkFolder(param) {
      this.$confirm('此操作将新增记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiBookmarkFolderConf.create(param).then(res => {
          this.$message.success('添加成功');
          this.queryBookmarkFolder(this.bookmarkFolderPagination.page);
          this.resetBookmarkFolderDialog();
        })
      }).catch(() => {
        this.$message.info('已取消添加');
      });
    },
    updateBookmarkFolder(param) {
      this.$confirm('此操作将修改该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiBookmarkFolderConf.update(param).then(res => {
          this.$message.success('修改成功');
          this.queryBookmarkFolder(this.bookmarkFolderPagination.page);
          this.resetBookmarkFolderDialog();
        })
      }).catch(() => {
        this.$message.info('已取消修改');
      });
    },
  },
  async mounted() {
    this.queryBookmarkFolder();
  }
}
</script>

<style scoped></style>
