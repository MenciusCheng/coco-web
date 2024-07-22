<template>
  <section>
    <el-row>
      <el-col :span="24">
        <!-- 工具条 -->
        <Toolbar :configs="configs" @config-change="loadConfig" @save="saveConfig"
          @copy="copyConfig" @reset="resetConfig" @generate="generateResult" />

        <!-- 配置部分 -->
        <ConfigEditor :config="currentConfig" ref="configEditor" />

        <!-- 生成结果部分 -->
        <ResultList :results="generatedResults" />
      </el-col>
    </el-row>
  </section>
</template>

<script>
import Toolbar from './Toolbar.vue';
import ConfigEditor from './ConfigEditor.vue';
import ResultList from './ResultList.vue';

export default {
  components: {
    Toolbar,
    ConfigEditor,
    ResultList
  },
  data() {
    return {
      selectedConfig: null,
      configs: [], // 预先加载的配置列表
      currentConfig: {
        name: '',
        details: []
      },
      generatedResults: []
    };
  },
  methods: {
    loadConfig(selectedConfigId) {
      console.log("loadConfig", selectedConfigId);
      // 加载选中的配置
      const config = this.configs.find(c => c.id === selectedConfigId);
      if (config) {
        this.currentConfig = JSON.parse(JSON.stringify(config));
      }
    },
    saveConfig() {
      // 保存当前配置
      const newConfig = {
        id: this.selectedConfig || Date.now(),
        name: this.$refs.configEditor.configName,
        details: this.$refs.configEditor.configDetails
      };
      // 提交保存逻辑
    },
    copyConfig() {
      // 复制当前配置
      const newConfig = {
        id: 0,
        name: `${this.currentConfig.name}-复制`,
        details: [...this.currentConfig.details]
      };
      this.configs.push(newConfig);
    },
    resetConfig() {
      // 重置当前配置
      this.selectedConfig = null;
      this.currentConfig = {
        name: '',
        details: []
      };
    },
    generateResult() {
      // 提交当前配置，生成结果
      // 模拟生成结果
      const result = {
        name: `结果-${Date.now()}`,
        content: '生成的内容'
      };
      this.generatedResults.push(result);
    }
  },
  mounted() {
    this.configs.push({
      "id": 2,
      "name": "测试",
      "confName": "测试",
      "extend": "{\"name\": \"cat\"}",
      "createdAt": "2024-06-23T21:17:08+08:00",
      "updatedAt": "2024-06-23T21:18:11+08:00"
    })
  },
};
</script>

<style></style>
