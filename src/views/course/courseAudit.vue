<template>
  <div style="padding: 10px; overflow: scroll; max-height: calc(100vh - 88px)">
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
        border
        :loading="tableDataLoading"
        :columns="columns"
        :data="auditingCoursesDisplayed"
      ></Table>
      <br />
      <Page
        :total="auditCount"
        show-sizer
        show-elevator
        @on-change="toPage"
        @on-page-size-change="pageSizeChange"
      />
    </div>
    <!-- 课程快照详情对话框 -->
    <Modal v-model="courseInfoModal" fullscreen title="课程审核">
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
        <span>{{
          chooseAuditRequest.operType === "0"
            ? "待审核的新增课程"
            : "待审核修改后的课程"
        }}</span>
      </p>
      <div class="demo-split" style="background: #eee; padding: 10px">
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
            <h3>审核请求ID</h3>
            <p>{{ chooseAuditRequest.auditRequestId }}</p>
            <h3>操作类型</h3>
            <p>{{ chooseAuditRequest.operType === "1" ? "添加" : "修改" }}</p>
            <h3
              v-show="
                chooseAuditRequest.operComment &&
                chooseAuditRequest.operComment !== ''
              "
            >
              操作备注
            </h3>
            <p>{{ chooseAuditRequest.operComment }}</p>
            <h3>商家发起审核时间</h3>
            <p>{{ chooseAuditRequest.auditRequestTime }}</p>
            <h3>商家ID</h3>
            <p>{{ chooseAuditRequest.merchantId }}</p>
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
            <p>{{ chooseCourse.courseSuitableCrow }}</p>
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
            <h3>课程最大人数</h3>
            <p>{{ chooseCourse.courseMaxNum }}</p>
            <h3>课程剩余人数</h3>
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
        <Button
          type="success"
          size="large"
          @click="approve(chooseAuditRequest.auditRequestId)"
          >通过</Button
        >
        <Button
          type="error"
          size="large"
          @click="refused(chooseAuditRequest.auditRequestId)"
          >不通过</Button
        >
        <Button type="primary" size="large" @click="closeModal">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { instance } from "../../components/Index";
import { get } from "@/api";
import { getTimeFromUnix } from "../../utils/getInfo";
import { homeDataAuditingCourseCount } from "../Home";

