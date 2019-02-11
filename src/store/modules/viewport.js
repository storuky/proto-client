const store = {
  namespaced: true,
  state: {
    transform: { x: 0, y: 0, scale: 1 }
  },
  mutations: {
    setTransform(state, transform) {
      state.transform = transform;
    }
  },
  actions: {
    setTransform({ commit }, transform) {
      commit("setTransform", transform);
      Promise.resolve();
    }
  },
  getters: {
    transform: state => state.transform
  }
};

export default store;
