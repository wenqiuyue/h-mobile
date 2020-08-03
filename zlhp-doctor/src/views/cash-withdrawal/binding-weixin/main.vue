<template>
  <div :class="classRoot" v-if="bindingInfo">
    <van-nav-bar left-arrow @click-left="$router.push({ path: '/user' })">
      <template #left>
        <van-icon name="arrow-left" size="18" color="#888888" />
        <span :class="`${classRoot}-bar`">绑定微信</span>
      </template>
    </van-nav-bar>
    <div :class="`${classRoot}-title`">
      {{ bindingInfo.OpenId ? "已绑定微信" : "还未绑定微信" }}
    </div>
    <span class="title" v-if="bindingInfo.OpenId">
      <van-image
        round
        width="36px"
        height="36px"
        fit="cover"
        :src="bindingInfo.UserImage"
      /><label>{{ bindingInfo.LoginName }}</label></span
    >
    <div class="cash-button" v-else>
      <van-button type="primary" native-type="submit" @click="authHandler"
        >微信绑定</van-button
      >
    </div>
  </div>
</template>
<script>
import { Auth } from "../../../commons/weixin";
import { mapState } from "vuex";
import * as UserApi from "../../../apis/UserApi";
export default {
  name: "binding-weixin",
  data() {
    return {
      bindingInfo: null
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    },
    ...mapState({
      token: state => state.token
    })
  },
  created() {
    this.getBindingDoctorInfo();
  },
  methods: {
    /**
     * 微信绑定
     */
    authHandler() {
      Auth(this.token, "/user/binding-weixin");
    },
    /**
     * 绑定微信信息
     */
    getBindingDoctorInfo() {
      this.$toast.loading("加载中。。。");
      UserApi.getDoctorInfo()
        .then(res => {
          if (res.Code === 0) {
            this.bindingInfo = res.Body;
          } else {
            this.$toast.fail(res.Message);
          }
        })
        .finally(this.$toast.clear);
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"binding-weixin";
.@{inner-prefix} {
  background: #f9f9f9;
  height: 100%;
  &-bar {
    color: #333333;
    font-size: 17px;
    margin-left: 10px;
  }
  &-title {
    padding: 22px 20px;
    color: #999999;
  }

  .title {
    padding: 18px 16px;
    background: #ffffff;
    font-size: 17px;
    color: #333333;
    display: flex;
    align-items: center;
    label {
      margin-left: 12px;
    }
  }
  .cash-button {
    margin-top: 20px;
    padding: 0 10px;
    .van-button {
      width: 100%;
      background: rgba(31, 208, 162, 1);
      box-shadow: 1px 5px 10px rgba(199, 238, 235, 1);
      font-size: 16px;
    }
  }
}
</style>
