<template>
  <div :class="classRoot">
    <nav-bar :title="'收入明细'"></nav-bar>
    <van-pull-refresh
      v-model="refreshing"
      :class="`${classRoot}-body`"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        :error="error"
        finished-text="没有更多了"
        @load="getdetailedListData"
      >
        <div v-if="detailedList && detailedList.length">
          <van-panel
            v-for="(item, index) in detailedList"
            :key="index"
            @click="handleInfo(item.WalletItemID)"
          >
            <template #header>
              <div class="detailed">
                <div>
                  <span>{{
                    item.IsCharge === 0
                      ? costType[item.CostType]
                      : chargeType[item.ChargeType]
                  }}</span
                  ><span>{{
                    new Date(item.CreateTime).format("yyyy-MM-dd hh:mm")
                  }}</span>
                </div>
                <div>
                  <span
                    class="money"
                    :style="
                      item.IsCharge === 0 ? 'color: #666666' : 'color: #ff0000'
                    "
                    >{{ item.IsCharge === 0 ? "-" : "+" }}10.00</span
                  ><span class="status">{{
                    orderStatus[item.Orders.OrderStatus]
                  }}</span>
                </div>
              </div>
            </template>
          </van-panel>
        </div>
        <van-empty v-else description="这里好冷清，没有任何收入明细" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import * as ConsultIncomeItemsApi from "../../apis/ConsultIncomeItemsApi";

export default {
  name: "income-detailed",
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      detailedList: [], //收入明细数据
      consultIncomeItemsParam: {
        page: 0,
        limit: 10
      },
      chargeType: ["充值", "咨询", "分享", "打赏"], //收入类型
      costType: ["提取", "咨询", "打赏"], //花费类型
      orderStatus: ["未支付", "已支付", "已取消", "支付失败"] //订单状态
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    }
  },
  methods: {
    /**
     * 刷新
     */
    onRefresh() {
      this.detailedList = [];
      this.finished = false;
      this.loading = true;
      this.getdetailedListData();
    },
    /**
     * 获取明细数据
     */
    getdetailedListData() {
      if (this.refreshing) {
        this.detailedList = [];
        this.refreshing = false;
      }
      this.consultIncomeItemsParam.page =
        Math.floor(
          this.detailedList.length / this.consultIncomeItemsParam.limit
        ) + 1;
      ConsultIncomeItemsApi.getConsultIncomeItems(this.consultIncomeItemsParam)
        .then(res => {
          if (res.Code === 0) {
            this.detailedList.push(...res.Body);
            if (res.Body.length !== this.consultIncomeItemsParam.limit) {
              this.finished = true;
            }
          } else {
            this.error = true;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /**
     * 收入详情
     */
    handleInfo(wid) {
      this.$router.push({
        path: "/user/income-info",
        query: {
          walletitem_id: wid
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"income-detailed";
.@{inner-prefix} {
  background: #f8f8f8;
  height: 100%;
  &-body {
    padding: 5px 2px;
    height: calc(100% - 56px);
    overflow: scroll;
    .detailed {
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
      div {
        span {
          display: block;
        }
      }
      div:first-child {
        span:first-child {
          color: #333333;
        }
        span:last-child {
          color: #888888;
          font-size: 13px;
          margin-top: 8px;
        }
      }
      div:last-child {
        .money {
          font-size: 18px;
        }
        .status {
          color: #ff9100;
          font-size: 14px;
          margin-top: 3px;
        }
      }
    }
  }
}
</style>
