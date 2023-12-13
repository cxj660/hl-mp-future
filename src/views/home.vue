<template>
  <div class="home">
    <div class="btn-list">
      <c-tabs v-model="tabsActive" gap="8px" :tabsData="btnList"></c-tabs>
    </div>
    <div class="container">
      <div class="left-box" v-if="tabsActive == 1">
        <div class="viewpoint-switching" @click="viewChange">
          视角切换( {{ viewState }} )
        </div>
        <map-sider v-model="siderList" @tabsChange="tabsChange"></map-sider>
      </div>
      <div id="hl-earth"></div>
      <div class="right-box" v-if="tabsActive == 1">
        <transition name="legend">
          <c-legend class="legend" v-show="legendState"></c-legend>
        </transition>
        <img
          class="legend-img"
          @click="showLegend"
          src="@/assets/images/icon_tuli.png"
          alt="图例"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch, nextTick } from 'vue'
import CTabs from '@/components/c-tabs/index.vue'
import earth from '@/utils/earth'
import { mapHeihgt, mapColor } from '@/utils/tools'
import { featureType } from '@/types/geoType'
import MapSider from '@/components/map-sider.vue'
import CLegend from '@/components/legend.vue'

const btnList = reactive<{ value: number; label: string }[]>([])
const tabsActive = ref<number>(1)
const legendState = ref<boolean>(true) // 图例显示状态

const getBtnList = () => {
  for (let i = 1; i <= 7; i++) {
    btnList.push({
      label: '示例' + i,
      value: i
    })
  }
}
getBtnList()

const showLegend = () => {
  legendState.value = !legendState.value
}

let viewState = ref<'2d' | '3d'>('2d')

onMounted(() => {
  // 初始化地图，参数为true意为隐藏地图瓦片
  earth.init(false)
  watch(
    () => tabsActive.value,
    async (val) => {
      await nextTick()
      if (val !== 1) {
        earth.hiddenLayer('围栏2', true)
        siderList[5].defaultActive = false
        fetch('./data/370700_full.json')
          .then((response) => {
            return response.json()
          })
          .then(async (res: any) => {
            res.features.forEach((i: any) => {
              try {
                if (
                  ['潍城区', '奎文区', '坊子区'].includes(i.properties.name)
                ) {
                  earth.hiddenLayer('newEnergy' + i.properties.name)
                  ;(
                    document.querySelector(`#hot-info_直供区`) as HTMLDivElement
                  ).style.display = 'none'
                } else {
                  earth.hiddenLayer('newEnergy' + i.properties.name)
                  ;(
                    document.querySelector(
                      `#hot-info_${i.properties.name}`
                    ) as HTMLDivElement
                  ).style.display = 'none'
                }
              } catch (error) {}
            })
          })
      }
      showAllLayers() // 隐藏其他图层
      if (val === 1) {
        demo1()
      } else if (val === 2) {
        demo2()
      } else if (val === 3) {
        demo3()
      } else if (val === 4) {
        demo4()
      } else if (val === 5) {
        demo5()
      } else if (val === 6) {
        demo6()
      } else if (val === 7) {
        demo7()
      }
    },
    {
      immediate: true
    }
  )
})

const viewChange = () => {
  if (viewState.value == '2d') {
    viewState.value = '3d'
    earth.earthFly({
      heading: 2.526276572560401,
      height: 402735.08081123885,
      lonlat: [118.99937527909287, 36.38731655132031, -8.381903171539307e-9],
      pitch: 74.25654102763554,
      tilt: 74.25654102763554
    })
  } else {
    viewState.value = '2d'
    earth.earthFly({
      heading: 3.0403741748747146,
      height: 156872.46470129024,
      lonlat: [119.10603700779322, 36.36542292861084, 2.7939677238464355e-9],
      pitch: 29.90886725711068,
      tilt: 29.90886725711068
    })
  }
}
const siderList = reactive([
  {
    id: 1,
    label: '500kV及以上',
    defaultActive: false
  },
  {
    id: 0,
    label: '220kV',
    defaultActive: false
  },
  {
    id: 2,
    label: '火电',
    defaultActive: false
  },
  {
    id: 3,
    label: '风电',
    defaultActive: false
  },
  {
    id: 4,
    label: '光伏',
    defaultActive: false
  },
  {
    id: 5,
    label: '新能源',
    defaultActive: false
  }
])

