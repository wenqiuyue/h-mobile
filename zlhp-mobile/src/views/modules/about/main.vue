<template>
	<div :class="classRoot">
		<van-nav-bar title="关于" left-arrow @click-left="$router.back()" />
		<div :class="`${classRoot}-body`">
			<van-image width="100%" :src="require('../../../assets/aboutzl.png')" />
			<van-panel title="慧生养" desc="重庆中联信息产业有限责任公司">
				<div>
					<h2>关于中联</h2>
					<p>
						中联成立于1992年，是国内领先的专业医疗卫生信息化解决方案提供商，解决方案涉及医院业务管理与经营决策信息化、区域医疗卫生信息化、社区卫生信息化及相应的基础技术研究等多个领域。
					</p>
					<p>
						二十余年来，中联坚持以“合作共生”为企业经营理念，以“创造价值、服务客户、尊重个人”为企业文化精髓，通过实施品牌、服务、运营和人力资源等多种发展战略，稳健提升企业核心竞争力与品牌价值，获得了用户及业界的广泛认同与支持。
					</p>
					<p>
						中联产品全部为自主研发，在业内资深专家领衔的顾问团队指导之下，以理念先进、运行稳定、灵活性强著称，是面向新时代医疗卫生信息化管理需求，打造数字化医院和区域医疗卫生信息平台之最佳选择。
					</p>
					<p>
						中联拥有完善的全国营销和服务网络，在华北、东北、华东、华南、华中、西南和西北等区域建立了二十余个分支机构及客户服务中心、拥有高素质的专业技术服务团队，能够为用户提供及时高效、超出期望的本地化服务。
					</p>
					<p>
						今天的中联，拥有1000余人组成的强大团队，正以创新开拓精神为动力，以加速医疗卫生信息化进程、改善公众就医环境为己任，打造中国医疗卫生信息化第一品牌！
					</p>
					<h3>三大业务体系</h3>
					<h4>中联信息</h4>
					<p>
						主要面向医院信息化领域，以中联数字化医院解决方案为依托，凭借丰富的医院管理业务、信息系统规划与项目实施经验、为各级各类医疗机构提供成熟稳定、一体化、可扩展、可定制的全面解决方案，成为医疗机构最有价值的合作伙伴。
					</p>
					<h4>中联区卫</h4>
					<p>
						以中联公共卫生信息化解决方案为依托，立足新医改，促进基本医疗卫生服务体系建设，全面推行公共卫生服务逐步均等化，搭建区域公共卫生服务平台，建立区域卫生数据中心。
					</p>
					<h4>中联敏捷</h4>
					<p>
						中联“技术引擎”，主要从事基础技术研究与协同平台开发工作，为中联面向未来医疗卫生信息化领域提供强大的技术支撑。
					</p>
				</div>
			</van-panel>
		</div>
	</div>
</template>
<script>
export default {
	name: 'about',
	data() {
		return {};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';
@inner-prefix: ~'@{prefix}-about';
.@{inner-prefix} {
	height: 100%;
	&-body {
		height: calc(100% - 46px);
		overflow: scroll;

		.van-cell__title {
			font-size: 1.5rem;
		}
		.van-cell__label {
			margin-top: 10px;
			font-size: 1rem;
		}
		.van-panel__content {
			padding: 15px;
		}
	}
}
</style>
