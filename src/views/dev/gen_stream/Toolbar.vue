<template>
  <el-form label-width="80px" size="small" @submit.native.prevent>
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
          <el-button @click="onGenerate" type="success" icon="el-icon-caret-right">生成</el-button>
          <el-button @click="onSave" type="primary"><span v-if="detailChanged">*</span>保存</el-button>
          <el-button @click="onCopy" type="primary" icon="el-icon-document-copy">复制</el-button>
          <el-button @click="onReset" type="primary">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    configId: {
      type: [String, Number],
    },
    configs: {
      type: Array,
      required: true
    },
    detailChanged: {
      type: Boolean
    }
  },
  watch: {
    configId() {
      this.selectedConfigId = this.configId
    }
  },
  data() {
    return {
      selectedConfigId: this.configId
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