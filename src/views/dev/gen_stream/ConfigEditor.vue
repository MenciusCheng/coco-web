<template>
  <el-form label-width="80px" ref="genStream" size="small">
    <el-row>
      <el-col :span="12">
        <el-form-item label="配置名称">
          <el-input v-model="config.name" placeholder="配置名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-button @click="addDetail(0)" type="primary" icon="el-icon-plus"></el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-for="(detail, index) in config.details" :key="index">
      <el-divider content-position="left">{{ index + 1 }}</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="解析类型" prop="parserType">
            <el-select v-model="detail.parserType" placeholder="请选择解析类型" filterable :style="{ width: '100%' }">
              <el-option v-for="(item, optIndex) in parserTypeOptions" :key="optIndex" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button @click="addDetail(index + 1)" type="primary" icon="el-icon-plus"></el-button>
            <el-button @click="moveDetail(index, -1)" type="primary" icon="el-icon-arrow-up"></el-button>
            <el-button @click="moveDetail(index, 1)" type="primary" icon="el-icon-arrow-down"></el-button>
            <el-button @click="removeDetail(index)" type="danger" icon="el-icon-delete"></el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="解析选项" prop="parserOption">
            <el-select v-model="detail.parserOption" placeholder="请选择解析选项" multiple filterable clearable
              :style="{ width: '100%' }">
              <el-option v-for="(item, optIndex) in parserOptionOptions" :key="optIndex" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isInParserOption('name', detail.parserOption)">
          <el-form-item label="名称">
            <el-input v-model="detail.optName" placeholder="请输入名称" clearable :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isInParserOption('sep', detail.parserOption)">
          <el-form-item label="分隔符">
            <el-input v-model="detail.optSep" placeholder="请输入分隔符" clearable :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="isInParserOption('replace', detail.parserOption)">
          <el-form-item label="替换文本">
            <el-input v-model="detail.optReplace" placeholder="请输入替换文本" clearable :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="解析内容" prop="parserText">
            <el-input v-model="detail.parserText" type="textarea" placeholder="请输入解析内容"
              :autosize="{ minRows: 4, maxRows: 16 }" :style="{ width: '100%' }"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // configId: this.config.id,
      // configName: this.config.name,
      // configDetails: this.config.details,
      parserTypeOptions: [
        {
          "label": "文本",
          "value": "text"
        },
        {
          "label": "行分割",
          "value": "line"
        },
        {
          "label": "列分割",
          "value": "row"
        },
        {
          "label": "json",
          "value": "json"
        },
        {
          "label": "createSql",
          "value": "createSql"
        },
        {
          "label": "t:正则表达式",
          "value": "reg"
        },
        {
          "label": "t:分割",
          "value": "split"
        },
        {
          "label": "t:合并",
          "value": "join"
        },
        {
          "label": "o:go模版",
          "value": "temp"
        }
      ],
      parserOptionOptions: [
        {
          "label": "名称",
          "value": "name"
        },
        {
          "label": "分隔符",
          "value": "sep"
        },
        {
          "label": "替换文本",
          "value": "replace"
        }
      ],
    };
  },
  watch: {
    // config: {
    //   handler(newConfig) {
    //     console.log("watch config", newConfig);
    //     this.configId = newConfig.id;
    //     this.configName = newConfig.name;
    //     this.configDetails = newConfig.details;
    //   },
    //   deep: true
    // }
  },
  methods: {
    addDetail(index) {
      if (index < 0 || index > this.config.details.length) {
        return;
      }
      this.config.details.splice(index, 0, {
        parserType: '',
        parserText: '',
        parserOption: []
      });
    },
    removeDetail(index) {
      this.config.details.splice(index, 1);
    },
    moveDetail(index, step) {
      const newIndex = index + step;
      if (index < 0 || index >= this.config.details.length) {
        return;
      }
      if (newIndex < 0 || newIndex >= this.config.details.length) {
        return;
      }

      let temp = this.config.details[index];
      this.config.details.splice(index, 1);
      this.config.details.splice(newIndex, 0, temp);
    },
    isInParserOption(opt, selectedOpts) {
      if (selectedOpts && selectedOpts.length > 0) {
        for (let i = 0; i < selectedOpts.length; i++) {
          if (selectedOpts[i] === opt) {
            return true;
          }
        }
      }
      return false;
    },
  },
};
</script>

<style></style>
