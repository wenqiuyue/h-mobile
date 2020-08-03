<template>
  <div :class="classRoot">
    <van-nav-bar left-arrow>
      <template #left>
        <svg-icon value="icon-doctor_backwardArrow" :size="1.2" />
      </template>
    </van-nav-bar>
    <div :class="`${classRoot}-body`">
      <div class="login-svg">
        <svg-icon value="icon-user2" :size="6" />
      </div>
      <van-form @submit="login">
        <div class="login-input">
          <van-field
            v-model="loginParam.Phone"
            left-icon="icon-doctor_backwardArrow"
            placeholder="请输入手机号"
            type="tel"
            :rules="[{ required: true, message: '请输入手机号' }]"
          >
            <template #left-icon>
              <div class="icon-left">
                <svg-icon value="icon-doctor_loginPhone" :size="1.2" />
              </div>
            </template>
          </van-field>
          <van-field
            v-model="loginParam.Password"
            left-icon="music-o"
            placeholder="请输入密码"
            type="password"
            :rules="[{ required: true, message: '请输入密码' }]"
          >
            <template #left-icon>
              <div class="icon-left">
                <svg-icon value="icon-doctor_loginPassword" :size="1.2" />
              </div>
            </template>
          </van-field>
          <div class="agreement">
            <van-checkbox
              v-model="checked"
              checked-color="#56DCBC"
              icon-size="15px"
            ></van-checkbox>
            <label>点击登录即同意 “用户协议”</label>
          </div>
        </div>
        <div class="login-button">
          <van-button type="primary" native-type="submit">登录</van-button>
        </div>
        <div class="other-login">
          <label>其他登录方式</label>
          <div class="mode">
            <svg-icon
              value="icon-doctor_loginWeChat"
              :size="3"
              @click="weiXinLogin"
            />
          </div>
        </div>
      </van-form>
    </div>
  </div>
</template>
<script>
import * as AccountApi from "../../apis/AccountApi";
import { Login } from "../../commons/weixin";
export default {
  name: "login",
  data() {
    return {
      checked: false, //是否同意用户协议
      loginParam: {
        Password: null, //登录密码
        Phone: null //登录手机号
      }
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    },
    token() {
      return this.$route.query.token;
    }
  },
  created() {
    this.handleCheckToken();
  },
  methods: {
    /**
     * 登录
     */
    login() {
      if (this.checked) {
        this.$toast.loading("正在登录...");
        AccountApi.doctorLogin(this.loginParam)
          .then(res => {
            if (res.Code === 0) {
              this.$toast.success("登录成功");
              this.$store.dispatch("login", res.Body);
              this.$router.push({
                path: "/home"
              });
            } else {
              this.$toast.fail(res.Message);
            }
          })
          .finally(this.$toast.clear);
      } else {
        this.$dialog.alert({
          title: "标题",
          message: "请先同意用户协议"
        });
      }
    },
    /**
     * 验证Token
     */
    handleCheckToken() {
      if (this.token) {
        this.$store.dispatch("login", this.token).then(
          this.$router.push({
            path: "/home"
          })
        );
      }
    },
    /**
     * 微信登录
     */
    weiXinLogin() {
      Login();
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"login";
.@{inner-prefix} {
  height: 100%;
  &-body {
    height: calc(100% - 115px);
    overflow: scroll;
    padding: 0 25px 68px 15px;
    .login-svg {
      text-align: center;
      padding: 50px 0;
    }
    .login-input {
      .van-cell {
        margin-bottom: 35px;
      }
      .icon-left {
        margin-right: 13px;
      }
      .agreement {
        padding-left: 15px;
        display: flex;
        align-items: center;
        label {
          font-size: 12px;
          color: #666666;
          margin-left: 7px;
        }
      }
    }
    .login-button {
      margin-top: 80px;
      padding-left: 10px;
      .van-button {
        width: 100%;
        background: rgba(31, 208, 162, 1);
        box-shadow: 1px 5px 10px rgba(199, 238, 235, 1);
        font-size: 16px;
      }
    }
    .other-login {
      text-align: center;
      margin-top: 50px;
      label {
        font-size: 12px;
        color: #666666;
      }
      .mode {
        margin-top: 25px;
      }
    }
  }
}
</style>