// 切换地图选项
const tabsChange = async (data: any) => {
  if (data.label !== '新能源') {
    siderList[5].defaultActive = false
    earth.hiddenLayer('围栏2', true)
    fetch('./data/370700_full.json')
      .then((response) => {
        return response.json()
      })
      .then(async (res: any) => {
        res.features.forEach((i: any) => {
          try {
            if (['潍城区', '奎文区', '坊子区'].includes(i.properties.name)) {
              earth.hiddenLayer('newEnergy' + i.properties.name)
              ;(
                document.querySelector(`#hot-info_直供区`) as HTMLDivElement
              ).style.display = 'none'
            } else {
              earth.hiddenLayer('newEnergy' + i.properties.name)
              ;(
                document.querySelector(
                  `#hot-info_${i.properties.name}`
                ) as HTMLDivElement
              ).style.display = 'none'
            }
          } catch (error) {}
        })
      })
  }

  switch (data.label) {
    case '220kV':
      if (data.defaultActive) {
        // 激活
        earth.addFlyLine('220kV')
        earth.get220Station() // 变电站打点
      } else {
        // 关闭
        earth.hiddenLayer('220kvPointLayer')
        earth.hiddenLayer('lineLayer220kV')
      }
      break
    case '500kV及以上':
      if (data.defaultActive) {
        earth.makePlantStation('变电站', '500kV') // 变电站打点
        earth.addFlyLine('500kV', 'rgba(252, 203, 51, 1)')
        earth.addFlyLine('800kV', 'rgba(255, 0, 0, 1)')
        earth.addFlyLine('1000kV', 'rgba(176, 51, 255, 1)')
      } else {
        // 关闭
        earth.hiddenLayer('stationName500kV')
        earth.hiddenLayer('stationName1000kV')
        earth.hiddenLayer('lineLayer500kV')
        earth.hiddenLayer('lineLayer800kV')
        earth.hiddenLayer('lineLayer1000kV')
      }
      break
    case '火电':
      if (data.defaultActive) {
        // 激活
        earth.makePlantStation('火电站', '火') // 变电站打点
      } else {
        // 关闭
        earth.hiddenLayer('stationName火')
      }
      break
    case '风电':
      if (data.defaultActive) {
        // 激活
        earth.makePlantStation('风电场', '风') // 变电站打点
      } else {
        // 关闭
        earth.hiddenLayer('stationName风')
      }
      break
    case '光伏':
      if (data.defaultActive) {
        // 激活
        earth.makePlantStation('光伏电站', '光') // 变电站打点
      } else {
        // 关闭
        earth.hiddenLayer('stationName光')
      }
      break
    case '新能源':
      if (data.defaultActive) {
        siderList.forEach((i) => {
          if (i.label !== '新能源') {
            i.defaultActive = false
            tabsChange(i)
          } else {
            earth.earthFly({
              heading: 7.900082169347795,
              height: 243615.56496232748,
              lonlat: [
                119.07315590201509, 36.2568973051249, 6.51925802230835e-9
              ],
              pitch: 49.859054056620245,
              tilt: 49.859054056620245
            })
            i.defaultActive = true
          }
        })
        await nextTick()
        // 激活
        earth.newEnergy() // 变电站打点
        // 显示每个区县块
        fetch('./data/370700_full.json')
          .then((response) => {
            return response.json()
          })
          .then(async (res: any) => {
            res.features.forEach((i: any) => {
              if (['潍城区', '奎文区', '坊子区'].includes(i.properties.name)) {
                ;(
                  document.querySelector(`#hot-info_直供区`) as HTMLDivElement
                ).style.display = 'block'
              } else {
                ;(
                  document.querySelector(
                    `#hot-info_${i.properties.name}`
                  ) as HTMLDivElement
                ).style.display = 'block'
              }
            })
          })
      } else {
        earth.hiddenLayer('围栏2', true)
        // 关闭
        // 隐藏每个区县块
        fetch('./data/370700_full.json')
          .then((response) => {
            return response.json()
          })
          .then(async (res: any) => {
            res.features.forEach((i: any) => {
              try {
                if (
                  ['潍城区', '奎文区', '坊子区'].includes(i.properties.name)
                ) {
                  earth.hiddenLayer('newEnergy' + i.properties.name)
                  ;(
                    document.querySelector(`#hot-info_直供区`) as HTMLDivElement
                  ).style.display = 'none'
                } else {
                  earth.hiddenLayer('newEnergy' + i.properties.name)
                  ;(
                    document.querySelector(
                      `#hot-info_${i.properties.name}`
                    ) as HTMLDivElement
                  ).style.display = 'none'
                }
              } catch (error) {}
            })
          })
      }
      break
    default:
      break
  }
  sessionStorage.setItem(
    'mapState2',
    siderList.map((i) => i.defaultActive).toString()
  )
}

