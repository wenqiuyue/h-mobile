<template>
  <div :class="classRoot">
    <div class="item_single">
      <span class="star_span">
        <svg-icon :value="icon" :size="4" />
        <label class="number" :style="`color: ${numberColor}`">{{
          number
        }}</label>
      </span>
      <span class="item_title">{{ itemTitle }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "star",
  props: {
    itemTitle: { type: String, default: null },
    number: { type: Number, default: null },
    numberColor: { type: String, default: null },
    icon: { type: String, default: "icon-grayFlowerBG" }
  },
  computed: {
    classRoot() {
      return this.$options.name;
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"star";
.@{inner-prefix} {
  .item_single {
    display: flex;
    flex-direction: column;
    margin-right: 22px;
    align-items: center;
    .star_span {
      position: relative;
      .number {
        position: absolute;
        font-size: 22px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .item_title {
      font-size: 14px;
      color: #666666;
      margin-top: 5px;
    }
  }
}
</style>
