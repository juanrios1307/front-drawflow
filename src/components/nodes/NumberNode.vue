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
    this.id = df.nodeId;
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

      if (node.outputs.output_1.connections.length > 0) {
        for (var i = 0; i < node.outputs.output_1.connections.length; i++) {
          const connection = node.outputs.output_1.connections[i];
          const inputNode = this.df.getNodeFromId(connection.node);

          const input_class = connection.output;
          const input = inputNode;
          const output = node;
          var data = {};
          if (input.name == "Suma") {
            if (input_class == "input_1") {
              const n1 = output.data.number;
              const n2 = input.data.n2;

              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) + parseInt(n2),
              };
            } else {
              const n1 = input.data.n1;
              const n2 = output.data.number;
              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) + parseInt(n2),
              };
            }
          } else if (input.name == "Resta") {
            if (input_class == "input_1") {
              const n1 = output.data.number;
              const n2 = input.data.n2;
              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) - parseInt(n2),
              };
            } else {
              const n1 = input.data.n1;
              const n2 = output.data.number;
              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) - parseInt(n2),
              };
            }
          } else if (input.name == "Multiplicacion") {
            if (input_class == "input_1") {
              const n1 = output.data.number;
              const n2 = input.data.n2;
              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) * parseInt(n2),
              };
            } else {
              const n1 = input.data.n1;
              const n2 = output.data.number;
              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) * parseInt(n2),
              };
            }
          } else if (input.name == "Division") {
            if (input_class == "input_1") {
              const n1 = output.data.number;
              const n2 = input.data.n2;
              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) / parseInt(n2),
              };
            } else {
              const n1 = input.data.n1;
              const n2 = output.data.number;
              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) / parseInt(n2),
              };
            }
          } else if (input.name == "If") {
            if (input_class == "input_1") {
              const n1 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;
              const n2 = input.data.n2;
              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                condition: input.data.condition,
              };
            } else {
              const n1 = input.data.n1;
              const n2 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;
              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                condition: input.data.condition,
              };
            }
          } else if (input.name == "For") {
            if (input_class == "input_1") {
              const n1 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;
              const n2 = input.data.n2;
              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                repeat: input.data.repeat,
              };
            } else {
              const n1 = input.data.n1;
              const n2 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;
              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                repeat: input.data.repeat,
              };
            }
          } else if (input.name == "Asignar") {
            data = {
              number: parseInt(
                output.name == "Numero"
                  ? output.data.number
                  : output.data.result
              ),
            };
          }
          this.df.updateNodeDataFromId(input.id, data);

          const nodeIndex = this.drawflowStore.nodes.findIndex(
            (n) => n.id == input.id
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
}

input {
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>
