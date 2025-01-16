<template>
  <el-container class="json-editor-container">
    <el-main>
      <!-- JSON 编辑区域 -->
      <el-card>
        <template #header>
          <span>JSON 输入</span>
        </template>
        <el-input
          v-model="jsonInput"
          type="textarea"
          :rows="15"
          placeholder="请输入JSON..."
          resize="none"
        />
        <el-row class="mt-20">
          <el-button type="primary" @click="formatJson">格式化</el-button>
          <el-button type="info" @click="compressJson">压缩</el-button>
          <el-button type="warning" @click="removeEscape">去转义符</el-button>
        </el-row>
      </el-card>

      <!-- 函数编辑区域 -->
      <el-card class="mt-20">
        <template #header>
          <span>函数输入</span>
        </template>
        <el-input
          v-model="functionInput"
          type="textarea"
          :rows="6"
          placeholder="输入要执行的函数，如：data => data.name"
          resize="none"
        />
      </el-card>

      <!-- 操作按钮区域 -->
      <el-row class="mt-20">
        <el-button type="success" @click="executeFunction">执行函数</el-button>
      </el-row>

      <!-- 结果显示区域 -->
      <el-card class="mt-20">
        <template #header>
          <span>结果</span>
        </template>
        <div v-if="executionResult">
          <strong>执行结果：</strong>
          <pre>{{ stringifyResult(executionResult) }}</pre>
        </div>
        <el-alert
          v-if="error"
          :title="error"
          type="error"
          show-icon
          class="mt-20"
        />
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      jsonInput: '',
      functionInput: '',
      executionResult: null,
      error: ''
    }
  },
  methods: {
    formatJson() {
      try {
        const parsed = JSON.parse(this.jsonInput)
        this.jsonInput = JSON.stringify(parsed, null, 2)
        this.error = ''
      } catch (e) {
        this.error = 'JSON格式错误：' + e.message
      }
    },
    executeFunction() {
      try {
        const jsonObj = JSON.parse(this.jsonInput)
        const func = new Function('data', `return ${this.functionInput}`)
        this.executionResult = func(jsonObj)
        this.error = ''
      } catch (e) {
        this.error = '函数执行错误：' + e.message
        this.executionResult = null
      }
    },
    stringifyResult(result) {
      try {
        return JSON.stringify(result, null, 2)
      } catch {
        return String(result)
      }
    },
    compressJson() {
      try {
        const parsed = JSON.parse(this.jsonInput)
        this.jsonInput = JSON.stringify(parsed)
        this.error = ''
      } catch (e) {
        this.error = 'JSON格式错误：' + e.message
      }
    },
    removeEscape() {
      try {
        this.jsonInput = this.jsonInput.replace(/\\/g, '')
        this.error = ''
      } catch (e) {
        this.error = '去转义符失败：' + e.message
      }
    }
  }
}
</script>

<style scoped>
.json-editor-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.mt-20 {
  margin-top: 20px;
}

.el-card {
  position: relative;
}

pre {
  margin: 0;
  padding: 10px;
  background-color: #f6f8fa;
  border-radius: 4px;
}
</style>
