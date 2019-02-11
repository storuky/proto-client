const store = {
  namespaced: true,
  state: {
    all: [
      {
        id: 1,
        type: "BaseElement",
        position: { x: 0, y: 0 },
        size: { width: 100, height: 100 }
      },
      {
        id: 2,
        type: "BaseElement",
        position: { x: 100, y: 100 },
        size: { width: 50, height: 200 }
      },
      {
        id: 3,
        type: "LineElement",
        position: { x: 250, y: 200 }
      }
    ]
  },
  mutations: {
    set(state, element) {
      const idx = state.all.findIndex(o => o.id == element.id);
      state.all.splice(idx, 1, { ...state.all[idx], ...element });
    }
  },
  actions: {
    set({ commit }, element) {
      commit("set", element);
      Promise.resolve();
    }
  },
  getters: {
    all: state => state.all
  }
};

export default store;
