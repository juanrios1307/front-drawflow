import { defineStore } from "pinia";

export const useDrawflowStore = defineStore({
  id: "drawflow",
  state: () => ({
    counter: 0,
    nodes: [],
    code: [],
    programs : [],
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
    getLineCodeById: (state) => {
      return (id) => state.code.find((line) => line.id == id);
    },
    getPrograms(state) {
      return state.programs;
    },
    getProgramById: (state) => {
      return (uid) => state.programs.find((program) => program.uid == uid);
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
