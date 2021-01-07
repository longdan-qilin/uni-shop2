<template>
  <view>
    <view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
        <block v-for="(item, i) in cateList" :key='i'>
          <view :class='["left-scroll-view-item",i === active? "active": ""]' @click="handleActive(i)">{{item.cat_name}}</view>
        </block>
      </scroll-view>
      <!-- 右侧的滚动视图区域 -->
      <!-- 动态获取顶部距离 变量？ 0  切换时候 把0 赋值过去？-->
      <!-- scroll-top 距离顶部的距离 -->
      <scroll-view scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2, i2) in cateLeavel2" :key='i2'>
          <!-- 二级分类标题 -->
          <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
          <!-- 三级分类列表数据 -->
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key='i3' @click="gotoCate(item3)">
              <!-- 三级分类 图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 三级分类 文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
        wh: 0,
        // 获取分类列表数据
        cateList: [],
        // 当前选中项的索引，默认让第一项被选中
        active: 0,
        // 获取二级分类列表数据
        cateLeavel2: [],
        // 设置右侧滚动条到顶部距离
        scrollTop: 0
      };
    },
    onLoad() {
      // 获取当前系统的信息
      const sysInfo = uni.getSystemInfoSync()
      console.log(sysInfo)
      // 为 wh 窗口可用高度动态赋值
      this.wh = sysInfo.windowHeight
      // 调用获取分类列表的数据的方法
      this.getCateList()
    },
    methods: {
      // 获取分类的数据方法
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        console.log(res)
        if (res.meta.status !== 200) return uni.$showMsg()
        // 分类列表数据 接收
        this.cateList = res.message
        // 赋值 给二级分类列表 默认是第一个
        this.cateLeavel2 = res.message[0].children
      },
      // 点击获取匹配 active类名
      handleActive(i) {
        this.active = i
        // 点击获取 二级分类列表
        this.cateLeavel2 = this.cateList[i].children
         // 让 scrollTop 的值在 0 与 1 之间切换
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      // 点击跳转到商品详情页面
      gotoCate(item3) {
        uni.navigateTo({
          url: '/subpkg/good_list/good_list?cid=' + item3.cat_id 
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .scroll-view-container {
    display: flex;

    // 左侧一级列表
    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        background-color: #F7F7F7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;

        &.active {
          background-color: #FFFFFF;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #C00000;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }
      }
    }

    // 右侧二级列表 标题
    .cate-lv2-title {
      font-size: 12px;
      text-align: center;
      padding: 15px 0;
      font-weight: bold;
    }
    
    // 三级分类列表
    .cate-lv3-list {
       display: flex;
       flex-wrap: wrap;
       .cate-lv3-item {
         width: 33.3%;
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         image {
           width: 60px;
           height: 60px;
         }
         text {
           font-size: 12px
         }
       }
    }
  
  }
</style>
