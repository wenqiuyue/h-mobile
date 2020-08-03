<template>
	<div ref="container" :class="classRoot" @scroll="onScroll">
		<template v-for="(item, index) in stepList">
			<div
				:key="index"
				:class="[
					`${classRoot}-item`,
					index < value ? 'success' : null,
					index === value ? 'active' : null
				]"
			>
				<span>{{ item }}</span>
				<div :class="`${classRoot}-item__circle`">
					<van-icon name="checked" v-if="index === value" />
					<i v-else />
				</div>
				<div :class="[`${classRoot}-item__line`, 'left']" />
				<div :class="[`${classRoot}-item__line`, 'right']" />
			</div>
		</template>
	</div>
</template>
<script>
export default {
	name: 'steps',
	props: {
		value: { type: Number, default: 0 },
		stepList: { type: Array, default: null }
	},
	data() {
		return {
			isReposition: false, // 是否正在重新定位
			isDrag: false, // 是否正在拖动
			dragTimeout: null // 拖动定时器
		};
	},
	watch: {
		value() {
			this.handleReposition();
		}
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	},
	methods: {
		/**
		 * 滚动监听
		 */
		onScroll() {
			if (!this.isReposition) {
				this.startDrag();
			}
		},
		/**
		 * 开始拖动
		 */
		startDrag() {
			if (this.dragTimeout) {
				clearTimeout(this.dragTimeout);
			}
			this.isDrag = true;
			this.dragTimeout = setTimeout(this.clearDrag, 2000);
		},
		/**
		 * 清理拖动
		 */
		clearDrag() {
			if (this.dragTimeout) {
				clearTimeout(this.dragTimeout);
				this.dragTimeout = null;
				this.isDrag = false;
				this.handleReposition();
			}
		},
		/**
		 * 重新定位
		 */
		handleReposition() {
			this.isReposition = true;
			this.$nextTick(() => {
				const { container } = this.$refs;
				const current = document.getElementsByClassName('active')[0];
				if (container) {
					const containerWidth = container.offsetWidth;
					const currentWidth = current.offsetWidth;
					const currentLeft = current.offsetLeft;
					container.scroll({
						left: currentLeft - containerWidth / 2 + currentWidth / 2,
						behavior: 'smooth'
					});
				}
				this.isReposition = false;
			});
		}
	}
};
</script>
<style lang="less">
@import '../../style/variable';

@inner-prefix: ~'@{prefix}-steps';
@active: rgb(7, 193, 96);
@success: #f59fb0;
.@{inner-prefix} {
	padding-top: 10px;
	width: 100%;
	height: 46px;
	overflow-y: hidden;
	overflow-x: auto;
	white-space: nowrap;
	background-color: @background-color;

	&-item {
		color: @font-color-secondary;
		position: relative;
		font-size: 14px;
		display: inline-block;
		padding: 0 15px;

		&.active {
			color: @active;

			.@{inner-prefix}-item__circle {
				i {
					background-color: @active;
					&.van-icon {
						left: 4px;
						bottom: 2px;
						background-color: unset;
					}
				}
			}
			.@{inner-prefix}-item__line.left {
				background-color: @success;
			}
		}

		&.success {
			color: @success;

			.@{inner-prefix}-item__circle {
				i {
					background-color: @success;
				}
			}
			.@{inner-prefix}-item__line.left,
			.@{inner-prefix}-item__line.right {
				background-color: @success;
			}
		}

		&__circle {
			position: absolute;
			left: calc(50% - 1rem);
			top: 28px;
			height: 5px;
			padding: 0 10px;
			background-color: white;
			text-align: center;
			z-index: 2;

			i {
				position: absolute;
				left: 7px;
				display: block;
				width: 5px;
				height: 5px;
				background-color: #969799;
				border-radius: 50%;
			}
		}

		&__line {
			z-index: 1;
			position: absolute;
			top: 30px;
			width: 50%;
			height: 1px;
			background-color: @main-color;

			&.left {
				left: 0;
			}
			&.right {
				left: unset;
				right: 0;
			}
		}

		&:first-child {
			.@{inner-prefix}-item__circle {
				left: 15px;
			}
			.@{inner-prefix}-item__line.left {
				width: unset;
			}
			.@{inner-prefix}-item__line.right {
				width: calc(100% - 15px);
			}
		}
		&:last-child {
			.@{inner-prefix}-item__circle {
				left: unset;
				right: 15px;
			}
			.@{inner-prefix}-item__line.left {
				width: calc(100% - 15px);
			}
			.@{inner-prefix}-item__line.right {
				width: unset;
			}
		}
	}
}
</style>
