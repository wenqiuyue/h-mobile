<template>
  <div :class="classRoot" v-if="doctorInfo && walletsData">
    <div :class="`${classRoot}-top`">
      <van-image class="bg" fit="cover" :src="require('../../assets/bg.png')" />
      <div class="doctor-info">
        <van-image
          v-if="doctorInfo.OnlineDoctor.MedicalStaff.Avatar"
          round
          width="65px"
          height="65px"
          fit="cover"
          :src="doctorInfo.OnlineDoctor.MedicalStaff.Avatar"
        />
        <svg-icon v-else value="icon-doctorHead" :size="4" />
        <span class="doctor-name">
          <label>{{ doctorInfo.OnlineDoctor.MedicalStaff.Name }}</label>
          <van-tag round
            ><svg-icon value="icon-doctor_Certified" :size="0.8" class="icon" />
            已认证</van-tag
          >
        </span>
      </div>
    </div>
    <div :class="`${classRoot}-body`">
      <van-image
        class="top-img"
        width="150px"
        height="150px"
        :src="require('../../assets/doctor_myCenterIllustration.svg')"
      />
      <van-panel class="money-panel">
        <template #header>
          <div class="profit">
            <span>
              <label>总收益(元)</label>
              <label>{{ walletsData.TotalAmount.toFixed(2) }}</label>
            </span>
            <span>
              <label>今日收益</label>
              <label class="today">{{
                walletsData.todayIncome === 0
                  ? "0.00"
                  : "+" + walletsData.todayIncome.toFixed(2)
              }}</label>
            </span>
          </div>
        </template>
        <template #footer>
          <div class="balance">
            <label>可提现余额(元)：{{ walletsData.Balance.toFixed(2) }}</label>
            <van-button
              round
              plain
              type="primary"
              color="#82D2B7"
              @click="handleCashWithdrawal"
              >提现</van-button
            >
          </div>
        </template>
      </van-panel>
      <van-panel class="option-panel">
        <template #header>
          <div class="profit">
            <router-link
              tag="div"
              :to="{ path: '/user/income' }"
              class="profit-array"
            >
              <span class="title"
                ><van-image
                  width="24px"
                  height="24px"
                  :src="require('../../assets/user/doctor_Income.svg')"
                /><label>我的收入</label></span
              >
              <svg-icon value="icon-doctor_thickReturn" :size="0.8" />
            </router-link>
            <router-link
              tag="div"
              :to="{ path: '/user/binding-weixin' }"
              class="profit-array"
            >
              <span class="title"
                ><van-image
                  width="24px"
                  height="24px"
                  :src="require('../../assets/user/doctor_BindingWeChat.svg')"
                /><label>绑定微信</label></span
              >
              <svg-icon value="icon-doctor_thickReturn" :size="0.8" />
            </router-link>
          </div>
        </template>
      </van-panel>
      <van-panel class="option-panel last-panel">
        <template #header>
          <div class="profit">
            <div class="profit-array">
              <span class="title"
                ><van-image
                  width="24px"
                  height="24px"
                  :src="require('../../assets/user/doctor_realName.svg')"
                /><label>实名认证</label></span
              >
              <svg-icon value="icon-doctor_thickReturn" :size="0.8" />
            </div>
            <router-link
              tag="div"
              :to="{ path: '/user/interrogation-manage' }"
              class="profit-array"
            >
              <span class="title"
                ><van-image
                  width="24px"
                  height="24px"
                  :src="require('../../assets/user/doctor_Interrogation.svg')"
                /><label>我的问诊</label></span
              >
              <svg-icon value="icon-doctor_thickReturn" :size="0.8" />
            </router-link>
            <router-link
              tag="div"
              :to="{ path: '/home/course-list' }"
              class="profit-array"
            >
              <span class="title"
                ><van-image
                  width="24px"
                  height="24px"
                  :src="require('../../assets/user/doctor_Income.svg')"
                /><label>我的课程</label></span
              >
              <svg-icon value="icon-doctor_thickReturn" :size="0.8" />
            </router-link>
            <router-link
              tag="div"
              :to="{ path: '/user/setting' }"
              class="profit-array"
            >
              <span class="title"
                ><van-image
                  width="24px"
                  height="24px"
                  :src="require('../../assets/user/doctor_setUp.svg')"
                /><label>设置</label></span
              >
              <svg-icon value="icon-doctor_thickReturn" :size="0.8" />
            </router-link>
          </div>
        </template>
      </van-panel>
    </div>
  </div>
