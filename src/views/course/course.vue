<template>
  <div
    style="padding: 10px; overflow: scroll; max-height: calc(100vh - 88px)"
    id="course"
  >
    <div style="background: #fff; border-radius: 8px; padding: 20px">
      <div class="query-c">
        <div>
          查询审核请求：
          <Input
            search
            @on-search="search"
            v-model="searchContent"
            style="width: auto"
          >
            <Select v-model="searchType" slot="prepend" style="width: 150px">
              <Option
                v-for="item in searchTypeList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </Input>
        </div>
        <Button
          type="primary"
          :loading="tableDataLoading"
          @click="refresh"
          class="refresh-btn"
        >
          <span v-if="!tableDataLoading">刷新</span>
          <span v-else>Loading...</span>
        </Button>
      </div>
      <br />
      <Table
        size="small"
        max-height="670"
        border
        :loading="tableDataLoading"
        :columns="columns"
        :data="coursesDisplay"
        :row-class-name="rowClassName"
      >
      </Table>
      <br />
      <Page
        :total="courseCount"
        show-sizer
        show-elevator
        @on-change="toPage"
        @on-page-size-change="pageSizeChange"
      />
    </div>
    <!-- 课程详情对话框 -->
    <Modal v-model="courseInfoModal" fullscreen title="课程详情">
      <p
        slot="header"
        style="
          color: #515a6e;
          text-align: center;
          font-size: larger;
          font-weight: bold;
        "
      >
        <Icon type="ios-information-circle"></Icon>
        <span>课程详情</span>
      </p>
      <div class="demo-split" style="background: #eee; padding: 20px">
        <div slot="left" class="demo-split-pane" style="overflow-y: scroll">
          <Card :bordered="false" style="height: auto !important">
            <a :href="chooseCourse.courseCoverPicUrl" target="_blank">
              <img
                :src="chooseCourse.courseCoverPicUrl"
                class="image-size"
                style="float: right"
              />
            </a>
            <h1>课程信息</h1>
            <h3>课程ID</h3>
            <p>{{ chooseCourse.courseId }}</p>
            <h3>课程名称</h3>
            <p>{{ chooseCourse.courseName }}</p>
            <h3>课程类型</h3>
            <p>{{ chooseCourse.courseType }}</p>
            <h3>课程地点</h3>
            <p>{{ chooseCourse.coursePlace }}</p>
            <h3>课程对象</h3>
            <p>{{ chooseCourse.courseObject }}</p>
            <h3>课程适合人群描述</h3>
            <p>{{ chooseCourse.courseSuitableCrowd }}</p>
            <h3>课程简介</h3>
            <p>{{ chooseCourse.courseBriefIntro }}</p>
            <h3>课程简介(视频)</h3>
            <p>{{ chooseCourse.courseVideoUrl }}</p>
            <h3>课程售价</h3>
            <p>{{ chooseCourse.courseSalePrice }}</p>
            <h3>课程拼团价</h3>
            <p>{{ chooseCourse.courseGroupSalePrice }}</p>
            <h3>课程开始报名日期</h3>
            <p>{{ chooseCourse.courseApplyDate }}</p>
            <h3>课程报名截止日期</h3>
            <p>{{ chooseCourse.courseApplyDDLDate }}</p>
            <h3>开课日期</h3>
            <p>{{ chooseCourse.courseDate }}</p>
            <h3>结课日期</h3>
            <p>{{ chooseCourse.courseDDLDate }}</p>
            <h3>课程最大名额</h3>
            <p>{{ chooseCourse.courseMaxNum }}</p>
            <h3>课程剩余名额</h3>
            <p>{{ chooseCourse.courseRemainNum }}</p>
            <h3>课程状态</h3>
            <p>{{ chooseCourse.courseStatus }}</p>
            <h3>课程是否软删除</h3>
            <p>{{ chooseCourse.isDeleted }}</p>
            <h3>课程数据版本</h3>
            <p>{{ chooseCourse.version }}</p>
            <h3>课程售卖属性</h3>
            <p>{{ chooseCourse.courseSaleProperty }}</p>
          </Card>
        </div>
      </div>
      <div slot="footer" style="text-align: center !important">
        <Button type="primary" size="large" @click="closeModal">确定</Button>
      </div>
    </Modal>
    <!-- 删除确认对话框 -->
    <Modal
      draggable
      v-model="deleteModal"
      title="是否删除此课程？"
      :loading="deleteModalLoading"
      @on-ok="deleteCourse"
    >
      <p>课程ID：{{ chooseCourse.courseId }}</p>
      <p>课程名：{{ chooseCourse.courseName }}</p>
    </Modal>
    <!-- 下架课程确认对话框 -->
    <Modal
      draggable
      v-model="deactivateCourseModal"
      title="是否下架此课程？"
      :loading="deactivateCourseModalLoading"
      @on-ok="platformDeactivateCourse"
    >
      <p>课程ID：{{ chooseCourse.courseId }}</p>
      <p>课程名：{{ chooseCourse.courseName }}</p>
      <Input
        placeholder="下架原因"
        v-model="platformDeactiveReason"
        style="width: auto"
      />
    </Modal>
  </div>
