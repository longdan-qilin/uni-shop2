<template>
		<view class="my-settle-container" >
      <!-- 全选区域 -->
        <label class="radio" @click="changeRadio">
          <radio :checked="isfunck" color="#C00000" /><text>全选</text>
        </label>
        
      <!-- 合计区域 -->
		  <view class="amount-box">
		    合计: <text class="amount">￥{{checkedGoodsAmount}}</text>
		  </view>
      
      <!-- 结算按钮 -->
      <view class="btn-settle" @click="settlement">
        结算({{checkoutCount}})
      </view>
		</view>
</template>

<script>
  // 导入 mapGetters, mapMutations 辅助函数
  import { mapGetters, mapMutations, mapState} from 'vuex'
	export default {
    computed: {
      // 将'checkoutCount', 'total', 'checkedGoodsAmount' 从m_cart 映射到当前页面的计算属性中
      ...mapGetters('m_cart', ['checkoutCount', 'total', 'checkedGoodsAmount']),
      // 将 addstr 从m_user 映射到当前页面的计算属性中
      ...mapGetters('m_user', ['addstr']),
       // token 是用户登录成功之后的 token 字符串
      ...mapState('m_user',['token']),
      ...mapState('m_cart', ['cart']),
      // 判断全选 当总选框构中 其他复选框也全部选中
      isfunck() {
        // 通过 mapGetters的 计算属性 判断总的选中的复选框的数量是否等于当前的商品复选框数量
        return  this.total === this.checkoutCount
      }
    },
		data() {
			return {
        // 倒计时的秒数
        seconds: 3,
        // 定时器Id
        timer: null
			}
		},
    methods:{
      // 从m_cart模块 updateAllGoodsState()方法映射到当前页面的方法中
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      // 从m_user 模块  将updateRedirect()方法 映射到当前页面的方法中
      ...mapMutations('m_user', ['updateRedirect']),
      // 点击改变总的选框 其他选框也要改变，此时可以取反 修改所有选框的状态通过总的选框
      changeRadio() {
        this.updateAllGoodsState(!this.isfunck)
      },
      // 倒计时 提示消息框
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: `进入倒计时,${n}秒后进入登录页面`,
          // 为页面添加透明遮罩，防止点击穿透
          mask: true,
          // 1.5秒后 消息框自动关闭
          duration: 1500
        })
      },
      // 点击提交结算按钮 触发事件
      settlement() {
        // 判断三步校验 是否有选中的商品 是否有收货地址 是否登录过（token）
        if(!this.checkoutCount) return uni.$showMsg('请选中商品加购！')
        if(!this.addstr) return uni.$showMsg('请选择收货地址！')
        if(!this.token) return this.delayNavigate()
        // 微信支付
        this.payOrder()
      },
      //  微信支付
      async payOrder() {
        // 1.创建订单阶段
        // 组织订单信息对象
        const orderInfo = {
          // 开发期间别用真实数据
          // order_price: this.checkedGoodsAmount, map() 里面返回的是一个对象
          order_price: 0.01,
          consignee_addr: this.addstr,
          goods: this.cart.filter(x => x.goods_state).map(x => ({goods_id: x.goods_id,goods_number: x.goods_count,goods_price: x.goods_price}))
        }
        // 发送请求 创建订单
        const { data : res } = await uni.$http.post('/api/public/v1/my/orders/create', this.orderInfo)
        // 错误处理
        if(res.meta.status !== 200) uni.$showMsg('创建订单失败！')
        // 请求成功 获取订单编号
        const orderNumber = res.message.order_number
        
        // 2. 订单预支付阶段
        const { data : res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
        // 错误处理
        if(res.meta.status !== 200) uni.$showMsg('预支付订单生成失败！')
        // 得到订单支付相关的必要参数
        const payInfo = res2.message.pay
        
        // 3.发去订单支付
        // 调用微信官方支付接口
        const [err, succ] = await uni.requestPayment(payInfo)
        // 支付失败
        if(err) return uni.$showMsg('订单未完成！')
        // 如果选择支付 请求订单支付状态查询
        const { data : res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
        // 相当于点了密码又取消了
        if(res3.meta.status !== 200) return uni.$showMsg('订单未完成！')
        // 支付成功
        uni.showToast({
          icon: 'success',
          title: '支付成功！'
        })
      },
      // 进入提示消息框 设置延时器
      delayNavigate() {
        // 重置data的seconds数据 3秒
        this.seconds = 3
        // 将 seconds 传入函数 调用
        this.showTips(this.seconds)
        const timer = setInterval(() => {
          // 每隔一秒  seconds -1
          this.seconds--
          if(this.seconds <= 0) {
            // 清空定时器
            clearInterval(timer)
            // 跳转到登录页面
            uni.switchTab({
              url: '/pages/my/my',
              // 返回一个成功的回调函数
              success: () => {
                // 将返回页的信息对象保存到store中
               this.updateRedirect({
                 openType: 'switchTab',
                 from: '/pages/cart/cart'
               })
             }
            })
            // 终止函数执行
            return
          }
          // 持续调入 弹出消息框
          this.showTips(this.seconds)
        },1000)
      }
    } 
	}
</script>

<style lang="scss">
.my-settle-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: white;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  .radio {
    display: flex;
    align-items: center;
  }
  .amount {
    color: #C00000;
  }
  .btn-settle {
    background-color: #C00000;
    min-width: 100px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    padding: 0 10px;
    color: white;
  }
}
</style>
