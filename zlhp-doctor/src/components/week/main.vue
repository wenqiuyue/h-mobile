<template>
  <div :class="classRoot"></div>
</template>
<script>
export default {
  name: "week",
  computed: {
    classRoot() {
      return this.$options.name;
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"week";
.@{inner-prefix} {
}
</style>
