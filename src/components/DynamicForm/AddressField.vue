<template>
  <div>
    <el-form-item label="Province">
      <el-select v-model="address.province" placeholder="Select Province" @change="handleProvinceChange">
        <el-option v-for="province in provinces" :key="province.value" :label="province.label"
          :value="province.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="City">
      <el-select v-model="address.city" placeholder="Select City">
        <el-option v-for="city in filteredCities" :key="city.value" :label="city.label" :value="city.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Detail Address">
      <el-input v-model="address.detail" placeholder="Enter detailed address"></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'AddressField',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      address: {
        province: this.value.province || '',
        city: this.value.city || '',
        detail: this.value.detail || ''
      },
      provinces: [
        { label: 'Province 1', value: 'province1', cities: [{ label: 'City 1-1', value: 'city1-1' }, { label: 'City 1-2', value: 'city1-2' }] },
        { label: 'Province 2', value: 'province2', cities: [{ label: 'City 2-1', value: 'city2-1' }, { label: 'City 2-2', value: 'city2-2' }] }
      ]
    };
  },
  computed: {
    filteredCities() {
      const selectedProvince = this.provinces.find(province => province.value === this.address.province);
      return selectedProvince ? selectedProvince.cities : [];
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal !== this.address) {
          this.address = {
            province: newVal.province || '',
            city: newVal.city || '',
            detail: newVal.detail || ''
          };
        }
      },
      deep: true
    },
    address: {
      handler(newVal) {
        if (newVal !== this.value) {
          this.$emit('input', newVal);
        }
      },
      deep: true
    }
  },
  methods: {
    handleProvinceChange() {
      this.address.city = '';
    }
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
