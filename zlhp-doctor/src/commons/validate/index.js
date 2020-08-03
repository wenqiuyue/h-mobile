// vee-validate 验证模块
import {
  ValidationObserver,
  ValidationProvider,
  localize,
  extend
} from "vee-validate";
import ZH_CN from "vee-validate/dist/locale/zh_CN.json";
import * as rules from "vee-validate/dist/rules";
import * as customRules from "./rules";

localize("zh_CN", ZH_CN);
Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule],
    message: ZH_CN.messages[rule]
  });
});

Object.keys(customRules).forEach(rule => {
  extend(rule, {
    ...customRules[rule]
  });
});

export default {
  install: Vue => {
    Vue.component("ValidationObserver", ValidationObserver);
    Vue.component("ValidationProvider", ValidationProvider);
  }
};
