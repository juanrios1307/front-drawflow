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
        var data = {};
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

          data = {
            n1: n1,
            n2: n2,
            result: result,
          };
        } else if (outputNode.name == "If") {
          var n1 = 0;
          var n2 = 0;
          if (output.output == "input_1") {
            n1 = assignNode.data.number;
            n2 = outputNode.data.n2;
          } else {
            n1 = outputNode.data.n1;
            n2 = assignNode.data.number;
          }

          const isTrue =
            input.data.condition == "mayor" && n1 > n2
              ? true
              : input.data.condition == "menor" && n1 < n2
              ? true
              : input.data.condition == "igual" && n1 == n2
              ? true
              : false;

          data = {
            n1: parseInt(n1),
            n2: parseInt(n2),
            condition: outputNode.data.condition,
            isTrue: isTrue,
          };
        } else if (outputNode.name == "For") {
          var n1 = 0;
          var n2 = 0;

          if (output.output == "input_1") {
            n1 = assignNode.data.number;
            n2 = outputNode.data.n2;
          } else {
            n1 = outputNode.data.n1;
            n2 = assignNode.data.number;
          }

          data = {
            n1: parseInt(n1),
            n2: parseInt(n2),
            repeat: outputNode.data.repeat,
          };
        } else if (outputNode.name == "Asignar") {
          data = {
            number: assignNode.data.number,
          };
        }

        this.df.updateNodeDataFromId(outputNode.id, data);

        const nodeIndex = this.drawflowStore.nodes.findIndex(
          (n) => n.id == outputNode.id
        );
        this.drawflowStore.$patch((state) => {
          state.nodes[nodeIndex].data = data;
        });
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
