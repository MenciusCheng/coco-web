<template>
  <section>
    <el-form :inline="true" :model="dataConvertQueryForm" size="mini">
      <el-form-item label="选择配置" label-width="80px">
        <el-select v-model="dataConvertQueryForm.dataConvertId" clearable filterable placeholder="请选择"
          @change="handleDataConvertIdChange" style="width: 350px;">
          <el-option v-for="item in dataConvertQueryForm.dataConvertOptions" :key="item.id" :label="item.confName"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="genDataConvert()" type="primary">生成</el-button>
        <el-button @click="saveDataConvert()" type="primary">保存</el-button>
        <el-button @click="saveDataConvert(true)" type="primary">另存为</el-button>
        <el-button @click="resetDataConvert()" type="primary">重置</el-button>
      </el-form-item>
    </el-form>

    <el-form :inline="true" :model="dataConvert" :rules="dataConvertRules" label-width="80px" ref="dataConvert"
      size="mini">
      <el-row>
        <el-col :span="11">
          <el-form-item label="数据类型" prop="dataSourceType">
            <el-select v-model="dataConvert.conf.dataSourceType" filterable placeholder="请选择" style="width: 350px;">
              <el-option v-for="item in dataSourceTypeOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="配置名称" prop="dataSource">
            <el-input type="input" v-model="dataConvert.confName" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="id" prop="id" label-width="40px">
            <el-input type="input" readonly disabled v-model="dataConvert.id" style="width: 50px;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="数据源" prop="dataSource">
            <el-input type="textarea" v-model="dataConvert.conf.dataSource" :rows="16" style="width: 350px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="模板内容" prop="template">
            <el-input type="textarea" v-model="dataConvert.conf.template" :rows="16" style="width: 350px;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-for="(item, index) in genList">
          <el-form-item :label="item.name ? item.name : '生成内容'">
            <el-input type="textarea" v-model="genList[index].content" :rows="16" style="width: 800px;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
import * as api_data_convert from '@/api/data_convert';
import { dateFormat } from '@/utils/timeUtil';

export default {
  data() {
    return {
      dataConvert: {
        id: 0,
        confName: '',
        confContent: '',
        conf: {
          dataSourceType: '',
          dataSource: '',
          template: ''
        },
      },
      dataConvertQueryForm: {
        dataConvertId: '',
        dataConvertOptions: [],
      },
      dataConvertRules: {
        confContent: [],
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
        }
      ],
      genList: [],
    }
  },
  methods: {
    queryDataConvert() {
      let param = {
        page: 1,
        size: 10000,
      }
      api_data_convert.postList(param).then(res => {
        let { records } = res.data;
        // const options = [];
        // for (let i = 0; i < records.length; i++) {
        //   let record = records[i];
        //   options.push({
        //     id: record.id,
        //     name: record.confName,
        //   });
        // }
        this.dataConvertQueryForm.dataConvertOptions = records;
      }).catch(err => {
        console.log(err);
      });
    },
    saveDataConvert(isOther) {
      // 保存
      this.$refs['dataConvert'].validate((valid) => {
        if (valid) {
          let param = Object.assign({}, this.dataConvert);
          param.confContent = JSON.stringify(param.conf);
          if (isOther) {
            // 另存为
            param.id = 0;
          }
          if (param.id > 0) {
            this.updateDataConvert(param);
          } else {
            this.insertDataConvert(param);
          }
        } else {
          this.$message.warning('请检查参数');
          return false;
        }
      });
    },
    insertDataConvert(param) {
      this.$confirm('此操作将新增记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api_data_convert.create(param).then(res => {
          this.$message.success('添加成功');
          this.queryDataConvert();
          let { id } = res.data;
          this.dataConvert.id = id;
          this.dataConvertQueryForm.dataConvertId = id;
        })
      }).catch(() => {
        this.$message.info('已取消添加');
      });
    },
    updateDataConvert(param) {
      this.$confirm('此操作将修改该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api_data_convert.update(param).then(res => {
          this.$message.success('修改成功');
          this.queryDataConvert();
        })
      }).catch(() => {
        this.$message.info('已取消修改');
      });
    },
    handleDataConvertIdChange(id) {
      this.genList = [];
      if (!id) {
        this.queryDataConvert();
        this.dataConvert = {
          id: 0,
          confName: '',
          confContent: '',
          conf: {
            dataSourceType: '',
            dataSource: '',
            template: ''
          },
        };
        return
      }
      this.dataConvertQueryForm.dataConvertOptions.find(item => {
        if (item.id === id) {
          const confJson = JSON.parse(item.confContent);
          this.dataConvert = {
            id: item.id,
            confName: item.confName,
            confContent: item.confContent,
            conf: {
              dataSourceType: confJson.dataSourceType,
              dataSource: confJson.dataSource,
              template: confJson.template
            }
          };
        }
      });
    },
    resetDataConvert() {
      this.dataConvert = {
        id: 0,
        confName: '',
        confContent: '',
        conf: {
          dataSourceType: '',
          dataSource: '',
          template: ''
        },
      };
      this.dataConvertQueryForm.dataConvertId = '';
      this.genList = [];
    },
    genDataConvert() {
      let param = Object.assign({}, this.dataConvert.conf);
      api_data_convert.gen(param).then(res => {
        this.$message.success('生成成功');
        let { list } = res.data;
        this.genList = list;
      });
    }
  },
  async mounted() {
    this.queryDataConvert();
  }
}
</script>

<style scoped></style>
