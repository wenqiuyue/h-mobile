<template>
  <div :class="classRoot" v-if="signUpData">
    <nav-bar :title="'报名情况'"></nav-bar>
    <div :class="`${classRoot}-body`">
      <van-panel class="sign_up_head">
        <template #header>
          <div class="sign_up_title">{{ signUpData.Title }}</div>
          <div class="sign_up_star">
            <star
              :itemTitle="'报名人数'"
              :number="signUpData.SignUpCount"
              :numberColor="'#34AE94'"
              :icon="'icon-greenFlowerBG'"
            ></star>
            <star
              :itemTitle="'签到人数'"
              :number="signUpData.SignInCount"
              :numberColor="'#34AE94'"
              :icon="'icon-greenFlowerBG'"
            ></star>
          </div>
        </template>
      </van-panel>
      <van-panel v-if="signUpData.SignUpList && signUpData.SignUpList.length">
        <template #header>
          <div class="sign_up_table">
            <table>
              <tr>
                <th v-for="(th, index) in tableTh" :key="index">
                  {{ th.title }}
                </th>
              </tr>
              <tr
                class="array_tr"
                v-for="(item, index) in signUpData.SignUpList"
                :key="index"
              >
                <th>{{ item.User.LoginName }}</th>
                <th class="time">
                  {{ new Date(item.SignUpTime).format("yyyy-MM-dd hh:mm") }}
                </th>
                <th>{{ item.Status === 3 ? "是" : "否" }}</th>
              </tr>
            </table>
          </div>
        </template>
      </van-panel>
      <van-empty v-else description="这里好冷清，没有更多报名情况" />
    </div>
  </div>
</template>
<script>
import * as CourseSignUpApi from "../../../apis/CourseSignUpApi";
export default {
  name: "sign-up",
  data() {
    return {
      tableTh: [
        {
          title: "姓名"
        },
        {
          title: "报名时间"
        },
        {
          title: "是否签到"
        }
      ],
      courseInfoId: this.$route.query.course_info_id,
      signUpData: null //报名情况数据
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    }
  },
  created() {
    this.getSignUpData();
  },
  methods: {
    /**
     * 获取报名数据
     */
    getSignUpData() {
      this.$toast.loading("加载中...");
      CourseSignUpApi.getCourseSignUpInfo(this.courseInfoId)
        .then(res => {
          if (res.Code === 0) {
            this.signUpData = res.Body;
          }
        })
        .finally(this.$toast.clear);
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"sign-up";
.@{inner-prefix} {
  background: #f8f8f8;
  height: 100%;
  &-body {
    height: calc(100% - 46px);
    overflow: scroll;
    .sign_up_head {
      padding: 15px 25px 20px 25px;
      margin-top: 5px;
      .sign_up_title {
        font-size: 20px;
        color: #000000;
      }
      .sign_up_star {
        display: flex;
        flex-direction: row;
        margin-top: 30px;
        padding: 0 18px 0 35px;
        justify-content: space-between;
      }
    }
    .sign_up_table {
      margin-top: 6px;
      padding-bottom: 20px;
      table {
        width: 100%;
        border-spacing: 0;
        tr {
          text-align: center;
          line-height: 42px;
          padding: 10px 26px;
        }
        tr:first-child {
          font-size: 14px;
          color: #999999;
        }
        th {
          font-weight: normal !important;
          border-bottom: 2px solid #f9f9f9;
        }
        .array_tr {
          font-size: 16px;
          color: #666666;
          line-height: 50px;
          .time {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
