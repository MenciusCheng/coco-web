<template>
  <el-dialog :visible.sync="visible" title="编辑福利" width="30%" @close="closeDialog" append-to-body>
    <el-form :model="welfareItem">
      <el-form-item label="名称">
        <el-input v-model="welfareItem.name"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-input-number v-model="welfareItem.start_time"></el-input-number>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-input-number v-model="welfareItem.end_time"></el-input-number>
      </el-form-item>
      <el-form-item label="类型">
        <el-input-number v-model="welfareItem.type"></el-input-number>
      </el-form-item>
      <el-form-item label="循环方式">
        <el-input-number v-model="welfareItem.cycle_type"></el-input-number>
      </el-form-item>
      <el-form-item label="完成条件">
        <el-input-number v-model="welfareItem.trigger_num"></el-input-number>
      </el-form-item>
      <el-form-item label="比较方式">
        <el-input-number v-model="welfareItem.compare_type"></el-input-number>
      </el-form-item>
      <el-form-item label="触发类型">
        <el-input-number v-model="welfareItem.trigger_type"></el-input-number>
      </el-form-item>
      <el-form-item label="自动领奖">
        <el-switch v-model="welfareItem.auto_receive"></el-switch>
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
    welfareItem: {
      type: Object,
      default: () => ({
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
      })
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:visible', false);
    },
    save() {
      this.$emit('save', this.welfareItem);
      this.closeDialog();
    }
  }
};
</script>