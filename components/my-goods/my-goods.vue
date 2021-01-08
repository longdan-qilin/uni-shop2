<template>
		<view class="goods-item">
		  <!-- 左边图片区域 -->
		  <view class="goods-item-left">
		    <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
		  </view>
		  <!-- 右边区域 -->
		  <view class="goods-item-right">
		    <!-- 上面文字区域  标题-->
		    <view class="goods-name">{{goods.goods_name}}</view>
		    <view class="goods-info-box">
		      <!-- 下面价格区域 -->
		      <view class="goods-price">￥{{goods.goods_price | toFixed}}</view>
		    </view>
		  </view>
		</view>
</template>

<script>
	export default {
    props: {
      goods: {
        type: Object,
        default: {}
      }
    },
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
    // 声明 filters 过滤器节点
    filters: {
      toFixed(num) {
        // 将传进来的值 变成带有2位小数的
        return Number(num).toFixed(2)
      }
    }
	}
</script>

<style lang="scss">
.goods-item {
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;

  .goods-item-left {
    margin-right: 5px;

    .goods-pic {
      width: 100px;
      height: 100px;
      display: block;
    }
  }

  .goods-item-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .goods-name {
      font-size: 13px;
    }

    .goods-price {
      font-size: 16px;
      color: #c00000;
    }
  }
}
</style>
