<template>
  <section>
    <el-row>
      <el-col :span="24">
        <!-- 工具条 -->
        <Toolbar :configId="selectedConfigId" :configs="configs" @config-change="selectConfig" @save="saveConfig"
          @copy="copyConfig" @reset="resetConfig" @generate="generateResult" :detailChanged="currentConfigChanged" />

        <!-- 配置部分 -->
        <ConfigEditor :config="currentConfig" ref="configEditor" />

        <!-- 生成结果部分 -->
        <ResultList :results="generatedResults" />
      </el-col>
    </el-row>
  </section>
</template>

<script>
import * as apiGenStreamConf from '@/api/gen_stream_conf';
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
      selectedConfigId: '',
      configs: [], // 预先加载的配置列表
      currentConfig: {
        id: 0,
        name: '',
        details: []
      },
      generatedResults: []
    };
  },
  computed: {
    currentConfigChanged() {
      if (this.currentConfig.id) {
        const matchConfig = this.configs.find(item => item.id === this.currentConfig.id);
        if (matchConfig) {
          const a1 = JSON.stringify(this.currentConfig.details);
          const a2 = JSON.stringify(JSON.parse(matchConfig.extend));
          return this.currentConfig.name != matchConfig.name || a1 != a2;
        }
      }
      return this.currentConfig.name != '' || this.currentConfig.details.length > 0;
    }
  },
  methods: {
    loadConfig() {
      let param = {
        page: 1,
        size: 10000,
      }
      apiGenStreamConf.query(param).then(res => {
        let { list } = res.data;
        for (let i = 0; i < list.length; i++) {
          list[i].name = list[i].confName;
        }
        this.configs = list;
      }).catch(err => {
        console.log(err);
      });
    },
    selectConfig(selectedConfigId) {
      if (this.selectedConfigId !== selectedConfigId) {
        this.generatedResults = [];
      }
      this.selectedConfigId = selectedConfigId;
      // 加载选中的配置
      const config = this.configs.find(c => c.id === selectedConfigId);
      if (config) {
        this.currentConfig.id = config.id;
        this.currentConfig.name = config.name;
        this.currentConfig.details = JSON.parse(config.extend);
      } else {
        this.resetConfig();
        this.loadConfig();
      }
    },
    saveConfig() {
      // 保存当前配置
      const config = this.$refs.configEditor.config;
      let param = {
        id: config.id,
        confName: config.name,
        extend: JSON.stringify(config.details)
      }
      if (param.id > 0) {
        apiGenStreamConf.update(param).then(res => {
          this.$message.success('修改成功');
          this.loadConfig();
        });
      } else {
        apiGenStreamConf.create(param).then(res => {
          this.$message.success('添加成功');
          this.loadConfig();
          let { id } = res.data;
          this.selectedConfigId = id;
          this.currentConfig.id = id;
        });
      }
    },
    copyConfig() {
      this.selectedConfigId = '';
      // 复制当前配置
      this.currentConfig.id = 0;
      if (this.currentConfig.name) {
        this.currentConfig.name = `${this.currentConfig.name}-复制`;
      }
    },
    resetConfig() {
      this.selectedConfigId = '';
      // 重置当前配置
      this.currentConfig = {
        id: 0,
        name: '',
        details: []
      };
      this.generatedResults = [];
    },
    generateResult() {
      const configs = [];
      const details = this.$refs.configEditor.config.details;
      if (details) {
        details.forEach(detail => {
          const opts = [];
          if (detail.parserOption && detail.parserOption.length > 0) {
            for (let i = 0; i < detail.parserOption.length; i++) {
              const optType = detail.parserOption[i];
              if (optType === 'name') {
                opts.push({ type: optType, value: detail.optName });
              } else if (optType === 'sep') {
                opts.push({ type: optType, value: detail.optSep });
              } else if (optType === 'replace') {
                opts.push({ type: optType, value: detail.optReplace });
              } else if (optType === 'map') {
                opts.push({ type: optType, value: detail.optMap });
              }
            }
          }
          const config = {
            type: detail.parserType,
            text: detail.parserText,
            opts: opts
          }
          configs.push(config);
        });
      }
      let param = {
        configs
      }
      this.generatedResults = [];
      apiGenStreamConf.gen(param).then(res => {
        this.$message.success('生成成功');
        let { list } = res.data;
        if (list) {
          this.generatedResults = list;
        }
      });
    }
  },
  mounted() {
    this.loadConfig();
  },
};
</script>

<style></style>
