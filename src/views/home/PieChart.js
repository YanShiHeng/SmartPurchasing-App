export default {
  data() {
    return {
      pieChart: null,
    };
  },
  methods: {
    renderPieChart(data, index = 0) {
      let item = data[index];
      let option = {
        color: ['#fe5b02', '#dddddd'],
        title: [{
            text: `${item.paid}元`,
            x: '30%',
            y: '39%',
            textAlign: 'center',
            textStyle: {
              fontSize: '27',
              fontWeight: '400',
              color: '#ff5b02',
              textAlign: 'center',
            },
          }, {
            text: '已付',
            left: '30%',
            top: '51%',
            textAlign: 'center',
            textStyle: {
              fontSize: '18',
              fontWeight: '400',
              color: '#666666',
              textAlign: 'center',
            },
          }, {
            text: item.date,
            left: '30%',
            top: '60%',
            textAlign: 'center',
            textStyle: {
              fontSize: '14',
              fontWeight: '400',
              color: '#aaaaaa',
              textAlign: 'center',
            },
          },
          {
            text: `${item.payable}元`,
            x: '70%',
            y: '39%',
            textAlign: 'center',
            textStyle: {
              fontSize: '27',
              fontWeight: '400',
              color: '#ff5b02',
              textAlign: 'center',
            },
          }, {
            text: '未付',
            left: '70%',
            top: '51%',
            textAlign: 'center',
            textStyle: {
              fontSize: '18',
              fontWeight: '400',
              color: '#666666',
              textAlign: 'center',
            },
          }, {
            text: item.date,
            left: '70%',
            top: '60%',
            textAlign: 'center',
            textStyle: {
              fontSize: '14',
              fontWeight: '400',
              color: '#aaaaaa',
              textAlign: 'center',
            },
          }
        ],
        series: [{
            type: 'pie',
            center: ['30%', '50%'],
            radius: ['50%', '47%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            data: [{
                value: `${item.paid}`,
                name: '已付'
              },
              {
                value: `${item.total}`,
                name: '总计'
              },
            ]
          },
          {
            type: 'pie',
            radius: ['50%', '47%'],
            center: ['70%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            data: [{
                value: `${item.payable}`,
                name: '应付'
              },
              {
                value: `${item.total}`,
                name: '总计'
              },
            ]
          }
        ]
      };
      // 调用setOption方法来执行渲染
      this.pieChart.setOption(option)
      setTimeout(() => {
        ++index;
        this.renderPieChart(data, index < data.length ? index : 0)
      }, 3000);
    }
  },
}
