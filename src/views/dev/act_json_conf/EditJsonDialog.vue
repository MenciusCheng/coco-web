<!-- EditDialog.vue -->
<template>
  <el-dialog :visible.sync="localVisible" title="Edit Item" @close="closeDialog">
    <el-form :model="formData" ref="form">
      <el-form-item label="名称" :label-width="formLabelWidth">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="扩展配置" :label-width="formLabelWidth">
        <el-input v-model="formData.extend"></el-input>
      </el-form-item> -->
      <el-row>
        <VueForm v-model="extendData" :schema="schema">
        </VueForm>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">Cancel</el-button>
      <el-button type="primary" @click="save">Save</el-button>
      <el-button @click="extendToData(formData.extend)">刷新</el-button>
    </div>
  </el-dialog>
</template>

<script>
import VueForm from '@lljj/vue-json-schema-form';

export default {
  components: {
    VueForm,
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
      formData: this.itemToFormData(this.item),
      localVisible: this.visible,
      formLabelWidth: '120px',
      extendData: {},
      schema: {},
    };
  },
  watch: {
    item(newItem) {
      this.formData = this.itemToFormData(newItem);
    },
    visible(newVal) {
      this.localVisible = newVal;
    },
  },
  methods: {
    closeDialog() {
      this.localVisible = false;
      this.$emit('update:visible', false);
    },
    save() {
      this.$emit('save', this.formDataToItem(this.formData));
      // this.visible = false;
    },
    itemToFormData(item) {
      const o = Object.assign({}, item);
      return o;
    },
    formDataToItem(formData) {
      const o = Object.assign({}, formData);
      o.extend = JSON.stringify({
        extendData: this.extendData,
        schema: this.schema,
      })

      return o;
    },
    extendToData(extend) {
      const extendObj = JSON.parse(extend);
      console.log("extendToData", extendObj);
      if (extendObj.extendData) {
        this.extendData = extendObj.extendData;
      }
      if (extendObj.schema) {
        this.schema = extendObj.schema;
      }
    }
  },
  mounted() {
    this.extendToData(this.formData.extend);
  }
};
</script>
