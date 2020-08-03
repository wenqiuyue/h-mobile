<template>
  <div :class="classRoot">
    <nav-bar :title="'修改密码'"></nav-bar>
    <div :class="`${classRoot}-body`">
      <van-panel>
        <template #header>
          <div class="panel_header">
            <div class="title">修改登录密码</div>
            <ValidationObserver ref="form">
              <div class="set-input">
                <ValidationProvider
                  rules="required|phone"
                  name="手机号"
                  v-slot="{ errors }"
                >
                  <van-field
                    readonly
                    v-model="param.Phone"
                    placeholder="请输入手机号"
                    type="tel"
                    :error-message="errors.join('')"
                  >
                  </van-field>
                </ValidationProvider>
                <ValidationProvider
                  rules="required"
                  name="当前密码"
                  v-slot="{ errors }"
                >
                  <van-field
                    v-model="param.Password"
                    placeholder="请输入当前密码"
                    type="password"
                    :error-message="errors.join('')"
                  >
                  </van-field>
                </ValidationProvider>
                <ValidationProvider
                  rules="required"
                  name="新密码"
                  v-slot="{ errors }"
                >
                  <van-field
                    v-model="param.newPassword"
                    placeholder="请输入新密码"
                    type="password"
                    :error-message="errors.join('')"
                  >
                  </van-field>
                </ValidationProvider>
                <ValidationProvider
                  rules="required|length:4"
                  name="短信验证码"
                  v-slot="{ errors }"
                >
                  <van-field
                    v-model="param.Code"
                    placeholder="请输入验证码"
                    :error-message="errors.join('')"
                  >
                    <template #button>
                      <van-button
                        size="small"
                        color="#1FD0A2"
                        :disabled="
                          !param.Phone || !param.Password || !param.newPassword
                        "
                        @click="handleSendSMS"
                        ><span v-show="!smsInterval">发送验证码</span>
                        <span v-show="smsInterval">{{
                          smsCount
                        }}</span></van-button
                      >
                    </template>
                  </van-field>
                </ValidationProvider>
              </div>
              <div class="set-button">
                <van-button type="primary" @click="handleSet"
                  >确认修改密码</van-button
                >
              </div>
            </ValidationObserver>
          </div>
        </template>
      </van-panel>
    </div>
  </div>
</template>
<script>
import { Dialog } from "vant";
import * as SMSApi from "../../apis/SMSApi";
import * as UserApi from "../../apis/UserApi";
export default {
  name: "set-password",
  data() {
    return {
      checking: null,
      smsInterval: null,
      smsCount: 0,
      param: {
        Phone: null,
        Password: null,
        NewPassword: null,
        Code: null // 短信验证码
      }
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    }
  },
  created() {
    this.getDoctorPhone();
  },
  methods: {
    /**
     * 获取医生电话
     */
    getDoctorPhone() {
      this.$toast.loading("加载中...");
      UserApi.getDoctorInfo()
        .then(res => {
          if (res.Code === 0) {
            this.param.Phone = res.Body.Phone;
          }
        })
        .finally(this.$toast.clear);
    },
    /**
     * 修改密码
     */
    handleSet() {
      this.$refs.form.validate().then(result => {
        if (result) {
          UserApi.changePassword(this.param).then(res => {
            if (res.Code === 0) {
              this.$toast.success("修改密码成功");
              this.$store.dispatch("logout");
              this.$router.push({
                path: "/login"
              });
            } else {
              this.$toast.fail(res.Message);
            }
          });
        }
      });
    },
    /**
     * 初始化定时器
     */
    initInterval() {
      clearInterval(this.smsInterval);
      this.smsCount = 0;
      this.smsInterval = null;
    },
    /**
     * 开始定时器
     */
    startInterval() {
      this.initInterval();
      this.smsCount = 60;
      this.smsInterval = setInterval(() => {
        this.smsCount -= 1;
        if (this.smsCount <= 0) {
          this.initInterval();
        }
      }, 1000);
    },
    /**
     * 发送短信验证码
     */
    handleSendSMS() {
      this.$toast.loading("发送中...");
      SMSApi.smsSend()
        .then(response => {
          if (response.Code === 0 && response.Body) {
            this.startInterval();
            this.$toast.success(response.Message);
          } else {
            Dialog.alert({
              title: "系统提示",
              message: response.Message
            });
          }
        })
        .finally(this.$toast.clear);
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"set-password";
.@{inner-prefix} {
  background: #f8f8f8;
  height: 100%;
  &-body {
    padding: 0 5px;
    height: calc(100% - 46px);
    overflow: scroll;
    .panel_header {
      margin-top: 10px;
      padding: 19px 20px 67px 20px;
      .title {
        font-size: 16px;
        color: #333333;
        padding-left: 20px;
      }
      .set-input {
        margin-top: 25px;
        .van-field {
          background: #f6f6f6;
          border-radius: 6px;
          margin-bottom: 10px;
          padding: 13px 16px;
        }
      }
      .set-button {
        margin-top: 42px;

        .van-button {
          width: 100%;
          background: rgba(31, 208, 162, 1);
          box-shadow: 1px 5px 10px rgba(199, 238, 235, 1);
          font-size: 16px;
        }
      }
      .captcha {
        vertical-align: middle;
        height: 35px;
      }
    }
  }
}
</style>
