import Axios from 'axios'
import { merge } from 'lodash'
import { GeonjsonType, PointDataType } from '@/types/geoType'
import getMapLine from '@/assets/json/getMapLine.json'
import getPlantStation from '@/assets/json/getPlantStation.json'
import searchNewenergyHeat from '@/assets/json/searchNewenergyHeat.json'

import { returnPercent } from '@/utils/tools'
class Earth {
  public mapUtils: any

  public init(hideTiles = false) {
    Axios('./config/InitEarthConfig.json').then((response: any) => {
      const {
        container,
        cameraFlyTo,
        map: { tileLayer, map }
      } = response.data
      const initCfg = {
        container, // 容器ID
        name: 'map',
        // restrictedLevel: [7, 9], // 地图层级范围
        maxPitch: 70, //地图最大俯仰角 最大90
        cameraFlyTo,
        tileLayer,
        map
      }

      // 创建地图
      this.mapUtils = new MapUtils(initCfg)

      this.mapUtils.HL_MAP.on('click', (e: any) => {
        console.log(e, e.coordinates.toString())
        console.log(
          this.mapUtils.HL_APP.camera.position,
          this.mapUtils.HL_APP.camera.target
        )
        console.log(this.mapUtils.HL_APP.camera.getCameInfo())
      })

      // window.mapUtils = this.mapUtils
      this.mapUtils.HL_APP.background = [0, 0, 0]

      if (hideTiles) {
        this.hideTiles()
      }
    })
  }

  /**
   * @description  初始化视角
   */
  public flyInit(key?: string) {
    Axios('./config/InitEarthConfig.json').then((response: any) => {
      const cfgKey = key || 'cameraFlyTo'
      const cameraFlyTo = response.data[cfgKey]
      console.log('aa', cameraFlyTo)

      this.mapUtils?.HL_APP.camera.earthFlyTo({ time: 2000, ...cameraFlyTo })
    })
  }

  earthFly(cameraFlyTo: any) {
    this.mapUtils?.HL_APP.camera.earthFlyTo({ time: 2000, ...cameraFlyTo })
  }

  /**
   * @description: 隐藏地球瓦片
   */
  private hideTiles() {
    const tilesLayer = this.mapUtils.queryLayer('天地图')
    if (tilesLayer) {
      tilesLayer.style.grayFilterEnable = true
      tilesLayer.style.customColor = [255, 255, 255, 0]
      tilesLayer.style.grayFilterColorBar = [
        [3, 14, 41, 1],
        [3, 14, 41, 1],
        [3, 14, 41, 1],
        [3, 14, 41, 1]
      ]
    }
  }

  /**
   * @description: 显示地球瓦片
   */
  // private showTiles() {
  //   // 显示地球瓦片
  //   const tilesLayer = this.mapUtils.queryLayer('天地图')
  //   tilesLayer.style.grayFilterEnable = true
  //   tilesLayer.style.customColor = [255, 255, 255, 1]
  // }

  // 查询所有物体
  public queryLayer(name: any) {
    return this.mapUtils?.HL_APP.query(name) || []
  }

  allLayers() {
    let layers: string[] = []
    if (this.mapUtils?.layers) {
      layers = Object.keys(this.mapUtils.layers)
    }
    return layers
  }

  // 隐藏图层
  hiddenLayer(layer: string, model: boolean = false) {
    if (model) {
      this.mapUtils.destoryModel(layer)
    } else {
      this.mapUtils.destroyLayer(layer)
    }
  }
  changeVisibleByLayer(layer: string, flag: boolean) {
    if (this.mapUtils?.query(layer)) {
      this.mapUtils.query(layer).visible = flag
    }
  }

