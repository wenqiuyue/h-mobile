<template>
  <div :class="classRoot">
    <div :class="`${classRoot}-top`">
      <div class="doctor-info">
        <van-image
          width="72px"
          height="24px"
          fit="cover"
          :src="require('../../assets/hometitle.png')"
        />
        <svg-icon value="icon-doctor_Bell" :size="1.1" />
      </div>
    </div>
    <div :class="`${classRoot}-body`">
      <div class="title_swipe">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#C4EAF0">
          <van-swipe-item v-for="(image, index) in titleImages" :key="index"
            ><van-image width="361px" height="162px" :src="image"
          /></van-swipe-item>
        </van-swipe>
      </div>
      <van-panel class="message_panel">
        <template #header>
          <div class="message_header">
            <svg-icon value="icon-newsTiXing" :size="2.3" class="icon" />
            <div class="message">
              <span>您的体检报告更新啦，快来查看！</span
              ><span>您的体检报告更新啦，快来查看！</span>
            </div>
          </div>
        </template>
      </van-panel>
      <van-panel class="Interrogation_panel" v-if="inquiryRecordData">
        <template #header>
          <div class="Interrogation_header">
            <div class="title" @click="inquiryRecordManage">
              <label>问诊管理</label>
              <svg-icon value="icon-doctor_blackRetrun" :size="0.8" />
            </div>
            <div class="item">
              <star
                :itemTitle="'待回复'"
                :number="inquiryRecordData.WaitReply"
                :numberColor="'#FF8555'"
              ></star>
              <star
                :itemTitle="'待接诊'"
                :number="inquiryRecordData.WaitReception"
                :numberColor="'#FEBD53'"
              ></star>
              <star
                :itemTitle="'接诊中'"
                :number="inquiryRecordData.InReception"
                :numberColor="'#1FD0A2'"
              ></star>
              <star
                :itemTitle="'已完成'"
                :number="inquiryRecordData.Finished"
                :numberColor="'#37A9FF'"
              ></star>
            </div>
            <div class="work" v-if="workData">
              <div class="work-status">
                <span>工作状态：</span>
                <span
                  >{{ stateChecked ? "接诊中" : "休息"
                  }}<van-switch
                    :value="stateChecked"
                    @input="onInput"
                    active-color="#1FD0A2"
                    size="21px"
                    class="switch"
                /></span>
              </div>
              <div class="work-status work-time" @click="setWork">
                <span>工作时间：</span>
                <span
                  >{{
                    workData.StartTime && workData.EndTime
                      ? workData.StartTime.substring(-1, 5) +
                        "-" +
                        workData.EndTime.substring(-1, 5)
                      : "请选择时间"
                  }}(周{{ day[workData.selDayArray[0]] }}至周{{
                    day[workData.selDayArray[workData.selDayArray.length - 1]]
                  }})<svg-icon
                    value="icon-doctor_greenReturn"
                    :size="0.8"
                    class="svg"
                /></span>
              </div>
            </div>
          </div>
        </template>
      </van-panel>
      <van-panel class="course_panel" v-if="courseData">
        <template #header>
          <div class="course_header">
            <div class="course_title" @click="courseManage">
              <label>课程管理</label>
              <svg-icon value="icon-doctor_blackRetrun" :size="0.8" />
            </div>
            <div class="course_week">
              <div
                class="course"
                v-for="(item, index) in courseData.Week"
                :key="index"
                @click="step = index"
              >
                <div class="week_item" v-if="step === index">
                  <van-image
                    width="36px"
                    height="26px"
                    :src="require('../../assets/dog.gif')"
                    class="img"
                  />
                  <div class="week">
                    <span>{{
                      item === "Today"
                        ? "今日"
                        : "周" + day[new Date().getDay() + index - 1]
                    }}</span
                    ><span>{{ courseData[item].length }}节课</span>
                  </div>
                </div>
                <div class="week_item_gray" v-else>
                  <span>{{
                    item === "Today"
                      ? "今日"
                      : "周" +
                        day[
                          new Date().getDay() + index > 7
                            ? new Date().getDay() + index - 1 - 7
                            : new Date().getDay() + index - 1
                        ]
                  }}</span
                  ><span>{{ courseData[item].length }}</span>
                </div>
              </div>
            </div>
            <div
              class="course_main"
              v-if="courseData[courseData.Week[step]].length > 0"
            >
              <div class="course_line"><span></span><span></span></div>
              <div
                class="course_info"
                v-for="(course, index) in courseData[courseData.Week[step]]"
                :key="index"
                :style="
                  index % 2 === 0
                    ? 'background: #ecfaf8'
                    : 'background: #F1FBFF'
                "
                @click="handleCourseInfo(course.CourseInfoID)"
              >
                <span class="title">{{ course.Title }}</span>
                <span class="time"
                  >{{ course["ClassBeginTimeStr"] }} -
                  {{ course["ClassEndTimeStr"] }}</span
                >
              </div>
            </div>
            <div class="no_course" v-else>
              <van-image
                width="83px"
                height="69px"
                :src="require('../../assets/doctor_empty_inbox.svg')"
              />
              <div class="tips">没课的日子好无聊</div>
            </div>
          </div>
        </template>
      </van-panel>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { Dialog } from "vant";
