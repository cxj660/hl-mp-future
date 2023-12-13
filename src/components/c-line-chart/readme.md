### 组件名称 c-line-chart

#### 依赖包 echarts、dayjs、lodash

##### 传参

```javascripts
  width?:   图表宽度、默认父盒子宽度
  height?:  图表高度、默认父盒子高度
  option:   图表配置项、与echarts官网配置相同，具体配置见 echarts官网
  unit?:    图表Y轴单位
  configXData: {
    allXData?: boolean              是否展示x轴xDataType类型的所有值,true：展示所有  false：展示到当前日期
    xDataType?: 'Y' | 'M' | 'D'     Y:默认展示最近五年、M:展示月份、D:当前月的天
  }

```

[echarts 官网](https://echarts.apache.org/zh/index.html)

### 注意事项

1. option 默认提供颜色选项,如要修改图表中颜色,在 option 中添加属性 color 即可,动态修改可指定 option 为 reactive 类型, 使用 option.color= ["#ff0000","#2e375s"] 即可动态修改
   **颜色建议使用 AEX("#FF0000")类型**

   ```
       const option =reactive({
           color:[""]  // 指定默认值,不指定删除即可,使用echarts默认颜色
       })
       option.color = ["#ff0000","#2e375s"]  // 修改颜色
   ```

2. 修改折线图渐变, 在开发中折线图图表渐变样式一般都统一,暂不做配置项修改,直接修改代码 option.series.areaStyle.colorStops 设置颜色透明度,达到满意即可

```
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

```

3. 图表数据改变时,图例依然保持上一个图表的数据,举个例子：数据一三条线三个图例,数据二两条线两个图例,由数据一的图表切换到数据二的图表时,option 中的 series 的第三条数据依然存在,这是因为传入组件的 series 只有前两条改变了数据,第三条没有变化。解决：切换到第二个图表时手动将整个 series 重置(可以先置空,然后对 name 和 data 赋值),对于 series 有很多自定义配置项时，可将其他非本图表的所有 series 的 name 和 data 手动置空

```
    options.series=[]
    options.series[0].data = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17]
    options.series[1].data = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    或者
    options.series[2] = { name: '', data: [] }

```

4. 