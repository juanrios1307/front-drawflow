<template>
  <div class="node1">
    <div class="title-box">Add Two Numbers</div>
    <div>Variable ID : {{ id }}</div>
    <div class="box">
      <input disabled df-result />
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
      console.log("Changing Data of Sum Node : " + this.id);

      //Se asigna assignNode a el nodo en cuestion
      const assignNode = this.df.getNodeFromId(this.id);

      //Se obtienen las outputs del nodo
      const outputs = assignNode.outputs.output_1.connections;

      //Para cada nodo se actualzia la info
      outputs.forEach((output) => {
        //Se obtiene el nodo de salida
        const outputNode = this.df.getNodeFromId(output.node);
        console.log(outputNode);
        var data = {};

        var n1 = 0;
        var n2 = 0;

        //Si el nodo entra por la input 1, se hace n1 = resultado de assignNode y n2 se deja igual
        //Si el nodo entra por la input 2, se hace n2 = resultado de assignNode y n1 se deja igual
        if (
          outputNode.name == "Suma" ||
          outputNode.name == "Resta" ||
          outputNode.name == "Multiplicacion" ||
          outputNode.name == "Division"
        ) {
          if (output.output == "input_1") {
            n1 = assignNode.data.result;
            n2 = outputNode.data.n2;
          } else {
            n1 = outputNode.data.n1;
            n2 = assignNode.data.result;
          }

          console.log(outputNode);
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
          //Si es un if, se determina el parametro isTrue basado en el cambio de datos
          var n1 = 0;
          var n2 = 0;
          if (output.output == "input_1") {
            n1 = assignNode.data.result;
            n2 = outputNode.data.n2;
          } else {
            n1 = outputNode.data.n1;
            n2 = assignNode.data.result;
          }
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

          if (output.output == "input_1") {
            n1 = assignNode.data.result;
            n2 = outputNode.data.n2;
          } else {
            n1 = outputNode.data.n1;
            n2 = assignNode.data.result;
          }

          data = {
            n1: parseInt(n1),
            n2: parseInt(n2),
            repeat: outputNode.data.repeat,
          };
        } else if (outputNode.name == "Asignar") {
          data = {
            number: assignNode.data.result,
          };
        }

        //Para cada salida se actualiza con la nueva data
        this.df.updateNodeDataFromId(outputNode.id, data);

        //Se busca el nodo en la store y tambien se actualiza
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
