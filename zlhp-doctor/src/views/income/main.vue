<template>
  <div :class="classRoot">
    <div :class="`${classRoot}-top`">
      <van-image fit="cover" :src="require('../../assets/bg.png')" />
      <nav-bar
        class="bar"
        :title="'收入'"
        :rightTitle="'明细'"
        @onClickRight="handelDetailed"
      ></nav-bar>
    </div>
    <div :class="`${classRoot}-body`" v-if="IncomeData">
      <van-panel class="money-panel">
        <template #header>
          <div class="profit">
            <span>
              <label>总收益(元)</label>
              <label>{{ IncomeData.TotalAmount.toFixed(2) }}</label>
            </span>
            <span>
              <label>余额(元)</label>
              <label>{{ IncomeData.Balance.toFixed(2) }}</label>
            </span>
          </div>
        </template>
        <template #footer>
          <div class="settlement">
            <span>
              <label>{{ IncomeData.NoSettlement.toFixed(2) }}</label>
              <label>待结算</label>
            </span>
            <div class="line"></div>
            <span>
              <label>{{ IncomeData.HaveSettlement.toFixed(2) }}</label>
              <label>已结算</label>
            </span>
            <div class="line"></div>
            <span>
              <label>{{ IncomeData.totalExtract.toFixed(2) }}</label>
              <label>已提现</label>
            </span>
          </div>
        </template>
      </van-panel>
      <div class="cash-button">
        <van-button type="primary" @click="handleCash">提现</van-button>
      </div>
      <div class="cash-tips">提现后24小时内到账</div>
    </div>
  </div>
</template>
<script>
import * as WalletsApi from "../../apis/WalletsApi";
export default {
  name: "income",
  data() {
    return {
      IncomeData: null //收入数据
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    }
  },
  created() {
    this.getIncomeData();
  },
  methods: {
    /**
     * 获取我的收入数据
     */
    getIncomeData() {
      this.$toast.loading("加载中...");
      WalletsApi.getWallets()
        .then(res => {
          if (res.Code === 0) {
            this.IncomeData = res.Body;
            this.IncomeData.totalExtract = 0;
            if (res.Body.ExtractRecords) {
              res.Body.ExtractRecords.forEach(element => {
                this.IncomeData.totalExtract =
                  this.IncomeData.totalExtract + element.Amount;
              });
            }
          }
        })
        .finally(this.$toast.clear);
    },
    /**
     * 查看收入明细
     */
    handelDetailed() {
      this.$router.push({
        path: "/user/income-detailed"
      });
    },
    /**
     * 提现到微信
     */
    handleCash() {
      //如果绑定了微信，则提现，否则先去绑定微信
      if (this.IncomeData.User.OpenId) {
        this.$router.push({
          path: "/user/input-cash"
        });
      } else {
        this.$dialog
          .confirm({
            title: "温馨提示",
            message: "您还没有绑定微信，请先绑定！"
          })
          .then(() => {
            this.$router.push({
              path: "/user/binding-weixin"
            });
          })
          .catch(() => {
            this.$toast.fail("用户取消");
          });
      }
    }
  }
};
</script>
<style lang="less">
@inner-prefix: ~"income";
.@{inner-prefix} {
  background: #f8f8f8;
  height: 100%;
  &-top {
    height: 220px;
    .van-image {
      height: 210px;
      img {
        border-radius: 0 0 8px 8px;
      }
    }
    .bar {
      position: relative;
      top: -215px;
      .van-nav-bar {
        background: none;
      }
      .van-nav-bar::after {
        border: none;
      }
    }
  }
  &-body {
    padding: 0 15px 10px 15px;
    .money-panel {
      position: absolute;
      top: 70px;
      left: 18px;
      right: 18px;
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
        }
      }
      .settlement {
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-radius: 10px;
        padding: 9px 0 13px 0;
        span {
          display: flex;
          flex-direction: column;
          label:first-child {
            font-size: 15px;
            color: #666666;
            text-align: center;
          }
          label:last-child {
            font-size: 13px;
            color: #999999;
            margin-top: 8px;
            text-align: center;
          }
        }
        .line {
          border: 1px solid #eeeeee;
          height: 57px;
        }
      }
    }
    .cash-button {
      margin-top: 80px;
      .van-button {
        width: 100%;
        background: rgba(31, 208, 162, 1);
        box-shadow: 1px 5px 10px rgba(199, 238, 235, 1);
        font-size: 16px;
      }
    }
    .cash-tips {
      text-align: center;
      margin-top: 22px;
      font-size: 13px;
      color: #888888;
    }
  }
}
</style>
