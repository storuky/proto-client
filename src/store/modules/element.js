const store = {
  namespaced: true,
  state: {
    all: [
      {
        id: 1,
        type: "BaseElement",
        position: { x: 0, y: 0 },
        size: { width: 100, height: 100 },
        resizable: true
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
    ],
    selectedIds: []
  },
  mutations: {
    set(state, element) {
      const idx = state.all.findIndex(o => o.id == element.id);
      state.all.splice(idx, 1, { ...state.all[idx], ...element });
    },
    select(state, { id }) {
      state.selectedIds.push(id);
    },
    deselectAll(state) {
      state.selectedIds = [];
    }
  },
  actions: {
    set({ commit }, element) {
      commit("set", element);
      Promise.resolve();
    }
  },
  getters: {
    all: state => state.all,
    selectedIds: state => state.selectedIds,
    findById: state => arg => {
      if (typeof arg == "object") {
        return state.all.filter(el => arg.includes(el.id));
      } else {
        return state.all.find(el => el.id == arg);
      }
    }
  }
};

export default store;
