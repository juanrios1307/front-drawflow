<template>
  <div class="node1">
    <div class="title-box">If Condition</div>
    <div>Variable ID : {{ id }}</div>
    <div class="box">
      <input type="number" df-n1 placeholder="N1" disabled />
      <input type="number" df-n2 placeholder="N2" disabled />
      <select df-condition @change="onChange">
        <option value="mayor">N1 &#62; N2</option>
        <option value="menor">N1 &#60; N2</option>
        <option value="igual">N1 == N2</option>
      </select>
    </div>
    <div>
      <input df-isTrue disabled />
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
      console.log("Changing Data of If Node : " + this.id);
      //console.log(this.df.getNodeFromId(this.id));

      //Se obtiene la data de este nodo
      const assignNode = this.df.getNodeFromId(this.id);

      //Se obtiene la variable true
      const isTrue = assignNode.data.isTrue;

      //Se obtienen las salidas
      const outputs = assignNode.outputs.output_1.connections;

      //Para cada salida se actualiza la data con respecto a la condicion isTrue
      outputs.forEach((output) => {
        const outputNode = this.df.getNodeFromId(output.node);
        console.log(outputNode);
        var data = {};

        if (isTrue) {
          if (
            outputNode.name == "Suma" ||
            outputNode.name == "Resta" ||
            outputNode.name == "Multiplicacion" ||
            outputNode.name == "Division"
          ) {
            var n1 = parseInt(assignNode.data.n1);
            var n2 = parseInt(assignNode.data.n2);

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
          } else if (outputNode.name == "For") {
            var n1 = parseInt(assignNode.data.n1);
            var n2 = parseInt(assignNode.data.n2);

            data = {
              n1: parseInt(n1),
              n2: parseInt(n2),
              repeat: outputNode.data.repeat,
            };
          }
        } else {
          if (
            outputNode.name == "Suma" ||
            outputNode.name == "Resta" ||
            outputNode.name == "Multiplicacion" ||
            outputNode.name == "Division"
          ) {
            data = {
              n1:
                outputNode.name == "Suma" || outputNode.name == "Resta" ? 0 : 1,
              n2:
                outputNode.name == "Suma" || outputNode.name == "Resta" ? 0 : 1,
              result:
                outputNode.name == "Suma" || outputNode.name == "Resta" ? 0 : 1,
            };
          } else if (outputNode.name == "For") {
            data = {
              n1: parseInt(0),
              n2: parseInt(0),
              repeat: outputNode.data.repeat,
            };
          }
        }

        //Se actualiza cada nodo de salida
        this.df.updateNodeDataFromId(outputNode.id, data);

        //Se obtiene index de la store y se actualiza cada nodo
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
  methods: {
    //Función para cambiar datos de salidas del IF cuando se cambia la condición
    onChange(event) {
      const node = this.df.getNodeFromId(this.id);
      console.log(node);

      const n1 = parseInt(node.data.n1);
      const n2 = parseInt(node.data.n2);

      const isTrue =
        node.data.condition == "mayor" && n1 > n2
          ? true
          : node.data.condition == "menor" && n1 < n2
          ? true
          : node.data.condition == "igual" && n1 == n2
          ? true
          : false;

      //Se cambia codigo del nodo
      var codeNode = this.drawflowStore.getLineCodeById(this.id).code;

      console.log(codeNode);

      const cond =
        node.data.condition == "mayor"
          ? " > "
          : node.data.condition == "menor"
          ? " < "
          : " == ";

      codeNode[2] = cond;

      console.log(codeNode);

      //Se actualiza storedel codigo
      const codeIndexNode = this.drawflowStore.code.findIndex(
        (n) => n.id == this.id
      );
      this.drawflowStore.$patch((state) => {
        state.code[codeIndexNode].code = codeNode;
      });

      const data1 = {
        n1: n1,
        n2: n2,
        condition: node.data.condition,
        isTrue: isTrue,
      };

      //Se actualiza nodo en drawflow y en store de nodos
      this.df.updateNodeDataFromId(this.id, data1);

      var nodeIndex = this.drawflowStore.nodes.findIndex(
        (n) => n.id == this.id
      );
      this.drawflowStore.$patch((state) => {
        state.nodes[nodeIndex].data = data1;
      });

      //Se obtienen todas las conexiones y se actualiza la data en correspondencia a la condicion
      //Si es verdadera la condición se actualiza la data de las salidas
      //Si es falsa se asignan 0 y 1 segun el caso a la data de las salidas
      if (node.outputs.output_1.connections.length > 0) {
        for (var i = 0; i < node.outputs.output_1.connections.length; i++) {
          const connection = node.outputs.output_1.connections[i];
          const inputNode = this.df.getNodeFromId(connection.node);
          var data = {};

          if (isTrue) {
            if (
              inputNode.name == "Suma" ||
              inputNode.name == "Resta" ||
              inputNode.name == "Multiplicacion" ||
              inputNode.name == "Division"
            ) {
              const result =
                inputNode.name == "Suma"
                  ? n1 + n2
                  : inputNode.name == "Resta"
                  ? n1 - n2
                  : inputNode.name == "Multiplicacion"
                  ? n1 * n2
                  : inputNode.name == "Division"
                  ? n1 / n2
                  : 0;

              data = {
                n1: n1,
                n2: n2,
                result: result,
              };
            } else if (inputNode.name == "For") {
              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                repeat: inputNode.data.repeat,
              };
            }
          } else {
            if (
              inputNode.name == "Suma" ||
              inputNode.name == "Resta" ||
              inputNode.name == "Multiplicacion" ||
              inputNode.name == "Division"
            ) {
              data = {
                n1:
                  inputNode.name == "Suma" || inputNode.name == "Resta" ? 0 : 1,
                n2:
                  inputNode.name == "Suma" || inputNode.name == "Resta" ? 0 : 1,
                result:
                  inputNode.name == "Suma" || inputNode.name == "Resta" ? 0 : 1,
              };
            } else if (inputNode.name == "For") {
              data = {
                n1: parseInt(0),
                n2: parseInt(0),
                repeat: inputNode.data.repeat,
              };
            }
          }

          //Se actualiza el nodo output con la nueva data
          this.df.updateNodeDataFromId(inputNode.id, data);

          //Se obtiene el index del nodo y se actualiza en store
          var nodeIndex = this.drawflowStore.nodes.findIndex(
            (n) => n.id == inputNode.id
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
