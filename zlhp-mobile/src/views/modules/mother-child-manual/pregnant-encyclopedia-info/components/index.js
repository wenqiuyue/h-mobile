import ImageText from './image-text';
import ArticleType from './article-type';

export default {
	install: Vue => {
		Vue.component(ImageText.name, ImageText);
		Vue.component(ArticleType.name, ArticleType);
	}
};
