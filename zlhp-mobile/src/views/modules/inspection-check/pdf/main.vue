<template>
	<div :class="classRoot">
		<van-nav-bar title="报告详情" left-arrow @click-left="$router.back()" />
		<van-pull-refresh disabled v-model="isLoading">
			<van-notice-bar
				text="这里是一段提示，例如：报告在提取之后48小时内才可以免费进行报告解读。"
				color="#1989fa"
				background="white"
				left-icon="info-o"
				:scrollable="false"
				wrapable
			/>
			<template v-if="pdfSrc">
				<div :class="`${classRoot}-content`">
					<pdf :src="pdfSrc" :style="{ width: `${width}%` }" />
				</div>
				<div :class="`${classRoot}-tools`">
					<van-button
						round
						@click="handleUpdate(width + 10)"
						:disabled="width === max"
					>
						+
					</van-button>
					<van-button
						round
						@click="handleUpdate(width - 10)"
						:disabled="width === min"
					>
						-
					</van-button>
					<van-button
						round
						@click="handleUpdate(100)"
						:disabled="width === 100"
					>
						<van-icon name="replay" />
					</van-button>
				</div>
			</template>
			<hint v-else />
		</van-pull-refresh>
	</div>
</template>

<script>
import pdf from 'vue-pdf';
import { mapState } from 'vuex';
import { version } from '../../../../fetch/version';
import types from '../../../../commons/types';

export default {
	name: 'inspection-check-pdf',
	components: { pdf },
	data() {
		return {
			isLoading: false,
			width: 100,
			max: 360,
			min: 100
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		},
		...mapState({
			token: state => state[types.TOKEN]
		}),
		title() {
			return `《${this.$route.query.title}》结果`;
		},
		pdfSrc() {
			if (!this.$route.query.caseHistoryId && this.$route.query.zyzid) {
				return false;
			}
			return `/v${version}/ArchiveRecords/GetViewReportDetailPDF/${this.token}/${this.$route.query.caseHistoryId}/${this.$route.query.zyzid}`;
		}
	},
	methods: {
		/**
		 * 更新
		 * @param num
		 */

		handleUpdate(num) {
			if (num < 100) {
				this.width = 100;
			} else if (num > 360) {
				this.width = 360;
			} else {
				this.width = num;
			}
		}
	}
};
</script>

<style lang="less">
@import '../../../../style/variable';

@inner-prefix: ~'@{prefix-mother}-inspection-check-pdf';
.@{inner-prefix} {
	height: 100%;
	background-color: @background-color-container;
	.van-pull-refresh {
		height: calc(100% - 46px);
		overflow: scroll;
		&__track {
			min-height: 100%;
		}
	}

	&-content {
		width: 100%;
		overflow: auto;
	}

	&-tools {
		position: fixed;
		right: 1rem;
		bottom: 1rem;
		button {
			display: block;
			width: 2rem;
			height: 2rem;
			line-height: 2rem;
			padding: unset;
			margin: unset;
			opacity: unset;
			background-color: rgba(255, 255, 255, 0.75);
			box-shadow: 0 0 0.5rem #d2d2d2;

			&:not(:first-child) {
				margin-top: 0.25rem;
			}
		}
	}
}
</style>
