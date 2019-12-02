import Vue from 'vue'
import App from './App'
import constant from '@/constant/constant'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.$APP_ID = Vue.prototype.$APP_ID = constant.$APP_ID

const app = new Vue(App)
app.$mount()

export default {
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序"
    }
  }
}
