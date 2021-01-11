  //  按需导入mapGetters 这个辅助方法
  import { mapGetters } from 'vuex'
  
  export default {
    computed: {
      //  将m_cart 中的total属性 映射到当前页面 作为计算属性使用
      ...mapGetters('m_cart', ['total'])
    },
    watch: {
      total: {
        handler(newVal) {
           this.setBadge()
        },
        //  通过vue api 的一个方法  immediate 来实现进入页面就加载
        immediate: true   
      }
    },
    onLoad() {
       this.setBadge()
    },
    methods: {
       setBadge() {
         // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
         uni.setTabBarBadge({
           index: 2,  // 索引
           text: this.total + ''  // 注意：text 的值必须是字符串，不能是数字
         })
       }
    }
  }

