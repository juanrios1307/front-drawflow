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
    //Obtención de drawflow instanciado en propiedaes globales
    let df = null;
    df = getCurrentInstance().appContext.config.globalProperties.$df.value;
    this.id = df != undefined ? df.nodeId : "";
    this.df = df;
  },
  setup() {
    const drawflowStore = useDrawflowStore();

    return {
      drawflowStore,
    };
  },
  methods: {
    //Función para cambiar data de nodos conectados a numero cuando se hace un cambio en este
    onChange(event) {
      const node = this.df.getNodeFromId(this.id);

      //Se obtiene y se cambia parte del codigo de numero
      var codeNode = this.drawflowStore.getLineCodeById(this.id).code;

      codeNode[2] = node.data.number;

      console.log(codeNode);

      //Se obtiene index del nodo en store de codigo
      const codeIndexNode = this.drawflowStore.code.findIndex(
        (n) => n.id == this.id
      );

      //Se actualiza el nuevo codigo
      this.drawflowStore.$patch((state) => {
        state.code[codeIndexNode].code = codeNode;
      });

      //Se obtienen las salidas del nodo
      if (node.outputs.output_1.connections.length > 0) {
        //Para cada salida se actualizan los datos
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
              number: node.data.number,
            };
          }

          //Se actualiza nodo con nuevos datos
          this.df.updateNodeDataFromId(outputNode.id, data);

          //Se busca el index en la store
          const nodeIndex = this.drawflowStore.nodes.findIndex(
            (n) => n.id == outputNode.id
          );
          //Se guarda en la store
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
