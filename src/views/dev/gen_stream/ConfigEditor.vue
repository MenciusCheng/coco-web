<template>
  <el-form label-width="80px" ref="genStream" size="small" @submit.native.prevent>
    <el-row>
      <el-col :span="12">
        <el-form-item label="配置名称">
          <el-input v-model="config.name" placeholder="配置名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-button @click="addDetail(0)" type="primary" icon="el-icon-plus"></el-button>
          <el-button @click="addDetailFromTmpl(0)" type="primary" icon="el-icon-plus">从模版</el-button>
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
            <el-button @click="addDetailFromTmpl(index + 1)" type="primary" icon="el-icon-plus">从模版</el-button>
            <el-button @click="saveDetail(detail)" type="primary">保存模版</el-button>
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
        <el-col :span="24" v-if="isInParserOption('map', detail.parserOption)">
          <el-form-item label="替换文本">
            <el-input v-model="detail.optMap" type="textarea" placeholder="请输入字典"
              :autosize="{ minRows: 3, maxRows: 16 }" :style="{ width: '100%' }"></el-input>
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

    <el-dialog title="从模版新增" :visible.sync="dialogFormVisible">
      <el-form size="small">
        <el-form-item label="选择配置" label-width="80px">
          <el-select v-model="detailTmplId" placeholder="选择模版" clearable filterable :style="{ width: '100%' }"
            @change="onDetailTmplChange">
            <el-option v-for="item in detailTmplOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预览内容" prop="previewParserText">
          <el-input v-model="previewParserText" type="textarea" placeholder="请输入解析内容"
            :autosize="{ minRows: 12, maxRows: 12 }" :style="{ width: '100%' }"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDialogForm">确 定</el-button>
      </div>
    </el-dialog>
  </el-form>
</template>

<script>
import * as apiGenStreamDetailTmplConf from '@/api/gen_stream_detail_tmpl';

export default {
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      detailTmplId: '',
      detailTmplOptions: [],
      detailTmplAddIndex: 0,
      previewParserText: '',
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
        },
        {
          "label": "字典",
          "value": "map"
        }
      ],
    };
  },
  watch: {
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
    loadDetailTmpl() {
      let param = {
        page: 1,
        size: 10000,
      }
      apiGenStreamDetailTmplConf.query(param).then(res => {
        let { list } = res.data;
        for (let i = 0; i < list.length; i++) {
        }
        this.detailTmplOptions = list;
      }).catch(err => {
        console.log(err);
      });
    },
    addDetailFromTmpl(index) {
      if (index < 0 || index > this.config.details.length) {
        return;
      }
      this.detailTmplId = '';
      this.dialogFormVisible = true;
      this.detailTmplAddIndex = index;
      this.previewParserText = '';
      this.loadDetailTmpl();
    },
    confirmDialogForm() {
      const detailObj = this.detailTmplOptions.find(item => item.id === this.detailTmplId);
      if (detailObj) {
        const detail = JSON.parse(detailObj.extend);
        this.config.details.splice(this.detailTmplAddIndex, 0, detail);
        this.dialogFormVisible = false;
      } else {
        this.$message({
          showClose: true,
          message: '请选择配置',
          type: 'warning'
        });
      }
    },
    saveDetail(detail) {
      this.$prompt('请输入保存的模版名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const param = {
          name: value,
          extend: JSON.stringify(detail),
        };
        apiGenStreamDetailTmplConf.create(param).then(res => {
          this.$message.success('保存成功');
        })
      }).catch(() => {
        this.$message.info('已取消保存');
      });
    },
    onDetailTmplChange() {
      const detailObj = this.detailTmplOptions.find(item => item.id === this.detailTmplId);
      if (detailObj) {
        const detail = JSON.parse(detailObj.extend);
        this.previewParserText = detail.parserText;
      } else {
        this.previewParserText = '';
      }
    }
  },
};
</script>

<style></style>
