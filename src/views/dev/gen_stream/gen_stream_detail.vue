<template>
  <section>
    <el-row>
      <el-col :span="24">
        <!-- 工具条 -->
        <Toolbar :configs="configs" @config-change="selectConfig" @save="saveConfig" @copy="copyConfig"
          @reset="resetConfig" @generate="generateResult" />

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
      configs: [], // 预先加载的配置列表
      currentConfig: {
        id: 0,
        name: '',
        details: []
      },
      generatedResults: []
    };
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
      this.resetConfig();
      // 加载选中的配置
      const config = this.configs.find(c => c.id === selectedConfigId);
      if (config) {
        // this.currentConfig = JSON.parse(JSON.stringify(config));
        this.currentConfig.id = config.id;
        this.currentConfig.name = config.name;
        this.currentConfig.details = JSON.parse(config.extend);
      } else {
        this.loadConfig();
      }
    },
    saveConfig() {
      // // 保存当前配置
      // const newConfig = {
      //   id: this.$refs.configEditor.config.id,
      //   name: this.$refs.configEditor.config.name,
      //   details: this.$refs.configEditor.config.details
      // };
      // // 提交保存逻辑
      // console.log("saveConfig", newConfig);

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
          console.log("saveConfig id", id);
          this.resetConfig(); // TODO 改为选中新的
        });
      }
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
          const config = {
            type: detail.parserType,
            text: detail.parserText
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
