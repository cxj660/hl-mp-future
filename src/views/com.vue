<template>
  <div class="com">
    <div class="content">
      <div class="btn">
        数据修改
        <select v-model="selectVal" style="width: 50px; text-align: center">
          <option v-for="i in 2" :key="i" :value="i">{{ i }}</option>
        </select>
        颜色修改
        <select v-model="colorsVal" style="width: 50px; text-align: center">
          <option v-for="i in 2" :key="i" :value="i">{{ i }}</option>
        </select>
        当前时间
        <select v-model="currentDate" style="width: 50px; text-align: center">
          <option v-for="i in ['Y', 'M', 'D']" :key="i" :value="i">
            {{ i }}
          </option>
        </select>
        展示全部
        <select v-model="allVal" style="width: 50px; text-align: center">
          <option v-for="(i, index) in [true, false]" :key="index" :value="i">
            {{ i }}
          </option>
        </select>
        单位修改
        <input v-model="unit" style="width: 50px" />
      </div>
      <div class="chart">
        <c-line-chart
          :option="options"
          :configXData="{
            allXData: allVal,
            xDataType: currentDate
          }"
          :unit="unit"
        ></c-line-chart>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import CLineChart from '@/components/c-line-chart/index.vue'

const selectVal = ref<number>(1)

const options = reactive({
  color: [''],
  tooltip: {},
  series: [
    {
      name: '线1',
      data: [1]
    },
    {
      name: '线2',
      data: [1]
    },
    {
      name: '线3',
      data: [1]
    }
  ]
})
const colors1 = ['#5E6DC5', '#F4CA5C']
const colors2 = ['#E86767', '#7DBFDD']

const colorsVal = ref<number>(1)
const currentDate = ref<'Y' | 'M' | 'D'>('Y')
const allVal = ref<boolean>(true)

// 单位修改
const unit = ref<string>('')

// 颜色修改
watch(
  () => colorsVal.value,
  (val) => {
    switch (val) {
      case 1:
        options.color = colors1
        break
      case 2:
        options.color = colors2
        break
    }
  },
  {
    immediate: true
  }
)

// 展示全部时间
watch(
  () => allVal.value,
  (val) => {
    if (val) {
    } else {
    }
  }
)

// 数据修改
watch(
  () => selectVal.value,
  (val) => {
    switch (val) {
      case 1:
        options.series[0].data = [1, 2, 3, 4, 5, 6, 7, 8, 8]
        options.series[1].data = [12, 21, 31, 32, 33, 34, 35]
        options.series[2].data = [33, 34, 35, 3, 4, 5, 6, 7, 8]
        break
      case 2:
        options.series[0].data = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17]
        options.series[1].data = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
        options.series[2] = { name: '', data: [] }
        break
    }
  },
  {
    immediate: true
  }
)
</script>

<style scoped lang="scss">
.com {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid red;
  box-sizing: border-box;

  .content {
    // width: 550px;
    height: 400px;
    display: flex;
    flex-direction: column;
    border: 1px solid red;
    .btn {
      text-align: center;
      height: 50px;
      line-height: 50px;
      border: 1px solid red;
    }
    .chart {
      flex: 1;
      border: 1px solid red;
    }
  }
}
</style>
