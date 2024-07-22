<template>
  <el-form label-width="80px" ref="genStream" size="medium">
    <el-row>
      <el-col :span="12">
        <el-form-item label="配置名称">
          <el-input v-model="configName" placeholder="配置名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-button @click="addDetail" type="primary">添加配置详情</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-for="(detail, index) in configDetails" :key="index" class="config-detail">
      <el-row>
        <el-col :span="12">
          <el-form-item label="解析类型" prop="parserType">
            <el-select v-model="detail.parserType" placeholder="请选择解析类型" filterable :style="{ width: '100%' }">
              <el-option v-for="(item, index) in parserTypeOptions" :key="index" :label="item.label" :value="item.value"
                :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button @click="removeDetail(index)" type="danger">删除</el-button>
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
          <el-form-item label="名称" prop="field104">
            <el-input v-model="detail.field104" placeholder="请输入名称" clearable :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isInParserOption('sep', detail.parserOption)">
          <el-form-item label="分隔符" prop="field108">
            <el-input v-model="detail.field108" placeholder="请输入分隔符" clearable :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="isInParserOption('replace', detail.parserOption)">
          <el-form-item label="替换文本" prop="field109">
            <el-input v-model="detail.field109" placeholder="请输入替换文本" clearable :style="{ width: '100%' }">
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
      configName: this.config.name,
      configDetails: this.config.details,
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
    config: {
      handler(newConfig) {
        this.configName = newConfig.name;
        this.configDetails = newConfig.details;
      },
      deep: true
    }
  },
  methods: {
    addDetail() {
      this.configDetails.push({
        parserType: '',
        parserOption: '',
        parserText: ''
      });
    },
    removeDetail(index) {
      this.configDetails.splice(index, 1);
    },
    isInParserOption(opt, selectedOpts) {
      for (let i = 0; i < selectedOpts.length; i++) {
        if (selectedOpts[i] === opt) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>

<style>
.config-detail {
  margin-bottom: 10px;
}
</style>
