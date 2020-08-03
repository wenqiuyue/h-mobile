<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-top_select`">
			<van-grid class="grid" :border="false">
				<template v-for="(item, index) in data['SectionItems']">
					<van-grid-item :key="index">
						<van-image
							@click="$emit('onClick', item)"
							width="47px"
							height="47px"
							fit="cover"
							:src="require(`../../../../../../assets/${item.Icon}`)"
						/>
						<div class="title">{{ item.Title }}</div>
					</van-grid-item>
				</template>
			</van-grid>
		</div>
	</div>
</template>
<script>
export default {
	name: 'type5',
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

@inner-prefix: ~'@{prefix}-type5';
.@{inner-prefix} {
	&-top_select {
		margin-top: 8px;
		border-top: none;
		.grid {
			text-align: center;
			.van-image {
				background: #f6f6f6;
				padding: 9px;
				border-radius: 20px;
			}
			.title {
				margin-top: 5px;
				color: #000000;
			}
		}
	}
}
</style>
