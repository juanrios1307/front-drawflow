<template>
  <div class="node1">
    <div class="title-box">Assign Variable</div>
    <div>Variable ID : {{ id }}</div>
    <div class="box">
      <input type="number" df-number @change="onChange" disabled />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUpdated } from "vue";
import { useDrawflowStore } from "../../stores/drawflow";

export default {
  data() {
    return {
      id: "",
      df: "",
      node: "",
      inputs: "",
      outputs: "",
    };
  },
  watch: {
    "node.inputs": function (newN, oldN) {
      console.log("Inputs");
      console.log(newN);
      console.log(oldN);
      console.log(this.node);
    },
    "node.outputs": function (newN, oldN) {
      console.log("Outputs");
      console.log(newN);
      console.log(oldN);
      console.log(this.node);
    },
  },
  mounted() {
    let df = null;
    df = getCurrentInstance().appContext.config.globalProperties.$df.value;

    console.log(df.nodeId);
    this.id = df.nodeId;
    this.df = df;
  },
  updated() {
    this.node = this.drawflowStore.getNodeById(this.id);
    this.inputs = this.node.inputs;
    this.outputs = this.node.outputs;
    console.log(this.node);
  },
  setup() {
    const drawflowStore = useDrawflowStore();
    return {
      drawflowStore,
    };
  },
  methods: {
    onChange(event) {},
  },
};
</script>

<style>
.node1 {
  text-align: center;
}

input {
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>
