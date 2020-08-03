<template>
  <div :class="classRoot">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      @click-right="clickRight"
    >
      <template #left>
        <van-icon name="arrow-left" size="18" color="#888888" />
        <span :class="`${classRoot}-title`">{{ title }}</span>
      </template>
      <template #right>
        <span :class="`${classRoot}-title`">{{ rightTitle }}</span>
      </template>
    </van-nav-bar>
  </div>
</template>
<script>
export default {
  name: "nav-bar",
  computed: {
    classRoot() {
      return this.$options.name;
    }
  },
  props: {
    title: { type: String, default: null },
    rightTitle: { type: String, default: null }
  },
  methods: {
    clickRight() {
      this.$emit("onClickRight");
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"nav-bar";
.@{inner-prefix} {
  &-title {
    color: #333333;
    font-size: 17px;
    margin-left: 10px;
  }
}
</style>
