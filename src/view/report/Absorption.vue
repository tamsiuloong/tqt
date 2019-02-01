<template>

  <div id="echarts" style="height: 500px;width: 100%;"></div>

</template>

<style scoped>
  .echarts {
    height: 500px;
    width: 100%;
    border-radius: 25px;
  }

</style>

<script>
  import echarts from 'echarts';
  import axios from '@/libs/api.request'
  export default {
    data: function () {
      return {

      }
    },
    mounted:function(){
      var echart = echarts.init(document.getElementById("echarts"));

      axios.request({
        url:"/api/report/absorption",
        method: "get"
      }).then((resp)=>{
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '学习吸收情况统计'
          },
          tooltip: {},
          legend: {
            data:['学习吸收情况']
          },
          xAxis: {
            data:resp.data.titles
          },
          yAxis: {},
          series: [{
            name: '学习吸收情况',
            type: 'bar',
            data:resp.data.values
          }]
        };

        // 使用刚指定的配置项和数据显示图表。
        echart.setOption(option);
      })


      //给window添加一个resize事件
      window.onresize=function () {
        echart.resize();
      }
    }
  }

</script>
