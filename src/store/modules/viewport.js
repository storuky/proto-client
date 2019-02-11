const store = {
  namespaced: true,
  state: {
    transform: { x: 0, y: 0, scale: 1 },
    gridDistance: null,
    gridOffset: null
  },
  mutations: {
    setTransform(state, transform) {
      state.transform = transform;
    },
    setGridDistance(state, gridDistance) {
      state.gridDistance = gridDistance;
    },
    setGridOffset(state, gridOffset) {
      state.gridOffset = gridOffset;
    }
  },
  actions: {
    setTransform({ commit }, transform) {
      commit("setTransform", transform);
      Promise.resolve();
    }
  },
  getters: {
    transform: state => state.transform,
    gridDistance: state => state.gridDistance,
    gridOffset: state => state.gridOffset
  }
};

export default store;
