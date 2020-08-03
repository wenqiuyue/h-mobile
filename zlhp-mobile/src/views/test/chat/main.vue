<template>
	<div>
		<van-field
			readonly
			clickable
			name="ContentType"
			:value="ContentTypeOption[ContentType]"
			label="消息类型"
			placeholder="点击选择消息类型"
			@click="showPicker = true"
		/>
		<van-popup v-model="showPicker" position="bottom">
			<van-picker
				show-toolbar
				:columns="ContentTypeOption"
				@confirm="onConfirm"
				@cancel="showPicker = false"
			/>
		</van-popup>
		<van-field type="textarea" label="消息" v-model="Content"></van-field>
		<van-button block :disabled="!connectionSuccess" @click="SendMessage">
			发送
			<template v-if="!!errorMessage"> （{{ errorMessage }}） </template>
		</van-button>
		<ol>
			<li v-for="(msg, index) in messages" :key="index">
				{{ msg.ConsultUserType == 0 ? '咨询者：' : '医生：' }}
				{{ msg.Content }}
				<span style="font-size: 0.8rem">
					{{ new Date(msg.CreateTime).format() }}
				</span>
			</li>
		</ol>
	</div>
</template>
<script>
import * as SignalR from '@aspnet/signalr';
import { mapState } from 'vuex';
import types from '../../../commons/types';

export default {
	name: 'test-chat',
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		},
		...mapState({
			token: state => state[types.TOKEN]
		})
	},
	data() {
		return {
			showPicker: false,
			ContentTypeOption: ['文字', '图片', '语音', '视频'],
			ContentType: 0,
			Content: null,
			connection: null,
			messages: [],
			connectionSuccess: false,
			errorMessage: null
		};
	},
	created() {
		this.connection = new SignalR.HubConnectionBuilder()
			.withUrl(`${process.env.VUE_APP_CHAT_URL}/v1/chatHub`, {
				accessTokenFactory: () => this.token
			})
			.build();
		this.connection.on('ReceiveMessage', this.ReceiveMessage);
		this.connection
			.start()
			.then(() => {
				this.connectionSuccess = true;
			})
			.catch(error => {
				this.errorMessage = error || '连接聊天服务器失败';
			});
	},
	methods: {
		SendMessage() {
			this.connection
				.invoke('SendMessage', {
					InquiryRecordID: 3,
					ContentType: this.ContentType,
					Content: this.Content
				})
				.catch(error => {
					this.errorMessage = error;
				});
		},
		ReceiveMessage(message) {
			this.messages.push(JSON.parse(message));
		},
		onConfirm(value, index) {
			this.ContentType = index;
			this.showPicker = false;
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable';

@inner-prefix: ~'@{prefix}-test-chat';
.@{inner-prefix} {
	margin: unset;
	font-size: 1rem;
}
</style>