  /**
   * @description: 创建行政区域（面）
   * @param layerName
   * @param geojson
   * @param height  离地高度 默认0
   * @param renderConfig
   */
  public createRegions(
    layerName: string,
    geojson: GeonjsonType,
    height = 0,
    renderConfig = {}
  ) {
    const geoPolyonConfig = {
      id: layerName,
      name: layerName,
      type: 'FeatureLayer',
      geometryType: 'GeoPolygon', // 几何类型 GeoLine GeoPoint GeoPolygon GeoWater GeoBuilding
      offsetHeight: height, // 离地高度
      alwaysOnTop: false, // 设置物体是否始终在最前端渲染显示
      // label: { //显示标签，样式配置
      //   text: "{{name}}", // 显示的文字, 可选取 properties 中的属性
      //   fontColor: "#009688",
      //   imageUrl: "/projectAssets/demo/images/bg/title.png", // 背景图
      //   fontSize: 18, // 默认18
      // },
      layerConfig: {
        // 样式渲染
        type: 'vector', // vector:纯色 | image:贴图
        color: 'rgba(0,172,252,0)', // 面的填充颜色
        imageUrl: './map/img/1st/picture.jpg', // 贴图地址
        outlineColor: '#15FEFF', //边框颜色
        outlineOpacity: 1, // 边框透明度
        outlineWidth: 5 // 边框宽度
      }
    }
    console.log(this.mapUtils, 'this.mapUtils')

    return this.mapUtils.createGeoPolygonFeatureLayer(
      merge(geoPolyonConfig, renderConfig),
      geojson
    )
  }

  // 创建围栏
  public creatBoundary(
    boundaryName: string,
    coordinates: [[[number, number]]],
    boundaryRender = {}
  ) {
    let boundary = this.mapUtils.HL_APP.query(boundaryName)[0]
    if (!boundary) {
      const cfg = {
        type: 'GeoBoundary',
        name: boundaryName,
        coordinates: coordinates, // 支持Polygon和MultiPolygon,格式可参考geoJson规范
        // 支持LineString和MultiLineString,格式可参考geoJson规范
        extrudeHeight: 50000, // 拉伸高度100m
        offsetHeight: 0, // 离地高度
        alwaysOnTop: false,
        outlineColor: '#fff',
        outlineOpacity: 1,
        outlineWidth: 0,
        renderer: {
          // color: "#f00", // 面填充颜色
          opacity: 1, // 不透明度
          imageUrl: './map/img/light_wall.png', // 贴图路径
          blending: false, // 是否混色
          alphaImageUrl: './map/img/light_wall.png', // 透明图路径
          speed: [0, 0.1], // 贴图流速(x,y方向)
          alphaSpeed: [1, 0], // 透明图流速(x,y方向)
          uvRatio: [1, 3], // 贴图在x轴和y轴的重复次数 默认[1,1] 如果两层贴图 是一个二维数组 数组第一个元素在下 第二个元素在上
          glowStrength: 0.5, // 发光强度 默认0.5
          postRadialBlur: false, // 是否垂直发光 默认false
          useColor: false // 是否叠加颜色
        }
      }
      boundary = this.mapUtils.HL_APP.create(merge(cfg, boundaryRender))
    } else {
      boundary.visible = !boundary.visible
    }
    return boundary
  }

  createThingLayer(layerName: string) {
    let pointListLayer = this.mapUtils.queryLayer(layerName)
    if (!pointListLayer) {
      pointListLayer = this.mapUtils.createThingLayer(layerName)
    }
    return pointListLayer
  }

  /**
   * 创建点
   * @param pointData   //点数据
   * @param cfg  //点自定义配置项
   */
  // 获取地图打点数据
  public getPointData(pointData: PointDataType[], cfg: any) {
    pointData.forEach((item: PointDataType, index: number) => {
      const geoPointCfg = {
        layerName: cfg.layerName,
        name: `point${index}`,
        userData: item.userData,
        coordinates: item.coordinate.split(','),
        type: 'image',
        url: `./images/building_top.png`,
        size: 1.5,
        opacity: 1,
        alwaysOnTop: true,
        keepSize: true,
        rotateSpeed: 0,
        offsetHeight: 60000
      }
      return this.mapUtils.addPoint(merge(geoPointCfg, cfg))
    })
  }

