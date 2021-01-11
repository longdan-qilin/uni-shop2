<template>
  <view class="cart-container" v-if="total">
    <!-- 收货地址区域 -->
    <my-address></my-address>

    <!--  购物车页面的标题区域 -->
    <view class="cart-title">
      <!-- 购物图标 -->
      <uni-icons type="shop" size="18"></uni-icons>
      <!-- 文字描述 -->
      <text class="cart-title-text">购物车</text>
    </view>

    <!-- 加购的商品区域 -->
    <!-- uni-swipe-action 是最外层包裹性质的容器 -->
    <uni-swipe-action>
      <block v-for="(goods, i) in cart" :key='i'>
        <!-- uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 options 属性来指定操作按钮的配置信息 -->
        <uni-swipe-action-item :options="options" @click="swipeActionClickHandler(goods)">
          <my-goods :goods='goods' :showRaido="true" @radio-change='radioChangeHandler' :showNum="true" @num-change='numChangeHandler'></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>

    <!-- 结算区域 -->
    <my-settle></my-settle>
  </view>
  
  <!-- 空空如也 没有商品的时候展示 -->
  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <text>空空如也~</text>
  </view>
</template>

<script>
  // 导入tabbar的  计算显示 微标的封装 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  //导入 mapState mapMutations 辅助函数
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins: [badgeMix],
    computed: {
      // 在 m_cart把cart数组 映射当前页面的 计算属性中
      ...mapState('m_cart', ['cart'])
    },
    data() {
      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#C00000'
          }
        }]
      };
    },
    methods: {
      // 将 m_cart 中的 updateGoodsState() 方法 映射到当前页面中使用
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeByID']),
      //  通过子组件传过来的参数 来改变选中状态
      radioChangeHandler(e) {
        this.updateGoodsState(e)
      },
      // 通过子组件传过来的参数 来改变商品的数量值
      numChangeHandler(e) {
        this.updateGoodsCount(e)
      },
      // 点击通过vuex 封装的 方法来删除商品列表
      swipeActionClickHandler(goods) {
        this.removeByID(goods.goods_id)
      }
    }
  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;
  }

  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;
    font-size: 14px;

    .cart-title-text {
      margin-left: 10px;
    }
  }

  // 购物车没有商品的状态
  .empty-cart {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 150px;
    align-items: center;

    .empty-img {
      width: 90px;
      height: 90px;
    }

    text {
      font-size: 12px;
      margin-top: 15px;
    }
  }
</style>
