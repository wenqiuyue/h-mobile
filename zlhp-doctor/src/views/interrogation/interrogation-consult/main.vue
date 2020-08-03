<template>
  <div :class="classRoot" v-if="inquiryRecordByIdData">
    <nav-bar
      :title="
        inquiryRecordByIdData.CUser.UserName ||
          inquiryRecordByIdData.CUser.LoginName
      "
      :rightTitle="
        status == 2
          ? '结束诊疗'
          : inquiryRecordByIdData.ConsultType === 0
          ? '查看病情描述'
          : ''
      "
      @onClickRight="handleEnd"
    ></nav-bar>
    <div :class="`${classRoot}-choice`" v-if="this.status == 1">
      <div @click="option = 0" class="cho">
        <svg-icon value="icon-doctor_Refuse" :size="1.3" /><label
          class="text"
          style="color:#888888"
          >拒绝</label
        >
      </div>
      <div class="line"></div>
      <div @click="option = 1" class="cho">
        <svg-icon value="icon-doctor_Accept" :size="1.3" /><label
          class="text"
          style="color:#1FD0A2"
          >接诊</label
        >
      </div>
    </div>
    <van-panel v-else-if="this.status === 2 || this.status === '2'">
      <template #header>
        <div :class="`${classRoot}-inquiry-status`" v-if="connectionSuccess">
          <span class="status"
            ><svg-icon value="icon-doctor_Complete" :size="1.1" />问诊中</span
          >
          <span
            class="disease"
            v-if="inquiryRecordByIdData.ConsultType === 0"
            @click="handleDisease"
          >
            查看病情描述
          </span>
          <!-- <span class="time">
            <van-count-down :time="24 * 60 * 60 * 1000" format="HH 时 mm 分" />
            <label>后问诊结束</label></span
          > -->
        </div>
        <div :class="`${classRoot}-inquiry-status`" v-else>
          <span class="status">连接服务器失败，请刷新</span>
          <span class="time" @click="consultConnection"
            ><van-icon name="replay" size="19px"
          /></span>
        </div>
      </template>
    </van-panel>
    <van-panel v-else>
      <template #header>
        <div :class="`${classRoot}-inquiry-status`">
          <span class="status">问诊已结束</span>
        </div>
      </template>
    </van-panel>
    <div :class="`${classRoot}-body`" ref="chat">
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        :offset="0"
        :error="error"
        finished-text="没有更多了"
        @load="getConsultListData"
        direction="up"
      >
        <div v-for="(item, index) in consultList" :key="index">
          <div class="time" v-if="index === 0">
            {{ new Date(item.CreateTime).format() }}
          </div>
          <div class="talk-left" v-if="item.ConsultUserType == 0">
            <van-image
              v-if="inquiryRecordByIdData.CUser.UserImage"
              round
              width="47px"
              height="47px"
              fit="cover"
              :src="inquiryRecordByIdData.CUser.UserImage"
            />
            <svg-icon v-else value="icon-user" :size="3" />
            <span class="talk-left-text"
              ><label v-if="item.ContentType === 0">{{ item.Content }}</label
              ><van-image
                class="msg_img"
                v-else
                fit="cover"
                :src="item.Content"
                @click="browsePic(item)"
              />
              <span class="triangle"></span>
            </span>
          </div>
          <div class="talk-right" v-else>
            <span class="talk-right-text"
              ><label v-if="item.ContentType === 0">{{ item.Content }}</label
              ><van-image
                class="msg_img"
                v-else
                fit="cover"
                :src="item.Content"
                @click="browsePic(item)"/>
              <span class="triangle"></span
            ></span>
            <van-image
              v-if="
                inquiryRecordByIdData.DUser.OnlineDoctor.MedicalStaff.Avatar
              "
              round
              width="47px"
              height="47px"
              fit="cover"
              :src="
                inquiryRecordByIdData.DUser.OnlineDoctor.MedicalStaff.Avatar
              "
            />
            <svg-icon v-else value="icon-doctorHead" :size="3" />
          </div>
        </div>
        <div v-for="(msg, index) in messages" :key="msg.InquiryConsultID">
          <div class="time" v-if="index === 0">
            {{ new Date(msg.CreateTime).format() }}
          </div>
          <div class="talk-left" v-if="msg.ConsultUserType == 0">
            <van-image
              v-if="inquiryRecordByIdData.CUser.UserImage"
              round
              width="47px"
              height="47px"
              fit="cover"
              :src="inquiryRecordByIdData.CUser.UserImage"
            />
            <svg-icon v-else value="icon-user" :size="3" />
            <span class="talk-left-text"
              ><label v-if="msg.ContentType === 0">{{ msg.Content }}</label
              ><van-image
                class="msg_img"
                v-else
                fit="cover"
                :src="msg.Content"
                @click="browsePic(item)"
              />
              <span class="triangle"></span>
            </span>
          </div>
          <div class="talk-right" v-else>
            <van-loading
              class="load"
              type="spinner"
              v-if="msg.msgStatus === 0"
              size="20px"
            />
            <span class="talk-right-text"
              ><label v-if="msg.ContentType === 0">{{ msg.Content }}</label
              ><van-image
                class="msg_img"
                v-else
                fit="cover"
                :src="msg.Content"
                @click="browsePic(item)"/>
              <span class="triangle"></span
            ></span>
            <van-image
              v-if="
                inquiryRecordByIdData.DUser.OnlineDoctor.MedicalStaff.Avatar
              "
              round
              width="47px"
              height="47px"
              fit="cover"
              :src="
                inquiryRecordByIdData.DUser.OnlineDoctor.MedicalStaff.Avatar
              "
            />
            <svg-icon v-else value="icon-doctorHead" :size="3" />
          </div>
        </div>
        <div class="tips" v-show="false">
          发送最近一次（孕12周）产检报告<label>立即发送</label>
        </div>
      </van-list>
    </div>
    <van-panel>
      <template #header>
        <div :class="`${classRoot}-send-out`">
          <van-uploader
            :after-read="uploadPic"
            :max-count="4"
            multiple
            :disabled="connectionSuccess ? false : true"
          >
            <van-icon name="photo-o" size="32px" color="#bbbbbb" />
          </van-uploader>
          <van-field v-model="sendOutValue" placeholder="请在这里输入问题" />
          <span v-if="sendOutValue && connectionSuccess" @click="SendMessage"
            >发送</span
          >
          <span v-else class="not_send">发送</span>
        </div>
      </template>
    </van-panel>
  </div>