export default {
  name: "auditCourse",
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
      auditingCourses: [],
      auditingCoursesDisplayed: [],
      chooseAuditRequest: {},
      chooseCourse: {},
      chooseUserInfo: {},
      courseInfoModal: false,
      splitLeft: 0.5,
      splitRight: 0.5,
      pageSize: 20,
      auditCount: 100,
      currIndex: 1,
      rowIndex: -1,
      refuseReason: "",
      columns: [
        {
          title: "审核请求ID",
          key: "auditRequestId",
          resizable: true,
          width: 120,
        },
        {
          title: "操作类型",
          key: "operType",
          resizable: true,
          width: 120,
          render: (h, params) =>
            h("div", [
              h(
                "strong",
                params.row.operType === "1" ? "添加课程" : "修改课程"
              ),
            ]),
        },
        {
          title: "申请时间",
          key: "auditRequestTime",
          resizable: true,
          width: 200,
          render: (h, params) =>
            h("div", [
              h("strong", typeof params.row.auditRequestTime !== 'string'?(params.row.auditRequestTime = getTimeFromUnix(params.row.auditRequestTime)):params.row.auditRequestTime),
            ]),
        },
        {
          title: "操作备注",
          key: "operComment",
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          width: 200,
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
                      this.rowIndex = params.index;
                      this.courseInfoModal = true;
                      this.chooseAuditRequest = params.row;
                      this.chooseCourse = JSON.parse(
                        this.chooseAuditRequest.snapShot
                      );
                      this.chooseCourse.courseApplyDate = getTimeFromUnix(
                        this.chooseCourse.courseApplyDate
                      );
                      this.chooseCourse.courseApplyDDLDate = getTimeFromUnix(
                        this.chooseCourse.courseApplyDDLDate
                      );
                      this.chooseCourse.courseDate = getTimeFromUnix(
                        this.chooseCourse.courseDate
                      );
                      this.chooseCourse.courseDDLDate = getTimeFromUnix(
                        this.chooseCourse.courseDDLDate
                      );
                      console.log("parsed course:", this.chooseCourse);
                    },
                  },
                },
                "查看"
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
                      this.rowIndex = params.index;
                      this.approve(params.row.auditRequestId);
                    },
                  },
                },
                "通过"
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
                      this.rowIndex = params.index;
                      this.refused(params.row.auditRequestId);
                    },
                  },
                },
                "不通过"
              ),
            ]),
        },
      ],
    };
  },
  mounted() {
    this.auditCount = homeDataAuditingCourseCount;
    this.getAuditingCoursesPageByPage(this.currIndex);
  },
  methods: {
    show(index) {},
    getAuditingCoursesPageByPage(index) {
      if (!index) return;
      let startIndex = (index - 1) * this.pageSize;
      let self = this;
      this.tableDataLoading = true;
      get("/adminManage/queryAllCourseAuditRequestPageByPage", {
        params: { start: startIndex, number: this.pageSize },
      })
        .then((res) => {
          console.log(res);
          self.auditingCourses[index] = res;
          self.auditingCoursesDisplayed = res;
          self.tableDataLoading = false;
        })
        .catch((error) => {
          console.log("查询失败");
          self.tableDataLoading = false;
        });
    },
    search() {
      // 按类型搜索
      let self = this;
      self.tableDataLoading = true;
      let id = 0;
      if (
        this.searchType === "根据课程ID查询" ||
        this.searchType === "根据审核ID查询"
      ) {
        id = parseInt(this.searchContent - 0);
        if (isNaN(id)) {
          this.$Message.error("非法的ID值！");
          return;
        }
      }
      if (this.searchType === "根据审核ID查询")
        get("/course/queryAuditCourseRequestById", {
          params: { auditRequestId: this.searchContent },
        })
          .then((res) => {
            console.log(res);
            self.auditingCoursesDisplayed = [res];
            self.tableDataLoading = false;
          })
          .catch((error) => {
            console.log("查询失败");
            self.tableDataLoading = false;
          });

      if (this.searchType === "根据课程ID查询")
        get("/course/queryAuditCourseRequestByCourseId", {
          params: { courseId: this.searchContent },
        })
          .then((res) => {
            console.log(res);
            self.auditingCoursesDisplayed = [res];
            self.tableDataLoading = false;
          })
          .catch((error) => {
            console.log("查询失败");
            self.tableDataLoading = false;
          });

      if (this.searchType === "根据课程名称查询")
        get("/course/queryAuditCourseRequestByCourseName", {
          params: { courseName: this.searchContent },
        })
          .then((res) => {
            console.log(res);
            self.auditingCoursesDisplayed = [res];
            self.tableDataLoading = false;
          })
          .catch((error) => {
            console.log("查询失败");
            self.tableDataLoading = false;
          });
    },
    refresh() {
      // 刷新本页面
      instance.reloadPage();
      this.toPage(this.currIndex);
    },
    toPage(index) {
      // 查看第 index 页的课程 index=1，2，3。。
      this.currIndex = index;
      if (!this.auditingCourses[index]) {
        this.getAuditingCoursesPageByPage(index);
      } else {
        this.auditingCoursesDisplayed = this.auditingCourses[index];
      }
    },
    pageSizeChange(size) {
      this.pageSize = size;
    },
    approve(id) {
      if (!id) return;
      let self = this;
      get("/adminManage/approveCourse", {
        params: { auditRequestId: id },
      })
        .then((res) => {
          self.$Notice.success({
            title: "操作成功",
          });
          let index = this.auditingCourses.indexOf(
            this.auditingCoursesDisplayed
          );
          this.auditingCoursesDisplayed.splice(this.rowIndex, 1);
          this.auditingCourses[index] = this.auditingCoursesDisplayed;
          this.closeModal();
        })
        .catch((error) => {
          self.$Notice.error({
            title: "【通过审核】操作失败",
          });
        });
    },
    refused(id) {
      if (!id) return;
      let self = this;
      get("/adminManage/refuseCourse", {
        params: { auditRequestId: id, refuseReason: this.refuseReason },
      })
        .then((res) => {
          self.$Notice.success({
            title: "操作成功",
          });
          let index = this.auditingCourses.indexOf(
            this.auditingCoursesDisplayed
          );
          this.auditingCoursesDisplayed.splice(this.rowIndex, 1);
          this.auditingCourses[index] = this.auditingCoursesDisplayed;
          this.closeModal();
        })
        .catch((error) => {
          self.$Notice.error({
            title: "【不通过审核】操作失败",
          });
        });
    },
    closeModal() {
      this.courseInfoModal = false;
    },
  },
};
</script>

<style scoped>
.image-size {
  width: 100px !important;
  height: 100px !important;
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
