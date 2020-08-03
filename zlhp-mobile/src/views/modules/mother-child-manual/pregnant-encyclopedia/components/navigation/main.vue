<!-- 导航类型 -->
<template>
	<div :class="classRoot">
		<van-collapse v-model="activeNames" accordion>
			<van-collapse-item
				:class="`${classRoot}-collapse`"
				:name="item.ArticleID"
				v-for="(item, index) in type"
				:key="index"
				><template #title>
					<div class="title">
						<svg-icon value="icon-mother_record_pre" :size="1.5" />{{
							item.Title
						}}
					</div>
				</template>
				<div class="article_list">
					<van-cell
						class="cell"
						is-link
						@click="$emit('articleInfo', articlesitem)"
						v-for="(articlesitem, index) in item.ChildrensArticles"
						:key="index"
					>
						<template #title>
							<div class="circle"></div>
							<span class="custom-title">{{ articlesitem.Title }}</span>
						</template>
					</van-cell>
				</div>
			</van-collapse-item>
		</van-collapse>
	</div>
</template>
<script>
export default {
	name: 'navigation',
	data() {
		return {
			activeNames: 0
		};
	},
	props: {
		type: { type: Array, default: null },
		articleSectionID: { type: Number, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	}
};
</script>
<style lang="less">
@import '../../../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-navigation';
.@{inner-prefix} {
	background: #f8f8f8;
	height: calc(100% - 51px);
	overflow: scroll;
	&-collapse {
		margin-top: 5px;
		.van-cell {
			padding: 18px 15px 18px 21px;
			font-size: 18px;
			color: #333333;
			.title {
				display: flex;
				align-items: center;
				svg {
					margin-right: 14px;
				}
			}
		}
		.van-collapse-item__content {
			padding: 0;
			.article_list {
				.cell {
					padding: 12px 15px 12px 30px;
					font-size: 16px;
					color: #333333;
					.van-cell__title {
						display: flex;
						flex-direction: row;
						align-items: center;
						.circle {
							height: 8px;
							width: 8px;
							background: #dddddd;
							border-radius: 50%;
							margin-right: 10px;
						}
					}
				}
			}
		}
	}
}
</style>
