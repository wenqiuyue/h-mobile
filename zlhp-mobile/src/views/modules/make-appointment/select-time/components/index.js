import Type0 from './type0';
import Type1 from './type1';
import Type2 from './type2';

export default {
	install: Vue => {
		Vue.component(Type0.name, Type0);
		Vue.component(Type1.name, Type1);
		Vue.component(Type2.name, Type2);
	}
};
