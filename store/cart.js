export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
  }),

  // 模块的 mutations 方法
  mutations: {
    // 添加商品
    addToCart(state, goods) {
      // 根据提交的商品的Id，查询购物车中是否存在这件商品
      // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if (!findResult) {
        //  如果购物车没有这件商品 就push给cart
        state.cart.push(goods)
      } else {
        // 如果购物车中有这件商品，则只更新数量即可
        findResult.goods_count++
      }
      //  通过 commit方法 调用 saveToStorage()这个方法
      this.commit('m_cart/saveToStorage')
    },
    // 把商品数量保存本地中
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新本地中cart的单选框的状态
    updateGoodsState(state, goods) {
      // 查询商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      // 有对应的商品信息对象
      if (findResult) {
        // 改变其中的状态
        findResult.goods_state = goods.goods_state
        //  持久化处理 储存本地中 
        this.commit('m_cart/saveToStorage')
      }
    },
    // 更新本地的cart 的 商品数量
    updateGoodsCount(state, goods) {
      // 查询商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      // 有对应的商品信息对象
      if (findResult) {
        // 改变其中的状态
        findResult.goods_count = goods.goods_count
        //  持久化处理 储存本地中 
        this.commit('m_cart/saveToStorage')
      }
    },
    // 通过商品id 删除对应的商品
    removeByID(state, goods_id) {
      // 通过filter查询商品的信息对象 排除指定删除的商品
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      // 本地存储持久化处理
      this.commit('m_cart/saveToStorage')
    },
    // 更新所有商品的勾选状态
    updateAllGoodsState(state, newState) {
      // 循环更新每件购物商品的勾选状态
      state.cart.forEach(x => x.goods_state = newState)
      // 本地存储持久化处理
      this.commit('m_cart/saveToStorage')
    }
  },

  // 模块的 getters 属性
  getters: {
    // 统计购物车商品的总数量
    total(state) {
      // 声明一个变量用来接收 自增的数量
      // let c = 0
      // 循环遍历商品信息对象 把每次自增的数量累加
      // state.cart.forEach(goods =>c += goods.goods_count)
      // return c
      return state.cart.reduce((total, goods) => total += goods.goods_count, 0)
    },
    // 勾选商品的数量
    checkoutCount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品总数量进行累加
      // reduce() 的返回值就是已勾选的商品的总数量
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    // 统计商品的总的价格 
    checkedGoodsAmount(state) {
      return state.cart.filter(x => x.goods_state)
        .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
        .toFixed(2)
    }
  }
}
