<template>
	<div :class="classRoot" v-if="inquiryRecordByIdData">
		<van-nav-bar
			:title="consultType === 1 ? '快速问诊' : '图文问诊'"
			left-arrow
			@click-left="handelBack"
			:right-text="steps === 2 ? '结束诊疗' : ''"
			@click-right="handelStop"
		>
		</van-nav-bar>
		<van-panel>
			<template #header>
				<div :class="`${classRoot}-inquiry-status`">
					<span v-if="connectionSuccess"
						><svg-icon value="icon-Selection" :size="1.3" />连接成功</span
					>
					<span v-else>{{ steps == 2 ? '连接失败' : '问诊已结束' }}</span>
					<!-- <span><label>23时58分</label>后问诊结束</span> -->
					<span v-if="!connectionSuccess && steps == 2" @click="Connection"
						><svg-icon value="icon-refresh" :size="1.1"
					/></span>
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
				@load="getInquiryConsults"
				direction="up"
			>
				<div v-for="(msg, index) in messagesRecord" :key="index">
					<div class="time" v-if="index === 0">
						{{ new Date(msg.CreateTime).format() }}
					</div>
					<div class="talk-left" v-if="msg.ConsultUserType != 0">
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
						<svg-icon v-else value="icon-Headportrait" :size="3.4" />
						<span class="talk-left-text"
							><label v-if="msg.ContentType === 0">{{ msg.Content }}</label>
							<van-image
								class="msg_img"
								v-else
								fit="fill"
								:src="msg.Content"
								@click="browsePic(msg)"
							/>
							<span class="triangle"></span>
						</span>
					</div>
					<div class="talk-right" v-else>
						<span class="talk-right-text"
							><label v-if="msg.ContentType === 0">{{ msg.Content }}</label
							><van-image
								class="msg_img"
								v-else
								fit="fill"
								:src="msg.Content"
								@click="browsePic(msg)"/>
							<span class="triangle"></span
						></span>
						<van-image
							round
							width="47px"
							height="47px"
							fit="cover"
							:src="inquiryRecordByIdData.CUser.UserImage"
						/>
					</div>
				</div>
				<div class="tips" v-if="connectionSuccess && steps === 2 && false">
					医生休息中，上线后将第一时间回复问诊！
				</div>
				<div v-for="(msg, index) in messages" :key="msg.InquiryConsultID">
					<div class="time" v-if="index === 0">
						{{ new Date(msg.CreateTime).format() }}
					</div>
					<div class="talk-left" v-if="msg.ConsultUserType !== 0">
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
						<svg-icon v-else value="icon-Headportrait" :size="3.4" />
						<span class="talk-left-text"
							><label v-if="msg.ContentType === 0">{{ msg.Content }}</label>
							<van-image
								class="msg_img"
								v-else
								fit="fill"
								:src="msg.Content"
								@click="browsePic(msg)"
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
						<span class="talk-right-text">
							<label v-if="msg.ContentType === 0">{{ msg.Content }}</label
							><van-image
								class="msg_img"
								v-else
								fit="fill"
								:src="msg.Content"
								@click="browsePic(msg)"/>
							<span class="triangle"></span
						></span>
						<van-image
							v-if="inquiryRecordByIdData.CUser.UserImage"
							round
							width="47px"
							height="47px"
							fit="cover"
							:src="inquiryRecordByIdData.CUser.UserImage"
						/>
						<svg-icon v-else value="icon-Headportrait" :size="3.4" />
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
import { Dialog, ImagePreview } from 'vant';
import uuid from 'uuid';
// import _ from 'lodash';
import * as SignalR from '@microsoft/signalr';
import { mapState } from 'vuex';
import types from '../../../commons/types';
import * as UploadApi from '../../../apis/UploadApi';
import * as InquiryRecordApi from '../../../apis/InquiryRecordApi';
import * as InquiryConsultsApi from '../../../apis/InquiryConsultsApi';

