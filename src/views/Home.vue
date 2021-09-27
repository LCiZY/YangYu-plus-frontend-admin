<template>
  <div class="home-container" style="text-align: center">
    <Row style="padding: 20px">
      <Col span="6">
        <Card>
          <div style="text-align: center">
            <img src="../assets/icons/activities.png" width="8%" />
            <p slot="title" class="head-line">活动总数</p>
            <p class="data">{{ activityCount }}个</p>
          </div>
        </Card>
      </Col>
      <Col span="6">
        <Card>
          <div style="text-align: center">
            <img src="../assets/icons/activitiesAuditing.png" width="8%" />
            <p slot="title" class="head-line">待审核活动数量</p>
            <p class="data">{{ auditingActivityCount }}个</p>
          </div>
        </Card>
      </Col>
      <Col span="6">
        <Card>
          <div style="text-align: center">
            <img src="../assets/icons/courses.png" width="8%" />
            <p slot="title" class="head-line">课程总数</p>
            <p class="data">{{ courseCount }}个</p>
          </div>
        </Card>
      </Col>
      <Col span="6">
        <Card>
          <div style="text-align: center">
            <img src="../assets/icons/coursesAuditing.png" width="8%" />
            <p slot="title" class="head-line">待审核课程数量</p>
            <p class="data">{{ auditingCourseCount }}个</p>
          </div>
        </Card>
      </Col>
    </Row>
    <Row style="padding: 20px">
      <Card>
        <v-chart class="chart" :option="option" />
      </Card>
    </Row>
    <Row style="padding: 20px">
      <Col span="11">
        <Card>
          <v-chart class="chart" :option="option1" />
        </Card>
      </Col>
      <Col span="11" offset="2">
        <Card>
           <v-chart class="chart" :option="option2" />
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { post, get } from "@/api";
import { isNumber } from "../utils/getInfo";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { BarChart } from "echarts/charts";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  MarkLineComponent,
  ToolboxComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,

  GridComponent,
  MarkLineComponent,
  BarChart,

  ToolboxComponent,
  LineChart,
  UniversalTransition,
]);

// eslint-disable-next-line import/no-mutable-exports
let homeDataActivityCount = 0;
// eslint-disable-next-line import/no-mutable-exports
let homeDataAuditingActivityCount = 0;
// eslint-disable-next-line import/no-mutable-exports
let homeDataCourseCount = 0;
// eslint-disable-next-line import/no-mutable-exports
let homeDataAuditingCourseCount = 0;

export default {
  name: "home",
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: "light",
  },
  data() {
    return {
      activityCount: 0,
      auditingActivityCount: 0,
      courseCount: 0,
      auditingCourseCount: 0,

      option: {
        title: {
          text: "用户来源",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [
            "Direct",
            "Email",
            "Ad Networks",
            "Video Ads",
            "Search Engines",
          ],
        },
        series: [
          {
            name: "Traffic Sources",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "Direct" },
              { value: 310, name: "Email" },
              { value: 234, name: "Ad Networks" },
              { value: 135, name: "Video Ads" },
              { value: 1548, name: "Search Engines" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },

      option1: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            emphasis: {
              focus: "series",
            },
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: "Email",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "Union Ads",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: "Video Ads",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: [150, 232, 201, 154, 190, 330, 410],
          },
          {
            name: "Search Engine",
            type: "bar",
            data: [862, 1018, 964, 1026, 1679, 1600, 1570],
            emphasis: {
              focus: "series",
            },
            markLine: {
              lineStyle: {
                type: "dashed",
              },
              data: [[{ type: "min" }, { type: "max" }]],
            },
          },
          {
            name: "Baidu",
            type: "bar",
            barWidth: 5,
            stack: "Search Engine",
            emphasis: {
              focus: "series",
            },
            data: [620, 732, 701, 734, 1090, 1130, 1120],
          },
          {
            name: "Google",
            type: "bar",
            stack: "Search Engine",
            emphasis: {
              focus: "series",
            },
            data: [120, 132, 101, 134, 290, 230, 220],
          },
          {
            name: "Bing",
            type: "bar",
            stack: "Search Engine",
            emphasis: {
              focus: "series",
            },
            data: [60, 72, 71, 74, 190, 130, 110],
          },
          {
            name: "Others",
            type: "bar",
            stack: "Search Engine",
            emphasis: {
              focus: "series",
            },
            data: [62, 82, 91, 84, 109, 110, 120],
          },
        ],
      },

      option2: {
        title: {
          text: "Stacked Area Chart",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Email",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "Union Ads",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: "Video Ads",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [150, 232, 201, 154, 190, 330, 410],
          },
          {
            name: "Direct",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: "Search Engine",
            type: "line",
            stack: "Total",
            label: {
              show: true,
              position: "top",
            },
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320],
          },
        ],
      },



    };
  },
  mounted() {
    this.queryActivityCount();
    this.queryAuditCount();
    this.queryAuditingCourseCount();
    this.queryCourseCount();
  },
  methods: {
    queryActivityCount() {
      let self = this;
      get("/activity/queryActivityCount")
        .then((res) => {
          if (isNumber(res)) {
            self.activityCount = res;
          } else {
            self.activityCount = parseInt(Math.random() * 100);
          }
          homeDataActivityCount = self.activityCount;
        })
        .catch((error) => {
          self.activityCount = parseInt(Math.random() * 100);
          homeDataActivityCount = self.activityCount;
        });
    },
    queryAuditCount() {
      let self = this;
      get("/preActivity/queryAuditRequestCount")
        .then((res) => {
          if (isNumber(res)) {
            self.auditingActivityCount = res;
          } else {
            self.auditingActivityCount = parseInt(Math.random() * 100);
          }
          homeDataAuditingActivityCount = self.auditingActivityCount;
        })
        .catch((error) => {
          self.auditCount = parseInt(Math.random() * 100);
          homeDataAuditingActivityCount = self.auditingActivityCount;
        });
    },
    queryAuditingCourseCount() {
      let self = this;
      get("/adminManage/queryCourseAuditRequestCount")
        .then((res) => {
          if (isNumber(res)) {
            self.auditingCourseCount = res;
          } else {
            self.auditingCourseCount = parseInt(Math.random() * 100);
          }
          homeDataAuditingCourseCount = self.auditingCourseCount;
        })
        .catch((error) => {
          self.auditCount = parseInt(Math.random() * 100);
          homeDataAuditingCourseCount = self.auditingCourseCount;
        });
    },
    queryCourseCount() {
      let self = this;
      get("/adminManage/queryCourseCount")
        .then((res) => {
          if (isNumber(res)) {
            self.courseCount = res;
          } else {
            self.courseCount = parseInt(Math.random() * 100);
          }
          homeDataCourseCount = self.courseCount;
        })
        .catch((error) => {
          self.auditCount = parseInt(Math.random() * 100);
          homeDataCourseCount = self.courseCount;
        });
    },
  },
};

export {
  homeDataActivityCount,
  homeDataAuditingActivityCount,
  homeDataCourseCount,
  homeDataAuditingCourseCount,
};
</script>

<style scoped>
.home-container {
  padding: 10px;
  padding-top: 5px;
}
.home-content {
  padding: 10px;
  border-radius: 5px;
  background: #fff;
}
.head-line {
  color: #464c5b;
  font-size: x-large;
  font-weight: bold;
}
.data {
  color: #aaa;
}
.chart {
  height: 400px;
}
</style>
