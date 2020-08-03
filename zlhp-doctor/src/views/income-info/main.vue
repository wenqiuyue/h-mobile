<template>
  <div :class="classRoot">
    <nav-bar :title="'收入详情'"></nav-bar>
    <van-panel :class="`${classRoot}-info`" v-if="incomeInfoData">
      <template #header>
        <div class="header">
          <span class="title">{{
            incomeInfoData.IsCharge === 0
              ? costType[incomeInfoData.CostType]
              : chargeType[incomeInfoData.ChargeType]
          }}</span>
          <span class="money"
            >{{ incomeInfoData.IsCharge === 0 ? "-" : "+" }}10.00</span
          >
          <span class="status">待结算</span>
        </div>
      </template>
      <template #footer>
        <div class="footer">
          <span>
            <p>咨询人</p>
            <p>流水号</p>
            <p>收款时间</p>
            <p>备注</p>
          </span>
          <span>
            <p>张丹阳</p>
            <p>{{ incomeInfoData.OrderID }}</p>
            <p>2019-06-14 16:30:10</p>
            <p>咨询服务费</p>
          </span>
        </div>
      </template>
    </van-panel>
  </div>
</template>
<script>
import * as ConsultIncomeItemsApi from "../../apis/ConsultIncomeItemsApi";
export default {
  name: "income-info",
  data() {
    return {
      incomeInfoData: null, //收入详情数据
      walletItemID: this.$route.query.walletitem_id, //收入明细id
      chargeType: ["充值", "咨询", "分享", "打赏"], //收入类型
      costType: ["提取", "咨询", "打赏"] //花费类型
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    }
  },
  created() {
    this.getIncomeInfo();
  },
  methods: {
    /**
     * 获取收入详情数据
     */
    getIncomeInfo() {
      this.$toast.loading("加载中...");
      ConsultIncomeItemsApi.getConsultIncomeItemsInfo(this.walletItemID)
        .then(res => {
          if (res.Code === 0) {
            this.incomeInfoData = res.Body;
          }
        })
        .finally(this.$toast.clear);
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"income-info";
.@{inner-prefix} {
  background: #f8f8f8;
  height: 100%;
  &-info {
    margin-top: 7px;
    .header {
      padding: 23px 0 19px 0;
      span {
        text-align: center;
        display: block;
      }
      .title {
        font-size: 16px;
        color: #333333;
      }
      .money {
        font-size: 30px;
        color: #000000;
        margin-top: 20px;
      }
      .status {
        font-size: 14px;
        color: #ff9100;
        margin-top: 10px;
      }
    }
    .footer {
      padding: 10px 5px 20px 5px;
      display: flex;
      flex-direction: row;
      span:first-child {
        p {
          color: #999999;
          font-size: 14px;
          margin: 16px 0;
        }
      }
      span:last-child {
        margin-left: 30px;
        p {
          color: #333333;
          font-size: 14px;
          margin: 16px 0;
        }
      }
    }
  }
}
</style>
