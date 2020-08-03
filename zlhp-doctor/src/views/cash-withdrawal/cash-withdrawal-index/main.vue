<template>
  <div :class="classRoot" v-if="walletsData">
    <div :class="`${classRoot}-top`">
      <van-image
        fit="cover"
        :src="require('../../../assets/bg_Cashwithdrawal.png')"
      />
      <nav-bar
        class="bar"
        :title="'提现'"
        :rightTitle="'明细'"
        @onClickRight="handelDetailed"
      ></nav-bar>
      <div class="money">
        <span class="money_content">{{ walletsData.Balance.toFixed(2) }}</span>
        <span class="title">可提现余额(元)</span>
      </div>
    </div>
    <div :class="`${classRoot}-cash-button`">
      <van-button type="primary" @click="handleCash">提现到微信</van-button>
    </div>
    <div :class="`${classRoot}-cash-tips`">提现后24小时内到账</div>
  </div>
</template>
<script>
import * as WalletsApi from "../../../apis/WalletsApi";
export default {
  name: "cash-withdrawal-index",
  data() {
    return {
      walletsData: null //钱包数据
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
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
     * 查看收入明细
     */
    handelDetailed() {
      this.$router.push({
        path: "/user/detailed"
      });
    },
    /**
     * 提现到微信
     */
    handleCash() {
      //如果绑定了微信，则提现，否则先去绑定微信
      if (this.walletsData.User.OpenId) {
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
@inner-prefix: ~"cash-withdrawal-index";
.@{inner-prefix} {
  background: #f8f8f8;
  height: 100%;
  &-top {
    height: 220px;
    .van-image {
      height: 220px;
      img {
        border-radius: 0 0 8px 8px;
      }
    }
    .bar {
      position: relative;
      top: -220px;
      .van-nav-bar {
        background: none;
      }
      .van-nav-bar::after {
        border: none;
      }
    }
    .money {
      position: relative;
      top: -195px;
      span {
        text-align: center;
        display: block;
      }
      .money_content {
        font-size: 30px;
        color: #000000;
      }
      .title {
        font-size: 14px;
        color: #555555;
        margin-top: 25px;
      }
    }
  }
  &-cash-button {
    margin-top: 29px;
    text-align: center;
    .van-button {
      width: 85%;
      background: rgba(31, 208, 162, 1);
      box-shadow: 1px 5px 10px rgba(199, 238, 235, 1);
      font-size: 16px;
    }
  }
  &-cash-tips {
    text-align: center;
    margin-top: 22px;
    font-size: 13px;
    color: #888888;
  }
}
</style>
