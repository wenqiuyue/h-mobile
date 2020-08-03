<template>
  <div :class="classRoot">
    <nav-bar :title="'设置'"></nav-bar>
    <van-panel :class="`${classRoot}-option-panel`">
      <template #header>
        <div class="profit">
          <router-link
            tag="div"
            :to="{ path: '/user/set-password' }"
            class="profit-array"
          >
            <span class="title">修改密码</span>
            <svg-icon value="icon-doctor_thickReturn" :size="0.8" />
          </router-link>
        </div>
      </template>
    </van-panel>
    <div :class="`${classRoot}-button`">
      <van-button type="primary" native-type="submit" @click="handleLoginOut"
        >退出当前账号</van-button
      >
    </div>
  </div>
</template>
<script>
import * as AccountApi from "../../apis/AccountApi";
export default {
  name: "setting",
  computed: {
    classRoot() {
      return this.$options.name;
    }
  },
  methods: {
    /**
     * 退出当前账号
     */
    handleLoginOut() {
      AccountApi.logout().then(res => {
        if (res.Code === 0) {
          this.$store.dispatch("logout");
          this.$router.push({
            path: "/login"
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"setting";
.@{inner-prefix} {
  background: #f8f8f8;
  height: 100%;
  &-option-panel {
    margin-top: 10px;
    .profit {
      padding: 18px 16px;
      .profit-array {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          font-size: 14px;
          color: #333333;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  &-button {
    margin-top: 100px;
    padding: 0 25px;
    .van-button {
      width: 100%;
      background: rgba(31, 208, 162, 1);
      box-shadow: 1px 5px 10px rgba(199, 238, 235, 1);
      font-size: 16px;
    }
  }
}
</style>
