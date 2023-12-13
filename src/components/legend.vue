<template>
  <div class="screen1-legend">
    <span class="title">图例</span>
    <div class="item" v-for="(item, index) in arr" :key="index">
      <img v-if="item.type !== 'line'" :src="item.url" alt="" />
      <div v-else class="line" :style="{ backgroundColor: item.color }"></div>
      {{ item.label }}
    </div>
  </div>
</template>

<script setup lang="ts">

const arr = [
  {
    label: '1000kV变电站',
    url: './images/icon_1000.png'
  },
  {
    label: '光伏',
    url: './images/icon-guangfu.png'
  },
  {
    label: '1000kV线路',
    type: 'line',
    color: '#B033FF'
  },
  {
    label: '火电',
    url: './images/icon_huodian.png'
  },
  {
    label: '800KV线路',
    type: 'line',
    color: 'red'
  },
  {
    label: '风电',
    url: './images/icon_fengdian.png'
  },
  {
    label: '500kV变电站',
    url: './images/icon_500.png'
  },
  {
    label: '抽水蓄能电站',
    url: './images/icon_choushui.png'
  },
  {
    label: '500kV线路',
    type: 'line',
    color: '#FCCB33'
  },
  {
    label: '换流变电站',
    url: './images/icon_huanliu.png'
  },
  {
    label: '220kV变电站',
    url: './images/220v-station.png'
  },
  {
    label: '电铁牵引站',
    url: './images/icon_diantieqianyinzhan.png'
  },
  {
    label: '220kV线路',
    type: 'line',
    color: '#FFFFFF'
  },
  {
    label: '储能站',
    url: './images/icon_chunengzhan.png'
  },
]
</script>

<style scoped lang="scss">
.screen1-legend {
  width: 435px;
  height: 366px;
  background-image: url('@/assets/images/legend-bg.png');
  background-size: 100% 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 75px 0 30px 50px;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
  .title {
    position: absolute;
    top: 25px;
    left: calc(50% - 32px);
    font-size: 30px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
  }

  .item {
    display: flex;
    width: 50%;
    font-size: 20px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #d6e7f8;
    align-items: center;

    img {
      width: 30px;
      height: 30px;
      margin-right: 13px;
    }

    .line {
      width: 27px;
      height: 2px;
      margin-right: 13px;
    }
  }
}
</style>
