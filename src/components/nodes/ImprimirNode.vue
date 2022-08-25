<template>
  <div class="node1">
    <div class="title-box">Print Variable</div>
    <div>Variable ID : {{ id }}</div>
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
    let df = null;
    df = getCurrentInstance().appContext.config.globalProperties.$df.value;

    console.log(df.nodeId);
    this.id = df.nodeId;
    this.df = df;
  },
};
</script>
<style>
.node1 {
  text-align: center;
}
</style>
