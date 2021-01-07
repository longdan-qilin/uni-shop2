<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <!-- 基本用法 -->
      <uni-search-bar placeholder="请输入搜索内容" @input="input" :radius="100" cancelButton='none'></uni-search-bar>
    </view>

    <!-- 下面的搜索建议 -->
    <view class="search-list" v-if="searchResult.length !== 0">
      <view class="search-item" v-for="(item, index) in searchResult" :key='index' @click="gotoDetail(item)">
        <view class="search-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>

    <!--  搜索历史 -->
    <view class="histroy-box" v-else>
      <!-- 标题区域 -->
      <view class="histroy-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click='clearHistroy'></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="histroy-list">
        <uni-tag :text="item" v-for="(item , i) in searchHistroy" :key='i' :circle="true" @click="gotolist(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 定时器id
        timer: null,
        // 搜索关键字
        kw: '',
        // 搜索的结果 建议
        searchResult: [],
        // 搜索历史列表
        searchHistroy: []
      };
    },
    onLoad() {
      // 页面初始化加载的时候 在本地存储中获取历史记录
      this.searchHistroy = JSON.parse(uni.getStorageSync('kw' || '[]'))
    },
    methods: {
      // 输入框事件
      input(e) {
        // 清空定时器
        clearTimeout(this.timer)
        // 设置定时器 500毫秒之后 才显示输入的查询关键字
        this.timer = setTimeout(() => {
          // 如果 500 毫秒内，没有触发新的输入事件，则为搜索关键词赋值
          console.log(this)
          // 清除2边的空格  赋值之前 不然后面依然生效
          this.kw = e.value.trim()
          // 根据关键词，查询搜索建议列表
          this.getSearchList()
        }, 500)
      },
      // 获取搜索建议的方法
      async getSearchList() {
        // 如果搜索的关键字为空 
        if (this.kw.length === 0) {
          this.searchResult = []
          return
        }
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        // 获取的结果赋值 搜索的结果
        this.searchResult = res.message
        //  调用保存搜索建议的数据方法
        this.saveSearchResult()
      },
      // 点击搜索建议 进入 详情页面
      gotoDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      // 保存搜索建议的方法
      saveSearchResult() {
        // 将搜索的关键字 添加到searchHistroy
        this.searchHistroy.unshift(this.kw)
        // [...new Set()] 去重
        this.searchHistroy = [...new Set(this.searchHistroy)]
        // 用uni.setStorageSync('storage_key', 'hello') 方法 将搜索历史记录存储到json字符串格式本地存储中
          uni.setStorageSync('kw', JSON.stringify(this.searchHistroy));
      },
      // 清除历史记录
      clearHistroy() {
        // 清除历史记录列表
        this.searchHistroy = [],
        // 清除本地存储中的历史记录
        uni.setStorageSync('kw', [])
      },
      // 点击搜索历史进入 商品列表页面 kw形参就是传进来的item
      gotolist(kw) {
        uni.navigateTo({
          url: '/subpkg/good_list/good_list?query=' + kw
        })
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  // 搜索建议
  .search-list {
    padding: 0 5px;

    .search-item {
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;

      .search-name {
        // 溢出隐藏
        overflow: hidden;
        // 文字不允许换行（单行文本）
        white-space: nowrap;
        // 溢出部分 ... 代替
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }

  // 历史记录
  .histroy-box {
    padding: 0 5px;
    .histroy-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }
    
    .histroy-list {
      display: flex;
      flex-wrap: wrap;
      .uni-tag  {
        margin: 5px 5px 0 0;
      }
    }
  }
</style>
