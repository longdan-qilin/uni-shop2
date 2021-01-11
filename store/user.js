export default {
  // 为当前模块开启命名空间
  namespaced: true,
  
  // 模块 state 数据
  state: () => ({
      // 获取本地中存储的数据，初始化 address 对象
      address: JSON.parse(uni.getStorageSync('address') || '{}')
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