declare const THING: any

const demo1 = () => {
  earth.earthFly({
    heading: 3.0403741748747146,
    height: 156872.46470129024,
    lonlat: [119.10603700779322, 36.36542292861084, 2.7939677238464355e-9],
    pitch: 29.90886725711068,
    tilt: 29.90886725711068
  })
  fetch('./data/370700_full.json')
    .then((response) => {
      return response.json()
    })
    .then((res) => {
      // 创建地市区域
      earth.createRegions('sd_full_9en', res, 11000, {
        layerConfig: {
          alwaysOnTop: false,
          layerConfig: {
            type: 'vector',
            color: 'rgba(13,74,142, 0.6)',
            outlineColor: '#81e6fc',
            outlineOpacity: 1,
            outlineWidth: 16
          }
        }
      })
    })

  fetch('./data/370700.json')
    .then((response) => {
      return response.json()
    })
    .then((res) => {
      // 中间地理盖板
      let layer = earth.createRegions('sd_top_cover_9ne', res, 5500, {
        layerConfig: {
          offsetHeight: 5500,
          alwaysOnTop: false,
          type: 'image',
          imageUrl: './map/img/9ne/dt.jpg',
          outlineColor: '#000',
          outlineOpacity: 1,
          outlineWidth: 5
        }
      })
      // 创建侧面围栏
      let wlLayer = earth.creatBoundary(
        'sd_boundary_9ne_wall',
        res.features[0].geometry.coordinates,
        {
          coordinates: res.features[0].geometry.coordinates,
          extrudeHeight: 11000, // 拉伸高度100m
          offsetHeight: 0, // 离地高度100m
          alwaysOnTop: false,
          renderer: {
            color: '#07529A', // 面填充颜色
            imageUrl: './map/img/9ne/1313.png', // 贴图路径
            blending: false, // 是否混色
            speed: 0, // 贴图流速(x,y方向)
            alphaSpeed: 'y', // 透明图流速(x,y方向)
            uvRatio: [1, 1], // 贴图在x轴和y轴的重复次数 默认[1,1] 如果两层贴图 是一个二维数组 数组第一个元素在下 第二个元素在上
            glowStrength: 0.3, // 发光强度 默认0.5
            postRadialBlur: true, // 是否垂直发光 默认false
            useColor: true // 是否叠加颜色
          }
        }
      )
      layer.renderOrder = -2
      wlLayer.renderOrder = -10

      // 顶部盖板
      let topLayer = earth.createRegions('sd_top_cover_9ne_topbg', res, 11000, {
        layerConfig: {
          type: 'vector',
          color: 'rgba(13,74,142, 0.6)',
          outlineColor: '#81e6fc',
          outlineOpacity: 1,
          outlineWidth: 16
        }
      })
      topLayer.renderOrder = -1
    })
}
const demo2 = () => {
  const height = 50000
  earth.earthFly({
    heading: 7.154255940828489,
    height: 938097.8652645927,
    lonlat: [118.0578123394815, 35.96437251406704, 2.7008354663848877e-8],
    pitch: 54.752800974014676,
    tilt: 54.752800974014676
  })
  fetch('./data/370000_full.json')
    .then((response) => {
      1
      return response.json()
    })
    .then((res) => {
      // 创建地市区域
      let dsLayer = earth.createRegions('sd_full_7en', res, height - 5000, {
        layerConfig: {
          outlineColor: '#97A5B7',
          offsetHeight: 25000
        }
      })
      dsLayer.renderOrder = 6
    })

  fetch('./data/370000.json')
    .then((response) => {
      return response.json()
    })
    .then((res) => {
      // 创建全省区域
      let aa = earth.createRegions('sd_top_cover_7en', res, height - 5000, {
        layerConfig: {
          type: 'image',
          imageUrl: './map/img/7en/map7-bg.png',
          outlineColor: '#BBD3FE',
          outlineWidth: 8, // 边框宽度
          alwaysOnTop: true
        }
      })

      const lineLayer = earth.createRegions(
        'sd_top_cover_7en_line',
        res,
        height / 2 - 5000,
        {
          layerConfig: {
            type: 'vector',
            outlineColor: '#515C7D',
            outlineWidth: 18, // 边框宽度
            alwaysOnTop: true
          }
        }
      )

      lineLayer.renderer.outlineEffect = true
      lineLayer.renderer.outlineGlowStrength = 0.8
      aa.renderOrder = 5
      // 创建一层围栏
      let wlLayer = earth.creatBoundary(
        'sd_boundary_7en_wall',
        res.features[0].geometry.coordinates,
        {
          extrudeHeight: height / 2,
          offsetHeight: height / 2 - 5000,
          outlineWidth: 15,
          outlineColor: '#515D7C',
          alwaysOnTop: false,
          renderer: {
            color: '#1B3350',
            speed: [0, 0],
            opacity: 1,
            alphaImageUrl: null,
            imageUrl: './map/img/7en/wall.png',
            glowStrength: 1, // 发光强度 默认0.5
            postRadialBlur: false // 是否垂直发光 默认false
          }
        }
      )
      earth.creatBoundary(
        'sd_boundary_7en_wall_2',
        res.features[0].geometry.coordinates,
        {
          extrudeHeight: height / 2 - 5000,
          offsetHeight: 0,
          outlineWidth: 15,
          outlineColor: '#515D7C',
          alwaysOnTop: false,
          renderer: {
            color: '#1B3350',
            speed: [0, 0],
            opacity: 0.4,
            alphaImageUrl: null,
            imageUrl: './map/img/7en/wall.png',
            glowStrength: 1, // 发光强度 默认0.5
            postRadialBlur: false // 是否垂直发光 默认false
          }
        }
      )
      wlLayer.renderOrder = -10
    })
}
const demo3 = () => {
  const height = 10000
  earth.earthFly({
    heading: 3.092498081826743,
    height: 401789.0004384974,
    lonlat: [117.45228486419846, 36.581935023101074, -3.725290298461914e-9],
    pitch: 74.25654102763733,
    tilt: 74.25654102763733
  })
  fetch('./data/jn.json').then((response) => {
    return response.json()
  })
  //底部区域
  // .then((response) => {
  //   earth.createRegions("jn_bottom_8ht", response, -100, {
  //     layerConfig: {
  //       outlineColor: "#61fdff",
  //       outlineWidth: 10,
  //     },
  //   });
  // });
  fetch('./data/jn-ds.json')
    .then((response) => {
      return response.json()
    })
    //中部区域
    .then((response) => {
      let createRegions = earth.createRegions(
        'jn_center_8ht',
        response,
        height,
        {
          layerConfig: {
            outlineColor: '#91c7dd',
            outlineWidth: 5,
            outlineOpacity: 1
          }
        }
      )
      createRegions.renderer.outlineEffect = true
      createRegions.renderer.outlineGlowStrength = 0.6
    })
  //顶部区域盖板
  fetch('./data/jn.json')
    .then((response) => {
      return response.json()
    })
    .then((res) => {
      let createRegions = earth.createRegions('jn_top_8ht', res, height + 800, {
        layerConfig: {
          type: 'image',
          imageUrl: './map/img/8ht/picture.png',
          outlineColor: '#71abd0',
          outlineWidth: 5
        }
      })
      createRegions.renderer.outlineEffect = true
      createRegions.renderer.outlineGlowStrength = 0.6
      //围栏
      let boundary = earth.creatBoundary(
        'jn_8ht_center_boundary',
        res.features[0].geometry.coordinates,
        {
          extrudeHeight: height,
          offsetHeight: 0,
          renderer: {
            imageUrl: './map/img/8ht/light_wall.png',
            alphaImageUrl: null,
            speed: [0, 0],
            useAlphaMap: false,
            uvRatio: [1, 1]
          }
        }
      )
      boundary.renderOrder = -10
      boundary.renderer.outlineWidth = 15
    })
}
const demo4 = () => {
  earth.earthFly({
    heading: 7.154255940828489,
    height: 938097.8652645927,
    lonlat: [118.0578123394815, 35.96437251406704, 2.7008354663848877e-8],
    pitch: 54.752800974014676,
    tilt: 54.752800974014676
  })
  const height = 25000
  fetch('./data/370000.json')
    .then((response) => {
      return response.json()
    })
    .then((res) => {
      // 创建地市区域
      let createRegions = earth.createRegions(
        'sd_full_42nd',
        res,
        height * 3.5,
        {
          layerConfig: {
            type: 'vector', // vector:纯色 | image:贴图
            outlineColor: '#29f4d2',
            opacity: 1,
            extrudeHeight: height * 2,
            postRadialBlur: true
          }
        }
      )
      createRegions.renderer.outlineEffect = true
      createRegions.renderer.outlineGlowStrength = 0.9
    })

  fetch('./data/370000_full.json')
    .then((response) => {
      return response.json()
    })
    .then((res) => {
      // 创建地市区域
      let createRegions = earth.createRegions('sd_full_4nd', res, height * 3, {
        layerConfig: {
          type: 'vector', // vector:纯色 | image:贴图
          outlineColor: '#29f4d2',
          opacity: 1,
          extrudeHeight: height * 2,
          outlineWidth: 10
        }
      })
      createRegions.outlineEffect = true
      createRegions.outlineGlowStrength = 0.9
    })

  fetch('./data/370000.json')
    .then((response) => {
      return response.json()
    })
    .then((res) => {
      // 创建全省区域
      earth.createRegions('sd_top_cover_4nd', res, height * 3, {
        layerConfig: {
          type: 'image',
          imageUrl: './map/img/4rd/picture.png',
          outlineColor: '#29f4d2',
          opacity: 0.5,
          renderOrder: -10
        }
      })

      // // 创建一层围栏
      earth.creatBoundary(
        'sd_boundary_4nd_wall',
        res.features[0].geometry.coordinates,
        {
          extrudeHeight: height * 1,
          offsetHeight: height * 2,
          renderer: {
            imageUrl: './map/img/4rd/light_wall.png',
            alphaImageUrl: null,
            effect: false, // 是否发光 默认false
            glowStrength: 0.5 // 发光强度 默认0.5
          }
        }
      )
      // 创建二层围栏
      earth.creatBoundary(
        'sd_boundary_4ad_yellow',
        res.features[0].geometry.coordinates,
        {
          extrudeHeight: height,
          offsetHeight: height - 1000,
          renderer: {
            color: '#372c1a', // 面填充颜色
            imageUrl: './map/img/4rd/light_wall.png', // 贴图路径
            blending: true, // 是否混色
            useColor: true // 是否叠加颜色
          }
        }
      )
    })
}
const demo5 = () => {
  earth.earthFly({
    heading: 7.154255940828489,
    height: 938097.8652645927,
    lonlat: [118.0578123394815, 35.96437251406704, 2.7008354663848877e-8],
    pitch: 54.752800974014676,
    tilt: 54.752800974014676
  })
  fetch('./data/370000.json')
    .then((response) => {
      return response.json()
    })
    .then((res) => {
      // 创建地市区域底部
      let regions = earth.createRegions('sd_bottom_11en', res, 0, {
        layerConfig: {
          outlineColor: '#66dff0',
          outlineWidth: 4
        }
      })
      regions.renderer.outlineEffect = true
      regions.renderer.outlineGlowStrength = 0.6
      regions.renderOrder = -15
    })
  fetch('./data/370000.json')
    .then((response) => {
      return response.json()
    })
    .then((res) => {
      // 创建地市区域顶部部
      let regions = earth.createRegions('sd_top_11en', res, 40000, {
        layerConfig: {
          outlineColor: '#66dff0',
          outlineWidth: 10
        }
      })
      regions.renderer.outlineEffect = true
      regions.renderer.outlineGlowStrength = 0.3
      regions.renderOrder = 1
    })
  //创建地市
  fetch('./data/370000_full.json')
    .then((response) => {
      return response.json()
    })
    .then((res: any) => {
      res.features.forEach((ele: any) => {
        let regions = earth.createRegions(
          `sd_bottom_11en_${ele.properties.name}`,
          {
            features: [ele],
            type: 'FeatureCollection'
          },
          0,
          {
            height: mapHeihgt(ele),
            layerConfig: {
              outlineColor: '#144269',
              outlineWidth:
                ele.properties.name == '日照市'
                  ? 0
                  : ele.properties.name == '青岛市'
                  ? 0
                  : ele.properties.name == '济南市'
                  ? 0
                  : 9,
              color: mapColor(ele.properties.name)
            }
          }
        )
        regions.renderOrder = -1
        // let boundary = earth.creatBoundary(
        //   "sd_boundary_11en" + ele.properties.name,
        //   ele.geometry.coordinates,
        //   {
        //     extrudeHeight: mapHeihgt(ele),
        //     offsetHeight: 0,
        //     renderer: {
        //       imageUrl: mapImg(ele),
        //       alphaImageUrl: null,
        //       speed: [0, 0],
        //       uvRatio: [1, 1],
        //     },
        //   }
        // );
        // if (
        //   boundary.name == "sd_boundary_11en青岛市" ||
        //   boundary.name == "sd_boundary_11en日照市" ||
        //   boundary.name == "sd_boundary_11en济南市"
        // ) {
        //   boundary.renderOrder = -10;
        // } else {
        //   boundary.renderOrder = -20;
        // }
      })
    })
}
const demo6 = () => {
  earth.earthFly({
    heading: 36.53003397435264,
    height: 138021.37697252166,
    lonlat: [117.06961606729178, 36.48630172519233, 1.0244548320770264e-8],
    pitch: 20.939237326803237,
    tilt: 20.939237326803237
  })
  fetch('./data/济南_full.json')
    .then((response) => {
      1
      return response.json()
    })
    .then((res) => {
      res.features.forEach((i: featureType) => {
        let heightRandom = Math.random() * (20000 - 10000) + 10000
        let data = {
          features: [i],
          type: 'FeatureCollection'
        }
        let layer = earth.createRegions(
          `sd_full_12th_${i.properties.name}`,
          data,
          0,
          {
            height: heightRandom,
            layerConfig: {
              type: 'vector',
              color: '#2C3958',
              alwaysOnTop: true,
              outlineColor: '#97A5B7'
            }
          }
        )
        layer.on(THING.EventType.MouseEnter, () => {
          document.body.style.cursor = 'pointer'
          layer.offsetHeight = 5000
          layer.renderer.color = '#F5A81D'
        })
        layer.on(THING.EventType.MouseLeave, () => {
          document.body.style.cursor = ''
          layer.offsetHeight = 0
          layer.renderer.color = '#2C3958'
        })
        layer.renderOrder = 10
      })
      // 创建地市区域
    })
}
const demo7 = () => {
  const height = 60000
  earth.earthFly({
    heading: 7.154255940828489,
    height: 938097.8652645927,
    lonlat: [118.0578123394815, 35.96437251406704, 2.7008354663848877e-8],
    pitch: 54.752800974014676,
    tilt: 54.752800974014676
  })
  fetch('./data/370000_full.json')
    .then((response) => {
      return response.json()
    })
    .then((res) => {
      // 创建地市区域
      let dsLayer = earth.createRegions('sd_full_13th', res, height, {
        layerConfig: {
          outlineWidth: 10, // 边框宽度
          outlineColor: '#243043'
        }
      })
      dsLayer.renderOrder = 6
      dsLayer.renderer.outlineEffect = true
      dsLayer.renderer.outlineGlowStrength = 0.2
    })

  fetch('./data/370000.json')
    .then((response) => {
      return response.json()
    })
    .then((res) => {
      // 创建全省区域
      let aa = earth.createRegions('sd_top_cover_13th', res, height, {
        layerConfig: {
          // type: 'image',
          // imageUrl: './map/img/15veth/15bg.png',
          type: 'vector',
          color: '#6F8DB3',
          outlineColor: '#BBD3FE',
          outlineWidth: 10, // 边框宽度
          alwaysOnTop: true
        }
      })

      aa.renderOrder = 5
      // 创建一层围栏
      let wlLayer = earth.creatBoundary(
        'sd_boundary_13th_wall',
        res.features[0].geometry.coordinates,
        {
          extrudeHeight: height,
          outlineWidth: 15,
          outlineColor: '#515D7C',
          alwaysOnTop: false,
          renderer: {
            color: '#222D3C',
            speed: [0, 0],
            opacity: 1,
            uvRatio: [1, 1],
            alphaImageUrl: null,
            imageUrl: './map/img/13then/wa.png',
            glowStrength: 1, // 发光强度 默认0.5
            postRadialBlur: false // 是否垂直发光 默认false
          }
        }
      )
      wlLayer.renderOrder = -10
    })
}

const showAllLayers = () => {
  // 隐藏所有围栏对象
  earth.queryLayer(/boundary/).forEach((boundary: any) => {
    boundary.visible = false
  })
  earth.allLayers().forEach((i) => {
    if (!['天地图'].includes(i)) {
      earth.hiddenLayer(i)
    }
  })
}
</script>

<style scoped lang="scss">
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .btn-list {
    height: 50px;
    display: flex;
    padding: 20px;
  }

  .container {
    flex: 1;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;

    .left-box {
      position: absolute;
      bottom: 1%;
      left: 1%;
      z-index: 2;
      scale: 0.6;

      .viewpoint-switching {
        width: 140px;
        height: 100px;
        color: #fff;
        cursor: pointer;
        text-align: center;
        line-height: 100px;
      }
    }

    .right-box {
      position: absolute;
      bottom: 12%;
      right: 2%;
      z-index: 2;
      scale: 0.6;
      cursor: pointer;

      .legend {
        width: 435px;
        height: 411px;
        position: absolute;
        right: 10px;
        bottom: 100px;
      }
    }
  }
}
</style>
