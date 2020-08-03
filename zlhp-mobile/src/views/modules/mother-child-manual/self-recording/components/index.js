import RecordingType from './recording-type';
import SelectType from './select-type';
import SweetTimeType from './sweet-time-type';

export default {
	install: Vue => {
		Vue.component(RecordingType.name, RecordingType);
		Vue.component(SelectType.name, SelectType);
		Vue.component(SweetTimeType.name, SweetTimeType);
	}
};
