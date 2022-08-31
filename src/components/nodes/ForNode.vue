<template>
  <div class="node1">
    <div class="title-box">For Loop</div>
    <div>Variable ID : {{ id }}</div>
    <div class="box">
      <input type="number" df-n1 placeholder="N1" disabled />
      <input type="number" df-n2 placeholder="N2" disabled />
      <input
        type="number"
        min="1"
        df-repeat
        placeholder="Repetición"
        @change="onChange"
      />
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
    //Se observa si hay algun cambio en la data del nodo
    //se actualiza la data de los nodos que tienen como input este nodo
    "node.data": function (newData, oldData) {
      console.log("Changing Data of For Node : " + this.id);
      console.log(this.df.getNodeFromId(this.id));

      //Se asigna el nodo
      const assignNode = this.df.getNodeFromId(this.id);

      //Se obtienen las salidas
      const outputs = assignNode.outputs.output_1.connections;

      var n1 = parseInt(assignNode.data.n1);
      var n2 = parseInt(assignNode.data.n2);

      //Para cada salida se hace por {repeat} veces la operacion
      outputs.forEach((output) => {
        //Se obtiene el nodo de salida
        const outputNode = this.df.getNodeFromId(output.node);
        console.log(outputNode);
        var data = {};

        var n2Alt = 0;
        var result = 0;

        //Desde 0 hasta {repeat} se hace la funcion
        for (var i = 0; i < assignNode.data.repeat; i++) {
          if (outputNode.name == "Suma") {
            if (i == 0) {
              result = n1 + n2;
              n2Alt = n2;
            } else {
              result += n2;
              n2Alt += n2;
            }
          } else if (outputNode.name == "Resta") {
            if (i == 0) {
              result = n1 - n2;
              n2Alt = n2;
            } else {
              result -= n2;
              n2Alt += n2;
            }
          } else if (outputNode.name == "Multiplicacion") {
            if (i == 0) {
              result = n1 * n2;
              n2Alt = n2;
            } else {
              result *= n2;
              n2Alt *= n2;
            }
          } else if (outputNode.name == "Division") {
            if (i == 0) {
              result = n1 / n2;
              n2Alt = n2;
            } else {
              result /= n2;
              n2Alt *= n2;
            }
          }
        }

        data = {
          n1: n1,
          n2: n2Alt,
          result: result,
        };

        console.log("DATA FOR");
        console.log(data);

        //Se actualiza nodo con nueva data
        this.df.updateNodeDataFromId(outputNode.id, data);

        //Se busca y actualiza en store el nodo
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
    //Obtención de drawflow instanciado en propiedaes globales
    let df = null;
    df = getCurrentInstance().appContext.config.globalProperties.$df.value;

    this.id = df != undefined ? df.nodeId : "";
    this.df = df;
  },
  updated() {
    this.node = this.drawflowStore.getNodeById(this.id);
    console.log(this.node);
  },
  setup() {
    const drawflowStore = useDrawflowStore();
    return {
      drawflowStore,
    };
  },
  methods: {
    //Función para cambiar el numero de repeat
    onChange(event) {
      const node = this.df.getNodeFromId(this.id);
      console.log("CHANGING FOR");
      console.log(node);

      const n1 = parseInt(node.data.n1);
      const n2 = parseInt(node.data.n2);
      var result = 0;

      const repeat = node.data.repeat;

      //Se actualiza codigo python en store
      var codeNode = this.drawflowStore.getLineCodeById(this.id).code;

      console.log(codeNode);

      codeNode[1] = node.data.repeat;

      console.log(codeNode);

      const codeIndexNode = this.drawflowStore.code.findIndex(
        (n) => n.id == this.id
      );
      this.drawflowStore.$patch((state) => {
        state.code[codeIndexNode].code = codeNode;
      });

      //Se actualiza nueva data y se guarda en drawflow y en store de nodos
      const data1 = {
        n1: n1,
        n2: n2,
        repeat: repeat,
      };

      this.df.updateNodeDataFromId(this.id, data1);

      var nodeIndex = this.drawflowStore.nodes.findIndex(
        (n) => n.id == this.id
      );
      this.drawflowStore.$patch((state) => {
        state.nodes[nodeIndex].data = data1;
      });

      //Se obtiene todas las salidas
      if (node.outputs.output_1.connections.length > 0) {
        for (var i = 0; i < node.outputs.output_1.connections.length; i++) {
          //Se obtiene la conexión
          const connection = node.outputs.output_1.connections[i];

          //Se obtiene a quien va el input de la conexión
          const input = this.df.getNodeFromId(connection.node);
          var data = {};
          var n2Alt = 0;

          //Se ejecuta la logica del for desde 0 hasta {repeat} entonces...
          for (var j = 0; j < repeat; j++) {
            if (input.name == "Suma") {
              if (j == 0) {
                result = n1 + n2;
                n2Alt = n2;
              } else {
                result += n2;
                n2Alt += n2;
              }
            } else if (input.name == "Resta") {
              if (j == 0) {
                result = n1 - n2;
                n2Alt = n2;
              } else {
                result -= n2;
                n2Alt += n2;
              }
            } else if (input.name == "Multiplicacion") {
              if (j == 0) {
                result = n1 * n2;
                n2Alt = n2;
              } else {
                result *= n2;
                n2Alt *= n2;
              }
            } else if (input.name == "Division") {
              if (j == 0) {
                result = n1 / n2;
                n2Alt = n2;
              } else {
                result /= n2;
                n2Alt *= n2;
              }
            }
          }

          data = {
            n1: n1,
            n2: n2Alt,
            result: result,
          };

          //Se actualiza el input
          this.df.updateNodeDataFromId(input.id, data);

          //Se actualiza el input en store
          var nodeIndex = this.drawflowStore.nodes.findIndex(
            (n) => n.id == input.id
          );
          this.drawflowStore.$patch((state) => {
            state.nodes[nodeIndex].data = data;
          });
        }
      }
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
