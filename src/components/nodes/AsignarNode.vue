<template>
  <div class="node1">
    <div class="title-box">Assign Variable</div>
    <div>Variable ID : {{ id }}</div>
    <div class="box">
      <input type="number" df-number disabled />
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
  watch: {
    "node.data": function (newData, oldData) {
      console.log("Changing Data of Node : " + this.id);
      //console.log(this.df.getNodeFromId(this.id));

      const assignNode = this.df.getNodeFromId(this.id);

      const outputs = assignNode.outputs.output_1.connections;

      outputs.forEach((output) => {
        const outputNode = this.df.getNodeFromId(output.node);
        console.log(outputNode);

        if (
          outputNode.name == "Suma" ||
          outputNode.name == "Resta" ||
          outputNode.name == "Multiplicacion" ||
          outputNode.name == "Division"
        ) {
          var n1 = 0;
          var n2 = 0;
          if (output.output == "input_1") {
            n1 = assignNode.data.number;
            n2 = outputNode.data.n2;
          } else {
            n1 = outputNode.data.n1;
            n2 = assignNode.data.number;
          }

          const result =
            outputNode.name == "Suma"
              ? n1 + n2
              : outputNode.name == "Resta"
              ? n1 - n2
              : outputNode.name == "Multiplicacion"
              ? n1 * n2
              : outputNode.name == "Division"
              ? n1 / n2
              : 0;

          const data = {
            n1: n1,
            n2: n2,
            result: result,
          };

          this.df.updateNodeDataFromId(outputNode.id, data);

          const nodeIndex = this.drawflowStore.nodes.findIndex(
            (n) => n.id == id
          );
          this.drawflowStore.$patch((state) => {
            state.nodes[nodeIndex].data = data;
          });
        } else if (outputNode.name == "Asignar") {
          const data = {
            number: assignNode.data.number,
          };

          this.df.updateNodeDataFromId(outputNode.id, data);

          const nodeIndex = this.drawflowStore.nodes.findIndex(
            (n) => n.id == outputNode.id
          );
          this.drawflowStore.$patch((state) => {
            state.nodes[nodeIndex].data = data;
          });
        }
      });
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

input {
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>
