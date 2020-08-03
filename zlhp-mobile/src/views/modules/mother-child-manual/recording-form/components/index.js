import Type0 from './type0';
import Type1 from './type1';
import Type2 from './type2';
import Type3 from './type3';
import Type4 from './type4';
import Type5 from './type5';
import Type6 from './type6';
import Type78 from './type78';
import Type10 from './type10';
import Type12 from './type12';
import FirstFormTime from './first-form-time';
import FirstFormImg from './first-form-img';

export default {
	install: Vue => {
		Vue.component(Type0.name, Type0);
		Vue.component(Type1.name, Type1);
		Vue.component(Type2.name, Type2);
		Vue.component(Type3.name, Type3);
		Vue.component(Type4.name, Type4);
		Vue.component(Type5.name, Type5);
		Vue.component(Type6.name, Type6);
		Vue.component(Type78.name, Type78);
		Vue.component(Type10.name, Type10);
		Vue.component(Type12.name, Type12);
		Vue.component(FirstFormTime.name, FirstFormTime);
		Vue.component(FirstFormImg.name, FirstFormImg);
	}
};