export default {
	name: 'interrogation-rapid-interrogation',
	data() {
		return {
			sendOutValue: null, // 发送的问题
			showPicker: false,
			ContentType: 0, // 0 文字 1图片
			connection: null,
			messages: [],
			messagesRecord: [], // 聊天记录
			connectionSuccess: false,
			errorMessage: null,
			uploadImage: [], // 发送的图片
			sourceId: this.$route.query.source_id,
			paramData: {
				InquiryRecordID: null,
				InquiryConsultID: null,
				page: 0,
				limit: 10
			},
			loading: false,
			finished: false,
			error: false,
			refreshing: false,
			isfirst: true,
			steps: this.$route.query.steps, // 当前问诊状态
			consultType: this.$route.query.consult_type, // 问诊类型
			inquiryRecordByIdData: null, // 问诊详情
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
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		},
		...mapState({
			token: state => state[types.TOKEN]
		})
	},
	watch: {
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
		// connection: {
		// 	handler(newValue) {
		// 		console.log(JSON.parse(JSON.stringify(newValue)));
		// 	},
		// 	deep: true
		// }
	},
	created() {
		this.getInquiryRecordByIdData();
		if (this.steps === 2 || this.steps === '2') {
			this.Connection();
		}
		this.getInquiryConsults(true);
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
			InquiryRecordApi.inquiryRecordInfo(this.sourceId).then(res => {
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
		Connection() {
			if (!this.connection) {
				this.connection = new SignalR.HubConnectionBuilder()
					.withUrl(`${process.env.VUE_APP_CHAT_URL}/signalr/chatHub`, {
						accessTokenFactory: () => this.token
					})
					.withAutomaticReconnect()
					.build();
				this.connection.on('ReceiveMessage', this.ReceiveMessage);
			}
			this.connection
				.start()
				.then(() => {
					this.connectionSuccess = true;
				})
				.catch(error => {
					this.errorMessage = error || '连接聊天服务器失败';
				});
		},
		/**
		 * 获取聊天记录
		 */
		getInquiryConsults(init = false) {
			if (!init) this.recordScrollPosition();

			if (this.refreshing) {
				this.messagesRecord = [];
				this.refreshing = false;
			}
			const compare = property => {
				return (a, b) => {
					const value1 = a[property];
					const value2 = b[property];
					return value1 - value2;
				};
			};
			this.paramData.InquiryRecordID = this.sourceId;
			this.paramData.page =
				Math.floor(this.messagesRecord.length / this.paramData.limit) + 1;
			InquiryConsultsApi.getInquiryConsultsList(this.paramData)
				.then(res => {
					if (res.Code === 0) {
						this.messagesRecord.push(...res.Body);
						this.messagesRecord.sort(compare('InquiryConsultID'));

						// 界面加载完成后执行，防止元素未渲染完导致滚动条位置错误
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
		 * 后退
		 */
		handelBack() {
			this.$router.push({
				path: '/mother/interrogation-details-inquiring',
				query: {
					inquiry_record_id: this.sourceId
				}
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
				ConsultUserType: 0,
				CreateTime: new Date().format()
			};
			this.messages.push(msg);
			console.log(this.messages);
			this.$nextTick(() => {
				this.scrollToTop(true);
			});
			if (this.connectionSuccess) {
				this.connection
					.invoke('SendMessage', {
						InquiryRecordID: this.sourceId,
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
			if (messageObj.InquiryRecordID === parseInt(this.sourceId, 10)) {
				if (messageObj.ConsultUserType === 0) {
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
			this.uploadImage = [];
			let files = [];
			// 多图处理
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
			this.$toast.loading('上传中...');
			UploadApi.UploadImages(files)
				.then(data => {
					if (data.Code === 0) {
						Object.keys(data.Body).forEach(key => {
							this.uploadImage.push(data.Body[key]);
						});
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 结束诊疗
		 */
		handelStop() {
			Dialog.confirm({
				title: '系统提示',
				message: '您要结束问诊吗'
			})
				.then(() => {
					InquiryRecordApi.stopInquiryRecord(this.sourceId).then(res => {
						if (res.Code === 0) {
							this.$router.back();
						} else {
							this.$toast.fail(res.Message);
						}
					});
				})
				.catch(() => {
					this.$toast.fail('用户取消');
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
<style lang="less">
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-interrogation-rapid-interrogation';
.@{inner-prefix} {
	height: 100%;
	background: #f8f8f8;
	&-inquiry-status {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 15px;
		span:first-child {
			color: #000000;
			display: flex;
			align-items: center;
			svg {
				margin-right: 5px;
			}
		}
		span:last-child {
			color: #999999;
			font-size: 13px;
			label {
				color: #f082a5;
			}
		}
	}
	&-body {
		padding: 14px 15px;
		height: calc(100% - 185px);
		overflow: scroll;
		.time {
			text-align: center;
			color: #999999;
			margin-bottom: 16px;
		}
		.talk-left {
			margin-bottom: 30px;
			display: flex;
			align-items: flex-start;
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
			width: 76%;
			height: 41px;
			line-height: 20px;
		}
		span {
			color: #f082a5;
		}
		.not_send {
			color: rgba(0, 0, 0, 0.2);
		}
	}
}
</style>
