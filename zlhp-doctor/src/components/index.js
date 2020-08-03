import NavBar from "./nav-bar";
import Star from "./star";
import SvgIcon from "./svg-icon";
import Hint from "./hint";
import Week from "./week";
export default {
  install: Vue => {
    Vue.component(NavBar.name, NavBar);
    Vue.component(Star.name, Star);
    Vue.component(SvgIcon.name, SvgIcon);
    Vue.component(Hint.name, Hint);
    Vue.component(Week.name, Week);
  }
};
