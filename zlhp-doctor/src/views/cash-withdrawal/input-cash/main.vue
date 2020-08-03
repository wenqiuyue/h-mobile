<template>
  <div :class="classRoot" v-if="walletsData">
    <nav-bar :title="'提现'"></nav-bar>
    <div :class="`${classRoot}-wx_number`">
      <p>提现到</p>
      <p class="title">
        <van-image
          round
          width="36px"
          height="36px"
          fit="cover"
          :src="walletsData.User.UserImage"
        /><label>{{ walletsData.User.LoginName }}</label>
      </p>
    </div>
    <van-panel :class="`${classRoot}-cash_content`">
      <template #header>
        <div class="header">
          <span class="title">提现金额</span>
          <van-field
            v-model="money"
            type="number"
            label="￥"
            class="input_money"
            label-width="50px"
            :error-message="errorMessage"
          />
          <div class="residue">
            可提现余额(元)：{{ walletsData.Balance.toFixed(2) }}元，<span
              @click="money = walletsData.Balance"
              >全部提现</span
            >
          </div>
          <div class="cash-button">
            <van-button
              @click="handleCash"
              :class="
                money && money >= 1 && money <= walletsData.Balance
                  ? 'button_color'
                  : 'button_color_disabled'
              "
              >提现</van-button
            >
          </div>
        </div>
      </template>
    </van-panel>
  </div>
</template>
<script>
import { Toast } from "vant";
import * as WalletsApi from "../../../apis/WalletsApi";
import * as ExtractRecordsApi from "../../../apis/ExtractRecordsApi";
export default {
  name: "input-cash",
  data() {
    return {
      money: null, //要体现的金额
      walletsData: null //钱包数据
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    },
    //提现金额限制提醒
    errorMessage() {
      if (this.money && this.money < 1) {
        return "最低提现金额1元";
      } else if (this.money > this.walletsData.Balance) {
        return "超出本次可提现金额";
      }
      return null;
    }
  },
  created() {
    this.getWalletsData();
  },
  methods: {
    /**
     * 获取钱包数据
     */
    getWalletsData() {
      this.$toast.loading("加载中...");
      WalletsApi.getWallets()
        .then(res => {
          if (res.Code === 0) {
            this.walletsData = res.Body;
          }
        })
        .finally(this.$toast.clear);
    },
    /**
     * 提现
     */
    handleCash() {
      if (
        this.money &&
        this.money >= 1 &&
        this.money <= this.walletsData.Balance
      ) {
        ExtractRecordsApi.extract(this.money).then(res => {
          if (res.Code === 0 && res.Body) {
            Toast.success("提现成功");
            this.$router.replace({
              path: "/user/cash-withdrawal-info",
              query: {
                extract_record_id: res.Body.ExtractRecordID
              }
            });
          } else {
            Toast.fail(res.Message);
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"input-cash";
.@{inner-prefix} {
  background: #f9f9f9;
  height: 100%;
  &-wx_number {
    background: #ffffff;
    padding: 8px 5px 12px 20px;
    margin-top: 5px;
    p {
      margin: 0;
    }
    p:first-child {
      color: #888888;
    }
    p:last-child {
      color: #333333;
      font-size: 16px;
      margin-top: 8px;
    }
    .title {
      padding-top: 12px;
      background: #ffffff;
      font-size: 17px;
      color: #333333;
      display: flex;
      align-items: center;
      label {
        margin-left: 12px;
      }
    }
  }
  &-cash_content {
    margin-top: 5px;
    padding: 16px 17px;
    .header {
      .title {
        color: #888888;
      }
      .input_money {
        border-bottom: 1px solid #dddddd;
        margin-top: 20px;
        font-size: 24px;
        color: #333333;
        display: flex;
        align-items: center;
        padding-left: 0;
      }
      .residue {
        margin-top: 16px;
        color: #888888;
        font-size: 14px;
        span {
          color: #3155a8;
        }
      }
      .cash-button {
        margin-top: 35px;
        text-align: center;
        .van-button {
          width: 95%;
          font-size: 17px;
        }
        .button_color {
          background: #1fd0a2;
          color: #ffffff;
        }
        .button_color_disabled {
          background: #f2f2f2;
          color: #999999;
        }
      }
    }
  }
}
</style>
