<template>
	<view class="my-container">
    <!-- 因为登录接口需要企业账号进不去 -->
		<my-login v-if="!token"></my-login>
		<my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
    // 导入tabbar的  计算显示 微标的封装方法
  import badgeMix from '@/mixins/tabbar-badge.js'
  import { mapState } from 'vuex'
	export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins: [badgeMix],
    computed:{
      ...mapState('m_user', ['token'])
    },
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
  // 每个页面最外层有个根节点page
page,.my-container {
    height: 100%;
}
</style>
