<template>
  <view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <!-- 循环遍历每个item项 -->
      <swiper-item v-for="(item, i) in swiperList" :key='i'>
        <!-- 点击图片跳转到详情页 -->
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <!-- 轮播的图片的 动态绑定src属性 -->
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>

    <!-- 分类导航区域 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item,index) in navList" :key='index' @click="navClickHandle(item)">
        <image :src="item.image_src" mode="" class="nav-img"></image>
      </view>
    </view>

    <!-- 楼层区域 -->
    <view class="floor_list">
      <view class="floor_item" v-for="(item,index) in floorList" :key='index'>
        <!-- 动态绑定 src属性 楼层标题-->
        <image :src="item.floor_title.image_src" class="floor_img"></image>
        <view class="floor-img-box">
          <!-- 左侧大图 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" mode="widthFix" :style="{width: item.product_list[0].image_width + 'rpx'}"></image>
          </navigator>
          <!-- 右侧4个图 -->
          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(item1, i) in item.product_list" :key='i' v-if="i !== 0" :url="item1.url">
              <image :src="item1.image_src" mode="widthFix" :style="{width: item1.image_width + 'rpx'}"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 获取轮播图数据列表
        swiperList: [],
        // 获取分类导航的数据列表
        navList: [],
        // 获取楼层的数据列表
        floorList: []
      };
    },
    onLoad() {
      // 在小程序页面刚加载的时候 调用获取轮播图数据的方法
      this.getSwiperList()
      // 在小程序页面刚加载的时候 调用获取分类导航数据的方法
      this.getNavList()
      // 在小程序页面刚加载的时候 调用获取楼层数据的方法
      this.getFloorList()
    },
    methods: {
      // 获取轮播图数据的方法
      async getSwiperList() {
        // 发起请求
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        console.log(res)
        if (res.meta.status !== 200) {
          return uni.$showMsg()
        }
        //  获取的轮播图数据 赋值给定义的数组
        this.swiperList = res.message
      },
      // 请求分类导航的数据的方法
      async getNavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        console.log(res)
        if (res.meta.status !== 200) return uni.$showMsg()
        //  获取的分类导航数据 赋值给定义的数组
        this.navList = res.message
      },
      // 点击进入分类页面
      navClickHandle(item) {
        // 判断点击 哪个是分类导航
        if (item.name === '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      // 获取楼层的数据的 方法
      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')
        // console.log(res)
        if (res.meta.status !== 200) return uni.$showMsg()
        // 双重循环 将获取的navigator_url 转化为url
        res.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/good_list/good_list?' + prod.navigator_url.split('?')[1]
          })
        })
        // 请求成功 让定义好的 获取楼层数组的列表 接收
        this.floorList = res.message
      }
    }
  }
</script>

<style lang="scss">
  // 轮播图区域
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  // 分类导航区域
  .nav-list {
    display: flex;
    margin: 15px 0;
    justify-content: space-around;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  // 楼层区域
  .floor_img {
    height: 60rpx;
    width: 100%;
  }

  .floor-img-box {
    display: flex;
    padding-left: 10rpx;

    .right-img-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
  }
</style>
