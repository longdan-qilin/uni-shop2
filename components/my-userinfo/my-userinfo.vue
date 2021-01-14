<template>

    <view class="my-userinfo-container">
      <!-- 头像昵称区域 -->
      <view class="top-box">
        <!-- <image :src="userinfo.avatarUrl" class="avatar"></image> -->
        <image src="../../static/cart_empty@2x.png" class="avatar"></image>
        <!-- <view class="nickname">{{userinfo.nickname}}</view> -->
        <view class="nickname">时间简史</view>
      </view>

      <!-- 面板的列表区域 -->
      <view class="panel-list">
        <!-- 第一个面板 -->
        <view class="panel">
          <!-- panel 的主体区域 -->
          <view class="panel-body">
            <!-- panel 的 item项 -->
            <view class="panel-item">
              <text>8</text>
              <text>收藏的店铺</text>
            </view>
            <view class="panel-item">
              <text>14</text>
              <text>收藏的商品</text>
            </view>
            <view class="panel-item">
              <text>18</text>
              <text>关注的商品</text>
            </view>
            <view class="panel-item">
              <text>84</text>
              <text>足迹</text>
            </view>
          </view>
        </view>

        <!-- 第二个面板 -->
        <view class="panel">
          <!-- 面板的标题 -->
          <view class="panel-title">我的订单</view>
          <!-- 面板的主体 -->
          <view class="panel-body">
            <!-- 面板主体中的 item 项 -->
            <view class="panel-item">
              <image src="/static/my-icons/icon1.png" class="icon"></image>
              <text>待付款</text>
            </view>
            <view class="panel-item">
              <image src="/static/my-icons/icon2.png" class="icon"></image>
              <text>待收货</text>
            </view>
            <view class="panel-item">
              <image src="/static/my-icons/icon3.png" class="icon"></image>
              <text>退款/退货</text>
            </view>
            <view class="panel-item">
              <image src="/static/my-icons/icon4.png" class="icon"></image>
              <text>全部订单</text>
            </view>
          </view>
        </view>

        <!-- 第三个面板 -->
        <view class="panel">
          <view class="panel-list-item">
            <text>收货地址</text>
            <uni-icons type="arrowright" size="15"></uni-icons>
          </view>
          <view class="panel-list-item">
            <text>联系客服</text>
            <uni-icons type="arrowright" size="15"></uni-icons>
          </view>
          <view class="panel-list-item" @click="lgyout">
            <text>退出登录</text>
            <uni-icons type="arrowright" size="15"></uni-icons>
          </view>
        </view>

      </view>
    </view>
</template>

<script>
  // 导入辅助函数mapState
  import { mapState, mapMutations} from 'vuex'
  export default {
    computed: {
      // 从m_user 中把 userinfo用户信息对象 映射到当前页面的计算属性
      ...mapState('m_user', ['userinfo'])
    },
    data() {
      return {

      };
    },
    methods: {
      // 从m_user 中把 updateAddress updateUserInfo updateToken映射到当前页面的方法
      ...mapMutations('m_user', ['updateAddress', 'updateUserInfo', 'updateToken']),
      // 点击退出登录
      async lgyout() {
        const [err, succ] = await uni.showModal({
          title: '提示',
          content: '确认退出登录吗?'
        }).catch(err => err)
        // 如果确认退出登录的话 清空state数据的信息 函数 传参 空对象 空字符串就清空
        if(succ && succ.confirm) {
          this.updateAddress({}),
          this.updateUserInfo({}),
          this.updateToken("")
        }
      }
    }
  }
</script>

<style lang="scss">
  // 用户信息
  .my-userinfo-container {
    height: 100%;
    // 为整个组件的结构添加浅灰色的背景
    background-color: #f4f4f4;

    // 用户昵称容器
    .top-box {
      height: 400rpx;
      background-color: #C00000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .avatar {
        display: block;
        width: 90px;
        height: 90px;
        border-radius: 50%;
        border: 2px solid white;
        // x轴衍生 y轴衍生 模糊度 模糊度颜色
        box-shadow: 0 1px 5px black;
      }

      .nickname {
        font-size: 16px;
        font-weight: 700;
        color: white;
        margin-top: 10px;
      }
    }

    // <!-- 面板的列表区域 -->
    .panel-list {
      position: relative;
      top: -10px;
      padding: 0 10px;


      .panel {
        background-color: #FFFFFF;
        margin-bottom: 8px;
        border-radius: 3px;

        .panel-title {
          line-height: 45px;
          padding-left: 10px;
          font-size: 15px;
          border-bottom: 1px solid #f4f4f4;
        }

        .panel-list-item {
          height: 45px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          padding: 0 10px;
        }

        .panel-body {
          display: flex;
          justify-content: space-around;

          .panel-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 13px;
            padding: 10px 0;

            .icon {
              width: 35px;
              height: 35px;
            }
          }
        }
      }
    }
  }
</style>
