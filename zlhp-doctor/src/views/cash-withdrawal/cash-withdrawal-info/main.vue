<template>
  <div :class="classRoot" v-if="infoData">
    <nav-bar :title="'提现详情'"></nav-bar>
    <van-panel :class="`${classRoot}-info`">
      <template #header>
        <div class="header">
          <span>提现到微信</span>
          <span>{{ infoData.Amount.toFixed(2) }}</span>
        </div>
      </template>
      <template #default>
        <div class="default">
          <span class="title">当前状态</span>
          <van-steps direction="vertical" :active="infoData.ExtractStatus">
            <van-step>
              <p>发起提现</p>
              <p>
                {{ new Date(infoData.CreateTime).format("yyyy-MM-dd hh:mm") }}
              </p>
            </van-step>
            <van-step>
              <p>处理中</p>
            </van-step>
            <van-step>
              <p>到账</p>
              <p v-if="infoData.ExtractStatus === 2">
                {{ new Date(infoData.UpdateTime).format("yyyy-MM-dd hh:mm") }}
              </p>
            </van-step>
          </van-steps>
        </div>
      </template>
      <template #footer>
        <div class="footer">
          <span>
            <p>提现金额</p>
            <p>发起时间</p>
            <p>到账时间</p>
            <p>流水号</p>
            <p>备注</p>
          </span>
          <span>
            <p>{{ infoData.Amount.toFixed(2) }}</p>
            <p>
              {{ new Date(infoData.CreateTime).format("yyyy-MM-dd hh:mm") }}
            </p>
            <p>
              {{
                infoData.ExtractStatus === 2
                  ? new Date(infoData.UpdateTime).format("yyyy-MM-dd hh:mm")
                  : "--"
              }}
            </p>
            <p>{{ infoData.OrderNo }}</p>
            <p>提现到微信</p>
          </span>
        </div>
      </template>
    </van-panel>
  </div>
</template>
<script>
import * as ExtractRecordsApi from "../../../apis/ExtractRecordsApi";
export default {
  name: "cash-withdrawal-info",
  data() {
    return {
      extractRecordID: this.$route.query.extract_record_id, //提现ID
      infoData: null //提现详情数据
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    }
  },
  created() {
    this.getExtractRecordsInfoData();
  },
  methods: {
    /**
     * 提现详情数据
     */
    getExtractRecordsInfoData() {
      this.$toast.loading("加载中...");
      ExtractRecordsApi.getExtractRecordsInfo(this.extractRecordID)
        .then(res => {
          if (res.Code === 0) {
            this.infoData = res.Body;
          }
        })
        .finally(this.$toast.clear);
    }
  }
};
</script>
<style lang="less">
@inner-prefix: ~"cash-withdrawal-info";
.@{inner-prefix} {
  background: #f9f9f9;
  height: 100%;
  &-info {
    height: calc(100% - 51px);
    overflow: scroll;
    margin-top: 5px;
    .header {
      display: flex;
      flex-direction: column;
      text-align: center;
      padding: 24px 0;
      border-bottom: 1px solid #dddddd;
      span:first-child {
        font-size: 16px;
        color: #333333;
      }
      span:last-child {
        font-size: 30px;
        color: #000000;
        margin-top: 17px;
      }
    }
    .default {
      padding: 14px 16px 0 16px;
      display: flex;
      flex-direction: row;
      .title {
        font-size: 14px;
        color: #999999;
        padding-top: 8px;
      }
      .van-steps {
        margin-left: 14px;
        .van-step {
          p:last-child {
            margin-bottom: 26px;
          }
          p {
            margin: 0 8px 3px 8px;
          }
          .van-step__circle {
            height: 8px;
            width: 8px;
          }
          .van-step__circle-container {
            font-size: 22px;
          }
        }
        .van-step::after {
          border: none;
        }
      }
    }
    .footer {
      padding: 0 5px 0 5px;
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
