import TextList from './text-list';
import Navigation from './navigation';
import Catalog from './catalog';

export default {
	install: Vue => {
		Vue.component(TextList.name, TextList);
		Vue.component(Navigation.name, Navigation);
		Vue.component(Catalog.name, Catalog);
	}
};
