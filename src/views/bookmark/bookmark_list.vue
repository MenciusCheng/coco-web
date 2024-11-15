<template>
  <section>
    <el-form :inline="true" :model="bookmarkQueryForm" size="small" @submit.native.prevent>
      <el-form-item label="名称">
        <el-input v-model="bookmarkQueryForm.name"></el-input>
      </el-form-item>
      <el-form-item label="书签URL">
        <el-input v-model="bookmarkQueryForm.url"></el-input>
      </el-form-item>
      <el-form-item label="书签图标">
        <el-input v-model="bookmarkQueryForm.icon"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="bookmarkQueryForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="文件夹ID">
        <el-input-number v-model="bookmarkQueryForm.folderId"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button @click="queryBookmark(1)" type="primary">查询</el-button>
        <el-button @click="openBookmarkDialog(false)" type="primary">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="bookmarkTableLoading" :data="bookmarkTableData" border>
      <el-table-column align="center" label="ID" prop="id"></el-table-column>
      <el-table-column align="center" label="名称" prop="name"></el-table-column>
      <el-table-column align="center" label="书签URL" prop="url"></el-table-column>
      <el-table-column align="center" label="书签图标" prop="icon"></el-table-column>
      <el-table-column align="center" label="备注" prop="remark"></el-table-column>
      <el-table-column align="center" label="文件夹ID" prop="folderId"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createdAt"></el-table-column>
      <el-table-column align="center" label="更新时间" prop="updatedAt"></el-table-column>
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
          <el-button @click="openBookmarkDialog(true, scope.row)">修改</el-button>
          <el-button @click="deleteBookmark(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :current-page="bookmarkPagination.page" :page-size="bookmarkPagination.size"
                   :total="bookmarkPagination.total" @current-change="queryBookmark" background
                   layout="prev, pager, next, total, jumper" style="padding-top: 20px"></el-pagination>

    <el-dialog :before-close="resetBookmarkDialog" :title="bookmarkDialog.title"
               :visible.sync="bookmarkDialog.visible" width="800px">
      <el-form :model="bookmark" :rules="bookmarkRules" label-width="150px"
               ref="bookmark">
        <el-row>
          <el-form-item label="名称" prop="name">
            <el-input v-model="bookmark.name"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="书签URL" prop="url">
            <el-input v-model="bookmark.url"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="书签图标" prop="icon">
            <el-input v-model="bookmark.icon"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="bookmark.remark"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="文件夹ID" prop="folderId">
            <el-input-number v-model="bookmark.folderId"></el-input-number>
          </el-form-item>
        </el-row>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="resetBookmarkDialog">取消</el-button>
        <el-button @click="submitBookmarkDialog" type="primary">确认</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import * as apiBookmarkConf from '@/api/bookmark';
import {dateFormat} from '@/utils/timeUtil';

export default {
  data() {
    return {
      bookmark: {
        id: 0,
        name: '',
        url: '',
        icon: '',
        remark: '',
        folderId: 0,
      },
      bookmarkDialog: {
        isEdit: false,
        title: '',
        visible: false
      },
      bookmarkPagination: {
        page: 1,
        size: 20,
        total: 0
      },
      bookmarkQueryForm: {
        name: '',
        url: '',
        icon: '',
        remark: '',
        folderId: 0,
      },
      bookmarkRules: {
        id: [],
        name: [],
        url: [],
        icon: [],
        remark: [],
        folderId: [],
      },
      bookmarkTableData: [],
      bookmarkTableLoading: false
    }
  },
  methods: {
    queryBookmark(page) {
      let param = {
        page: page,
        size: this.bookmarkPagination.size,
        name: this.bookmarkQueryForm.name,
        url: this.bookmarkQueryForm.url,
        icon: this.bookmarkQueryForm.icon,
        remark: this.bookmarkQueryForm.remark,
        folderId: this.bookmarkQueryForm.folderId,
      }
      this.bookmarkTableLoading = true;
      apiBookmarkConf.query(param).then(res => {
        let {list, total} = res.data;
        for (let i = 0; i < list.length; i++) {
          let record = list[i];
          record.createdAt = dateFormat(new Date(record.createdAt), 'yyyy-MM-dd HH:mm:ss');
          record.updatedAt = dateFormat(new Date(record.updatedAt), 'yyyy-MM-dd HH:mm:ss');
        }
        this.bookmarkTableData = list;
        this.bookmarkPagination.total = total;
        this.bookmarkPagination.page = page;
        this.bookmarkTableLoading = false;
      }).catch(err => {
        console.log(err);
        this.bookmarkTableLoading = false;
      });
    },
    deleteBookmark(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          id: row.id,
        }
        apiBookmarkConf.del(param).then(res => {
          this.$message.success('删除成功');
          this.queryBookmark(this.bookmarkPagination.page);
        })
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    openBookmarkDialog(isEdit, row) {
      if (isEdit) {
        this.bookmarkDialog.title = '修改数据';
        this.bookmark = {
          id: row.id,
          name: row.name,
          url: row.url,
          icon: row.icon,
          remark: row.remark,
          folderId: row.folderId,
        };
        this.bookmarkDialog.isEdit = true;
      } else {
        this.bookmarkDialog.title = '添加数据';
        this.bookmarkDialog.isEdit = false;
      }
      this.bookmarkDialog.visible = true;
    },
    resetBookmarkDialog() {
      this.bookmark = {
        id: 0,
        name: '',
        url: '',
        icon: '',
        remark: '',
        folderId: 0,
      }
      this.bookmarkDialog.visible = false;
    },
    submitBookmarkDialog() {
      this.$refs['bookmark'].validate((valid) => {
        if (valid) {
          let param = Object.assign({}, this.bookmark);
          if (this.bookmarkDialog.isEdit) {
            this.updateBookmark(param)
          } else {
            this.insertBookmark(param)
          }
        } else {
          this.$message.warning('请检查参数');
          return false;
        }
      });
    },
    insertBookmark(param) {
      this.$confirm('此操作将新增记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiBookmarkConf.create(param).then(res => {
          this.$message.success('添加成功');
          this.queryBookmark(this.bookmarkPagination.page);
          this.resetBookmarkDialog();
        })
      }).catch(() => {
        this.$message.info('已取消添加');
      });
    },
    updateBookmark(param) {
      this.$confirm('此操作将修改该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiBookmarkConf.update(param).then(res => {
          this.$message.success('修改成功');
          this.queryBookmark(this.bookmarkPagination.page);
          this.resetBookmarkDialog();
        })
      }).catch(() => {
        this.$message.info('已取消修改');
      });
    },
  },
  async mounted() {
    this.queryBookmark();
  }
}
</script>

<style scoped></style>
