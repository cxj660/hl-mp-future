<template>
  <div :id="randomId" :style="`width: ${width};height: ${height}`"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ECharts } from 'echarts'
import { merge, debounce } from 'lodash'
import { parseColorString } from '@/utils/tools'
import { ref, onMounted, watch, shallowRef } from 'vue'

import dayjs from 'dayjs'

interface configXDataType {
  allXData?: boolean
  xDataType?: 'Y' | 'M' | 'D'
}

interface Props {
  width?: string
  height?: string
  option?: any
  unit?: string
  configXData: configXDataType
}
const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%',
  configXData: () => {
    return {
      xDataType: 'D',
      allXData: false
    }
  }
})
const randomId = (Math.random() * 100000).toFixed(0)

let color = ref<string[]>([
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc'
])

let myChart = shallowRef<ECharts>()

const hexToRgba = (hex: any, opacity: any) => {
  let rgbaColor = ''
  let reg = /^#[\da-f]{6}$/i
  const colorTest = parseColorString(hex)
  if (reg.test(hex)) {
    rgbaColor = `rgba(${colorTest.r},${colorTest.g},${colorTest.b},${opacity})`
  }
  return rgbaColor
}

const option = (color: string[], xData?: string[]) => {
  return {
    color,
    legend: {
      padding: [20, 20, 0, 0],
      icon: 'rect',
      itemWidth: 15,
      itemHeight: 4,
      x: 'right',
      y: 'top',
      textStyle: {
        color: '#BFD5E0',
        fontSize: 14
      }
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      borderColor: '#000',
      backgroundColor: 'rgba(0, 0, 0, 0.50)',
      formatter: function (params: any) {
        let html = ''
        params.forEach((v: any) => {
          html += `<div style="color: #fff;font-size: 18px;line-height: 25px;">
          <span style="margin-right:8px"> ${v.axisValue}</span>
                <span style="color:${color[v.componentIndex]};
                 font-weight:700;font-size: 18px;font-family: QuartzEF;">${
                   v.value
                 }</span>
                <span style='color:#97A5C5;font-size: 15px'>${
                  props.unit || ''
                }</span>`
        })
        return html
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          type: 'solid',
          color: 'rgba(168, 181, 189, 0.8)'
        }
      }
    },
    grid: {
      top: '18%',
      left: '12%',
      right: '5%',
      bottom: '15%'
    },
    xAxis: [
      {
        type: 'category',
        interval: 1,
        splitNumber: 4,
        // boundaryGap: false,
        axisLabel: {
          margin: 15,
          textStyle: {
            color: '#BFD5E0',
            fontSize: 14
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        data: xData
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: props.unit,
        axisLabel: {
          textStyle: {
            color: '#BFD5E0',
            fontSize: 14
          }
        },
        nameTextStyle: {
          color: '#BFD5E0',
          fontSize: 14,
          padding: [0, 0, 0, -40]
        },
        splitLine: {
          lineStyle: {
            type: 'solid',
            width: 1,
            color: 'rgba(0, 179, 254, 0.12)'
          }
        },
        axisLine: {
          show: false
        }
      }
    ],
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: hexToRgba(color[0], 0.6)
                },
                {
                  offset: 1,
                  color: hexToRgba(color[0], 0.2)
                }
              ]
            }
          }
        },
        data: []
      },
      {
        type: 'line',
        smooth: true,
        symbol: 'none',
        symbolSize: 8,
        zlevel: 3,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: hexToRgba(color[1], 0.6)
                },
                {
                  offset: 1,
                  color: hexToRgba(color[1], 0.2)
                }
              ],
              false
            )
          }
        },
        data: []
      },
      {
        type: 'line',
        smooth: true,
        symbol: 'none',
        symbolSize: 8,
        zlevel: 3,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: hexToRgba(color[2], 0.6)
                },
                {
                  offset: 1,
                  color: hexToRgba(color[2], 0.2)
                }
              ],
              false
            )
          }
        },
        data: []
      },
      {
        type: 'line',
        smooth: true,
        symbol: 'none',
        symbolSize: 8,
        zlevel: 3,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: hexToRgba(color[3], 0.6)
                },
                {
                  offset: 1,
                  color: hexToRgba(color[3], 0.2)
                }
              ],
              false
            )
          }
        },
        data: []
      }
    ]
  }
}
const drawChart = debounce(() => {
  myChart.value = echarts.init(document.getElementById(randomId) as HTMLElement)
  color.value = props.option?.color
    ? [...props.option?.color, ...color.value]
    : [
        '#5470c6',
        '#91cc75',
        '#fac858',
        '#ee6666',
        '#73c0de',
        '#3ba272',
        '#fc8452',
        '#9a60b4',
        '#ea7ccc'
      ]
  myChart.value.setOption(
    merge(option(color.value, getXData(props.configXData)), props.option)
  )
}, 500)
onMounted(() => {
  drawChart()
})

watch(
  () => props,
  () => {
    console.log(props.option)

    drawChart()
  },
  {
    deep: true
  }
)

// 获取x轴数据
const getXData = (configXData: configXDataType) => {
  const allVal = configXData.allXData
  const xDataType = configXData.xDataType
  let xArr: any[] = []
  // 获取近五年数据 //  [2019, 2020, 2021, 2022, 2023]
  if (xDataType == 'Y') {
    // 获取近五年数据
    const year = parseInt(dayjs().format('YYYY'))
    for (let i = year; i > year - 5; i--) {
      xArr.unshift(i)
    }
  }
  // 获取今年 所有月份
  if (xDataType == 'M') {
    if (!allVal) {
      console.log(dayjs().format('M'))
      for (let i = 1; i <= parseInt(dayjs().format('M')); i++) {
        xArr.push(i)
      }
    } else {
      for (let i = 1; i <= 12; i++) {
        xArr.push(i)
      }
    }
  }
  // 获取本月所有天
  if (xDataType == 'D') {
    if (!allVal) {
      for (let i = 1; i <= parseInt(dayjs().format('D')); i++) {
        xArr.push(i)
      }
    } else {
      let dayLength = parseFloat(dayjs().endOf('month').format('DD'))
      for (let i = 1; i <= dayLength; i++) {
        xArr.push(i)
      }
    }
  }
  return xArr
}
</script>

<style scoped lang="scss">
:deep(.charts-bg) {
  // padding: 23px 32px;
  background-size: 100% 100%;
  font-family: 'Source Han Sans CN';
  position: absolute;
  display: block;

  .charts-value {
    font-family: QuartzEF;
  }
}
</style>
