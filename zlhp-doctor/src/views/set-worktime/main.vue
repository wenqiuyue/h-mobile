<template>
  <div :class="classRoot">
    <nav-bar
      :title="'设置工作时间'"
      :rightTitle="'保存'"
      @onClickRight="handelKeep"
    ></nav-bar>
    <van-panel>
      <template #header>
        <div :class="`${classRoot}-state`">
          <span>工作状态</span>
          <van-switch
            v-model="stateChecked"
            active-color="#1FD0A2"
            size="25px"
          />
        </div>
      </template>
    </van-panel>
    <van-panel>
      <template #header>
        <div :class="`${classRoot}-worktime`">
          <div class="title">每周工作时间</div>
          <div class="day">
            <span
              v-for="(item, index) in day"
              :key="index"
              @click="selDay(index)"
              :class="
                selDayArray.indexOf(index) === -1 ? 'init-span' : 'sel-span'
              "
              >{{ item }}</span
            >
          </div>
        </div>
      </template>
    </van-panel>
    <van-panel>
      <template #header>
        <div :class="`${classRoot}-duration`" @click="isTimePicker = true">
          <span>工作时间段</span>
          <span v-if="!isTimePicker"
            >{{
              setWorkParam.StartTime && setWorkParam.EndTime
                ? setWorkParam.StartTime.substring(-1, 5) +
                  "-" +
                  setWorkParam.EndTime.substring(-1, 5)
                : "请选择时间"
            }}
            <svg-icon value="icon-doctor_thickReturn" :size="0.8"
          /></span>
        </div>
      </template>
      <template #default v-if="isTimePicker">
        <van-field
          readonly
          clickable
          :value="setWorkParam.StartTime"
          label="开始时间"
          placeholder="点击选择时间"
          @click="showBeginPicker = true"
        />
        <van-popup v-model="showBeginPicker" position="bottom">
          <van-datetime-picker
            type="time"
            @confirm="onConfirmBegin"
            @cancel="showBeginPicker = false"
          />
        </van-popup>
        <van-field
          readonly
          clickable
          :value="setWorkParam.EndTime"
          label="结束时间"
          placeholder="点击选择时间"
          @click="showEndPicker = true"
        />
        <van-popup v-model="showEndPicker" position="bottom">
          <van-datetime-picker
            type="time"
            @confirm="onConfirmEnd"
            @cancel="showEndPicker = false"
          />
        </van-popup>
      </template>
      <template #footer v-if="isTimePicker">
        <div :class="`${classRoot}-footer`">
          <van-button round type="info" plain color="#56DCB9" @click="determine"
            >确定</van-button
          >
        </div>
      </template>
    </van-panel>
  </div>
</template>
<script>
import _ from "lodash";
import * as OnlineDoctorApi from "../../apis/OnlineDoctorApi";
import * as UserApi from "../../apis/UserApi";
export default {
  name: "set-worktime",
  data() {
    return {
      stateChecked: true, //工作状态开关
      day: ["一", "二", "三", "四", "五", "六", "日"],
      selDayArray: [], // 被选择的工作日
      setWorkParam: {
        WorkStatus: null,
        Weeks: null,
        StartTime: null,
        EndTime: null
      },
      isTimePicker: false, //是否选择时间
      showBeginPicker: false, //显示开始时间选择器
      showEndPicker: false, //显示结束时间选择器
      onlineDoctorId: null //在线医生id
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    }
  },
  created() {
    this.getDoctorInfo();
  },
  methods: {
    /**
     * 获取医生数据
     */
    getDoctorInfo() {
      this.$toast.loading("加载中...");
      UserApi.getDoctorInfo().then(res => {
        if (res.Code === 0) {
          this.onlineDoctorId = res.Body.OnlineDoctor.OnlineDoctorID;
          //获取在线医生信息
          OnlineDoctorApi.getOnlineDoctor(this.onlineDoctorId)
            .then(data => {
              if (data.Code === 0) {
                //初始化工作时间信息
                this.setWorkParam.WorkStatus = data.Body.WorkStatus;
                this.setWorkParam.StartTime = data.Body.StartTime;
                this.setWorkParam.EndTime = data.Body.EndTime;
                //上班日期
                if (data.Body.Weeks) {
                  this.selDayArray = data.Body.Weeks.split(",").map(s => {
                    return parseInt(_.trim(s), 0);
                  });
                }
                //工作状态
                if (data.Body.WorkStatus === 0) {
                  this.stateChecked = true;
                } else {
                  this.stateChecked = false;
                }
              }
            })
            .finally(this.$toast.clear);
        }
      });
    },
    /**
     * 保存
     */
    handelKeep() {
      if (this.stateChecked) {
        this.setWorkParam.WorkStatus = 0;
      } else {
        this.setWorkParam.WorkStatus = 1;
      }
      this.setWorkParam.Weeks = _.join(this.selDayArray, ",");
      this.$toast.loading("正在保存...");
      OnlineDoctorApi.ChangeWorkTime(this.onlineDoctorId, this.setWorkParam)
        .then(res => {
          if (res.Code === 0) {
            this.$router.back();
          }
        })
        .finally(this.$toast.clear);
    },
    /**
     * 工作日选择
     */
    selDay(day) {
      if (this.selDayArray.indexOf(day) === -1) {
        this.selDayArray.push(day);
      } else {
        this.selDayArray.forEach((ele, index) => {
          if (ele === day) {
            this.selDayArray.splice(index, 1);
          }
        });
      }
    },
    /**确定时间段选择 */
    determine() {
      this.isTimePicker = false;
    },
    /**
     * 确认选择开始工作时间
     */
    onConfirmBegin(time) {
      this.setWorkParam.StartTime = time;
      this.showBeginPicker = false;
    },
    /**
     * 确认选择结束工作时间
     */
    onConfirmEnd(time) {
      this.setWorkParam.EndTime = time;
      this.showEndPicker = false;
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"set-worktime";
.@{inner-prefix} {
  background: #f8f8f8;
  height: 100%;
  &-state {
    margin-top: 5px;
    padding: 18px 17px 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 16px;
      color: #333333;
    }
  }
  &-worktime {
    padding: 20px 17px 19px 20px;
    .title {
      font-size: 16px;
      color: #333333;
    }
    .day {
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      span {
        border-radius: 50%;
        height: 40px;
        width: 40px;

        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 7px;
      }
      .init-span {
        border: 1px solid #dddddd;
        background: #f2f4f5;
        color: #191f25;
      }
      .sel-span {
        background: #56dcb9;
        color: #ffffff;
      }
    }
  }
  &-duration {
    padding: 18px 17px 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span:first-child {
      font-size: 16px;
      color: #333333;
    }
    span:last-child {
      font-size: 16px;
      color: #888888;
    }
  }
  &-footer {
    display: flex;
    justify-content: flex-end;
    .van-button {
      margin-left: 5px;
      font-size: 14px;
      height: 30px;
      line-height: 10px;
      padding: 8px 20px;
    }
  }
}
</style>
