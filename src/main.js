import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入element-ui 以及对应的样式表
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//axios导入
import axios from "axios";
//引入封装的axios
import service from '@/service'

Vue.config.productionTip = false
Vue.use(ElementUi)
Vue.prototype.axios=axios //挂载到原型，可以全局使用
Vue.prototype.service=service //挂载到原型，可以全局使用
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
