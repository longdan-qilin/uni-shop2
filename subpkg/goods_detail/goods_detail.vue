<template>
  <view v-if="goods_info.goods_name" class="detail-container">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
      <swiper-item v-for="(item, i) in goods_info.pics" :key='i'>
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    <!-- / 轮播图区域 -->

    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">
        ￥{{goods_info.goods_price}}
      </view>
      <!-- 商品信息主题区域 -->
      <view class="goods-info-body">
        <!-- 商品的名称 -->
        <view class="goods-name">
          {{goods_info.goods_name}}
        </view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>

      <!-- 运费 -->
      <view class="yf">
        快递: 免运费
      </view>
    </view>
    <!-- / 商品信息区域 -->

    <!-- 富文本区域 商品介绍HTML富文本-->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>

    <!-- 商品导航组件 -->
    <!--fill控制右侧按钮的样式 options左侧按钮组的配置对象   buttonGroup右侧按钮组的配置对象 -->
    <!-- click 左侧按钮的点击事件处理函数 -->
    <!-- buttonClick 右侧按钮的点击事件处理函数 -->
    <view class="goods-nav">
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
    </view>
    <!--/ 商品导航组件 -->
  </view>
</template>

<script>
  // 从 vuex 中按需导入 mapState mapMutations mapGetters辅助方法
  import {
    mapState, mapMutations, mapGetters
  } from 'vuex'

  export default {
    computed: {
      // 调用 mapState 方法，把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算属性来使用
      // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
      ...mapState('m_cart', ['cart']),
      // 调用 mapGetters方法 把 m_cart 模块中的 total的getter属性 映射到当前页面中 做为计算属性来使用
      ...mapGetters('m_cart', ['total'])
    },
    watch : {
      //  侦听 购物车商品的数量变化 通过第一个形参得到变化后的新值
      // total(newVal) {
      //  通过find()方法   获取购物车按钮的配置的对象
      //  const findResult  = this.options.find(x => x.text === '购物车')
      //   if(findResult) {
      //     findResult.info = newVal
      //   }
      // }
      // 使用普通函数的形式定义的 watch 侦听器，在页面首次加载后不会被调用。
      // 因此导致了商品详情页在首次加载完毕之后，不会将商品的总数量显示到商品导航区域：
      total: {
        handler(newVal) {
          const findResult = this.options.find(x => x.text === '购物车')
          if(findResult) return findResult.info = newVal
        },
        //  通过vue api 的一个方法  immediate 来实现进入页面就加载
        immediate: true   
      }
    },
    data() {
      return {
        //  获取商品的详情数据
        goods_info: {},
        // 左侧按钮组的配置对象  
        options: [{
          icon: 'shop',
          text: '店铺',
        }, {
          icon: 'cart',
          text: '购物车',
          info: 0
        }],
        // 右侧按钮组的配置对象
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      };
    },
    onLoad(options) {
      // 获取点击进入的页面参数 id
      const goods_id = options.goods_id
      // 页面加载时  调用获取详情页面的数据的方法
      this.getGoodsDetail(goods_id)
    },
    methods: {
      // 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
      ...mapMutations('m_cart', ['addToCart']),
      // 获取详情页面的数据的方法
      async getGoodsDetail(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id
        })
        //  使用字符串的 replace() 方法 为img 标签添加行内的 style 样式 从而解决图片底部空白间隙的问题
        // 使用字符串的 replace() 方法，将 webp 的后缀名替换为 jpg 的后缀名
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg')
        // 为data 中的数据赋值
        this.goods_info = res.message
      },
      // 点击轮番图片 预览
      preview(i) {
        uni.previewImage({
          // 预览的当前图片索引
          count: i,
          //  预览图片的地址 map() 数组方法 迭代返回的是一个新数组
          urls: this.goods_info.pics.map(item => item.pics_big)
        })
      },
      //  点击左侧的按钮处理事件
      onClick(e) {
        //  点击进入购物车页面
        if (e.content.text === '购物车') {
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      //  点击右侧的按钮处理事件
      buttonClick(e) {
        // 1. 判断是否点击了 加入购物车 按钮
        if (e.content.text === '加入购物车') {
          // 2. 组织一个商品的信息对象
          const goods = {
            goods_id: this.goods_info.goods_id, // 商品的Id
            goods_name: this.goods_info.goods_name, // 商品的名称
            goods_price: this.goods_info.goods_price, // 商品的价格
            goods_count: 1, // 商品的数量
            goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
            goods_state: true // 商品的勾选状态
          }
          // 3. 通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
          this.addToCart(goods)
        }
      }
    }
  }
</script>

<style lang="scss">
  .detail-container {
    //  给页面加个底部padding 防止页面的内容被底部导航组件覆盖
    padding-bottom: 50px;
  }

  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  // <!-- 商品信息区域 -->
  .goods-info-box {
    padding: 10px;
    padding-right: 0;

    .price {
      color: #C00000;
      font-size: 18px;
      margin: 10px 0;
    }

    .goods-info-body {
      display: flex;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
        padding-right: 10px;
      }

      .favi {
        width: 120px;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: gray;
        border-left: 1px solid #efefef;
      }
    }

    // <!-- 运费 -->
    .yf {
      font-size: 12px;
      margin: 10px 0;
      color: gray;
    }
  }

  // 商品导航
  .goods-nav {
    width: 100%;
    position: fixed;
    bottom: 0;
  }
</style>
