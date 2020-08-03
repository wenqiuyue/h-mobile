<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-knowledge`">
			<section-title :title="data['Title']" />
			<div :class="`${classRoot}-knowledge-body`">
				<div
					:class="index === 0 ? 'content_array first_content' : 'content_array'"
					v-for="(item, index) in data['SectionItems']"
					:key="index"
				>
					<van-row class="content" @click="$emit('onClick', item)">
						<van-col :span="item.Icon ? 16 : 24" class="policy_content">
							<span class="policy_content_title">{{ item.Title }}</span>
							<span class="policy_content_container">
								{{ item.SubContent.replace(/&lt;.+?&gt;/g, '') }}
							</span>
						</van-col>
						<van-col span="8" class="policy_img" v-if="item.Icon">
							<van-image :src="item.Icon" />
						</van-col>
					</van-row>
					<van-divider />
				</div>
			</div>
			<!-- <div
				class="content_array"
				v-for="(item, index) in data['SectionItems']"
				:key="index"
			>
				<van-row class="content" v-if="item.Icon">
					<van-col span="16" class="content_title">
						{{ item.Title }}
					</van-col>
					<van-col span="8" class="img">
						<van-image :src="item.Icon" />
					</van-col>
				</van-row>
				<van-row class="content" v-else-if="!item.Icon">
					<van-col span="24" class="content_title">
						{{ item.Title }}
					</van-col>
				</van-row>
				<van-row class="content" v-else>
					<van-col span="24" class="content_title">
						{{ item.Title }}
					</van-col>
					<van-col span="24" class="imgs">
						<van-image
							v-for="(item, index) in 3"
							:key="index"
							:src="item.Icon"
						/>
					</van-col>
				</van-row>
			</div> -->
		</div>
	</div>
</template>
<script>
import SectionTitle from '../title';

export default {
	name: 'type6',
	components: { SectionTitle },
	props: {
		data: { type: Object, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	}
};
</script>
<style lang="less">
@import '../../../../../../style/variable';

@inner-prefix: ~'@{prefix}-type6';
.@{inner-prefix} {
	margin-top: 8px;
	&-knowledge {
		&-body {
			padding-bottom: 30px;
			background: #ffffff;
			border-radius: 0 0 10px 10px;
			.content_array {
				background: #ffffff;
				.van-divider {
					margin: 0;
					width: 94%;
					margin-left: 3%;
				}
				.content {
					padding: 22px 10px;
					.policy_content {
						padding-right: 16px;
						display: flex;
						flex-direction: column;
						.policy_content_title {
							font-size: 17px;
							color: #333333;
							letter-spacing: 1px;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							overflow: hidden;
							text-overflow: ellipsis;
							-webkit-box-orient: vertical;
						}
						.policy_content_container {
							font-size: 14px;
							color: #999999;
							margin-top: 12px;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							overflow: hidden;
							text-overflow: ellipsis;
							-webkit-box-orient: vertical;
							line-height: 22px;
						}
					}
					.policy_img {
						text-align: center;
						.van-image {
							width: 100px;
							height: 70px;
							img {
								border-radius: 10px;
							}
						}
					}
				}
			}
		}
	}
}
</style>
