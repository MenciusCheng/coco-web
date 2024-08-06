<template>
  <div>
    <el-button type="primary" @click="addRank">新增榜单</el-button>
    <el-table :data="rank" style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editRank(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" @click="removeRank(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <RankItemEditor :visible.sync="rankDialogVisible" :rank-item="currentRankItem" @save="saveRankItem" />
  </div>
</template>

<script>
import RankItemEditor from './RankItemEditor.vue';

export default {
  components: {
    RankItemEditor
  },
  props: {
    rank: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      rankDialogVisible: false,
      currentRankItem: {}
    };
  },
  methods: {
    addRank() {
      this.currentRankItem = {
        id: Date.now(),
        name: '',
        start_time: 0,
        end_time: 0,
        type: 0,
        cycle: 0,
        rank_count: 0,
        event_type: 0
      };
      this.rankDialogVisible = true;
    },
    editRank(index, row) {
      this.currentRankItem = { ...row };
      this.rankDialogVisible = true;
    },
    removeRank(index) {
      this.rank.splice(index, 1);
    },
    saveRankItem(item) {
      const index = this.rank.findIndex(r => r.id === item.id);
      if (index !== -1) {
        this.$set(this.rank, index, item);
      } else {
        this.rank.push(item);
      }
    },
    getRankList() {
      return this.rank;
    }
  }
};
</script>

<style scoped>
/* 样式可以根据需要进行调整 */
</style>