</template>

<script>
import { instance } from "../../components/Index";
import { get, post } from "@/api";
import { getTimeFromUnix } from "../../utils/getInfo";
import { isNumber } from "../../utils/getInfo";


let courseStatusCode2StatusText = {
  0: "draft(草稿状态)",
  1: "init(初次送审，无线上版本，正在审核)",
  2: "auditing(有线上版本，修改后正在审核)",
  3: "online(正常线上状态)",
  4: "offline(商家设为离线状态)",
  5: "platform_deactivate(被平台封禁)",
};

let courseStatusCode2LightColor = {
  0: "rgba(40, 40, 40, 0.5)",
  1: "rgba(40, 40, 40, 0.5)",
  2: "rgba(115, 201, 145)",
  3: "rgba(115, 201, 145)",
  4: "rgba(40, 40, 40, 0.5)",
  5: "rgba(40, 40, 40, 0.5)",
};

export default {
  name: "courseTable",
  data() {
    return {
      searchContent: "",
      searchType: "id",
      searchTypeList: [
        {
          value: "id",
          label: "根据课程id查询",
        },
        {
          value: "name",
          label: "根据课程名称查询",
        },
        {
          value: "type",
          label: "根据课程类型查询",
        },
      ],
      searchResult: {
        id: [],
        name: [],
        type: [],
      },
      tableDataLoading: false,
      courseInfoModal: false, // 显示课程信息的模态框
      deleteModal: false, // 询问是否删除课程的模态框
      deleteModalLoading: false, // 正在删除的loading标志
      deactivateCourseModal: false, // 询问是否删除课程的模态框
      deactivateCourseModalLoading: false, // 正在删除的loading标志
      courseCount: 100, // 每次请求课程的数量
      pageSize: 20, // 每次请求课程的数量
      currIndex: 1, // 当前页面的索引，初始是第一页
      chooseCourse: {}, // 当前选择的课程
      chooseCourseDeletedIndex: -1, // 当前选择的课程在本页的索引
      chooseUserInfo: {}, // 当前选择的课程所属用户的信息
      splitLeft: 0.4, // 课程信息的模态框左半边宽度的初始比重
      splitRight: 0.6, // 课程信息的模态框右半边宽度的初始比重
      updateSplitLeft: 0.7, // 更新课程信息的模态框左半边宽度的初始比重
      updateSplitRight: 0.3, // 课程信息的模态框右半边宽度的初始比重
      platformDeactiveReason: "", // 封禁课程原因
      whiteSpaces: "\u3000\u3000",

      columns: [
        // 表头
        {
          title: "课程ID",
          key: "courseId",
          resizable: true,
          width: 120,
        },
        {
          title: "课程状态",
          key: "courseStatus",
          resizable: true,
          width: 180,
          render: (h, params) =>
            h("div", {style:{textAlign: 'center',display: 'flex',justifyContent: 'space-between', alignItems: 'center'}},[
              h("strong", {style: {fontSize: '50px', cursor: 'default', color: courseStatusCode2LightColor[params.row.courseStatus]}}, "·"),
              h("strong", courseStatusCode2StatusText[params.row.courseStatus]),
            ]),
        },
        {
          title: "商家ID",
          key: "merchantId",
          resizable: true,
          width: 120,
        },
        {
          title: "课程名称",
          key: "courseName",
          resizable: true,
          width: 120,
        },
        {
          title: "课程类型",
          key: "courseType",
          resizable: true,
          width: 120,
        },
        {
          title: "课程地点",
          key: "coursePlace",
          resizable: true,
          width: 180,
        },
        {
          title: "课程对象",
          key: "courseObject",
          resizable: true,
          width: 180,
        },
        {
          title: "课程适合人群描述",
          key: "courseSuitableCrowd",
          resizable: true,
          width: 180,
        },
        {
          title: "课程简介",
          key: "courseBriefIntro",
          resizable: true,
          width: 180,
        },
        {
          title: "课程简介(视频)",
          key: "courseVideoUrl",
          resizable: true,
          width: 180,
        },
        {
          title: "课程售价",
          key: "courseSalePrice",
          resizable: true,
          width: 180,
        },
        {
          title: "课程拼团价",
          key: "courseGroupSalePrice",
          resizable: true,
          width: 180,
        },
        {
          title: "课程开始报名日期",
          key: "courseApplyDate",
          resizable: true,
          width: 200,
          render: (h, params) =>
            h("div", [h("strong", getTimeFromUnix(params.row.courseApplyDate))]),
        },
        {
          title: "课程报名截止日期",
          key: "courseApplyDDLDate",
          resizable: true,
          width: 200,
          render: (h, params) =>
            h("div", [h("strong", getTimeFromUnix(params.row.courseApplyDDLDate))]),
        },
        {
          title: "开课日期",
          key: "courseDate",
          resizable: true,
          width: 200,
          render: (h, params) =>
            h("div", [h("strong", getTimeFromUnix(params.row.courseDate))]),
        },
        {
          title: "结课日期",
          key: "courseDDLDate",
          resizable: true,
          width: 200,
          render: (h, params) =>
            h("div", [h("strong", getTimeFromUnix(params.row.courseDDLDate))]),
        },
        {
          title: "课程最大名额",
          key: "courseMaxNum",
          resizable: true,
          width: 180,
        },
        {
          title: "课程剩余名额",
          key: "courseRemainNum",
          resizable: true,
          width: 180,
        },
        {
          title: "课程是否软删除",
          key: "isDeleted",
          resizable: true,
          width: 180,
          render: (h, params) =>
            h("div", [h("strong", params.row.isDeleted === "1" ? "是" : "否")]),
        },
        {
          title: "课程数据版本",
          key: "version",
          resizable: true,
          width: 180,
        },
        {
          title: "课程售卖属性",
          key: "courseSaleProperty",
          resizable: true,
          width: 180,
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          width: 180,
          align: "center",
          render: (h, params) =>
            h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.chooseCourse = params.row;
                      this.courseInfoModal = true;
                    },
                  },
                },
                "查看"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "dashed",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      
                    },
                  },
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.chooseCourse = params.row;
                    },
                  },
                },
                "上架"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small",
                  },
                   style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.chooseCourse = params.row;
                      this.deactivateCourseModal = true;
                    },
                  },
                },
                "下架"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      this.chooseCourse = params.row;
                      this.chooseCourseDeletedIndex = params.index;
                      this.deleteModal = true;
                    },
                  },
                },
                "删除"
              ),
            ]),
        },
      ],
      coursesDisplay: [
        // 当前页显示出来的课程
      ],
      courses: [
        // 所有的课程，比如第一页在 courses[1] 里
      ],
    };
  },
  watch: {
    $route: {
      handler(route) {
        console.log("route.params");
        console.log(route.params);
      },
      immediate: true,
    },
  },
  mounted() {
    this.queryCourseCount();
    this.queryCoursePageByPage(this.currIndex);
  },
  methods: {
    rowClassName(row, index) {
      if (row.courseStatus !== 2 && row.courseStatus !== 3) {
        return "inactive-table-info-row";
      }
      return "";
    },
    changeSearchType(value) {
      this.coursesDisplay = this.searchResult[value];
    },
    search() {
      // 按类型搜索
      // instance.gotoPage('auditTable', {})
      let self = this;
      self.tableDataLoading = true;
      if (this.searchType === "id") {
        // 根据id查询课程
        if (!isNumber(this.searchContent)) return;
        get("/course/queryCourseById", {
          params: { courseId: this.searchContent },
        })
          .then((res) => {
            console.log(res);
            self.coursesDisplay = [res];
            self.tableDataLoading = false;
          })
          .catch((error) => {
            console.log("查询失败");
            self.tableDataLoading = false;
          });
        // eslint-disable-next-line no-empty
      } else if (this.searchType === "name") {
        get("/course/queryCompleteCourseByNameDescKeyword", {
          params: {
            keyword: this.searchContent,
            start: this.searchResult.name.length,
            number: 10,
          },
        })
          .then((res) => {
            self.searchResult.name = self.searchResult.name.concat(res);
            self.coursesDisplay = self.searchResult.name;
            self.tableDataLoading = false;
          })
          .catch((error) => {
            console.log("查询失败");
            self.tableDataLoading = false;
          });
      } else if (this.searchType === "type") {
        // 根据类型查询queryCourseByType
        get("/course/queryCompleteCourseByType", {
          params: {
            courseType: this.searchContent,
            start: this.searchResult.type.length,
            number: 10,
          },
        })
          .then((res) => {
            self.searchResult.type = self.searchResult.type.concat(res);
            self.coursesDisplay = self.searchResult.type;
            self.tableDataLoading = false;
          })
          .catch((error) => {
            console.log("查询失败");
            self.tableDataLoading = false;
          });
      }
    },
    refresh() {
      // 刷新本页面
      instance.reloadPage();
      this.queryCourseCount();
      this.toPage(this.currIndex);
      this.searchResult = {
        id: [],
        name: [],
        type: [],
      };
    },
    toPage(index) {
      // 查看第 index 页的课程 index=1，2，3。。
      this.currIndex = index;
      if (!this.courses[index]) {
        this.queryCoursePageByPage(index);
      } else {
        this.coursesDisplay = this.courses[index];
      }
    },
    pageSizeChange(size) {
      this.pageSize = size;
    },
    queryCoursePageByPage(index) {
      // 向服务器查询第index页的课程
      if (!index) return;
      let startIndex = (index - 1) * this.pageSize;
      let self = this;
      this.tableDataLoading = true;
      get("/course/queryCompleteCoursePageByPage", {
        params: { start: startIndex, number: self.pageSize },
      })
        .then((res) => {
          console.log(res);
          self.courses[index] = res;
          self.tableDataLoading = false;
          self.coursesDisplay = res;
        })
        .catch((error) => {
          console.log("获取课程失败");
          self.tableDataLoading = false;
        });
    },
    resumePlatformDeactivateCourse() {
      // 上架课程
      get("/course/resumePlatformDeactivateCourse", {
        params: { courseId: this.chooseCourse.courseId },
      })
        .then((res) => {
          self.$Notice.success({
            title: "操作成功",
          });
        })
        .catch((error) => {
          self.$Notice.error({
            title: "操作失败",
          });
        });
    },
    platformDeactivateCourse() {
      // 下架课程
      get("/course/platformDeactivateCourse", {
        params: {
          courseId: this.chooseCourse.courseId,
          reason: self.platformDeactiveReason,
        },
      })
        .then((res) => {
          self.$Notice.success({
            title: "操作成功",
          });
        })
        .catch((error) => {
          self.$Notice.error({
            title: "操作失败",
          });
        });
    },
    deleteCourse() {
      // 删除courseId指定的课程
      this.deleteModalLoading = true;
      let self = this;
      get("/course/delete", {
        params: { courseId: this.chooseCourse.courseId },
      })
        .then((res) => {
          self.coursesDisplay.splice(self.chooseCourseDeletedIndex, 1);
          console.log("删除课程：" + res);
          self.deleteModalLoading = false;
          self.deleteModal = false;
          if (res && res !== "fail") {
            self.$Notice.success({
              title: "删除成功",
            });
          }
        })
        .catch((error) => {
          console.log("删除课程失败");
          self.deleteModalLoading = false;
          self.deleteModal = false;
          self.$Notice.error({
            title: "删除失败",
          });
        });
    },
    queryCourseCount() {
      let self = this;
      get("/adminManage/queryCourseCount")
        .then((res) => {
          if (isNumber(res)) {
            self.courseCount = res;
          } else {
            self.courseCount = 100;
          }
        })
        .catch((error) => {
          self.courseCount = 100;
        });
    },
    closeModal() {
      this.courseInfoModal = false;
      this.deleteModal = false;
      this.updateModal = false;
      this.deactivateCourseModal = false;
    },
    selectDate(date) {
      this.courseDate = date;
    },
    show(index) {
      // 显示调试信息，测试用
      this.$Modal.info({
        title: "详情",
        // content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`,
        // content: JSON.stringify(this.coursesDisplay[index], null, 4),
        content: '<Button type="text">Text</Button>',
      });
    },
  },
};
</script>


<style scoped>

.image-size {
  width: 100px !important;
  height: 100px !important;
}
.margin-left {
  margin-left: 20px;
}

.demo-split {
  height: 100%;
}
.demo-split-pane {
  padding: 10px;
}
.demo-split-pane.no-padding {
  height: 100%;
  padding: 0;
}
.demo-split-pane {
  height: 100%;
}
.ivu-card {
  height: 100%;
}
.ivu-card-body {
  height: 100%;
}
.ivu-modal-footer {
  border: none;
}


.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: inline-block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
