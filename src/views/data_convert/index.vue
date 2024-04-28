<template>
  <div class="app-container">
    <el-tabs v-model="defaultTab" @tab-click="handleClick">
      <el-tab-pane label="数据转换列表" name="data_convert_list">
        <keep-alive>
          <data_convert_list v-if="compMap['data_convert_list']" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="数据转换详情" name="data_convert_detial">
        <keep-alive>
          <data_convert_detial v-if="compMap['data_convert_detial']" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import data_convert_list from "./data_convert_list.vue";
import data_convert_detail from "./data_convert_detail.vue";

export default {
  data() {
    return {
      defaultTab: "data_convert_list",
      compMap: {
        data_convert_list: true,
        data_convert_detail: false,
      }
    }
  },

  methods: {
    handleClick: function (tab, event) {
      for (var k in this.compMap) {
        this.compMap[k] = k === tab.name
      }
    },
  },

  components: {
    data_convert_list,
    data_convert_detail,
  }
};
</script>

<style scoped></style>