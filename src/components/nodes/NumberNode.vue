<template>
  <div class="node1">
    <div class="title-box">Enter a number</div>
    <div>Number ID : {{ id }}</div>
    <div class="box">
      <input type="number" df-number @change="onChange" />
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
    };
  },
  mounted() {
    let df = null;
    df = getCurrentInstance().appContext.config.globalProperties.$df.value;
    this.id = df!=undefined?df.nodeId:"";
    this.df = df;
  },
  setup() {
    const drawflowStore = useDrawflowStore();

    return {
      drawflowStore,
    };
  },
  methods: {
    onChange(event) {
      const node = this.df.getNodeFromId(this.id);

      var codeNode = this.drawflowStore.getLineCodeById(this.id).code;

      codeNode[2] = node.data.number;

      console.log(codeNode);

      const codeIndexNode = this.drawflowStore.code.findIndex(
        (n) => n.id == this.id
      );
      this.drawflowStore.$patch((state) => {
        state.code[codeIndexNode].code = codeNode;
      });

      if (node.outputs.output_1.connections.length > 0) {
        for (var i = 0; i < node.outputs.output_1.connections.length; i++) {
          const connection = node.outputs.output_1.connections[i];
          const outputNode = this.df.getNodeFromId(connection.node);

          const input_class = connection.output;

          var data = {};
          if (
            outputNode.name == "Suma" ||
            outputNode.name == "Resta" ||
            outputNode.name == "Multiplicacion" ||
            outputNode.name == "Division"
          ) {
            var n1 = 0;
            var n2 = 0;
            if (input_class == "input_1") {
              n1 = node.data.number;
              n2 = outputNode.data.n2;
            } else {
              n1 = outputNode.data.n1;
              n2 = node.data.number;
            }
            n1 = parseInt(n1);
            n2 = parseInt(n2);

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
            if (input_class == "input_1") {
              n1 = node.data.number;
              n2 = outputNode.data.n2;
            } else {
              n1 = outputNode.data.n1;
              n2 = node.data.number;
            }

            n1 = parseInt(n1);
            n2 = parseInt(n2);

            const isTrue =
              outputNode.data.condition == "mayor" && n1 > n2
                ? true
                : outputNode.data.condition == "menor" && n1 < n2
                ? true
                : outputNode.data.condition == "igual" && n1 == n2
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

            if (input_class == "input_1") {
              n1 = node.data.number;
              n2 = outputNode.data.n2;
            } else {
              n1 = outputNode.data.n1;
              n2 = node.data.number;
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
        }
      }
      return 1;
    },
  },
};
</script>

<style>
.node1 {
  text-align: center;
  border-radius: 25px;
}

input {
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>
