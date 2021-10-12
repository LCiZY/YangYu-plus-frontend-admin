<template>
  <div
    style="padding: 10px; overflow: scroll; max-height: calc(100vh - 88px)"
    id="course"
  >
    <div style="background: #fff; border-radius: 8px; padding: 20px">
      <div class="query-c">
        <Form
          :model="searchFormItem"
          :label-width="120"
          inline
          :rules="ruleValidate"
        >
          <FormItem label="课程ID">
            <Input v-model="searchFormItem.courseId" placeholder="选填"></Input>
          </FormItem>
          <FormItem label="商家ID" prop="merchantId">
            <Input
              v-model="searchFormItem.merchantId"
              placeholder="选填"
            ></Input>
          </FormItem>
          <FormItem label="课程关键字">
            <Input
              v-model="searchFormItem.courseKeyword"
              placeholder="选填"
            ></Input>
          </FormItem>
          <FormItem label="课程类型">
            <treeSelect
              :optionList="typeOptionList"
              :value="searchFormItem.courseType"
              @change="
                (s) => {
                  searchFormItem.courseType = s;
                }
              "
              :operateVisiable="false"
            ></treeSelect>
          </FormItem>
          <FormItem label="课程状态">
            <Select v-model="searchFormItem.courseStatus">
              <Option value="-1">所有</Option>
              <Option value="0">草稿状态（无线上版本，创建时存为草稿）</Option>
              <Option value="1">初始状态（无线上版本，初次审核）</Option>
              <Option value="2">审核状态（有线上版本，修改后正在审核）</Option>
              <Option value="3">在线状态</Option>
              <Option value="4">离线状态（商家将课程下架）</Option>
              <Option value="5">离线状态（被管理员封禁）</Option>
            </Select>
          </FormItem>
        </Form>
        <span class="search-btn-group">
          <Button
            type="primary"
            icon="ios-search"
            class="margin3"
            @click="search(0, pageSize)"
            :loading="tableDataLoading"
          >
            <span v-if="!tableDataLoading">搜索</span>
            <span v-else>Loading...</span>
          </Button>
          <Button icon="ios-refresh" class="margin3" @click="resetSearchForm"
            >重置</Button
          >
          <Button
            type="success"
            :loading="tableDataLoading"
            @click="refresh"
            class="refresh-btn margin3"
            icon="ios-refresh"
          >
            <span v-if="!tableDataLoading">刷新</span>
            <span v-else>Loading...</span>
          </Button>
        </span>
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
            <courseInfo :chooseCourse="chooseCourse"></courseInfo>
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
import treeSelect from "../../components/treeSelect.vue";
import courseInfo from "../../components/courseInfo.vue";

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
const validatePhoneNumber = (rule, value, callback) => {
  let reg = /^[1-9]{1}\d{10}$/; // 检验规则为正则，可自行百度。
  if (reg.test(value)) {
    callback();
  } else {
    return callback(new Error("商家id格式错误"));
  }
};