import * as CourseInfoApi from "../../apis/CourseInfoApi";
import * as InquiryRecordApi from "../../apis/InquiryRecordApi";
import * as OnlineDoctorApi from "../../apis/OnlineDoctorApi";
import * as UserApi from "../../apis/UserApi";
export default {
  name: "home",
  data() {
    return {
      titleImages: [
        `${require("../../assets/banner1.png")}`,
        `${require("../../assets/banner2.png")}`,
        `${require("../../assets/banner3.png")}`
      ],
      step: 0,
      stateChecked: true, //工作状态开关
      courseData: null, //课程信息
      inquiryRecordData: null, //问诊统计
      day: ["一", "二", "三", "四", "五", "六", "日"],
      onlineDoctorId: null, //在线医生id
      workData: null
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    }
  },
  created() {
    this.getData();
  },
  methods: {
    /**
     * 获取首页数据
     */
    getData() {
      const methods = [
        CourseInfoApi.getThisWeek(),
        InquiryRecordApi.getInquiryRecordStatistics(),
        UserApi.getDoctorInfo()
      ];
      this.$toast.loading("加载中...");
      Promise.all(methods)
        .then(res => {
          if (res[0].Code === 0 && res[1].Code === 0 && res[2].Code === 0) {
            this.courseData = res[0].Body;
            this.courseData.Week = Object.keys(res[0].Body);
            this.inquiryRecordData = res[1].Body;
            this.onlineDoctorId = res[2].Body.OnlineDoctor.OnlineDoctorID;
            //获取在线医生信息
            OnlineDoctorApi.getOnlineDoctor(this.onlineDoctorId).then(data => {
              if (data.Code === 0) {
                this.workData = data.Body;
                //工作状态设置
                if (data.Body.WorkStatus === 0) {
                  this.stateChecked = true;
                } else {
                  this.stateChecked = false;
                }
                //上班日期
                if (data.Body.Weeks) {
                  this.workData.selDayArray = data.Body.Weeks.split(",").map(
                    s => {
                      return parseInt(_.trim(s), 0);
                    }
                  );
                } else {
                  this.workData.selDayArray = [];
                }
              }
            });
          }
        })
        .finally(this.$toast.clear);
    },
    /**
     * 工作状态开关
     */
    onInput(checked) {
      Dialog.confirm({
        title: "提醒",
        message: "是否切换工作状态？"
      })
        .then(() => {
          this.stateChecked = checked;
          let setWorkParam = {
            WorkStatus: null
          };
          if (this.stateChecked) {
            setWorkParam.WorkStatus = 0;
          } else {
            setWorkParam.WorkStatus = 1;
          }
          this.$toast.loading("正在保存...");
          OnlineDoctorApi.changeWorkStatus(this.onlineDoctorId, setWorkParam)
            .then(res => {
              if (res.Code === 0) {
                this.$toast.success("设置成功");
              }
            })
            .finally(this.$toast.clear);
        })
        .catch(() => {
          this.$toast.fail("用户取消");
        });
    },
    /**
     * 课程详情
     */
    handleCourseInfo(courseinfoid) {
      this.$router.push({
        path: "/home/course-info",
        query: {
          course_info_id: courseinfoid
        }
      });
    },
    /**
     * 设置工作时间
     */
    setWork() {
      this.$router.push({
        path: "/home/set-worktime"
      });
    },
    /**
     * 课程管理
     */
    courseManage() {
      this.$router.push({
        path: "/home/course-list"
      });
    },
    /**
     * 问诊管理
     */
    inquiryRecordManage() {
      this.$router.push({
        path: "/user/interrogation-manage"
      });
    }
  }
};
</script>