</template>

<script>
import * as UserApi from "../../apis/UserApi";
import * as WalletsApi from "../../apis/WalletsApi";
export default {
  name: "user",
  data() {
    return {
      doctorInfo: null, //医生信息
      walletsData: null //收入信息
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    }
  },
  created() {
    this.getDoctorData();
  },
  methods: {
    /**
     * 获取医生信息
     */
    getDoctorData() {
      const methods = [UserApi.getDoctorInfo(), WalletsApi.getWallets()];
      this.$toast.loading("加载中...");
      Promise.all(methods)
        .then(res => {
          if (res[0].Code === 0 && res[1].Code === 0) {
            this.doctorInfo = res[0].Body;
            this.walletsData = res[1].Body;
            this.walletsData.todayIncome = 0;
            //筛选出今日收入
            if (
              this.walletsData.ConsultIncomeItems &&
              this.walletsData.ConsultIncomeItems.length
            ) {
              const todayIncomeArray = this.walletsData.ConsultIncomeItems.filter(
                m =>
                  m.IsCharge === 1 &&
                  new Date(m.CreateTime).toDateString() ===
                    new Date().toDateString()
              );
              //计算今日收入总和
              if (todayIncomeArray.length > 0) {
                todayIncomeArray.map(
                  s =>
                    (this.walletsData.todayIncome =
                      this.walletsData.todayIncome + s.ChargeAmount)
                );
              }
            }
          }
        })
        .finally(this.$toast.clear);
    },
    /**
     * 提现
     */
    handleCashWithdrawal() {
      this.$router.push({
        path: "/user/cash-withdrawal-index"
      });
    }
  }
};
</script>

<style lang="less">
@inner-prefix: ~"user";
.@{inner-prefix} {
  background: #f9f9f9;
  height: 100%;
  &-top {
    height: 220px;
    .bg {
      height: 210px;
      img {
        border-radius: 0 0 8px 8px;
      }
    }
    .doctor-info {
      position: absolute;
      top: 40px;
      left: 25px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .doctor-name {
        display: flex;
        flex-direction: column;
        margin-left: 12px;
        label {
          font-size: 18px;
          color: #333333;
        }
        .van-tag {
          margin-top: 12px;
          background: radial-gradient(
            rgba(182, 214, 255, 1) 0%,
            rgba(191, 226, 245, 1) 52%,
            rgba(199, 238, 235, 1) 100%
          );
          color: #333333;
          font-size: 12px;
          .icon {
            margin-right: 3px;
          }
        }
      }
    }
  }
  &-body {
    padding: 0 5px 10px 5px;
    .top-img {
      position: absolute;
      top: 27px;
      right: 15px;
    }
    .money-panel {
      position: absolute;
      top: 130px;
      left: 5px;
      right: 5px;
      width: calc(100%-10px);
      border-radius: 10px;
      box-shadow: 1px 1px 2px rgba(238, 238, 238, 1);
      .profit {
        border-radius: 10px;
        display: flex;
        justify-content: space-around;
        padding: 19px 0;
        span {
          display: flex;
          flex-direction: column;
          label:first-child {
            font-size: 13px;
            color: #999999;
            text-align: center;
          }
          label:last-child {
            font-size: 20px;
            color: #333333;
            margin-top: 17px;
          }
          .today {
            color: #f64d4d !important;
            text-align: center;
          }
        }
      }
      .balance {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 10px;
        label {
          font-size: 14px;
          color: #333333;
        }
        .van-button {
          width: 74px;
          height: 30px;
          line-height: 30px;
        }
      }
    }
    .option-panel {
      margin-top: 58px;
      border-radius: 10px;
      box-shadow: 1px 1px 2px rgba(238, 238, 238, 1);
      .profit {
        padding: 1px 16px 26px 16px;
        .profit-array {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 25px;
          .title {
            font-size: 16px;
            color: #333333;
            display: flex;
            align-items: center;
            label {
              margin-left: 10px;
            }
          }
        }
      }
    }
    .last-panel {
      margin-top: 5px;
    }
  }
}
</style>
