import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vant from "vant";
import "vant/lib/index.css";
import apis from "./apis";
import components from "./components";
import validate from "./commons/validate"; // 表单验证模块
import "./assets/iconfont/iconfont";
import "./tools/extend";
Vue.prototype.$apis = apis;

Vue.use(vant);
Vue.use(components);
Vue.use(validate);
Vue.config.productionTip = false;

//数据缓存
// const token = sessionStorage.getItem("token");
// if(!token && location.href.indexOf('/login')===-1)
//   location.href = '/login'
// if(token && token!=='null')
store.dispatch("login", sessionStorage.getItem("token"));
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