</template>
<script>
import { Dialog, ImagePreview } from "vant";
import * as SignalR from "@aspnet/signalr";
import uuid from "uuid";
import { mapState } from "vuex";
import * as InquiryConsultsApi from "../../../apis/InquiryConsultsApi";
import * as InquiryRecordApi from "../../../apis/InquiryRecordApi";
import * as UploadApi from "../../../apis/UploadApi";
export default {
  name: "interrogation-consult",
  data() {
    return {
      option: null, //0 拒绝；1 接诊
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      consultList: [], //聊天记录
      sendOutValue: null, //发送的内容
      status: this.$route.query.status, //咨询状态
      ContentType: 0, // 0 文字 1图片
      connectionSuccess: false,
      errorMessage: null,
      uploadImage: [], // 发送的图片
      connection: null,
      inquiryRecordID: this.$route.query.inquiry_record_id,
      messages: [],
      paramData: {
        //聊天记录接口参数
        InquiryRecordID: null,
        InquiryConsultID: null,
        page: 0,
        limit: 10
      },
      inquiryRecordByIdData: null, //咨询者的问诊信息
      beforeScroll: {
        top: 0,
        height: 0,
        left: 0,
        width: 0
      }
    };
  },
  computed: {
    classRoot() {
      return this.$options.name;
    },
    ...mapState({
      token: state => state.token
    })
  },
  watch: {
    //监听是拒绝还是接诊
    option() {
      if (this.option === 1) {
        InquiryRecordApi.doctorReception(this.inquiryRecordID).then(res => {
          if (res.Code === 0) {
            this.consultConnection();
            this.status = 2;
          }
        });
      } else {
        this.$router.back();
      }
    },
    //监听是否是发送图片
    uploadImage() {
      if (this.uploadImage.length) {
        this.ContentType = 1;
        this.uploadImage.forEach(element => {
          this.SendMessage(element);
        });
      } else {
        this.ContentType = 0;
      }
    }
  },
  created() {
    this.getInquiryRecordByIdData();
    //如果是接诊中状态，则连接聊天服务器
    if (this.status === 2 || this.status === "2") {
      this.consultConnection();
    }
    this.getConsultListData(true);
  },
  beforeDestroy() {
    if (this.connection) {
      this.connection.stop();
    }
  },
  methods: {
    /**
     * 获取咨询者问诊信息
     */
    getInquiryRecordByIdData() {
      InquiryRecordApi.getInquiryRecordById(this.inquiryRecordID).then(res => {
        if (res.Code === 0) {
          this.inquiryRecordByIdData = res.Body;
        } else {
          this.$toast.fail(res.Message);
        }
      });
    },
    /**
     * 连接服务器
     */
    consultConnection() {
      if (!this.connection) {
        this.connection = new SignalR.HubConnectionBuilder()
          .withUrl(`${process.env.VUE_APP_CHAT_URL}/signalr/chatHub`, {
            accessTokenFactory: () => this.token
          })
          // .withAutomaticReconnect()
          .build();
        this.connection.on("ReceiveMessage", this.ReceiveMessage);
      }
      this.connection
        .start()
        .then(() => {
          this.connectionSuccess = true;
        })
        .catch(error => {
          this.errorMessage = error || "连接聊天服务器失败";
        });
    },
    /**
     * 发送消息
     */
    SendMessage(image) {
      const uid = uuid();
      const content = this.ContentType === 0 ? this.sendOutValue : image;
      this.sendOutValue = null;
      this.uploadImage = [];
      // 点击发送后，将发送的内容添加到显示的聊天数组
      // msgStatus: 0发送中，1发送成功，2发送失败
      const msg = {
        Content: content,
        guid: uid,
        msgStatus: 0,
        ContentType: this.ContentType,
        ConsultUserType: 1,
        CreateTime: new Date().format()
      };
      this.messages.push(msg);
      this.$nextTick(() => {
        this.scrollToTop(true);
      });
      if (this.connectionSuccess) {
        this.connection
          .invoke("SendMessage", {
            InquiryRecordID: this.inquiryRecordID,
            ContentType: this.ContentType,
            Content: content,
            GUID: uid
          })
          .catch(error => {
            this.errorMessage = error;
          });
      }
    },
    /**
     * 接收消息
     */
    ReceiveMessage(message) {
      console.log(message);
      const messageObj = JSON.parse(message);
      if (messageObj.InquiryRecordID === parseInt(this.inquiryRecordID)) {
        if (messageObj.ConsultUserType === 1) {
          this.messages = this.messages.map(s => {
            if (messageObj.GUID && s.guid === messageObj.GUID) {
              s.msgStatus = 1;
            }
            return s;
          });
        } else {
          this.messages.push(messageObj);
          this.$nextTick(() => {
            this.scrollToTop(true);
          });
        }
      }
    },
    /**
     * 上传图片
     */
    uploadPic(file) {
      if (this.connectionSuccess) {
        this.uploadImage = [];
        let files = [];
        // 多图上传
        if (file instanceof Array) {
          files = file.map(item => {
            return {
              content: item.content,
              name: item.file.name
            };
          });
        } else {
          files.push({
            content: file.content,
            name: file.file.name
          });
        }
        this.$toast.loading("上传中...");
        UploadApi.UploadImages(files)
          .then(data => {
            if (data.Code === 0) {
              Object.keys(data.Body).forEach(key => {
                this.uploadImage.push(data.Body[key]);
              });
            }
          })
          .finally(this.$toast.clear);
      }
    },
    /**
     * 获取问诊数据
     */
    getConsultListData(init = false) {
      if (!init) this.recordScrollPosition();
      const compare = function(property) {
        return function(a, b) {
          const value1 = a[property];
          const value2 = b[property];
          return value1 - value2;
        };
      };
      if (this.refreshing) {
        this.consultList = [];
        this.refreshing = false;
      }
      this.paramData.InquiryRecordID = this.inquiryRecordID;
      this.paramData.page =
        Math.floor(this.consultList.length / this.paramData.limit) + 1;
      InquiryConsultsApi.getInquiryConsultsList(this.paramData)
        .then(res => {
          if (res.Code === 0) {
            this.consultList.push(...res.Body);
            //将数组中的数据按InquiryConsultID倒序排列
            this.consultList.sort(compare("InquiryConsultID"));

            this.$nextTick(() => {
              this.scrollToTop(init).then(() => {
                this.loading = false;
                if (res.Body.length !== this.paramData.limit) {
                  this.finished = true;
                }
              });
            });
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
     * 滚动到
     * @param init
     */
    scrollToTop(init) {
      let distance = this.$refs.chat.scrollHeight;
      if (!init) distance = this.getBeforeScrollPosition();
      return new Promise(resolve => {
        this.$refs.chat.scroll({
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
        this.beforeScroll.top = this.$refs.chat.scrollTop;
        this.beforeScroll.height = this.$refs.chat.scrollHeight;
        this.beforeScroll.left = this.$refs.chat.scrollLeft;
        this.beforeScroll.width = this.$refs.chat.scrollWidth;
      });
    },
    /**
     * 获取之前滚动条位置
     * @returns {number}
     */
    getBeforeScrollPosition() {
      const height = this.$refs.chat.scrollHeight;
      return height - this.beforeScroll.height;
    },
    /**
     * 结束诊疗
     */
    handleEnd() {
      if (this.status === 2 || this.status === "2") {
        Dialog.confirm({
          title: "系统提示",
          message: "您要结束问诊吗"
        })
          .then(() => {
            this.$toast.loading("正在结束诊疗...");
            InquiryRecordApi.stopInquiryRecord(this.inquiryRecordID)
              .then(res => {
                if (res.Code === 0) {
                  this.$router.back();
                }
              })
              .finally(this.$toast.clear);
          })
          .catch(() => {
            this.$toast.fail("用户取消");
          });
      } else if (this.inquiryRecordByIdData.ConsultType === 0) {
        this.handleDisease();
      }
    },
    /**
     * 查看病情描述
     */
    handleDisease() {
      this.$router.push({
        path: "/user/description_disease",
        query: {
          inquiry_record_id: this.inquiryRecordID
        }
      });
    },
    /**
     * 浏览图片
     */
    browsePic(msg) {
      ImagePreview({
        images: [msg.Content],
        closeable: true
      });
    }
  }
};
</script>
<style lang="less" scoped>
@inner-prefix: ~"interrogation-consult";
.@{inner-prefix} {
  background: #f8f8f8;
  height: 100%;
  &-choice {
    margin-top: 2px;
    background: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 50px;
    font-size: 16px;
    padding: 0 25px;
    .cho {
      display: flex;
      align-items: center;
    }
    .text {
      margin-left: 8px;
    }
    .line {
      border: 0.5px solid #dddddd;
      background: #dddddd;
      height: 30px;
    }
  }
  &-inquiry-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    height: 52px;
    .status {
      color: #000000;
      display: flex;
      align-items: center;
      font-size: 14px;
      svg {
        margin-right: 5px;
      }
    }
    .time {
      color: #999999;
      font-size: 14px;
      display: flex;
      flex-direction: row;
      .van-count-down {
        color: #1fd0a2;
      }
    }
    .disease {
      color: #1fd0a2;
      font-size: 14px;
    }
  }
  &-body {
    padding: 14px 15px;
    height: calc(100% - 195px);
    overflow: scroll;
    .time {
      text-align: center;
      color: #999999;
      margin-bottom: 16px;
      font-size: 14px;
    }
    .talk-left {
      margin-bottom: 30px;
      display: flex;
      align-items: flex-start;
      font-size: 15px;
      .talk-left-text {
        background: #ffffff;
        padding: 12px;
        margin-left: 16px;
        max-width: 230px;
        color: #666666;
        line-height: 23px;
        border-radius: 6px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        .triangle {
          display: block;
          height: 0px;
          width: 0px;
          border: 10px solid transparent;
          border-top-color: #ffffff;
          position: absolute;
          transform: rotate(90deg);
          left: -18px;
          top: 10px;
        }
      }
      .msg_img {
        width: 100%;
        height: 150px;
        overflow: hidden;
      }
    }
    .talk-right {
      margin-bottom: 30px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      font-size: 15px;
      .load {
        margin: 15px 5px 0 0;
      }
      .talk-right-text {
        background: #ffffff;
        padding: 12px;
        margin-right: 15px;
        max-width: 235px;
        color: #666666;
        line-height: 23px;
        border-radius: 6px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        .triangle {
          display: block;
          height: 0px;
          width: 0px;
          border: 10px solid transparent;
          border-top-color: #ffffff;
          position: absolute;
          transform: rotate(-90deg);
          right: -18px;
          top: 10px;
        }
      }
      .msg_img {
        width: 100%;
        height: 150px;
        overflow: hidden;
      }
    }
    .tips {
      background: rgba(240, 130, 165, 0.08);
      text-align: center;
      padding: 13px 0;
      font-size: 13px;
      color: #666666;
      font-size: 13px;
      border-radius: 5px;
      margin-bottom: 29px;
      label {
        font-size: 14px;
        color: #f082a5;
        margin-left: 5px;
      }
    }
  }
  &-send-out {
    padding: 13px 15px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .van-field {
      margin: 0 10px;
      background: #fbfbfb;
      border: 1px solid #dddddd;
      border-radius: 20px;
      width: 75%;
      height: 41px;
      line-height: 20px;
    }
    span {
      color: #1fd0a2;
    }
    .not_send {
      color: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
