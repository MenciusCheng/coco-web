<template>
  <div>
    <el-button type="primary" @click="addItem">Add Item</el-button>
    <div v-for="(item, index) in value" :key="index" style="margin-top: 10px;">
      <component :is="getComponent(schema.items)" v-model="value[index]" :schema="schema.items"
        v-bind="getProps(schema.items)" style="width: 80%;"></component>
      <el-button type="danger" @click="removeItem(index)">Remove</el-button>
    </div>
  </div>
</template>

<script>
import ObjectField from './ObjectField.vue';

export default {
  components: {
    ObjectField
  },
  name: 'ArrayField',
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      type: Array,
      required: true
    }
  },
  methods: {
    addItem() {
      if (this.schema.items.type === 'object') {
        this.value.push({});
      } else {
        this.value.push('');
      }
    },
    removeItem(index) {
      this.value.splice(index, 1);
    },
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
