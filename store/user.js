 // 生命一个token常量
 const Token = 'token'
 
export default {
  // 为当前模块开启命名空间
  namespaced: true,
 
  // 模块 state 数据
  state: () => ({
      // 获取本地中存储的数据，初始化 address, userinfo对象
      address: JSON.parse(uni.getStorageSync('address') || '{}'),
      userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
      // 本地存储token字符串 
      token: uni.getStorageSync(Token) || '',
      // 重定向的 object 页面的信息对象 对象，主要包含 { openType, from } 两个属性
      redirectInfo: null
  }),
  
  // 模块 mutations 方法
  mutations: {
    // 添加地址的方法 切重新赋值到state里的address中
    updateAddress(state, address) {
      state.address = address
      // 更新数据 持久化处理 调动m_user saveAddressToStorage() 这个方法
      this.commit('m_user/saveAddressToStorage')
    },
    // 将得到地址数据对象 存储到本地中 => 定义将 address 持久化存储到本地 mutations 方法
    saveAddressToStorage(state) {
      uni.setStorageSync('address',JSON.stringify(state.address))
    },
    
    // 更新用户信息的方法 
    updateUserInfo(state, userinfo) {
      // 将更新后的值 传入到vuex中
      state.userinfo = userinfo
      // 用commit()这个方法调用 m_user中的saveUserInfoToStorage()这个方法
      // 更新数据 本地持久化处理
      this.commit('m_user/saveUserInfoToStorage')
    },
    // 将vuex中的用户信息userinfo 持久化存储到本地
    saveUserInfoToStorage(state) {
      uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
    },
    
    // 更新vuex 中的用户Token
    updateToken(state, token) {
      state.token = token
      // 调用 m_user中的saveTokenToStorage()这个方法 持久化本地存储
      this.commit('m_user/saveTokenToStorage')
    },
    
    // 将vuex中的token 持久化存储到本地
    saveTokenToStorage(state) {
        uni.setStorageSync(Token, JSON.stringify(state.token))
    },
    
    // 更新vuex中的重定向对象
    updateRedirect(state, info) {
      state.redirectInfo = info
      console.log(state.redirectInfo)
    }
  },
  
  // 模块getters 属性  包装器
  getters : {
    addstr(state) {
      //  先判断有没有地址 再去拼接
      if(!state.address.provinceName) return ''
      // 拼接 省，市，区，详细地址 的字符串并返回给用户
      return state.address.provinceName + state.address.cityName  + state.address.countyName +state.address.detailInfo
    }
  }
}