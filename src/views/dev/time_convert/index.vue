<template>
  <div class="app-container">
    <el-form :model="timeConvert" label-width="80px" ref="timeConvert" size="mini">

      <el-form-item label="时间戳" prop="">
        <el-input v-model="timeConvert.unix" style="width: 200px;"></el-input>
        <el-button @click="timeConvert.unixF = uinxToDtStr(timeConvert.unix)" style="width: 80px;">转换</el-button>
        <el-input v-model="timeConvert.unixF" style="width: 200px;"></el-input>
      </el-form-item>

      <el-form-item label="时间" prop="">
        <el-input v-model="timeConvert.dtStr" style="width: 200px;"></el-input>
        <el-button @click="timeConvert.dtStrF = dtStrToUnix(timeConvert.dtStr)" style="width: 80px;">转换</el-button>
        <el-input v-model="timeConvert.dtStrF" style="width: 200px;"></el-input>
      </el-form-item>

      <el-form-item label="零点时间" prop="">
        <el-input v-model="timeConvert.dtStrZero" style="width: 200px;"></el-input>
        <el-button @click="timeConvert.dtStrZeroF = dtStrToUnix(timeConvert.dtStrZero)" style="width: 80px;">转换</el-button>
        <el-input v-model="timeConvert.dtStrZeroF" style="width: 200px;"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeConvert: {
        unix: "",
        unixF: "",
        dtStr: "",
        dtStrF: "",
        dtStrZero: "",
        dtStrZeroF: "",
      },
    }
  },

  methods: {
    formatUnix() {
      this.timeConvert.unixF = this.uinxToDtStr(this.timeConvert.unix);
    },

    dateToUnix(date) {
      return Math.floor(date.getTime() / 1000);
    },
    dateToDtStr(date) {
      return this.formatDateString(date, "yyyy-MM-dd hh:mm:ss");
    },
    dateToDtStrZero(date) {
      return this.formatDateString(date, "yyyy-MM-dd 00:00:00");
    },
    unixToDate(unix) {
      return new Date(unix * 1000);
    },
    dtStrToDate(dtStr) {
      return new Date(dtStr);
    },
    uinxToDtStr(unix) {
      return this.dateToDtStr(this.unixToDate(unix));
    },
    dtStrToUnix(dtStr) {
      return this.dateToUnix(this.dtStrToDate(dtStr));
    },
    formatDateString(date, pattern) {
      const map = {
        'yyyy': date.getFullYear(),
        'MM': String(date.getMonth() + 1).padStart(2, '0'),
        'dd': String(date.getDate()).padStart(2, '0'),
        'hh': String(date.getHours()).padStart(2, '0'),
        'mm': String(date.getMinutes()).padStart(2, '0'),
        'ss': String(date.getSeconds()).padStart(2, '0')
      };
      return pattern.replace(/yyyy|MM|dd|hh|mm|ss/g, match => map[match]);
    }
  },

  mounted() {
    // date Date 日期对象
    // unix int 秒级时间戳
    // dtStr string 日期时间字符串
    const now = new Date();
    this.timeConvert.unix = this.dateToUnix(now);
    this.timeConvert.dtStr = this.dateToDtStr(now);
    this.timeConvert.dtStrZero = this.dateToDtStrZero(now);
  }
};
</script>

<style scoped></style>