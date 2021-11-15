<template>
  <div></div>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {
      colorList: ["#9E87FF", "#73DDFF", "#fe9a8b"],
      lineChart: null,
    };
  },
  methods: {
    renderLineChart(data) {
      //   let xAxisName = data.map((v) => {
      //     return v.date.substring(5);
      //   });
      let xAxisName = [],
        seriesData = { data0: [], data1: [], data2: [] };
      //通过遍历得到x轴的文字和图例对应的数据
      for (let item of data) {
        xAxisName.push(item.date.substring(5));
        seriesData.data0.push(item.received); //已收
        seriesData.data1.push(item.receiving); //未收
        seriesData.data2.push(item.total); //应收
      }
      console.log(xAxisName);
      console.log(seriesData);
      let name = ["已收", "未收", "应收"],
        myColor = [
          ["#9effff", "#9E87FF", "rgba(158,135,255, 0.3)"],
          ["#73DD39", "#73DDFF", "rgba(115,221,255, 0.3)"],
          ["#fe9a", "#fe9a8b", "rgba(254,154,139, 0.3)"],
        ];
      //遍历得到series数据
      let series = name.map((v, i) => {
        return {
          name: v,
          type: "line",
          data: seriesData[`data${i}`],
          symbolSize: 1,
          yAxisIndex: 0,
          symbol: "circle",
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 5,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: myColor[i][0],
              },
              {
                offset: 1,
                color: myColor[i][1],
              },
            ]),
            shadowColor: myColor[i][2],
            shadowBlur: 10,
            shadowOffsetY: 20,
          },
          itemStyle: {
            normal: {
              color: this.colorList[i],
              borderColor: this.colorList[i],
            },
          },
        };
      });
      // 配置渲染数据
      let option = {
        backgroundColor: "#f5f5f5",
        legend: {
          icon: "circle",
          top: 8,
          itemWidth: 6,
          itemGap: 20,
          textStyle: {
            color: "#556677",
          },
        },

        grid: {
          top: 30,
          left: 50,
          right: 36,
          bottom: 30,
        },
        xAxis: [
          {
            type: "category",
            data: xAxisName,
            axisLine: {
              lineStyle: {
                color: "#DCE2E8",
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
              rotate: 20,
              textStyle: {
                color: "#556677",
              },
              // 默认x轴字体大小
              fontSize: 12,
              // margin:文字到x轴的距离
              margin: 10,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#DCE2E8",
              },
            },
            axisLabel: {
              textStyle: {
                color: "#556677",
              },
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series,
      };
      // 调用setOption方法来执行渲染
      this.lineChart.setOption(option);
    },
  },
};
</script>