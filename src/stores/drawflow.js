import { defineStore } from "pinia";

export const useDrawflowStore = defineStore({
  id: "drawflow",
  state: () => ({
    counter: 0,
    nodes: [],
    connections: [],
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
    getNodes(state) {
      return state.nodes;
    },
  },
  actions: {
    increment() {
      this.counter++;
    },
    suma(n1, n2) {
      return n1 + n2;
    },
  },
});