<style lang="less" scoped>
@inner-prefix: ~"home";
.@{inner-prefix} {
  background: #f9f9f9;
  height: 100%;
  &-top {
    background-image: url("../../assets/bg.png");
    padding: 17px 20px 95px 21px;
    border-radius: 0 0 8px 8px;
    .doctor-info {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }
  &-body {
    padding: 0 5px 10px 5px;
    .title_swipe {
      position: absolute;
      top: 60px;
      left: 8px;
      right: 8px;
      width: calc(100%-16px);
      border-radius: 10px;
      .my-swipe {
        border-radius: 10px;
      }
    }
    .message_panel {
      border-radius: 10px;
      margin-top: 93px;
      .message_header {
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 12px 14px 12px 14px;
        box-shadow: 1px 1px 2px rgba(238, 238, 238, 1);
        .message {
          margin-left: 15px;
          line-height: 25px;
          span {
            display: flex;
            flex-direction: row;
            font-size: 13px;
            color: #333333;
          }
        }
      }
    }
    .Interrogation_panel {
      margin-top: 5px;
      border-radius: 10px;
      .Interrogation_header {
        box-shadow: 1px 1px 2px rgba(238, 238, 238, 1);
        padding: 12px 17px 25px 17px;
        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 18px;
        }
        .item {
          margin-top: 22px;
          display: flex;
          flex-direction: row;
        }
        .work {
          background: #fafafa;
          margin-top: 20px;
          padding: 14px 10px 13px 16px;
          border-radius: 10px;
          .work-status {
            display: flex;
            justify-content: space-between;
            span:first-child {
              font-size: 14px;
              color: #999999;
            }
            span:last-child {
              font-size: 15px;
              color: #888888;
              display: flex;
              align-items: center;
              .switch {
                margin-left: 13px;
              }
              .svg {
                margin-left: 11px;
              }
            }
          }
          .work-time {
            margin-top: 18px;
          }
        }
      }
    }
    .course_panel {
      margin-top: 5px;
      border-radius: 10px;
      .course_header {
        box-shadow: 1px 1px 2px rgba(238, 238, 238, 1);
        padding: 12px 17px 25px 17px;
        .course_title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 18px;
        }
        .course_week {
          margin-top: 18px;
          background: #fafafa;
          border-radius: 10px;
          padding: 20px 11px;
          display: flex;
          flex-direction: row;
          .course {
            .week_item {
              width: 73px;
              text-align: center;
              position: relative;
              .img {
                position: absolute;
                top: -27px;
                left: 20px;
              }
              .week {
                width: 70px;
                height: 51px;
                border-radius: 5px;
                border: 1px solid #82d2b7;
                display: flex;
                flex-direction: column;
                padding: 13px 0;
                background: #fcfffe;
                span:first-child {
                  font-size: 14px;
                  color: #82d2b7;
                }
                span:last-child {
                  font-size: 16px;
                  color: #999999;
                  margin-top: 8px;
                }
              }
            }
            .week_item_gray {
              width: 59px;
              text-align: center;
              display: flex;
              flex-direction: column;
              padding: 13px 0;
              span:first-child {
                font-size: 14px;
                color: #666666;
              }
              span:last-child {
                font-size: 20px;
                color: #82d2b7;
                margin-top: 8px;
              }
            }
          }
        }
        .course_main {
          .course_line {
            padding: 0 45px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            span {
              height: 13px;
              width: 4px;
              background: #e4e4e4;
              border: 1px solid #e4e4e4;
            }
          }
          .course_info {
            padding: 14px 15px 11px 21px;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
            .title {
              font-size: 16px;
              color: #000000;
            }
            .time {
              font-size: 14px;
              color: #999999;
              margin-top: 5px;
            }
          }
        }
        .no_course {
          text-align: center;
          padding: 45px 0;
          .tips {
            margin-top: 29px;
            font-size: 14px;
            color: #bbbbbb;
          }
        }
      }
    }
  }
}
</style>
