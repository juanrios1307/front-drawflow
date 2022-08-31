<template>
  <div class="node1">
    <div class="title-box">Print Variable</div>
    <div>Variable ID : {{ id }}</div>
    <div class="box">
      <input df-var disabled />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";
import { useDrawflowStore } from "../../stores/drawflow";

export default {
  data() {
    return {
      id: "",
      df: "",
      node: "",
    };
  },
  mounted() {
    //Obtención de drawflow instanciado en propiedaes globales
    let df = null;
    df = getCurrentInstance().appContext.config.globalProperties.$df.value;

    this.id = df != undefined ? df.nodeId : "";
    this.df = df;
  },
  updated() {
    this.node = this.drawflowStore.getNodeById(this.id);
  },
  setup() {
    const drawflowStore = useDrawflowStore();
    return {
      drawflowStore,
    };
  },
};
</script>
<style>
.node1 {
  text-align: center;
}
</style>
