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
    node(newN, oldN) {
      console.log(newN);
      console.log(oldN);
    },
  },
  mounted() {
    let df = null;
    df = getCurrentInstance().appContext.config.globalProperties.$df.value;
    this.id = df.nodeId;
    this.df = df;
    //this.node = df.getNodeFromId(df.nodeId);
  },
  setup() {
    const drawflowStore = useDrawflowStore();

    return {
      drawflowStore,
    };
  },
  methods: {
    onChange(event) {
      /* const node = this.df.getNodeFromId(this.id);

      if (node.outputs.output_1.connections.length > 0) {
        for (var i = 0; i < node.outputs.output_1.connections.length; i++) {
          const connection = node.outputs.output_1.connections[i];
          const inputNode = this.df.getNodeFromId(connection.node);

          const input_class = connection.output;

          if (inputNode.name == "Suma") {
            if (input_class == "input_1") {
              const n1 = node.data.number;
              const n2 = inputNode.data.n2;
              this.df.updateNodeDataFromId(inputNode.id, {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) + parseInt(n2),
              });
            } else {
              const n1 = inputNode.data.n1;
              const n2 = node.data.number;
              this.df.updateNodeDataFromId(inputNode.id, {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) + parseInt(n2),
              });
            }
          } else if (inputNode.name == "Resta") {
            if (input_class == "input_1") {
              const n1 = node.data.number;
              const n2 = inputNode.data.n2;
              this.df.updateNodeDataFromId(inputNode.id, {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) - parseInt(n2),
              });
            } else {
              const n1 = inputNode.data.n1;
              const n2 = node.data.number;
              this.df.updateNodeDataFromId(inputNode.id, {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) - parseInt(n2),
              });
            }
          } else if (inputNode.name == "Multiplicacion") {
            if (input_class == "input_1") {
              const n1 = node.data.number;
              const n2 = inputNode.data.n2;
              this.df.updateNodeDataFromId(inputNode.id, {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) * parseInt(n2),
              });
            } else {
              const n1 = inputNode.data.n1;
              const n2 = node.data.number;
              this.df.updateNodeDataFromId(inputNode.id, {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) * parseInt(n2),
              });
            }
          } else if (inputNode.name == "Division") {
            if (input_class == "input_1") {
              const n1 = node.data.number;
              const n2 = inputNode.data.n2;
              this.df.updateNodeDataFromId(inputNode.id, {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) / parseInt(n2),
              });
            } else {
              const n1 = inputNode.data.n1;
              const n2 = node.data.number;
              this.df.updateNodeDataFromId(inputNode.id, {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) / parseInt(n2),
              });
            }
          } else if (inputNode.name == "Numero") {
            const n = node.data.number;
            this.df.updateNodeDataFromId(inputNode.id, {
              number: parseInt(n),
            });
          }
        }
      }
      return 1;*/
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
