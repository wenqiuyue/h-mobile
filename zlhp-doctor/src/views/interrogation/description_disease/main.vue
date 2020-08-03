<template>
  <div :class="classRoot">
    <nav-bar :title="'病情描述'"></nav-bar>
    <div :class="`${classRoot}-body`">
      <div class="description-illness">
        <div class="title">
          病情描述
        </div>
        <div class="text">
          {{ descriptionIllness ? descriptionIllness : "暂无描述" }}
        </div>
      </div>
      <van-panel class="description-illness">
        <template #header>
          <div class="title">
            病情照片
          </div>
          <div class="pic">
            <van-grid :border="false" :column-num="3">
              <van-grid-item v-for="(img, index) in fileList" :key="index">
                <van-image fit="cover" :src="img" @click="browsePic(index)" />
              </van-grid-item>
            </van-grid>
            <label v-if="fileList.length === 0">没有上传病情照片</label>
          </div>
        </template>
      </van-panel>
    </div>
  </div>
</template>
<script>
import { ImagePreview } from "vant";
import * as InquiryRecordApi from "../../../apis/InquiryRecordApi";

export default {
  name: "description_disease",
  data() {
    return {
      descriptionIllness: null, // 病情描述
      fileList: [] // 上传的病情照片
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    }
  },
  created() {
    this.getInquiryRecordData();
  },
  methods: {
    /**
     * 获取图文问诊内容
     */
    getInquiryRecordData() {
      this.$toast.loading("加载中");
      InquiryRecordApi.getInquiryRecordById(this.$route.query.inquiry_record_id)
        .then(res => {
          if (res.Code === 0) {
            if (res.Body.Images) {
              this.fileList = res.Body.Images.split("|").map(s => {
                return s;
              });
            }
            this.descriptionIllness = res.Body.Content;
          } else {
            this.$toast.fail(res.Message);
          }
        })
        .finally(this.$toast.clear);
    },
    /**
     * 浏览图片
     */
    browsePic(index) {
      ImagePreview({
        images: this.fileList,
        startPosition: index,
        closeable: true
      });
    }
  }
};
</script>
<style lang="less">
@inner-prefix: ~"description_disease";
.@{inner-prefix} {
  background: #f8f8f8;
  height: 100%;
  &-body {
    padding-top: 5px;
    padding-bottom: 25px;
    height: calc(100% - 78px);
    overflow: scroll;
    .description-illness {
      background: #ffffff;
      margin-top: 5px;
      padding: 15px 21px 15px 21px;
      .title {
        color: #000000;
      }
      .text {
        margin-top: 5px;
        font-size: 14px;
        padding: 10px 0;
        line-height: 25px;
        color: #666666;
      }
      .pic {
        margin-top: 20px;
        .van-grid-item__content {
          padding: 8px;
          .van-image {
            height: 80px;
            width: 80px;
          }
        }
        label {
          font-size: 12px;
          color: #999999;
        }
      }
    }
  }
}
</style>
