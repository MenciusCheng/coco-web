<template>
  <div class="app-container">
    <el-tabs v-model="defaultTab" @tab-click="handleClick">
      <el-tab-pane label="生成器" name="gen_stream_detail">
        <keep-alive>
          <gen_stream_detail v-if="compMap['gen_stream_detail']" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="配置列表" name="gen_stream_list">
        <keep-alive>
          <gen_stream_list v-if="compMap['gen_stream_list']" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="模版列表" name="gen_stream_detail_tmpl_list">
        <keep-alive>
          <gen_stream_detail_tmpl_list v-if="compMap['gen_stream_detail_tmpl_list']" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import gen_stream_list from "./gen_stream_list.vue";
import gen_stream_detail from "./gen_stream_detail.vue";
import gen_stream_detail_tmpl_list from "./gen_stream_detail_tmpl_list.vue";

export default {
  components: {
    gen_stream_list,
    gen_stream_detail,
    gen_stream_detail_tmpl_list,
  },

  data() {
    return {
      defaultTab: "gen_stream_detail",
      compMap: {
        gen_stream_detail: true,
        gen_stream_list: false,
        gen_stream_detail_tmpl_list: false,
      }
    }
  },

  methods: {
    handleClick: function (tab, event) {
      for (var k in this.compMap) {
        this.compMap[k] = k === tab.name
      }
    },
  }
};
</script>

<style scoped></style>