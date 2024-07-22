<template>
  <el-form label-width="80px" size="medium">
    <el-row>
      <el-col :span="12">
        <el-form-item label="选择配置" label-width="80px">
          <el-select v-model="selectedConfigId" placeholder="选择配置" @change="onConfigChange" clearable filterable :style="{ width: '100%' }">
            <el-option v-for="item in configs" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-button @click="onGenerate" type="primary">生成</el-button>
          <el-button @click="onSave" type="primary">保存</el-button>
          <el-button @click="onCopy" type="primary">复制</el-button>
          <el-button @click="onReset" type="primary">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    configs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedConfigId: null
    }
  },
  methods: {
    onConfigChange() {
      this.$emit('config-change', this.selectedConfigId);
    },
    onSave() {
      this.$emit('save');
    },
    onCopy() {
      this.$emit('copy');
    },
    onReset() {
      this.$emit('reset');
    },
    onGenerate() {
      this.$emit('generate');
    }
  },
  mounted() {
  },
};
</script>

<style></style>