export default {
  components: {
    treeSelect,
    courseInfo,
  },
  name: "courseTable",
  data() {
    return {
      searchCourses: [],
      originalSearchFormItem: {
        courseStatus: "-1",
        courseId: "",
        merchantId: "",
        courseKeyword: "",
        courseType: "所有",
      },
      searchFormItem: {},
      typeOptionList: [],

      ruleValidate: {
        merchantId: [
          {
            validator: validatePhoneNumber,
            message: "商家id格式错误",
            trigger: "change",
          },
        ],
      },

      tableDataLoading: false,
      courseInfoModal: false, // 显示课程信息的模态框
      deleteModal: false, // 询问是否删除课程的模态框
      deleteModalLoading: false, // 正在删除的loading标志
      deactivateCourseModal: false, // 询问是否删除课程的模态框
      deactivateCourseModalLoading: false, // 正在删除的loading标志
      courseCount: 100, // 每次请求课程的数量
      pageSize: 10, // 每次请求课程的数量
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
      coursesDisplay: [
        // 当前页显示出来的课程
      ],
      courses: [
        // 所有的课程，比如第一页在 courses[1] 里
      ],

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
            h(
              "div",
              {
                style: {
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              },
              [
                h(
                  "strong",
                  {
                    style: {
                      fontSize: "50px",
                      cursor: "default",
                      color:
                        courseStatusCode2LightColor[params.row.courseStatus],
                    },
                  },
                  "·"
                ),
                h(
                  "strong",
                  courseStatusCode2StatusText[params.row.courseStatus]
                ),
              ]
            ),
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
          title: "课程图片",
          key: "courseImageUrls",
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
            h("div", [
              h("strong", getTimeFromUnix(params.row.courseApplyDate)),
            ]),
        },
        {
          title: "课程报名截止日期",
          key: "courseApplyDDLDate",
          resizable: true,
          width: 200,
          render: (h, params) =>
            h("div", [
              h("strong", getTimeFromUnix(params.row.courseApplyDDLDate)),
            ]),
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
          title: "课程团单最大人数",
          key: "courseGroupOrderMaxNum",
          resizable: true,
          width: 180,
        },
        {
          title: "课程团单持续时间",
          key: "courseGroupOrderHoldHours",
          resizable: true,
          width: 180,
          render: (h, params) =>
            h("div", [
              h("strong", params.row.courseGroupOrderHoldHours + "小时"),
            ]),
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
                    click: () => {},
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
    };
  },
  watch: {
    $route: {
      handler(route) {
        // console.log("route.params",route.params);
      },
      immediate: true,
    },
  },
  mounted() {
    this.queryCourseCount();
    this.queryCoursePageByPage(this.currIndex);
    this.queryCourseCatalog();
    this.resetSearchForm();
  },
  methods: {
    rowClassName(row, index) {
      if (row.courseStatus !== 2 && row.courseStatus !== 3) {
        return "inactive-table-info-row";
      }
      return "";
    },
    search(start, number) {
      if (
        JSON.stringify(this.searchFormItem) ===
        JSON.stringify(this.originalSearchFormItem)
      ) {
        // 没有设置搜索条件
        this.toPage(this.currIndex);
        return;
      }
      let self = this;
      self.tableDataLoading = true;
      if (this.searchFormItem.courseId && this.searchFormItem.courseId !== "") {
        // 根据id查询课程
        if (!isNumber(this.searchFormItem.courseId)) return;
        get("/course4a/queryCourseById", {
          params: { courseId: this.searchFormItem.courseId },
        })
          .then((res) => {
            console.log("search resp:", res);
            if (res && res != "") {
              self.coursesDisplay = [res];
            } else {
              self.coursesDisplay = [];
            }
            self.tableDataLoading = false;
          })
          .catch((error) => {
            console.log("查询失败");
            self.tableDataLoading = false;
          });
      } else {
        if (!isNumber(start) || !isNumber(number)) {
          console.error("start,number:", start, number);
          self.tableDataLoading = false;
          return;
        }
        let params = {};
        let merchantId =
          this.searchFormItem.merchantId &&
          this.searchFormItem.merchantId !=
            this.originalSearchFormItem.merchantId
            ? this.searchFormItem.merchantId
            : null;
        if (merchantId != null) {
          params.merchantId = merchantId;
          if (!isNumber(params.merchantId)) return;
        }
        let courseStatus =
          this.searchFormItem.courseStatus &&
          this.searchFormItem.courseStatus !=
            this.originalSearchFormItem.courseStatus
            ? this.searchFormItem.courseStatus
            : null;
        if (courseStatus != null) params.courseStatus = courseStatus;
        let courseKeyword =
          this.searchFormItem.courseKeyword &&
          this.searchFormItem.courseKeyword !=
            this.originalSearchFormItem.courseKeyword
            ? this.searchFormItem.courseKeyword
            : null;
        if (courseKeyword != null) params.keyword = courseKeyword;
        let courseType =
          this.searchFormItem.courseType &&
          this.searchFormItem.courseType !=
            this.originalSearchFormItem.courseType
            ? this.searchFormItem.courseType
            : null;
        if (courseType != null) params.courseType = courseType;
        params.start = start;
        params.number = number;

        get("/course4a/queryCourses", {
          params,
        })
          .then((res) => {
            if (res && res != "") {
              self.coursesDisplay = res;
              self.searchCourses[start / self.pageSize + 1] = res;
            } else {
              self.coursesDisplay = [];
            }
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
      this.searchCourses = [];
      this.courses = [];
      this.queryCourseCount();
      this.toPage(this.currIndex);
    },
    toPage(index) {
      // 查看第 index 页的课程 index=1，2，3。。
      this.currIndex = index;
      if (
        JSON.stringify(this.searchFormItem) ===
        JSON.stringify(this.originalSearchFormItem)
      ) {
        // 没有设置搜索条件
        if (!this.courses[index]) {
          this.queryCoursePageByPage(index);
        } else {
          this.coursesDisplay = this.courses[index];
        }
      } else {
        // 设置了搜索条件
        if (!this.searchCourses[index]) {
          this.search(this.pageSize * (index - 1), this.pageSize);
        } else {
          this.coursesDisplay = this.searchCourses[index];
        }
      }
    },
    pageSizeChange(size) {
      this.pageSize = size;
    },
    queryCourseCatalog() {
      let self = this;
      get("/course4c/queryCourseCatalog")
        .then((res) => {
          self.typeOptionList = res;
        })
        .catch((error) => {
          console.log("获取课程类目");
        });
    },
    queryCoursePageByPage(index) {
      // 向服务器查询第index页的课程
      if (!index) return;
      let startIndex = (index - 1) * this.pageSize;
      let self = this;
      this.tableDataLoading = true;
      get("/course4a/queryCoursePageByPage", {
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
    platformActivateCourse() {
      // 上架课程
      get("/course4a/platformActivateCourse", {
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
      get("/course4a/platformDeactivateCourse", {
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
      get("/course4a/delete", {
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
    resetSearchForm() {
      this.searchFormItem = JSON.parse(
        JSON.stringify(this.originalSearchFormItem)
      );
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
.search-btn-group {
  display: grid;
  align-content: space-around;
}
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
.margin3 {
  margin-bottom: 3px;
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
