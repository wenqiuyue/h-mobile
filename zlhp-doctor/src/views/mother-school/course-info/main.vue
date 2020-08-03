<template>
  <div :class="classRoot">
    <nav-bar :title="'课程详情'"></nav-bar>
    <div :class="`${classRoot}-body`" v-if="courseInfoData">
      <van-panel class="title-panel">
        <template #header>
          <div class="title">{{ courseInfoData.Title }}</div>
          <div class="class-date">
            开课时间：
            {{ new Date(courseInfoData.ClassData).format("yyyy-MM-dd") }}
            {{ courseInfoData.BeginTime.substring(0, 5) }} -
            {{ new Date(courseInfoData.EndClassDate).format("hh:mm") }} 星期{{
              day[new Date(courseInfoData.ClassData).getDay() - 1]
            }}
          </div>
        </template>
      </van-panel>
      <van-panel class="situation">
        <template #header>
          <div class="situation-content">
            <star
              :itemTitle="'已报名'"
              :number="courseInfoData.Rejistered"
              :numberColor="'#1FD0A2'"
              :icon="'icon-greenFlowerBG'"
            ></star>
            <star
              :itemTitle="'未报名'"
              :number="courseInfoData.Residue"
              :numberColor="'#BBBBBB'"
            ></star>
            <star
              :itemTitle="'已签到'"
              :number="courseInfoData.CheckedIn"
              :numberColor="'#1FD0A2'"
              :icon="'icon-greenFlowerBG'"
            ></star>
            <star
              :itemTitle="'未签到'"
              :number="courseInfoData.DidNotCheckedIn"
              :numberColor="'#BBBBBB'"
            ></star>
          </div>
        </template>
      </van-panel>
      <van-panel class="option-panel">
        <template #header>
          <div class="profit">
            <router-link
              tag="div"
              :to="{
                path: '/home/sign-up',
                query: {
                  course_info_id: courseInfoId
                }
              }"
              class="profit-array"
            >
              <span class="title"
                ><svg-icon value="icon-doctor_signUp" :size="1.2" /><label
                  >报名情况</label
                ></span
              >
              <svg-icon value="icon-doctor_blackRetrun" :size="0.8" />
            </router-link>
          </div>
        </template>
      </van-panel>
      <van-panel class="option-panel">
        <template #header>
          <div class="profit">
            <router-link
              tag="div"
              :to="{
                path: '/home/sign-in',
                query: {
                  course_info_id: courseInfoId
                }
              }"
              class="profit-array"
            >
              <span class="title"
                ><svg-icon value="icon-doctor_signIn" :size="1.2" /><label
                  >签到情况</label
                ></span
              >
              <svg-icon value="icon-doctor_blackRetrun" :size="0.8" />
            </router-link>
          </div>
        </template>
      </van-panel>
    </div>
  </div>
</template>
<script>
import * as CourseInfoApi from "../../../apis/CourseInfoApi";
export default {
  name: "course-info",
  data() {
    return {
      courseInfoData: null, //课程详情数据
      courseInfoId: this.$route.query.course_info_id,
      day: ["一", "二", "三", "四", "五", "六", "日"]
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    }
  },
  created() {
    this.getCourseInfo();
  },
  methods: {
    /**
     * 获取课程详情
     */
    getCourseInfo() {
      this.$toast.loading("加载中...");
      CourseInfoApi.getCourseInfo(this.courseInfoId)
        .then(res => {
          if (res.Code === 0) {
            this.courseInfoData = res.Body;
          }
        })
        .finally(this.$toast.clear);
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"course-info";
.@{inner-prefix} {
  background: #f8f8f8;
  height: 100%;
  &-body {
    padding: 5px 0;
    .title-panel {
      padding: 15px 15px 17px 26px;
      .title {
        font-size: 20px;
        color: #000000;
      }
      .class-date {
        font-size: 14px;
        color: #999999;
        margin-top: 12px;
      }
    }
    .situation {
      padding: 30px 29px 20px 29px;
      margin-bottom: 8px;
      .situation-content {
        display: flex;
        flex-direction: row;
      }
    }
    .option-panel {
      margin-bottom: 1px;
      .profit {
        padding: 18px 16px;
        .profit-array {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .title {
            font-size: 16px;
            color: #000000;
            display: flex;
            align-items: center;
            label {
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
