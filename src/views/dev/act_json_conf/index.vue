<template>
  <div class="app-container">
    <el-tabs v-model="defaultTab" @tab-click="handleClick">
      <el-tab-pane label="列表" name="act_json_conf_list">
        <keep-alive>
          <act_json_conf_list v-if="compMap['act_json_conf_list']" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import act_json_conf_list from "./act_json_conf_list.vue";

export default {
  components: {
    act_json_conf_list,
  },

  data() {
    return {
      defaultTab: "act_json_conf_list",
      compMap: {
        act_json_conf_list: true,
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