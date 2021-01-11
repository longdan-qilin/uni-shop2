<template>
	<view>
		<view class="goods-list">
      <view v-for="(item, i) in goodsList" :key='i' @click="gotoDetail(item)"> 
       <my-goods :goods="item"></my-goods>
      </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        // 参数对象
				queryObj: {
          // 查询关键词
          query : '',
          // 商品id
          cid: '',
          // 当前第几页
          pagenum: 1,
          // 每页有多少条数据
          pagesize: 10
        },
        //  获取商品列表
        goodsList: [],
        // 获取商品列表的总条数
        total: 0,
        // 通过节流阀防止发起额外的请求
        isLoading: false
			};
		},
    // 页面加载时
    onLoad(options) {
      //   将页面参数转存到 queryObj对象中
      this.queryObj.query =  options.query || ''
      this.queryObj.cid =  options.cid || ''
      //  加载时调用获取商品列表的方法
      this.getGoodsList()
    },
    methods:{
      // 获取商品列表的方法
      async getGoodsList(cb) {
        // 请求数据的时候 打开节流阀
        this.isLoading = true
        const { data : res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        //  请求完毕 关闭节流阀
        this.isLoading = false
        // 只要数据加载完毕 就立即 按需调用cb回调函数  
        cb && cb()
        if(res.meta.status !== 200) return uni.$showMsg()
        //  将响应的数据 保存到data中  利用展开运算符 新旧数据交替
        this.goodsList = [...this.goodsList, ...res.message.goods]
        // 响应的数据 保存到data中的 total
        this.total = res.message.total
      },
      // 点击商品类别进入商品详情
      gotoDetail(item) {
        uni.navigateTo({
            url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      }
    },
    // 上拉触底加载新的数据
    onReachBottom() {
      // pagesize * pagenum >= total  当前的页码值 * 每页显示多少条数据 >= 总数条数
      // 如果这一页的数据加载完毕了 就不在执行下面的代码
      if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕!')
      // 如果是发起请求的状态的 就不在刷新执行下面的代码  2者都是防止发起额外的请求
      if(this.isloading) return
      // 切换到下一页 自增 +1
      this.queryObj.pagenum += 1
      // 调用函数 跟新
      this.getGoodsList()
    },
    // 下拉刷新
    onPullDownRefresh() {
      // 重置数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.goodsList = []    
      this.isLoading = false
      // 重新刷新数据  刷新完成后关闭加载窗口
      this.getGoodsList(() => uni.stopPullDownRefresh())
    }
	}
</script>

<style lang="scss">

</style>
