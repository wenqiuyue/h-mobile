<template>
  <div :class="classRoot">
    <van-nav-bar left-arrow>
      <template #left>
        <svg-icon value="icon-doctor_backwardArrow" :size="1.2" />
      </template>
    </van-nav-bar>
    <div :class="`${classRoot}-body`">
      <div class="main">
        <div class="login-input">
          <van-field
            v-model="phone"
            left-icon="icon-doctor_backwardArrow"
            placeholder="请输入手机号"
          >
            <template #left-icon>
              <div class="icon-left">
                <svg-icon value="icon-doctor_loginPhone" :size="1.2" />
              </div>
            </template>
          </van-field>
          <van-field
            v-model="password"
            left-icon="music-o"
            placeholder="请输入密码"
          >
            <template #left-icon>
              <div class="icon-left">
                <svg-icon value="icon-doctor_loginPassword" :size="1.2" />
              </div>
            </template>
          </van-field>
        </div>
        <div class="register-button">
          <van-button type="primary">注册</van-button>
        </div>
        <div class="other-register">
          <div class="mode">
            <svg-icon value="icon-doctor_loginWeChat" :size="3" />
          </div>
        </div>
        <div class="number">已有账号？</div>
      </div>
      <div class="login-bottom">去登陆</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "register",
  data() {
    return {
      phone: null, //手机号
      password: null, //密码
      checked: false //是否同意用户协议
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"register";
.@{inner-prefix} {
  height: 100%;
  &-body {
    height: calc(100% - 46px);
    overflow: scroll;
    .main {
      padding: 0 25px;
      .login-input {
        margin-top: 130px;
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
      .register-button {
        margin-top: 80px;
        padding-left: 10px;
        .van-button {
          width: 100%;
          background: rgba(31, 208, 162, 1);
          box-shadow: 1px 5px 10px rgba(199, 238, 235, 1);
          font-size: 16px;
        }
      }
      .other-register {
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
      .number {
        margin-top: 50px;
        text-align: center;
        font-size: 12px;
        color: #82d2b7;
      }
    }

    .login-bottom {
      background: rgba(31, 208, 162, 0.17);
      font-size: 12px;
      color: #82d2b7;
      text-align: center;
      padding: 16px 0;
      margin-top: 31px;
    }
  }
}
</style>
