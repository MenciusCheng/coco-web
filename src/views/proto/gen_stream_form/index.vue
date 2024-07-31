<template>
  <section>
    <el-form :inline="true" :model="genStreamQueryForm" size="medium">
      <el-form-item label="选择配置" label-width="80px">
        <el-select v-model="genStreamQueryForm.genStreamId" clearable filterable placeholder="请选择"
          @change="handleGenStreamIdChange" style="width: 350px;">
          <el-option v-for="item in genStreamQueryForm.genStreamOptions" :key="item.id" :label="item.optionName"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="genGenStream()" type="primary">生成</el-button>
        <el-button @click="saveGenStream()" type="primary">保存</el-button>
        <el-button @click="saveGenStream(true)" type="primary">另存为</el-button>
        <el-button @click="resetGenStream()" type="primary">重置</el-button>
      </el-form-item>
    </el-form>

    <el-form :model="genStream" :rules="genStreamRules" label-width="80px" ref="genStream" size="medium">

      <el-row>
        <el-col :span="12">
          <el-form-item label="解析类型" prop="parserType">
            <el-select v-model="genStream.parserType" placeholder="请选择解析类型" filterable :style="{ width: '100%' }">
              <el-option v-for="(item, index) in parserTypeOptions" :key="index" :label="item.label" :value="item.value"
                :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button @click="" type="danger">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="解析选项" prop="parserOption">
            <el-select v-model="genStream.parserOption" placeholder="请选择解析选项" multiple filterable clearable
              :style="{ width: '100%' }">
              <el-option v-for="(item, index) in parserOptionOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isInParserOption('name')">
          <el-form-item label="名称" prop="field104">
            <el-input v-model="genStream.field104" placeholder="请输入名称" clearable :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isInParserOption('sep')">
          <el-form-item label="分隔符" prop="field108">
            <el-input v-model="genStream.field108" placeholder="请输入分隔符" clearable :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="isInParserOption('replace')">
          <el-form-item label="替换文本" prop="field109">
            <el-input v-model="genStream.field109" placeholder="请输入替换文本" clearable :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="解析内容" prop="parserText">
            <el-input v-model="genStream.parserText" type="textarea" placeholder="请输入解析内容"
              :autosize="{ minRows: 4, maxRows: 16 }" :style="{ width: '100%' }"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" v-for="(item, index) in genList" :key="index">
          <el-form-item :label="item.name ? item.name : '生成内容'">
            <el-input type="textarea" v-model="genList[index].content" :rows="16" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>

export default {
  components: {},
  props: [],
  data() {
    return {
      genStream: {
        id: 0,
        confName: '',
        extend: '',
        conf: {
          dataSourceType: '',
          dataSource: '',
          template: ''
        },
        parserType: "text",
        parserOption: [],
        parserText: undefined,
        field104: undefined,
        field108: undefined,
        field109: undefined,
      },
      genStreamQueryForm: {
        genStreamId: '',
        genStreamOptions: [],
      },
      genStreamRules: {
        extend: [],
        confName: [],
        id: [],
      },
      dataSourceTypeOptions: [
        {
          value: "tabRow",
          label: "tabRow"
        },
        {
          value: "json",
          label: "json"
        },
        {
          value: "sql",
          label: "sql"
        },
        {
          value: "sql2",
          label: "sql2"
        }
      ],
      genList: [
        {
          "name": "",
          "content": "Hello World"
        },
        {
          "name": "zzz",
          "content": "真的可以"
        }
      ],
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
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    isInParserOption(opt) {
      const parserOption = this.genStream.parserOption;
      for (let i = 0; i < parserOption.length; i++) {
        if (parserOption[i] === opt) {
          return true;
        }
      }
      return false;
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
  }
}
</script>

<style scoped></style>