  protected createTheGridFlyLine() {
    // const layerObject = this.mapUtils.createThingLayer('lineLayer')
    // request
    //   .get('./config/chengmenbei.geojson', { params: { qxcode } })
    //   .then((res) => {
    //     if (!res || !res.length) return
    //     // console.log(res, '745res')
    //     res.forEach((item) => {
    //       const jsonData = JSON.parse(item.wjValue)
    //       const cfg = {
    //         type: 'GeoLine',
    //         name: layerObject.name + item.lineId,
    //         coordinates: jsonData.features.map(
    //           (feature) => feature.geometry.coordinates
    //         ),
    //         renderer: {
    //           type: 'vector', // 代表纯色渲染
    //           lineType: 'Plane',
    //           color: [255, 255, 255], // 红色
    //           width: 5
    //         },
    //         visible: true,
    //         userData: item,
    //         z: 15,
    //         infoWindow: {
    //           displayMode: CMAP.DisplayMode.MouseEnter, // 悬浮显示
    //           type: CMAP.InfoWindowType.Custom, // 自定义InfoWindow
    //           pivot: [0.5, 0.5], // 界面的轴心，以百分比表示界面轴心位置。[0,0] 代表界面左上；[1,1] 代表界面右下
    //           offset: [0, 0, 0], // 偏移量 单位米 y代表上下方向
    //           customHtml: `<div>
    //             <div class="earth_line">${item.lineName}</div>
    //             </div>`
    //         }
    //       }
    //       const line = this.mapUtils.HL_APP.create(cfg)
    //       layerObject.add(line)
    //       line.on(THING.EventType.MouseEnter, () => {
    //         document.body.style.cursor = 'pointer'
    //         if (line.renderer.color === '#ffffff') {
    //           line.renderer.color = '#ff1100'
    //           line.renderer.effect = true
    //         }
    //         // line.renderer.speed = 1
    //       })
    //       line.on(THING.EventType.MouseLeave, () => {
    //         document.body.style.cursor = ''
    //         if (line.renderer.color === '#ff1100') {
    //           line.renderer.color = '#fff'
    //           line.renderer.effect = false
    //         }
    //         // line.renderer.speed = 1
    //       })
    //     })
    //   })
  }

  // 创建图层
  public createLayer(layerName: string) {
    return this.mapUtils.createThingLayer(layerName)
  }

  // 图层查询
  public queryLayerbyName(layerName: string) {
    return this.mapUtils.queryLayer(layerName)
  }

  public createLine(configs: any) {
    let layer = this.mapUtils.createThingLayer(configs.layerName) // 创建图层
    const geoLineCfg = {
      userData: {},
      type: 'image', // image vector
      lineType: 'Plane',
      imageUrl: './images/huangse.png',
      color: '#ff0000',
      width: 30,
      growLoop: false,
      opacity: 1,
      speed: 0
    }
    layer.renderOrder = 20
    this.mapUtils.addLine(merge(geoLineCfg, configs))
  }

  getFilterData = async (station: string, level: any) => {
    const res = getPlantStation.returnObject
    if (['火', '风', '光'].includes(level)) {
      return res.filter((i: any) => {
        return i.stationType == station && parseInt(i.voltageLevel) <= 220
      })
    }
    if (parseInt(level) == 500) {
      return res.filter((i: any) => parseInt(i.voltageLevel) >= 500)
    }
    if (parseInt(level) == 220) {
      return res.filter((i: any) => i.voltageLevel == '220kV')
    }
  }

  getLineType = async (level: string) => {
    return getMapLine.returnObject.filter((i: any) => i.voltageLevel == level)
  }

  /**
   * 创建飞线
   */
  addFlyLine(level: string, _color: string = '#fff') {
    const data = this.getLineType(level)
    const lineLayer = this.mapUtils.createThingLayer('lineLayer' + level)
    data.then((res) => {
      res.forEach((item: any, index: number) => {
        let geoLineCfg: any
        const layerName = 'lineLayer' + level

        geoLineCfg = {
          layerName,
          name: index,
          coordinates: JSON.parse(item.coordinate)[0],
          type: 'image',
          lineType: 'Plane',
          renderOrder: 0,
          imageUrl:
            level == '1000kV'
              ? './images/zhi.png'
              : level == '800kV'
              ? './images/hong.png'
              : level == '500kV'
              ? './images/huangse.png'
              : level == '220kV'
              ? './images/bai.png'
              : './images/bai.png',
          width: 40,
          numPass: 0,
          opacity: 1,
          speed: 0.15,
          effect: false
        }
        const line = this.mapUtils.addLine(geoLineCfg)
        line.userData = { county: item.lineName, dl: item.dl, pyg: item.pyg }
        lineLayer.offsetHeight = 11500
        this.createCardInfo(line)
        line.on(THING.EventType.MouseEnter, () => {
          document.body.style.cursor = 'pointer'
          ;(
            document.querySelector(
              `#card-info_${item.lineName}`
            ) as HTMLDivElement
          ).style.display = 'block'
        })
        this.createUIAnchor(line, 'dialog')
        line.on(THING.EventType.MouseLeave, () => {
          document.body.style.cursor = 'auto'
          ;(
            document.querySelector(
              `#card-info_${item.lineName}`
            ) as HTMLDivElement
          ).style.display = 'none'
        })
      })
    })
    lineLayer.renderOrder = 99999999999999
  }

