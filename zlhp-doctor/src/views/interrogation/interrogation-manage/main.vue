<template>
  <div :class="classRoot">
    <nav-bar :title="'问诊管理'"></nav-bar>
    <van-tabs
      v-model="inquiryActive"
      :class="`${classRoot}-tabs`"
      color="#1FD0A2"
      line-width="120px"
      line-height="5px"
      title-active-color="#82D2B7"
      title-inactive-color="#999999"
    >
      <van-tab title="待接诊"></van-tab>
      <van-tab title="问诊中"></van-tab>
      <van-tab title="已完成"></van-tab>
    </van-tabs>
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
        @load="getqueryListData"
      >
        <van-panel
          v-for="(item, index) in queryList"
          :key="index"
          class="inquiry-panel"
          @click="handelConsult(item)"
        >
          <template #header>
            <div class="top">
              <van-image
                round
                width="55px"
                height="55px"
                fit="cover"
                :src="item.CUser.UserImage"
              />
              <div class="info">
                <div class="name">
                  <span>{{ item.CUser.UserName || item.CUser.LoginName }}</span>
                  <span class="time">{{ formatDate(item.CreateTime) }}</span>
                </div>
                <div class="bottom">
                  {{ item.Content }}
                </div>
              </div>
            </div>
          </template>
        </van-panel>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import * as InquiryRecordApi from "../../../apis/InquiryRecordApi";
import { formatDate } from "../../../commons";
export default {
  name: "interrogation-manage",
  data() {
    return {
      inquiryActive: 0, //当前标签页索引
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      queryList: [],
      queryParam: {
        limit: 10,
        page: 0,
        ConsultStatus: 1
      }
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    }
  },
  watch: {
    inquiryActive() {
      if (this.inquiryActive === 0) {
        this.queryParam.ConsultStatus = 1;
      } else if (this.inquiryActive === 1) {
        this.queryParam.ConsultStatus = 2;
      } else {
        this.queryParam.ConsultStatus = 3;
      }
      this.onRefresh();
    }
  },
  methods: {
    formatDate,
    /**
     * 获取问诊数据
     */
    getqueryListData() {
      if (this.refreshing) {
        this.queryList = [];
        this.refreshing = false;
      }
      this.queryParam.page =
        Math.floor(this.queryList.length / this.queryParam.limit) + 1;

      InquiryRecordApi.getInquiryRecordList(this.queryParam)
        .then(res => {
          if (res.Code === 0) {
            this.queryList.push(...res.Body);
            if (res.Body.length !== this.queryParam.limit) {
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
     * 刷新
     */
    onRefresh() {
      this.queryList = [];
      this.finished = false;
      this.loading = true;
      this.getqueryListData();
    },
    /**
     * 进入咨询
     */
    handelConsult(data) {
      this.$router.push({
        path: "/user/interrogation-consult",
        query: {
          status: data.ConsultStatus,
          inquiry_record_id: data.InquiryRecordID
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"interrogation-manage";
.@{inner-prefix} {
  background: #f8f8f8;
  height: 100%;
  &-tabs {
    margin-top: 2px;
  }
  &-body {
    padding: 5px 2px;
    height: calc(100% - 105px);
    overflow: scroll;
    .inquiry-panel {
      margin-bottom: 5px;
      padding: 21px 15px 19px 16px;
      .top {
        display: flex;
        flex-direction: row;
        align-items: center;
        .info {
          margin-left: 15px;
          width: 80%;
          .name {
            display: flex;
            justify-content: space-between;
            font-size: 17px;
            color: #333333;
            .time {
              font-size: 14px;
              color: #999999;
            }
          }
          .bottom {
            font-size: 14px;
            color: #999999;
            line-height: 23px;
            margin-top: 8px;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
}
</style>
