import SvgIcon from './svg-icon';
import Hint from './hint';
import Combobox from './combobox';
import Steps from './steps';
import Cascade from './cascade';
import Date from './date';
import Tips from './tips';
import TitleBg from './title-bg';
import TitleStyle from './title-style';
import SimpleHeader from './simple-header';
import TitleCircle from './title-circle';
import Petal from './petal';

export default {
	install: Vue => {
		Vue.component(SvgIcon.name, SvgIcon);
		Vue.component(Hint.name, Hint);
		Vue.component(Combobox.name, Combobox);
		Vue.component(Steps.name, Steps);
		Vue.component(Cascade.name, Cascade);
		Vue.component(Date.name, Date);
		Vue.component(Tips.name, Tips);
		Vue.component(TitleBg.name, TitleBg);
		Vue.component(TitleStyle.name, TitleStyle);
		Vue.component(SimpleHeader.name, SimpleHeader);
		Vue.component(TitleCircle.name, TitleCircle);
		Vue.component(Petal.name, Petal);
	}
};
