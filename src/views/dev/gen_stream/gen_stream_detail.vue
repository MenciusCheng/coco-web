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
          <el-form-item label="数据类型" prop="dataSourceType">
            <el-select v-model="genStream.conf.dataSourceType" filterable placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in dataSourceTypeOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="18">
              <el-form-item label="配置名称" prop="dataSource">
                <el-input type="input" v-model="genStream.confName" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="id" prop="id" label-width="40px">
                <el-input type="input" readonly disabled v-model="genStream.id" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="数据源" prop="dataSource">
            <el-input type="textarea" v-model="genStream.conf.dataSource" :rows="16" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模板内容" prop="template">
            <el-input type="textarea" v-model="genStream.conf.template" :rows="16" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-for="(item, index) in genList">
          <el-form-item :label="item.name ? item.name : '生成内容'">
            <el-input type="textarea" v-model="genList[index].content" :rows="16" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
import * as apiGenStreamConf from '@/api/gen_stream_conf';
import { dateFormat } from '@/utils/timeUtil';

export default {
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
      genList: [],
    }
  },
  methods: {
    queryGenStream() {
      let param = {
        page: 1,
        size: 10000,
      }
      apiGenStreamConf.query(param).then(res => {
        let { list } = res.data;
        for (let i = 0; i < list.length; i++) {
          let record = list[i];
          record.optionName = `${record.confName}(${record.id})`;
        }
        this.genStreamQueryForm.genStreamOptions = list;
      }).catch(err => {
        console.log(err);
      });
    },
    saveGenStream(isOther) {
      // 保存
      this.$refs['genStream'].validate((valid) => {
        if (valid) {
          let param = Object.assign({}, this.genStream);
          param.extend = JSON.stringify(param.conf);
          if (isOther) {
            // 另存为
            param.id = 0;
          }
          if (param.id > 0) {
            this.updateGenStream(param);
          } else {
            this.insertGenStream(param);
          }
        } else {
          this.$message.warning('请检查参数');
          return false;
        }
      });
    },
    insertGenStream(param) {
      this.$confirm('此操作将新增记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiGenStreamConf.create(param).then(res => {
          this.$message.success('添加成功');
          this.queryGenStream();
          let { id } = res.data;
          this.genStream.id = id;
          this.genStreamQueryForm.genStreamId = id;
        })
      }).catch(() => {
        this.$message.info('已取消添加');
      });
    },
    updateGenStream(param) {
      apiGenStreamConf.update(param).then(res => {
        this.$message.success('修改成功');
        this.queryGenStream();
      });
      // this.$confirm('此操作将修改该记录, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   apiGenStreamConf.update(param).then(res => {
      //     this.$message.success('修改成功');
      //     this.queryGenStream();
      //   })
      // }).catch(() => {
      //   this.$message.info('已取消修改');
      // });
    },
    handleGenStreamIdChange(id) {
      this.genList = [];
      if (!id) {
        this.queryGenStream();
        this.genStream = {
          id: 0,
          confName: '',
          extend: '',
          conf: {
            dataSourceType: '',
            dataSource: '',
            template: ''
          },
        };
        return
      }
      this.genStreamQueryForm.genStreamOptions.find(item => {
        if (item.id === id) {
          const extend = JSON.parse(item.extend);
          this.genStream = {
            id: item.id,
            confName: item.confName,
            extend: item.extend,
            conf: {
              dataSourceType: extend.dataSourceType,
              dataSource: extend.dataSource,
              template: extend.template
            }
          };
        }
      });
    },
    resetGenStream() {
      this.genStream = {
        id: 0,
        confName: '',
        extend: '',
        conf: {
          dataSourceType: '',
          dataSource: '',
          template: ''
        },
      };
      this.genStreamQueryForm.genStreamId = '';
      this.genList = [];
    },
    genGenStream() {
      let param = Object.assign({}, this.genStream.conf);
      apiGenStreamConf.gen(param).then(res => {
        this.$message.success('生成成功');
        let { list } = res.data;
        this.genList = list;
      });
    }
  },
  async mounted() {
    this.queryGenStream();
  }
}
</script>

<style scoped></style>
