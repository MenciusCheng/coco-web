<template>
  <el-form label-width="80px" size="small" @submit.native.prevent label-position="top">
    <el-divider content-position="left">生成结果</el-divider>
    <el-row>
      <el-col :span="24" v-for="(item, index) in results" :key="index">
        <el-form-item :label="item.name ? item.name : '生成内容'">
          <el-input type="textarea" v-model="results[index].content" :rows="16" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    results: {
      type: Array,
      required: true
    }
  }
};
</script>

<style></style>