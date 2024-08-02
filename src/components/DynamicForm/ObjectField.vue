<template>
  <el-form :model="value" label-width="100px">
    <el-form-item v-for="(val, key) in schema.properties" :key="key" :label="key" v-if="!val.hidden">
      <component :is="getComponent(val)" v-model="value[key]" v-bind="getProps(val)" :schema="val"></component>
    </el-form-item>
  </el-form>
</template>

<script>
import ArrayField from './ArrayField.vue';

export default {
  components: {
    ArrayField,
  },
  name: 'ObjectField',
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
  }
};
</script>
