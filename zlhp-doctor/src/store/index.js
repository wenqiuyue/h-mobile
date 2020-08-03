import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null
  },
  getters: {
    token(state) {
      return state.token;
    }
  },
  mutations: {
    login(state, payload) {
      state.token = payload;
    },
    logout(state) {
      state.token = null;
    }
  },
  actions: {
    login({ commit }, token) {
      sessionStorage.setItem("token", token);
      if (token && token !== "null") commit("login", token);
    },
    logout({ commit }) {
      sessionStorage.removeItem("token");
      commit("logout");
    }
  }
});
