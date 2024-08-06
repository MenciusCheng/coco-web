<template>
  <el-dialog :visible.sync="visible" title="编辑榜单" width="30%" @close="closeDialog" append-to-body>
    <el-form :model="rankItem">
      <el-form-item label="名称">
        <el-input v-model="rankItem.name"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-input-number v-model="rankItem.start_time"></el-input-number>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-input-number v-model="rankItem.end_time"></el-input-number>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="rankItem.type">
          <el-option :label="'主榜'" :value="0"></el-option>
          <el-option :label="'主榜带子榜'" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="周期">
        <el-input-number v-model="rankItem.cycle"></el-input-number>
      </el-form-item>
      <el-form-item label="排行数量">
        <el-input-number v-model="rankItem.rank_count"></el-input-number>
      </el-form-item>
      <el-form-item label="事件类型">
        <el-input-number v-model="rankItem.event_type"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    rankItem: {
      type: Object,
      default: () => ({
        id: Date.now(),
        name: '',
        start_time: 0,
        end_time: 0,
        type: 0,
        cycle: 0,
        rank_count: 0,
        event_type: 0
      })
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:visible', false);
    },
    save() {
      this.$emit('save', this.rankItem);
      this.closeDialog();
    }
  }
};
</script>