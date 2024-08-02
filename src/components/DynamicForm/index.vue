<template>
  <el-form :model="formData" ref="form" label-width="100px">
    <el-form-item v-for="(value, key) in schema.properties" :key="key" :label="key" v-if="!value.hidden">
      <component :is="getComponent(value)" v-model="formData[key]" v-bind="getProps(value)" :schema="value"></component>
    </el-form-item>
  </el-form>
</template>

<script>
import ArrayField from './ArrayField.vue';
import ObjectField from './ObjectField.vue';

export default {
  name: 'DynamicForm',
  components: {
    ArrayField,
    ObjectField
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: this.value
    };
  },
  methods: {
    getComponent(field) {
      if (field.component) {
        return field.component;
      }
      switch (field.type) {
        case 'string':
          return 'el-input';
        case 'number':
          return 'el-input-number';
        case 'boolean':
          return 'el-switch';
        case 'array':
          return 'ArrayField';
        case 'object':
          return 'ObjectField';
        default:
          return 'el-input';
      }
    },
    getProps(field) {
      const props = {};
      if (field.type === 'string' && field.format === 'textarea') {
        props.type = 'textarea';
        props.rows = field.rows || 3;
      }
      if (field.placeholder) {
        props.placeholder = field.placeholder;
      }
      if (field.type === 'number') {
        props.min = field.minimum;
        props.max = field.maximum;
      }
      return props;
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.formData = newVal;
      },
      deep: true
    }
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
