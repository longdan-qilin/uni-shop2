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
      <view class="btn-settle">
        结算({{checkoutCount}})
      </view>
		</view>

</template>

<script>
  import { mapGetters, mapMutations} from 'vuex'
	export default {
    computed: {
      ...mapGetters('m_cart', ['checkoutCount', 'total', 'checkedGoodsAmount']),
      isfunck() {
        return  this.total === this.checkoutCount
      }
    },
		data() {
			return {
        
			}
		},
    methods:{
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      changeRadio() {
        this.updateAllGoodsState(!this.isfunck)
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
