// 简单数组去重
const uniqe = (array: any[]) => {
  return [...new Set(array)]
}

// 对象数组根据某个key值去重
const uniqeByKey = (array: any[], key: string) => {
  const obj: any = {}
  return array.reduce(function (item, next) {
    obj[next[key]] ? '' : (obj[next[key]] = true && item.push(next))
    return item
  }, [])
}
export function returnPercent(
  currentVal: number,
  totalValue: number,
  decimal: number = 1
) {
  return ((currentVal / totalValue) * 100).toFixed(decimal)
}

// 根据index删除数组某个值
const removeByIndex = <T>(array: T[], index: number | string): T[] => {
  if (
    !/(^[0-9]\d*$)/.test(String(index)) ||
    (index as number) >= array.length
  ) {
    return array
  }

  return array.splice(Number(index), 1)
}
export const getPublicPath = (path: string): string => {
  const { VITE_OUT_DIR } = import.meta.env
  return `/${VITE_OUT_DIR}/${path.replace(/^\//, '')}`
}
// 删除一维数组中的某个值
const removeByValue = <T>(array: T[], value: any): T[] => {
  const index = array.findIndex((v) => v === value)

  if (index > -1) {
    return removeByIndex(array, index)
  } else {
    return array
  }
}

const isObjectLike = (value: any) => {
  return typeof value == 'object' && value !== null
}

// 树形根据某个字段值数据过滤
const filterTreeData = (
  nodes: any[],
  key = 'children',
  predicate: any
): any[] => {
  // 没有节点结束递归
  if (!(nodes && nodes.length)) {
    return []
  }

  const result = []
  for (const node of nodes) {
    if (predicate(node)) {
      // 如果节点符合条件，直接加入新的节点集
      result.push(node)
      node[key] = filterTreeData(node[key], key, predicate)
    } else {
      // 如果当前节点不符合条件，递归过滤子节点，
      // 把符合条件的子节点提升上来，并入新节点集
      result.push(...filterTreeData(node[key], key, predicate))
    }
  }
  return result
}

// 判断是否是数字
const isNumber = (n: any): boolean => {
  return parseFloat(n).toString() !== 'NaN'
}

// 判断数组为空数组
const arrayNotEmpty = (array: any[]): boolean => {
  return array && array.length > 0
}

// 大驼峰转中划线
const camel2Kebab = (str: string) => {
  const result = str.replace(/([A-Z])/g, (letter: string) => {
    return '-' + letter.toLowerCase()
  })

  if (result.slice(0, 1) === '-') {
    return result.slice(1)
  } else {
    return result
  }
}

const getAssetsImg = (url: string) => {
  return `./static/images/${url}`
}

// 判断字符串是否包含（http）
const isHttp = (url: string) => {
  if (url) {
    return ''
  } else {
    const str = new RegExp('http://')
    const flag = str.test(url)
    return flag ? url : `http://${url}`
  }
}

// 根据key分组
const getGroupListByKey = (
  array: Record<string, any>[],
  key: string
): Record<string, any> => {
  return array.reduce((a, b) => {
    const bk: string = b[key] || ''
    if (a[bk]) {
      a[bk].push(b)
    } else {
      a[bk] = [b]
    }
    return a
  }, {})
}

// 从url中获取token
const getTokenByURL = () => {
  const queryString = window.location.search

  const urlParams = new URLSearchParams(queryString)
  return urlParams.get('token')
}

// 生成288个数据，按每五分钟一个点
function generateXData() {
  const tempArr = []
  for (let i = 0; i < 288; i++) {
    const hours = parseInt(i / 12 + '')
    const minutes = 5 * (i % 12)
    if (minutes) {
      tempArr.push(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}`
      )
    } else {
      tempArr.push(`${hours.toString().padStart(2, '0')}`)
    }
  }
  // tempArr = tempArr.map(item => (item.length === 2 ? `${item}:00` : item))
  return tempArr
}

export interface IColorObj {
  r: number
  g: number
  b: number
  a?: number
}
export const parseColorString = (color: string) => {
  if (color.startsWith('#')) {
    return parseHexColor(color)
  } else if (color.startsWith('rgb')) {
    return parseRgbaColor(color)
  } else if (color === 'transparent') {
    return parseHexColor('#00000000')
  }
  throw new Error(`color string error: ${color}`)
}

/**
 * 16进制颜色字符串解析为颜色对象
 * @param color 颜色字符串
 * @returns IColorObj
 */
export const parseHexColor = (color: string) => {
  let hex = color.slice(1)
  let a = 1
  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
  }
  if (hex.length === 8) {
    a = parseInt(hex.slice(6), 16) / 255
    hex = hex.slice(0, 6)
  }
  const bigint = parseInt(hex, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
    a
  } as IColorObj
}

/**
 * rgba颜色字符串解析为颜色对象
 * @param color 颜色字符串
 * @returns IColorObj
 */
export const parseRgbaColor = (color: string) => {
  const arr = color.match(/(\d(\.\d+)?)+/g) || []
  const res = arr.map((s: string) => parseInt(s, 10))
  return {
    r: res[0],
    g: res[1],
    b: res[2],
    a: parseFloat(arr[3])
  } as IColorObj
}

export const mapColor = (data: any) => {
  let color = ''
  if (data == '济南市') {
    color = '#8898c9'
  } else if (data == '日照市') {
    color = '#109bab'
  } else if (data == '青岛市') {
    color = '#1195cf'
  } else if (data == '菏泽市' || data == '威海市') {
    color = '#204cb1'
  } else {
    color = '#4eabdd'
  }

  return color
}
export const mapHeihgt = (data: any) => {
  if (
    data.properties.name == '济南市' ||
    data.properties.name == '青岛市' ||
    data.properties.name == '日照市'
  ) {
    return 60000
  } else {
    return 40000
  }
}

export const mapImg = (data: any) => {
  if (data.properties.name == '济南市') {
    return './map/img/11en/jn-img.png'
  } else if (data.properties.name == '青岛市') {
    return './map/img/11en/qd-img.png'
  } else if (data.properties.name == '日照市') {
    return './map/img/11en/ri-img.png'
  } else {
    return './map/img/11en/all-img.png'
  }
}
export {
  uniqe,
  uniqeByKey,
  removeByIndex,
  removeByValue,
  isObjectLike,
  filterTreeData,
  isNumber,
  arrayNotEmpty,
  camel2Kebab,
  getAssetsImg,
  isHttp,
  getGroupListByKey,
  getTokenByURL,
  generateXData
}
