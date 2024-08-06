<!-- EditDialog.vue -->
<template>
  <el-dialog :visible.sync="localVisible" title="Edit Item" @close="closeDialog" width="80%">
    <el-form :model="formData" ref="form">
      <el-row>
        <el-col :span="24">
          <el-form-item label="Name" :label-width="formLabelWidth">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <span class="demonstration">预览 JSON</span>
          <vue-json-editor style="width: 100%; height: 420px" v-model="extendData" :showBtns="false" mode="code"
            lang="zh" :expanded-on-start="true" @json-change="onJsonChange" @json-save="onJsonSave"
            @has-error="onError" />
        </el-col>
      </el-row>

      <!-- <el-form-item label="JSON" :label-width="formLabelWidth">
        <el-input v-model="extendData"></el-input>
      </el-form-item>
      <el-form-item label="schema" :label-width="formLabelWidth">
        <el-input v-model="schema"></el-input>
      </el-form-item> -->
      <el-row>

      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">Cancel</el-button>
      <el-button type="primary" @click="save">Save</el-button>
    </div>
  </el-dialog>
</template>

<script>
import VueForm from '@lljj/vue-json-schema-form';
import VueJsonEditor from "vue-json-editor";
import DynamicForm from "@/components/DynamicForm";

export default {
  components: {
    VueForm,
    VueJsonEditor,
    DynamicForm,
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
      localVisible: this.visible,
      formData: Object.assign({}, this.item),
      formLabelWidth: '120px',
      extendData: {},
      schema: {},
    };
  },
  watch: {
    visible(newVal) {
      this.localVisible = newVal;
    },
    item(newItem) {
      this.formData = Object.assign({}, newItem);
      const extendObj = JSON.parse(this.formData.extend);
      this.extendData = extendObj;
    },
  },
  methods: {
    closeDialog() {
      this.localVisible = false;
      this.$emit('update:visible', false);
    },
    save() {
      // const o = Object.assign({}, this.formData);
      // o.extend = JSON.stringify({
      //   extendData: this.extendData,
      //   schema: this.schema,
      // })
      // this.$emit('save', o);
      this.closeDialog();
    },
    onJsonChange(value) {
      console.log('onJsonChange:', value)
    },
    onJsonSave(value) {

    },
    onError(value) {

    }
  },
  mounted() {
    const extendObj = JSON.parse(this.formData.extend);
    this.extendData = extendObj;
  }
};
</script>

<style>
.jsoneditor-vue {
  height: 100%;
}
</style>
