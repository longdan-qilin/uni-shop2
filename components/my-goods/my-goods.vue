<template>
  <view class="goods-item">
    <!-- 左边图片区域 -->
    <view class="goods-item-left">
      <radio :checked='goods.goods_state' color="#C00000" v-if="showRaido" @click="radioClickHandler"></radio>
      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
    </view>
    <!-- 右边区域 -->
    <view class="goods-item-right">
      <!-- 上面文字区域  标题-->
      <view class="goods-name">{{goods.goods_name}}</view>
      <view class="goods-info-box">
        <!-- 下面价格区域 -->
        <view class="goods-price">￥{{goods.goods_price | toFixed}}</view>
        <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="valChangeNum"></uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      goods: {
        type: Object,
        // 对象或数组默认值必须从一个工厂函数获取
        default: () => ({})
      },
      // 控制商品列表的 单选框的隐藏与显示 只有购物车才显示 其他隐藏
      showRaido: {
        type: Boolean,
        default: false
      },
      // 控制当前组件中是否显示 NumberBox 组件
      showNum: {
        type: Boolean,
        default: false
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
    },
    methods: {
      //  点击单选框 获取状态 将参数 传递给父组件 父组件控制状态切换
      radioClickHandler() {
        const radioQuery = {
          goods_id: this.goods.goods_id,
          // 商品最新的勾选状态  是变化之后的值 取反
          goods_state: !this.goods.goods_state
        }
        this.$emit('radioChange', radioQuery)
      },
      // 改变商品加购的数量值 
      valChangeNum(val) {
        // 通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
        this.$emit('numChange', {
          // 商品的id
          goods_id: this.goods.goods_id,
          // 商品最新的数量
          goods_count: +val
        })
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    // 让 goods-item 项占满整个屏幕的宽度
    width: 750rpx;
    // 设置盒模型为 border-box
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      margin-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

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
      flex: 1;

      .goods-name {
        font-size: 13px;
      }

      .goods-info-box {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .goods-price {
          font-size: 16px;
          color: #c00000;
        }
      }
    }
  }
</style>