  protected createCardInfo(point: any) {
    const parent: any = document.getElementById('hl-earth')
    const div = document.createElement('div')

    point.userData.county = point.userData.county.replace(/[（）()]/g, '')

    div.setAttribute('class', 'card-info')
    div.setAttribute('id', `card-info_${point.userData.county}`)
    const htmlStr = `
      <div class='title'>${point.userData.county}</div>
      <div class='content'>
      <span>有功：${point.userData.pyg}</span>
      <span>电流：${point.userData.dl}</span>
      </div>
    `
    div.innerHTML = htmlStr
    // const parser = new DOMParser()
    // const document2 = parser.parseFromString(htmlStr, 'text/html')
    parent.appendChild(div)
    this.createUIAnchor(point, 'card-info_' + point.userData.county, [0.5, 1])
  }

  // 获取与220kv线路有关的站点
  async get220Station() {
    const data = await this.getLineType('220kV')
    const res = getPlantStation.returnObject // 所有站点数据
    const aboutPoint: any = []
    res.forEach((item: any) => {
      data.forEach((i: any) => {
        if (
          item.voltageLevel == '220kV' ||
          item.stationName == i.oneStationId ||
          item.stationName == i.twoStationId
        ) {
          aboutPoint.push(item)
        }
      })
    })

    const lineLayer = this.mapUtils.createThingLayer('220kvPointLayer')
    aboutPoint.forEach((item: any) => {
      if (!item.coordinate) return
      const geoPointCfg = {
        layerName: '220kvPointLayer', //'countyName',
        name: item.areaId + item.stationName,
        coordinates: item?.coordinate?.split(',') ?? [],
        type: 'image',
        url:
          item.stationType == '火电站'
            ? './images/icon_huodian.png'
            : item.stationType == '风电场'
            ? './images/icon_fengdian.png'
            : item.stationType == '牵引站'
            ? './images/icon_diantieqianyinzhan.png'
            : item.stationType == '储能站'
            ? './images/icon_chunengzhan.png'
            : item.stationType == '光伏电站'
            ? './images/icon-guangfu.png'
            : item.stationType == '换流站'
            ? './images/icon_huanliu.png'
            : item.voltageLevel == '220kV'
            ? './images/220v-station.png'
            : item.voltageLevel == '500kV'
            ? './images/icon_500.png'
            : item.voltageLevel == '1000kV'
            ? './images/icon_1000.png'
            : item.stationType == '储能站'
            ? './images/icon_chunengzhan.png'
            : '',
        size: 1,
        // pivot: [0, 0],
        pivotPixel: [12, 8],
        lineWidth: 0,
        alwaysOnTop: true,
        keepSize: true,
        rotateSpeed: 0,
        infoWindow: {
          displayMode: CMAP.DisplayMode.MouseEnter, // 悬浮显示
          type: CMAP.InfoWindowType.Custom, // 自定义InfoWindow
          pivot: [0.8, 1.5],
          offset: [20, 20, 0],
          customHtml: `<div style="font-size: 25px;color: #00FFFF;">${
            item.stationName !== null ? item.stationName : ''
          }</div>`
        }
      }
      const point = this.mapUtils.addPoint(geoPointCfg)
      point.offsetHeight = 11000
      point.userData = { county: item.stationName }
      point.on(THING.EventType.MouseEnter, () => {
        document.body.style.cursor = 'pointer'
      })
      point.on(THING.EventType.MouseLeave, () => {
        document.body.style.cursor = 'auto'
      })
    })
    lineLayer.renderOrder = -10
  }

