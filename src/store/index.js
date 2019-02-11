import Vue from "vue";
import Vuex from "vuex";

import viewport from "./modules/viewport";
import element from "./modules/element";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    viewport,
    element
  }
});
