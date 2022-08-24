import { defineStore } from "pinia";

export const useDrawflowStore = defineStore({
  id: "drawflow",
  state: () => ({
    counter: 0,
    nodes: [],
    code: [],
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
    getNodes(state) {
      return state.nodes;
    },
    getNodeById: (state) => {
      return (id) => state.nodes.find((node) => node.id == id);
    },
    getCode(state) {
      return state.code;
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
