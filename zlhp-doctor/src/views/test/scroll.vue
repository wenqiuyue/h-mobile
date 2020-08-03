<template>
  <div class="container">
    <van-nav-bar title="标题" left-text="返回" right-text="按钮" left-arrow />
    <div class="content" ref="content">
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        :offset="0"
        finished-text="没有更多了"
        direction="up"
        @load="onLoad"
      >
        <van-cell
          v-for="item in list"
          :key="item"
          :title="item"
          style="height: 100px"
        />
      </van-list>
    </div>
  </div>
</template>

<script>
export default {
  name: "scroll",
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      beforeScroll: {
        top: 0,
        height: 0,
        left: 0,
        width: 0
      }
    };
  },
  created() {
    this.onLoad(true);
  },
  methods: {
    onLoad(init = false) {
      if (!init) this.recordScrollPosition();

      this.$nextTick(() => {
        setTimeout(() => {
          if (this.refreshing) {
            this.list = [];
            this.refreshing = false;
          }

          for (let i = 0; i < 10; i++) {
            this.list.unshift(this.list.length + 1);
          }

          // 界面加载完成后执行，防止元素未渲染完导致滚动条位置错误
          this.$nextTick(() => {
            this.scrollToTop(init).then(() => {
              this.loading = false;
              if (this.list.length >= 40) {
                this.finished = true;
              }
            });
          });
        }, 1000);
      });
    },
    /**
     * 滚动到
     * @param init
     */
    scrollToTop(init) {
      let distance = this.$refs.content.scrollHeight;
      if (!init) distance = this.getBeforeScrollPosition();
      return new Promise(resolve => {
        this.$refs.content.scroll({
          top: distance
        });
        // 列表完成滚动后回调，防止二次触发置顶刷新
        this.$nextTick(resolve);
      });
    },
    /**
     * 记录当前滚动条位置
     */
    recordScrollPosition() {
      // 此处加入 this.$nextTick 是为了防止下拉刷新时出现的提示块消失后会出现列表抖动的问题
      this.$nextTick(() => {
        this.beforeScroll.top = this.$refs.content.scrollTop;
        this.beforeScroll.height = this.$refs.content.scrollHeight;
        this.beforeScroll.left = this.$refs.content.scrollLeft;
        this.beforeScroll.width = this.$refs.content.scrollWidth;
      });
    },
    /**
     * 获取之前滚动条位置
     * @returns {number}
     */
    getBeforeScrollPosition() {
      const height = this.$refs.content.scrollHeight;
      return height - this.beforeScroll.height;
    }
  }
};
</script>

<style scoped lang="less">
.container {
  height: 100%;
  .content {
    height: calc(100% - 46px);
    overflow: auto;
  }
}
</style>
