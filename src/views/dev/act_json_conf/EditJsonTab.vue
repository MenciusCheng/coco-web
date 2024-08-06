<!-- EditDialog.vue -->
<template>
  <el-dialog :visible.sync="localVisible" title="编辑配置" @close="closeDialog" width="80%">

    <el-tabs v-model="activeTab">
      <el-tab-pane v-if="hasBasic" label="活动" name="basic">
        <BasicConfig ref="basicConfig" :basic="formData.basic" @change="basicChange" />
      </el-tab-pane>
      <el-tab-pane v-if="hasRank" label="榜单" name="rank">
        <RankConfig ref="rankConfig" :rank="formData.rank" />
      </el-tab-pane>
      <el-tab-pane v-if="hasWelfare" label="福利" name="welfare">
        <WelfareConfig ref="welfareConfig" :welfare="formData.welfare" />
      </el-tab-pane>
      <el-tab-pane v-if="hasPlay" label="玩法" name="play">
        <h1>玩法</h1>
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="saveDialog">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import BasicConfig from './tab/BasicConfig.vue';
import RankConfig from './tab/RankConfig.vue';
import WelfareConfig from './tab/WelfareConfig.vue';

export default {
  components: {
    BasicConfig,
    RankConfig,
    WelfareConfig
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeTab: 'basic',
      localVisible: this.visible,
      conf: Object.assign({}, this.item),
      formData: {
        basic: {
          name: '',
          start_time: 0,
          end_time: 0,
          selectedValues: []
        },
        rank: [],
        welfare: [],
      },
      hasPlay: false,
    };
  },
  computed: {
    hasBasic() {
      return this.formData.basic;
    },
    hasRank() {
      return this.formData.rank;
    },
    hasWelfare() {
      return this.formData.welfare;
    }
  },
  methods: {
    closeDialog() {
      this.localVisible = false;
      this.$emit('update:visible', false);
    },
    saveDialog() {
      const o = Object.assign({}, this.conf);

      const basicConfig = this.$refs.basicConfig.getConfig();
      const rankConfig = this.$refs.rankConfig.getRankList();
      const welfareConfig = this.$refs.welfareConfig.getWelfareList();
      const finalConfig = {
        basic: basicConfig,
        rank: rankConfig,
        welfare: welfareConfig
      };
      o.extend = JSON.stringify(finalConfig);
      this.$emit('save', o);
      this.closeDialog();
    },
    basicChange(e) {
      console.log('basicChange', e);
      this.hasPlay = e.includes('play');
    }
  },
  mounted() {
    const extendObj = JSON.parse(this.conf.extend);
    console.log("mounted", extendObj, this.conf);
    if (extendObj.basic) {
      if (!extendObj.basic.selectedValues) {
        extendObj.basic.selectedValues = [];
      }
      this.formData.basic = extendObj.basic;
    }
    if (extendObj.rank) {
      this.formData.rank = extendObj.rank;
    }
    if (extendObj.welfare) {
      this.formData.welfare = extendObj.welfare;
    }
  }
};
</script>

<style>
.jsoneditor-vue {
  height: 100%;
}
</style>
