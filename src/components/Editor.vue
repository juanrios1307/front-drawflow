<template>
  <div id="drawflow"></div>
</template>

<script>
import Drawflow from "drawflow";
import "drawflow/dist/drawflow.min.css";

export default {
  name: "editor-draw-flow",
  async mounted() {
    var id = document.getElementById("drawflow");
    const editor = new Drawflow(id);
    editor.start();
    editor.reroute = true;
    editor.addNode(
      "foo",
      1,
      1,
      0,
      100,
      "action",
      {},
      "<b>If Condition</b>",
      false
    );
    editor.addNode(
      "foo",
      1,
      1,
      0,
      300,
      "action",
      {},
      "<b>If Condition</b>",
      false
    );
    //editor.zoom = 0.5;
    var dataExport = editor.export();
  },
};
</script>

<style scoped>
#drawflow {
  width: calc(100%);
  height: calc(100% - 40px);
  text-align: initial;
  background: #ecf1f0;
  background-size: 20px 20px;
}
</style>
