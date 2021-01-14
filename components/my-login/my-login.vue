<template>
  <view class="login-container">
    <uni-icons type='contact-filled' size='100' color='#AFAFAF'></uni-icons>
    <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo='getUserInfo'>一键登录</button>
    <text class="tips-text">登录后尽享更多权益</text>
  </view>
</template>

<script>
  // 从vuex 中导入 mapMutations mapState 辅助函数
  import { mapMutations } from 'vuex'
  import { mapState } from 'vuex'
  export default {
    computed:{
      ...mapState('m_user', ['redirectInfo'])
    },
    data() {
      return {

      };
    },
    methods:{
      // 在 m_user 中 将updateUserInfo() 映射到当前页面的方法中
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken',  'updateRedirect']),
      getUserInfo(e) {
        // 如果用户没有授权
        // 取消授权的 当e.detail.errMsg 有这个 getUserInfo 事件出来的 用户选择拒绝了权限
        if(e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了用户信息授权！')
        // 将获取的用户信息存储到vuex中
        this.updateUserInfo(e.detail.userInfo)
        // 调用 getToken 函数 获取token
        this.getToken(e.detail)
      }, 
      // 调用登录接口，换取永久的 token
      async getToken(info) {
        // 调用微信登录接口
        const [err, succ]  = await uni.login().catch(err => err)
        // 判断登录失败的话 提示用户
        if(succ.errMsg !== 'login:ok') uni.$showMsg('登录授权失败！')

       // 准备参数对象
       const query = {
         code: succ.code,
         encryptedData: info.encryptedData,
         iv: info.iv,
         rawData: info.rawData,
         signature: info.signature
       }
       
       /* 因为 不能获取token 现在可以假设token 登陆进去*/
       this.updateToken("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o")
       
       // 请求从后端获取token
       // const { data : loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
       // console.log(loginResult)
       // if(loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
       // uni.$showMsg('登录成功！')
       // this.updateToken(loginResult.message.token)
       
       // 判断 vuex 中的 redirectInfo 是否为 null
       // 如果不为 null，则登录成功之后，需要重新导航到对应的页面
       this.navigateback()
      },
      // 返回登录之前的页面
      navigateback() {
        // 如果redirectInfo 不为 null，并且导航方式为 switchTab
        if(this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            // 接口调用结束的时候回调函数
            complete: () => {
              // 清空vuex中的 redirectInfo
              this.updateRedirect(null)
            }
          })
        }
      }
    }
    
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #f8f8f8;
    overflow: hidden;
    position: relative;
    
     // 绘制登录盒子底部的半椭圆造型
     &::after {
       content: '';
       display: block;
       position: absolute;
       left: 0;
       bottom: 0;
       width: 100%;
       background-color: white;
       height: 40px;
       border-radius: 100%;
       transform: translateY(50%);
     }
     
    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c00000;
    }

    // 按钮下方提示消息的样式
    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
