import Vue from 'vue'
import App from './App'
// 按需导入 $http 对象 网络请求包
import { $http } from '@escook/request-miniprogram'
// 1. 导入 store 的实例对象
import store from './store/store.js'
// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://www.uinav.com'
// 请求拦截器
$http.beforeRequest = function(option) {
  uni.showLoading({
    title: '数据加载中...'
  })
}
// 响应拦截器
$http.afterRequest = function(option) {
  uni.hideLoading()
}
// 封装展示提示消息的方法
uni.$showMsg = function(title ='加载中...',duration = 1500) {
 uni.showToast({
   title,
   duration,
   icon: 'none'
 })
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
    // 2. 将 store 挂载到 Vue 实例上
    store,
})
app.$mount()
