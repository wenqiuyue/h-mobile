<template>
  <svg
    :class="customClass"
    aria-hidden="true"
    :style="{ height: `${size}rem`, width: `${size}rem` }"
    @click="$emit('click')"
  >
    <use :xlink:href="`#${value}`" />
  </svg>
</template>
<script>
export default {
  name: "svg-icon",
  props: {
    value: { type: String, default: null },
    size: { type: Number, default: 1 },
    customClass: {
      type: String,
      default: `${process.env.VUE_APP_PREFIX}-svg-icon`
    },
    color: { type: [Array, String], default: null }
  },
  created() {}
};
</script>

<style lang="less" scoped>
@inner-prefix: ~"svg-icon";

/*Symbol iconfont 彩色图标*/
.@{inner-prefix} {
  fill: currentColor;
  overflow: hidden;
}
</style>
