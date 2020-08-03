<template>
  <div :class="classRoot">
    <svg-icon :value="icon" :size="size" />
    <h3 v-if="message" :style="{ color: color }">
      {{ message }}
    </h3>
    <p v-if="intro">{{ intro }}</p>
  </div>
</template>
<script>
export default {
  name: "hint",
  props: {
    icon: { type: String, default: "icon-doctor_Bell" },
    message: { type: String, default: "无数据" },
    color: { type: String, default: null },
    intro: { type: String, default: null },
    size: { type: Number, default: 7.5 }
  },
  computed: {
    classRoot() {
      return this.$options.name;
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"hint";
.@{inner-prefix} {
  text-align: center;
  padding: 20px 0;
  h3 {
    color: #333333;
  }
  p {
    color: #333333;
    margin-bottom: unset;
  }
}
</style>