  protected createUIAnchor(
    obj: any,
    panelId: any,
    pivot = [0.5, -1],
    _localPosition = [1, 0, 0],
    zIndex?: any
  ) {
    const UIAnchor = this.mapUtils.HL_APP.create({
      type: 'UIAnchor',
      name: panelId,
      element: document.getElementById(panelId),
      parent: obj,
      pivot: pivot,
      complete: () => {}
    })
    if (zIndex) {
      UIAnchor.zIndex = zIndex
    }
  }

  protected createPointText(point: any, county: boolean = false) {
    const parent: any = document.getElementById('hl-earth')
    const div = document.createElement('div')
    const newContent = document.createTextNode(point.userData.county)
    div.appendChild(newContent)
    div.setAttribute('class', `point_text`)
    div.setAttribute('id', `point_text_${point.userData.county}`)
    parent.appendChild(div)
    this.createUIAnchor(
      point,
      'point_text_' + point.userData.county,
      county ? [0.5, 1] : [0.5, -1]
      // [10, 0, 0]
    )
  }
  // 变电站打点

  async makePlantStation(station: string, level: any) {
    const layer = this.mapUtils.createThingLayer('stationName' + level)
    const data = (await this.getFilterData(station, level)) ?? []
    data.forEach((item: any) => {
      if (!item.coordinate) return
      const geoPointCfg = {
        layerName: 'stationName' + level, //'countyName',
        name: item.areaId + item.stationName,
        coordinates: item?.coordinate?.split(',') ?? [],
        type: 'image',
        url:
          item.stationType == '火电站'
            ? './images/icon_huodian.png'
            : item.stationType == '风电场'
            ? './images/icon_fengdian.png'
            : item.stationType == '牵引站'
            ? './images/icon_diantieqianyinzhan.png'
            : item.stationType == '光伏电站'
            ? './images/icon-guangfu.png'
            : item.stationType == '换流站'
            ? './images/icon_huanliu.png'
            : item.voltageLevel == '220kV'
            ? './images/220v-station.png'
            : item.voltageLevel == '500kV'
            ? './images/icon_500.png'
            : item.voltageLevel == '1000kV'
            ? './images/icon_1000.png'
            : '',

        size: 1,
        // pivot: [0, 0],
        pivotPixel: [12, 8],
        lineWidth: 0,
        alwaysOnTop: true,
        keepSize: true,
        rotateSpeed: 0,
        infoWindow: ['500kV', '1000kV'].includes(level)
          ? ''
          : {
              displayMode: CMAP.DisplayMode.MouseEnter, // 悬浮显示
              type: CMAP.InfoWindowType.Custom, // 自定义InfoWindow
              pivot: [0.8, 1.5],
              offset: [20, 20, 0],
              customHtml: `<div style="font-size: 16px;color: #00FFFF;">${
                item.stationName !== null ? item.stationName : ''
              }</div>`
            }
      }
      const point = this.mapUtils.addPoint(geoPointCfg)
      point.offsetHeight = 11000
      point.userData = { county: item.stationName }
      if (['500kV', '1000kV'].includes(level)) {
        this.createPointText(point)
      } else {
        point.on(THING.EventType.MouseEnter, () => {
          document.body.style.cursor = 'pointer'
        })
        point.on(THING.EventType.MouseLeave, () => {
          document.body.style.cursor = 'auto'
        })
      }
    })
    layer.renderOrder = 2
  }

