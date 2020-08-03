<template>
	<van-popup :class="classRoot" v-model="show" position="bottom">
		<div :class="`${classRoot}-title`">历史档案</div>
		<ul>
			<li v-for="(item, index) in list" :key="index" @click="handleClick(item)">
				<van-row>
					<van-col span="16">{{ item['Name'] }}</van-col>
					<van-col span="8">
						{{ new Date(item['CreateTime']).format('yyyy-MM-dd') }}
					</van-col>
				</van-row>
				<van-row>
					<van-col span="16">{{ item['Hospital'] }} </van-col>
					<van-col span="8">
						<svg-icon value="icon-GWPG_dian" />
					</van-col>
				</van-row>
			</li>
		</ul>
	</van-popup>
</template>
<script>
import * as ArchiveApi from '../../../../../../apis/ArchiveApi';

export default {
	name: 'archive-history',
	data() {
		return {
			show: false,
			list: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	methods: {
		handleClick(item) {
			this.$emit('onClick', item.ArchiveID);
			this.show = false;
		},
		handleShow() {
			this.$toast.loading('加载中...');
			ArchiveApi.GetAll()
				.then(response => {
					if (response.Code === 0) {
						this.list = response.Body;
						this.show = true;
					}
				})
				.finally(this.$toast.clear);
		}
	}
};
</script>
<style lang="less">
@import '../../../../../../style/variable';
@inner-prefix: ~'@{prefix-mother}-archive-history';
.@{inner-prefix} {
	max-height: 50%;
	min-height: 100px;
	overflow: auto;

	&-title {
		text-align: center;
		font-size: 16px;
		font-weight: bold;
		text-indent: 1em;
		padding: 10px 0;
		color: rgb(117, 164, 242);
	}

	ul {
		padding: 5px;

		li {
			margin: 2px 0;
			line-height: 20px;
			padding: 8px 0;
			background-color: rgb(247, 247, 247);
			border-radius: 5px;

			.van-row {
				color: @font-color-middle;
				padding: 0 15px;
				font-size: 0.85rem;
				&:first-child {
					.van-col {
						&:first-child {
							font-size: 1rem;
							font-weight: bold;
						}
					}
				}
				.van-col {
					&:last-child {
						text-align: right;
						font-size: 0.85rem;
					}
				}
			}
		}
	}
}
</style>
