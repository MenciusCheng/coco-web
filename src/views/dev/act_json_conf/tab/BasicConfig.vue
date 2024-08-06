<template>
  <el-form :model="basic">
    <el-form-item label="活动名称">
      <el-input v-model="basic.name"></el-input>
    </el-form-item>
    <el-form-item label="开始时间">
      <el-input-number v-model="basic.start_time"></el-input-number>
    </el-form-item>
    <el-form-item label="结束时间">
      <el-input-number v-model="basic.end_time"></el-input-number>
    </el-form-item>
    <el-form-item label="开启模块">
      <el-checkbox-group v-model="basic.selectedValues" @change="handleChange">
        <el-checkbox v-for="opt in options" :label="opt.value" :key="opt.value">{{ opt.label }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    basic: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      options: [
        { label: '榜单', value: 'rank' },
        { label: '福利', value: 'welfare' },
        { label: '玩法', value: 'play' }
      ]
    }
  },
  methods: {
    getConfig() {
      return this.basic;
    },
    handleChange() {
      this.$emit('change', this.basic.selectedValues);
    },
    isOptionSelected(value) {
      return this.basic.selectedValues.includes(value);
    }
  }
};
</script>

<style scoped>
/* 样式可以根据需要进行调整 */
</style>