  // 新能源
  newEnergy() {
    fetch('./data/370700_full.json')
      .then((response) => {
        return response.json()
      })
      .then(async (res: any) => {
        const NewenergData = searchNewenergyHeat.returnObject
        res.features.forEach((i: any, k: any) => {
          let result: any = {
            features: [],
            type: 'FeatureCollection'
          }
          const MWData = NewenergData.filter((f: any) => {
            if (['潍城区', '奎文区', '坊子区'].includes(i.properties.name)) {
              return f.region == '直供'
            }
            if (i.properties.name.includes(f.region)) {
              return f
            }
          })
          result.features = [res.features[k]]
          const geoPolyonConfig = {
            id: 'newEnergy' + i.properties.name,
            name: 'newEnergy' + i.properties.name,
            enable: false,
            type: 'FeatureLayer',
            geometryType: 'GeoPolygon',
            offsetHeight: 11500,
            alwaysOnTop: false,
            renderOrder: 1,
            layerConfig: {
              type: 'vector',
              color: this.newEnergyColor(MWData[0]?.totalCapacity ?? 0),
              outlineColor: '#5CB3E5',
              outlineOpacity: 1,
              outlineWidth: 7
            }
          }
          const layer = this.mapUtils.createGeoPolygonFeatureLayer(
            geoPolyonConfig,
            result
          )
          // 区县名称 打点
          const geoPointCfg = {
            layerName: i.properties.name, //'countyName',
            name: i.properties.name,
            coordinates: i.properties.center,
            type: 'image',
            url: './images/tm.png',
            size: 1,
            offsetHeight: 8000,
            pivotPixel: [12, 8],
            alwaysOnTop: true,
            keepSize: true
          }
          let quxianPoint: any
          if (!['潍城区', '奎文区', '坊子区'].includes(i.properties.name)) {
            quxianPoint = this.mapUtils.addPoint(geoPointCfg)
            quxianPoint.userData = {
              county: i.properties.name,
              MW: MWData[0]?.totalCapacity
            }
            this.createhotCardInfo(quxianPoint)
          } else if (['坊子区'].includes(i.properties.name)) {
            quxianPoint = this.mapUtils.addPoint(geoPointCfg)
            quxianPoint.userData = {
              county: '直供区',
              MW: MWData[0]?.totalCapacity
            }
            this.createhotCardInfo(quxianPoint)
          }
          const allTotal = NewenergData[10]
          layer.userData = {
            county: ['潍城区', '奎文区', '坊子区'].includes(i.properties.name)
              ? '直供区'
              : i.properties.name,
            totalCapacity: MWData[0]?.totalCapacity, // 总容量
            WindCapacity: MWData[0]?.WindCapacity, // 风电
            photovoltaic: MWData[0]?.photovoltaic, // 光伏
            centralization: MWData[0]?.centralization, // 集中式光伏
            distributed: MWData[0]?.distributed, // 分布式光伏
            totalPercent: returnPercent(
              MWData[0]?.totalCapacity,
              allTotal.totalCapacity
            ), // 总容量百分比
            windPercent: returnPercent(
              MWData[0]?.WindCapacity,
              allTotal.WindCapacity
            ), // 风电百分比
            phoPercent: returnPercent(
              MWData[0]?.photovoltaic,
              allTotal.photovoltaic
            ), // 光伏百分比
            cenPercent: returnPercent(
              MWData[0]?.centralization,
              allTotal.centralization
            ), //集中式光伏百分比
            disPercent: returnPercent(
              MWData[0]?.distributed,
              allTotal.distributed
            ) // 分布式光伏百分比
          }

          if (!['潍城区', '坊子区'].includes(i.properties.name)) {
            this.hotDialogCardInfo(layer)
          }

          layer.on(THING.EventType.MouseEnter, () => {
            if (['潍城区', '奎文区', '坊子区'].includes(i.properties.name)) {
              ;(
                document.querySelector(`#hot-dialog_直供区`) as HTMLDivElement
              ).style.display = 'block'
            } else {
              ;(
                document.querySelector(
                  `#hot-dialog_${i.properties.name}`
                ) as HTMLDivElement
              ).style.display = 'block'
            }

            document.body.style.cursor = 'pointer'
          })
          layer.on(THING.EventType.MouseLeave, () => {
            if (['潍城区', '奎文区', '坊子区'].includes(i.properties.name)) {
              ;(
                document.querySelector(`#hot-dialog_直供区`) as HTMLDivElement
              ).style.display = 'none'
            } else {
              ;(
                document.querySelector(
                  `#hot-dialog_${i.properties.name}`
                ) as HTMLDivElement
              ).style.display = 'none'
            }
            document.body.style.cursor = ''
          })
        })

        fetch('./data/370700.json')
          .then((response) => {
            return response.json()
          })
          .then((res) => {
            let layer = this.mapUtils.HL_APP.create({
              type: 'GeoBoundary',
              name: '围栏2',
              coordinates: res.features[0].geometry.coordinates,
              // 支持LineString和MultiLineString,格式可参考geoJson规范
              extrudeHeight: 11500, // 拉伸高度100m
              offsetHeight: 0, // 离地高度100m
              renderOrder: -9,
              alwaysOnTop: false,
              outlineColor: '#A3DDFF',
              outlineOpacity: 1,
              outlineWidth: 260,
              renderer: {
                // color: '#003F90', // 面填充颜色
                imageUrl: './images/lv.png', // 贴图路径
                blending: false, // 是否混色
                speed: 0, // 贴图流速(x,y方向)
                alphaSpeed: 'y', // 透明图流速(x,y方向)
                uvRatio: [1, 1], // 贴图在x轴和y轴的重复次数 默认[1,1] 如果两层贴图 是一个二维数组 数组第一个元素在下 第二个元素在上
                glowStrength: 0, // 发光强度 默认0.5
                postRadialBlur: false, // 是否垂直发光 默认false
                useColor: false // 是否叠加颜色
              }
            })
            layer.renderOrder = -1
          })
      })
  }
  protected hotDialogCardInfo(point: any) {
    const parent: any = document.getElementById('hl-earth')
    const div = document.createElement('div')

    point.userData.county = point.userData.county.replace(/[（）()]/g, '')

    div.setAttribute('class', 'hot-dialog')
    div.setAttribute('id', `hot-dialog_${point.userData.county}`)
    const htmlStr = `
    <div class="content">
    
      <div class='county'>${point.userData.county}</div>
     <div class='label'>总容量</div>
     <div class='value'>
          <span>${point.userData.totalCapacity}<span class="unit">MW</span></span>
          <span class="percent">${point.userData.totalPercent}%</span>
     </div>
     <div class='label'>风电</div>
     <div class='value'>
          <span>${point.userData.WindCapacity}<span class="unit">MW</span></span>
          <span class="percent">${point.userData.windPercent}%</span>
     </div>
     <div class='label'>光伏</div>
     <div class='value'>
          <span>${point.userData.photovoltaic}<span class="unit">MW</span></span>
          <span class="percent">${point.userData.phoPercent}%</span>
     </div>
     <div class='label'>集中式光伏</div>
     <div class='value'>
          <span>${point.userData.centralization}<span class="unit">MW</span></span>
          <span class="percent">${point.userData.cenPercent}%</span>
     </div>
     <div class='label'>分布式光伏</div>
     <div class='value'>
          <span>${point.userData.distributed}<span class="unit">MW</span></span>
          <span class="percent">${point.userData.disPercent}%</span>
     </div>

     </div>
    `
    div.innerHTML = htmlStr
    // const parser = new DOMParser()
    // const document2 = parser.parseFromString(htmlStr, 'text/html')
    parent.appendChild(div)

    let pix = [0.5, 1]

    const countyName = point.userData.county
    if (countyName == '寿光市') {
      pix = [1.5, 0.7]
    } else if (countyName == '寒亭区') {
      pix = [-1.2, 0.5]
    } else if (countyName == '青州市') {
      pix = [1.3, 0.6]
    } else if (countyName == '昌乐县') {
      pix = [0.5, 1.11]
    } else if (countyName == '诸城市') {
      pix = [0.3, 1.11]
    } else if (countyName == '高密市') {
      pix = [0.3, 1.11]
    } else if (countyName == '直供区') {
      pix = [0.24, 1]
    } else if (countyName == '安丘市') {
      pix = [0.4, 1.02]
    } else if (countyName == '昌邑市') {
      pix = [-0.58, 0.8]
    }

    this.createUIAnchor(point, 'hot-dialog_' + point.userData.county, pix)
  }

  protected createhotCardInfo(point: any) {
    const parent: any = document.getElementById('hl-earth')
    const div = document.createElement('div')

    div.setAttribute('class', 'hot-info')
    div.setAttribute('id', `hot-info_${point.userData.county}`)
    const htmlStr = `
      <div class='title'>
      <span>${point.userData.county}</span>
      <span class='mw'>${point.userData.MW}<span class='unit'>MW</span></span>
      </div>
    `
    div.innerHTML = htmlStr
    parent.appendChild(div)
    this.createUIAnchor(point, 'hot-info_' + point.userData.county, [0, 1])
  }
  // 热力颜色
  newEnergyColor(val: number) {
    let colors = ['#C1F4C7', '#95EE83', '#41D03E']
    if (val >= 0 && val < 1000) {
      return colors[0]
    } else if (val >= 1000 && val < 2000) {
      return colors[1]
    } else if (val >= 2000) {
      return colors[2]
    }
  }
}

export default new Earth()
