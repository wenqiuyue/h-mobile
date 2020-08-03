<template>
  <div :class="classRoot">
    <nav-bar :title="'课程管理'"></nav-bar>
    <!-- <van-search
      v-model="searchValue"
      show-action
      shape="round"
      placeholder="搜索课程名称"
      @search="onSearch"
    >
      <template #action>
        <div>
          <van-dropdown-menu>
            <van-dropdown-item v-model="value1" :options="option1" />
          </van-dropdown-menu>
        </div>
      </template>
    </van-search> -->
    <van-pull-refresh
      v-model="refreshing"
      :class="`${classRoot}-body`"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        :error="error"
        finished-text="没有更多了"
        @load="getCourseData"
      >
        <div v-if="courseList && courseList.length">
          <van-panel
            class="list-panel"
            v-for="(item, index) in courseList"
            :key="index"
            :style="
              index % 2 === 0 ? 'background: #ecfaf8' : 'background: #F1FBFF'
            "
            @click="handelCourseInfo(item.CourseInfoID)"
          >
            <template #header>
              <div class="date">
                <label>
                  {{
                    `${item.ClassDataDate} ${item.ClassBeginTimeStr}-${item.ClassEndTimeStr}`
                  }}
                </label>
                <label>{{ item.ClassDataWeek }}</label>
              </div>
              <div class="title">
                {{ item.Title }}
              </div>
              <div class="number">
                <label
                  >报名人数：{{
                    item.SignUpCount ? item.SignUpCount : 0
                  }}人</label
                >
                <label
                  >签到人数：{{
                    item.SignInCount ? item.SignInCount : 0
                  }}人</label
                >
              </div>
            </template>
          </van-panel>
        </div>
        <van-empty
          v-else-if="!loading"
          description="这里好冷清，没有任何课程"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import * as CourseInfoApi from "../../../apis/CourseInfoApi";
export default {
  name: "course-list",
  data() {
    return {
      searchValue: null,
      value1: 0,
      option1: [
        { text: "筛选", value: 0 },
        { text: "新款商品", value: 1 },
        { text: "活动商品", value: 2 }
      ],
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      courseList: [], //课程管理数据
      courseParam: {
        Keyword: null,
        page: 0,
        limit: 10
      },
      day: ["一", "二", "三", "四", "五", "六", "日"]
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    }
  },
  created() {},
  methods: {
    /**
     * 刷新
     */
    onRefresh() {
      this.courseList = [];
      this.finished = false;
      this.loading = true;
      this.getCourseData();
    },
    /**
     * 获取课程管理数据
     */
    getCourseData() {
      if (this.refreshing) {
        this.courseList = [];
        this.refreshing = false;
      }
      this.courseParam.page =
        Math.floor(this.courseList.length / this.courseParam.limit) + 1;
      CourseInfoApi.getCourseManage(this.courseParam)
        .then(res => {
          if (res.Code === 0) {
            this.courseList.push(...res.Body);
            if (res.Body.length !== this.courseParam.limit) {
              this.finished = true;
            }
          } else {
            this.error = true;
          }
        })
        .catch(() => {
          this.finished = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /**
     * 查看课程详情
     */
    handelCourseInfo(courseinfoid) {
      this.$router.push({
        path: "/home/course-info",
        query: {
          course_info_id: courseinfoid
        }
      });
    },
    // eslint-disable-next-line no-unused-vars
    onSearch(val) {
      // console.log(val);
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"course-list";
.@{inner-prefix} {
  height: 100%;
  [class*="van-hairline"]::after {
    border: 0px;
  }
  &-body {
    padding: 3px 10px;
    height: calc(100% - 125px);
    overflow: scroll;
    .list-panel {
      border-radius: 10px;
      margin-bottom: 16px;
      padding: 15px 13px 20px 16px;
      .date {
        font-size: 14px;
        color: #999999;
        display: flex;
        justify-content: space-between;
      }
      .title {
        font-size: 17px;
        color: #000000;
        padding-left: 5px;
        margin-top: 12px;
      }
      .number {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: #666666;
        margin-top: 19px;
      }
    }
  }
}
</style>
