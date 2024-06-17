<template>
  <div class="app-container">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-col :span="20">
        <el-form-item label="正则表达式" prop="expr">
          <el-input v-model="formData.expr" placeholder="请输入正则表达式" clearable :style="{ width: '100%' }">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-form-item label-width="10px" prop="">
          <el-button type="primary" size="medium" @click="regexpFind">匹配</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="匹配文本" prop="s">
          <el-input v-model="formData.s" type="textarea" placeholder="请输入匹配文本" :autosize="{ minRows: 6, maxRows: 6 }"
            :style="{ width: '100%' }"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="匹配结果" prop="res">
          <el-input v-model="formData.res" type="textarea" placeholder="请输入匹配结果" :autosize="{ minRows: 6, maxRows: 6 }"
            :style="{ width: '100%' }"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="替换文本" prop="repl">
          <el-input v-model="formData.repl" placeholder="请输入替换文本" clearable :style="{ width: '100%' }"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-form-item label-width="10px" prop="">
          <el-button type="primary" size="medium" @click="regexpReplace">替换</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="替换结果" prop="des">
          <el-input v-model="formData.des" type="textarea" placeholder="请输入替换结果" :autosize="{ minRows: 6, maxRows: 6 }"
            :style="{ width: '100%' }"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item size="large">
          <!-- <el-button type="primary" @click="submitForm">提交</el-button> -->
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script>
import * as apiRegexp from '@/api/regexp';

export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        expr: "",
        s: "",
        res: "",
        repl: "",
        des: "",
      },
      rules: {
        expr: [{
          required: true,
          message: '请输入正则表达式',
          trigger: 'blur'
        }],
        s: [{
          required: true,
          message: '请输入匹配文本',
          trigger: 'blur'
        }],
        res: [],
        repl: [],
      },
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    regexpFind() {
      let param = {
        expr: this.formData.expr,
        s: this.formData.s,
      }
      apiRegexp.postFind(param).then(res => {
        let data = res.data;
        let strArr = []
        if (data.matchString) {
          strArr.push(`allString: ${JSON.stringify(data.findAllString)}`);
          strArr.push(`stringSubmatch: ${JSON.stringify(data.findStringSubmatch)}`);
          strArr.push(`allStringSubmatch: ${JSON.stringify(data.findAllStringSubmatch)}`);
        }
        this.formData.res = strArr.join("\n");
      }).catch(err => {
        console.log(err);
      });
    },
    regexpReplace() {
      let param = {
        expr: this.formData.expr,
        s: this.formData.s,
        repl: this.formData.repl,
      }
      apiRegexp.postReplace(param).then(res => {
        let data = res.data;
        this.formData.des = data.des;
      }).catch(err => {
        console.log(err);
      });
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
