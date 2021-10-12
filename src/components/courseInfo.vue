<template>
  <div>
    <Divider class="head">课程信息</Divider>

    <div style="text-align: center">
      <a :href="chooseCourse.courseCoverPicUrl" target="_blank">
        <img :src="chooseCourse.courseCoverPicUrl" class="cover-pic" />
      </a>
    </div>

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
    <h3>课程团单最大人数</h3>
    <p>{{ chooseCourse.courseGroupOrderMaxNum }}</p>
    <h3>课程团单持续时间</h3>
    <p>{{ chooseCourse.courseGroupOrderHoldHours }}小时</p>
    <h3>课程状态</h3>
    <p>{{ chooseCourse.courseStatus }}</p>
    <h3>课程是否软删除</h3>
    <p>{{ chooseCourse.isDeleted }}</p>
    <h3>课程数据版本</h3>
    <p>{{ chooseCourse.version }}</p>
    <h3>课程售卖属性</h3>
    <p>{{ chooseCourse.courseSaleProperty }}</p>
    <h3>课程图片</h3>
    <p v-if="this.chooseCourseImages.length == 0">无</p>
    <viewer :images="this.chooseCourseImages">
      <img
        style="width: 100%; cursor: pointer"
        title="点击查看大图"
        v-for="src in chooseCourseImages"
        :src="src"
        :key="src.index"
      />
    </viewer>
  </div>
</template>
<script>
export default {
  props: {
    // 监听值
    chooseCourse: {
      type: Object,
    },
  },
  computed: {},
  data() {
    return {
      chooseCourseImages: [],
    };
  },
  // 手动双向绑定
  watch: {
    chooseCourse: {
      handler: function (val, oldVal) {
        if (val.courseImageUrls)
          this.chooseCourseImages = JSON.parse(val.courseImageUrls);
      },
      deep: true, //true 深度监听
    },
  },
  methods: {},
};
</script>

<style scoped>
.head {
  text-align: center;
  margin-bottom: 20px;
  font-size: xx-large;
}
.cover-pic {
  width: 100%;
}
</style>

