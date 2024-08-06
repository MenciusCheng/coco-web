<template>
  <div>
    <el-button type="primary" @click="addWelfare">新增福利</el-button>
    <el-table :data="welfare" style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editWelfare(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" @click="removeWelfare(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <WelfareItemEditor :visible.sync="welfareDialogVisible" :welfare-item="currentWelfareItem"
      @save="saveWelfareItem" />
  </div>
</template>

<script>
import WelfareItemEditor from './WelfareItemEditor.vue';

export default {
  components: {
    WelfareItemEditor
  },
  props: {
    welfare: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      welfareDialogVisible: false,
      currentWelfareItem: {}
    };
  },
  methods: {
    addWelfare() {
      this.currentWelfareItem = {
        id: Date.now(),
        name: '',
        start_time: 0,
        end_time: 0,
        type: 0,
        cycle_type: 0,
        trigger_num: 0,
        compare_type: 0,
        trigger_type: 0,
        auto_receive: false
      };
      this.welfareDialogVisible = true;
    },
    editWelfare(index, row) {
      this.currentWelfareItem = { ...row };
      this.welfareDialogVisible = true;
    },
    removeWelfare(index) {
      this.welfare.splice(index, 1);
    },
    saveWelfareItem(item) {
      const index = this.welfare.findIndex(w => w.id === item.id);
      if (index !== -1) {
        this.$set(this.welfare, index, item);
      } else {
        this.welfare.push(item);
      }
    },
    getWelfareList() {
      return this.welfare;
    }
  }
};
</script>

<style scoped>
/* 样式可以根据需要进行调整 */
</style>