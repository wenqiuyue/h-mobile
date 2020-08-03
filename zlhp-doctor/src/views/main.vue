<template>
  <div>
    <router-view id="container" />
    <van-tabbar
      v-model="active"
      @change="onChange"
      active-color="#666666"
      inactive-color="#666666"
    >
      <van-tabbar-item name="home" to="/">
        <span>首页</span>
        <template #icon="props">
          <svg-icon :value="props.active ? icon[0].active : icon[0].inactive" />
        </template>
      </van-tabbar-item>
<!--      <van-tabbar-item name="message" to="message">-->
<!--        <span>消息</span>-->
<!--        <template #icon="props">-->
<!--          <svg-icon :value="props.active ? icon[1].active : icon[1].inactive" />-->
<!--        </template>-->
<!--      </van-tabbar-item>-->
<!--      <van-tabbar-item name="consult" to="consult">-->
<!--        <span>咨询</span>-->
<!--        <template #icon="props">-->
<!--          <svg-icon :value="props.active ? icon[2].active : icon[2].inactive" />-->
<!--        </template>-->
<!--      </van-tabbar-item>-->
      <van-tabbar-item name="user" to="user">
        <span>我的</span>
        <template #icon="props">
          <svg-icon :value="props.active ? icon[3].active : icon[3].inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      icon: [
        {
          active: "icon-doctor_fillHome",
          inactive: "icon-doctor_Home"
        },
        {
          active: "icon-doctor_fillNotice",
          inactive: "icon-doctor_Notice"
        },
        {
          active: "icon-doctor_fillConsultation",
          inactive: "icon-doctor_Consultation"
        },
        {
          active: "icon-doctor_fillMy",
          inactive: "icon-doctor_My"
        }
      ]
    };
  },
  mounted() {
    const path = this.$route.path.split("/");
    const curr = path.filter(m => m)[0];
    this.onChange(curr);
  },
  methods: {
    onChange(active) {
      this.active = active;
    }
  }
};
</script>

<style lang="less" scoped>
#container {
  padding-bottom: 50px;
}
</style>
