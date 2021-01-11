<template>
  <view>
    <!-- 选择收货地址的盒子 -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" class="btnChooseAddres" size="mini" @click="chooseAddress">请选择收货地址+</button>
    </view>

    <!-- 收货的信息 -->
    <view class="address-info-box" v-else  @click="chooseAddress">
      <!-- 第一行数据 -->
      <view class="row1">
        <!-- 收货人 -->
        <view class="row1-left">
          <view class="username">
            收货人：<text>{{address.userName}}</text>
          </view>
        </view>
        <view class="row1-right">
          <view class="phone">
            电话：<text>{{address.telNumber}}</text>
          </view>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>

      <!-- 第二行数据 -->
      <view class="row2">
        <view class="row2-left">
          收货地址：
        </view>
        <view class="row2-right">
          {{addstr}}
        </view>
      </view>
    </view>
    
    <!-- 下面的底部边框 -->
    <image src="/static/cart_border@2x.png" class="addres-border"></image>
  </view>
</template>

<script>
  // 导入 mapMutations辅助函数 
  // 为了提高代码的复用性，可以把收货的详细地址抽离为 getters，方便在多个页面和组件之间实现复用。
  import { mapMutations, mapState, mapGetters} from 'vuex'
  export default {
    // 计算属性 算出地址的总和 字符串拼接
    computed: {
     ...mapState('m_user', ['address']),
     // 将 m_user 模块中的 addstr 映射到当前组件中使用
     ...mapGetters('m_user', ['addstr'])
    },
    data() {
      return {};
    },
    methods: {
      // 把m_user中的 mutations addAddress()方法的映射到当前页面方法中
       ...mapMutations('m_user', ['updateAddress']),
      async chooseAddress() {
        // 通过uni.chooseAddress() 这个方法  异步获取收货地址 返回的是一个promise对象
        // 返回2个参数 err succ  失败  和 成功
        const [err, succ] = await uni.chooseAddress().catch(err => err)
        
        // 如果err返回的是null 'chooseAddress:ok' 那么获取地址成功
        if(succ && succ.errMsg ==='chooseAddress:ok') {
          //  为data里的address对象赋值
          // this.address = succ
          this.updateAddress(succ)
        }
        // 如果用户没有授权
      //   if(err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response')) {
      //     this.reAuth()  // reAuth() 可以让用户重新授权
      //   }
      // },
       // async reAuth() {
       //   const [err2, confirmResult] = await uni.showModal({
       //     content: '检测到您还没打开地址权限，是否去打开？',
       //     confirmText: '确认',
       //     cancelText: '取消'
       //   })
         //  如果弹框异常，则直接退出
         // if(err2) return
         // // 用户取消了授权 提出提示框
         // if(confirmResult.cancel) uni.$showMsg('您取消了授权地址权限!')
         // 用户确认去授权  uni.openSetting() 方法进入授权页面，让用户重新进行授权

         // if(confirmResult.confirm) return uni.openSetting({
         //   success: (settingResult) => {
         //     // 授权之前需要进一步确认用户是否授权 勾选了才可以 防止用户进入后退出
         //     if(!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了授权地址权限！')
         //     // 如果结果为 true 表示用户同意授权 勾选权限成功
         //     if(settingResult.authSetting['scope.address'])  return uni.$showMsg('授权成功！')
         //   }
         // })
       }
    }
  }
</script>

<style lang="scss">
  // 选择收货地址的盒子
  .address-choose-box {
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  // 渲染收货信息的盒子
  .address-info-box {
    display: flex;
    height: 90px;
    flex-direction: column;
    justify-content: center;
    padding: 0 5px;
    font-size: 12px;
    // 第一行数据
    .row1 {
      display: flex;
      justify-content: space-between;
      .row1-right {
        display: flex;
        align-items: center;
        .phone {
          margin-right: 5px;
        }
      }
    }
    // 第二行数据
    .row2 {
      display: flex;
      align-items: center;
      margin-top: 10px;
      .row2-left {
        white-space: nowrap;
      }
    }
  }
  
// 底部边框线的样式
  .addres-border {
    width: 100%;
    display: block;
    height: 5px;
  }
</style>
