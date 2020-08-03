<template>
  <div :class="classRoot">
    <nav-bar :title="'提现明细'"></nav-bar>
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
            @click="handleInfo(item.ExtractRecordID)"
          >
            <template #header>
              <div class="detailed">
                <div>
                  <span>提现到微信</span
                  ><span>{{
                    new Date(item.CreateTime).format("yyyy-MM-dd hh:mm")
                  }}</span>
                </div>
                <div>
                  <span>
                    <label class="money">-{{ item.Amount.toFixed(2) }}</label
                    ><span
                      class="residue_money"
                      v-if="item.ExtractStatus !== 2"
                      >{{ contentExtractStatus[item.ExtractStatus] }}</span
                    >
                  </span>
                  <van-icon name="arrow" color="#999999" />
                </div>
              </div>
            </template>
          </van-panel>
        </div>
        <van-empty v-else description="这里好冷清，没有任何提现明细" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import * as ExtractRecordsApi from "../../../apis/ExtractRecordsApi";
export default {
  name: "detailed",
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      detailedList: [], //收入明细数据
      page: 0,
      limit: 10,
      contentExtractStatus: ["申请中", "处理中", "成功"]
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
      this.page = Math.floor(this.detailedList.length / this.limit) + 1;
      ExtractRecordsApi.getExtractRecordsList(this.page, this.limit)
        .then(res => {
          if (res.Code === 0) {
            this.detailedList.push(...res.Body);
            if (res.Body.length !== this.limit) {
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
     * 提现详情
     */
    handleInfo(extractRecordID) {
      this.$router.push({
        path: "/user/cash-withdrawal-info",
        query: {
          extract_record_id: extractRecordID
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"detailed";
.@{inner-prefix} {
  background: #f9f9f9;
  height: 100%;
  &-body {
    padding: 5px 2px;
    height: calc(100% - 56px);
    overflow: scroll;
    .detailed {
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;

      background: #ffffff;
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
        display: flex;
        flex-direction: row;
        align-items: center;
        .money {
          font-size: 16px;
          color: #333333;
        }
        .residue_money {
          color: #888888;
          font-size: 14px;
          margin-top: 3px;
          color: #ff9100;
        }
        .van-icon {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
