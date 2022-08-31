<template>
  <div class="row">
    <div class="col-4" id="drag">
      <h4>Modulo de Operaciones</h4>
      <ul class="list-group list-group-flush">
        <li
          class="list-group-item a"
          v-for="n in listNodes"
          :key="n.ID"
          draggable="true"
          :data-node="n.item"
          @dragstart="drag($event, n.name)"
        >
          <div class="card">
            <div class="card-body" style="color: #17202a">{{ n.name }}</div>
          </div>
        </li>
      </ul>
    </div>

    <div class="col-8" id="editor" v-on:keyup="keyPress">
      <h4>Editor</h4>
      <div
        id="drawflow"
        ref="drawflow"
        @drop="drop($event)"
        @dragover="allowDrop($event)"
      ></div>
    </div>
  </div>
</template>

<script>
import { h, getCurrentInstance, render, onMounted, shallowRef, ref } from "vue";
import Drawflow from "drawflow";
import "drawflow/dist/drawflow.min.css";

import { useDrawflowStore } from "../stores/drawflow";

import Numero from "./nodes/NumberNode.vue";
import Suma from "./nodes/SumNode.vue";
import Resta from "./nodes/RestaNode.vue";
import Multiplicacion from "./nodes/MultiplicacionNode.vue";
import Division from "./nodes/DividirNode.vue";
import If from "./nodes/IfNode.vue";
import For from "./nodes/ForNode.vue";
import Asignar from "./nodes/AsignarNode.vue";
import Imprimir from "./nodes/ImprimirNode.vue";

export default {
  name: "editor-draw-flow",
  components: {},
  data() {
    return {
      df: null,
      dragEventType: "",
      nodeType: "",
      selectedNodeInfo: {},
      allEventsInfoArray: [],
      dialogVisible: false,
      nodeCount: 1,
      eventNodeCounter: 1,
      identifiersNodeCounter: 1,
      connectorCounter: 1,
      dialogData: {},
      listNodes: [
        {
          ID: 1,
          type: "Numero",
          name: "Número",
          item: "Numero",
          input: 0,
          output: 1,
        },
        {
          ID: 2,
          type: "Suma",
          name: "Suma",
          item: "Suma",
          input: 1,
          output: 1,
        },
        {
          ID: 3,
          type: "Resta",
          name: "Resta",
          item: "Resta",
          input: 1,
          output: 1,
        },
        {
          ID: 4,
          type: "Multiplicacion",
          name: "Multiplicación",
          item: "Multiplicacion",
          input: 1,
          output: 1,
        },
        {
          ID: 5,
          type: "Division",
          name: "División",
          item: "Division",
          input: 1,
          output: 1,
        },
        {
          ID: 6,
          type: "IF",
          name: "IF",
          item: "If",
          input: 1,
          output: 1,
        },
        {
          ID: 7,
          type: "For",
          name: "For",
          item: "For",
          input: 1,
          output: 1,
        },
        {
          ID: 8,
          type: "Asignar",
          name: "Asignar",
          item: "Asignar",
          input: 0,
          output: 1,
        },
        {
          ID: 9,
          type: "Imprimir",
          name: "Imprimir",
          item: "Imprimir",
          input: 1,
          output: 0,
        },
      ],
    };
  },
  setup() {
    //Se declara variable reactiva df, y se agrega en propiedades globales
    const df = shallowRef({});
    const internalInstance = getCurrentInstance();
    internalInstance.appContext.app._context.config.globalProperties.$df = df;

    //Se crea instancia de Vue
    const Vue = { version: 3, h, render };

    //Se hace instancia a la store pinia
    const drawflowStore = useDrawflowStore();

    //Funcion para hacer drag del nodo
    const drag = (event, eventType) => {
      event.dataTransfer.setData(
        "node",
        event.target.getAttribute("data-node")
      );
    };

    //Función para dejar nodo en editor
    const drop = (event) => {
      event.preventDefault();
      const data = event.dataTransfer.getData("node");

      if (df.value.editor_mode == "edit") {
        addNodeToDrawFlow(data, event.clientX, event.clientY);
      }
    };

    //Al permitir el soltar previene refresh de la pagina
    const allowDrop = (event) => {
      event.preventDefault();
    };

    //Función para crear nodo con teclado
    const keyPress = (event) => {
      console.log(event.key);

      var name = "";

      switch (event.key) {
        case "n":
          name = "Numero";
          break;
        case "s":
          name = "Suma";
          break;
        case "r":
          name = "Resta";
          break;
        case "m":
          name = "Multiplicacion";
          break;
        case "d":
          name = "Division";
          break;
        case "i":
          name = "If";
          break;
        case "f":
          name = "For";
          break;
        case "a":
          name = "Asignar";
          break;
        case "p":
          name = "Imprimir";
          break;
      }

      if (df.value.editor_mode == "edit") {
        addNodeToDrawFlow(name, event.clientX, event.clientY);
      }
    };

    //Función para agregar nodo al drawflow
    const addNodeToDrawFlow = (name, pos_x, pos_y) => {
      //Se crean posiciones basado en la posicion del mouse, zoom y tamaños
      pos_x =
        pos_x *
          (df.value.precanvas.clientWidth /
            (df.value.precanvas.clientWidth * df.value.zoom)) -
        df.value.precanvas.getBoundingClientRect().x *
          (df.value.precanvas.clientWidth /
            (df.value.precanvas.clientWidth * df.value.zoom));
      pos_y =
        pos_y *
          (df.value.precanvas.clientHeight /
            (df.value.precanvas.clientHeight * df.value.zoom)) -
        df.value.precanvas.getBoundingClientRect().y *
          (df.value.precanvas.clientHeight /
            (df.value.precanvas.clientHeight * df.value.zoom));

      //Se crea nodo basado en el nombre
      switch (name) {
        case "Numero":
          df.value.addNode(
            name,
            0,
            1,
            pos_x,
            pos_y,
            "number node",
            { number: 0 },
            name,
            "vue"
          );

          break;

        case "Suma":
          df.value.addNode(
            name,
            2,
            1,
            pos_x,
            pos_y,
            "sum node",
            { n1: 0, n2: 0, result: 0 },
            name,
            "vue"
          );
          break;
        case "Resta":
          df.value.addNode(
            name,
            2,
            1,
            pos_x,
            pos_y,
            "rest node",
            { n1: 0, n2: 0, result: 0 },
            name,
            "vue"
          );
          break;
        case "Multiplicacion":
          df.value.addNode(
            name,
            2,
            1,
            pos_x,
            pos_y,
            "mult node",
            { n1: 1, n2: 1, result: 1 },
            name,
            "vue"
          );
          break;
        case "Division":
          df.value.addNode(
            name,
            2,
            1,
            pos_x,
            pos_y,
            "div node",
            { n1: 1, n2: 1, result: 1 },
            name,
            "vue"
          );
          break;
        case "If":
          df.value.addNode(
            name,
            2,
            1,
            pos_x,
            pos_y,
            "if node",
            { n1: 0, n2: 0, condition: "mayor", isTrue: false },
            name,
            "vue"
          );
          break;
        case "For":
          df.value.addNode(
            name,
            2,
            1,
            pos_x,
            pos_y,
            "for node",
            { n1: 0, n2: 1, repeat: 1 },
            name,
            "vue"
          );
          break;
        case "Asignar":
          df.value.addNode(
            name,
            1,
            1,
            pos_x,
            pos_y,
            "asignar node",
            { number: 0 },
            name,
            "vue"
          );
          break;
        case "Imprimir":
          df.value.addNode(
            name,
            1,
            0,
            pos_x,
            pos_y,
            "imprimir node",
            { var: "" },
            name,
            "vue"
          );
          break;
      }
    };

    //Función al montar componente
    onMounted(() => {
      //Se obtiene el div para el editor
      var id = document.getElementById("drawflow");

      //se crea el nuevo drawflow
      df.value = new Drawflow(
        id,
        Vue,
        internalInstance.appContext.app._context
      );

      //Se hace modo edición
      df.value.editor_mode = "edit"; // Default

      //Se inicia
      df.value.start();

      //Se registran todos los nodos y su componente
      df.value.registerNode("Numero", Numero, {}, {});
      df.value.registerNode("Suma", Suma, {}, {});
      df.value.registerNode("Resta", Resta, {}, {});
      df.value.registerNode("Multiplicacion", Multiplicacion, {}, {});
      df.value.registerNode("Division", Division, {}, {});
      df.value.registerNode("If", If, {}, {});
      df.value.registerNode("For", For, {}, {});
      df.value.registerNode("Asignar", Asignar, {}, {});
      df.value.registerNode("Imprimir", Imprimir, {}, {});

      //Se permite hacer reroute
      df.reroute = true;

      //Events!!

      //Al crear nodo
      df.value.on("nodeCreated", function (id) {
        console.log("Node created " + id);
        //se obtiene el nodo creado
        const node = df.value.getNodeFromId(id);

        var code = [];
        //Se crea codigo del nodo
        if (node.name == "Numero") {
          code = [node.name + "_" + id, " = ", node.data.number];
        } else if (
          node.name == "Suma" ||
          node.name == "Resta" ||
          node.name == "Multiplicacion" ||
          node.name == "Division"
        ) {
          const expresion =
            node.name == "Suma"
              ? ["0", " + ", "0"]
              : node.name == "Resta"
              ? ["0", " - ", "0"]
              : node.name == "Multiplicacion"
              ? ["1", " * ", "1"]
              : node.name == "Division"
              ? ["1", " / ", "1"]
              : 0;
          code = [node.name + "_" + id, " = "].concat(expresion);
        } else if (node.name == "If") {
          const cond =
            node.data.condition == "mayor"
              ? ">"
              : node.data.condition == "menor"
              ? "<"
              : "==";
          code = ["if ", "0", " " + cond + " ", "0", ":"];
        } else if (node.name == "For") {
          code = ["for i in range (", node.data.repeat, "):"];
        } else if (node.name == "Asignar") {
          code = [node.name + "_" + id, " = ", node.data.number];
        } else if (node.name == "Imprimir") {
          code = ["print(", 0, ")"];
        }

        //Se agrega el nodo a la store
        drawflowStore.$patch((state) => {
          state.nodes.push({
            id: id,
            name: node.name,
            data: node.data,
          });
        });

        //Se agrega el codigo a la store
        drawflowStore.$patch((state) => {
          state.code.push({
            id: id,
            code: code,
            aux: { v1: 0, v2: 0 },
          });
        });
      });

      //Al eliminar un nodo
      df.value.on("nodeRemoved", function (id) {
        console.log("Node removed " + id);

        //Se elimina el nodo y el codigo de la store
        const nodeIndex = drawflowStore.nodes.findIndex((n) => n.id == id);
        const codeIndex = drawflowStore.code.findIndex((n) => n.id == id);

        drawflowStore.$patch((state) => {
          state.nodes.splice(nodeIndex, 1);
        });

        drawflowStore.$patch((state) => {
          state.code.splice(codeIndex, 1);
        });
      });

      //Al cambiar data del nodo
      df.value.on("nodeDataChanged", function (id) {
        console.log("Node data changed " + id);

        //Se obtiene el nodo y se elimina de la store
        const node = df.value.getNodeFromId(id);
        const data = node.data;

        const nodeIndex = drawflowStore.nodes.findIndex((n) => n.id == id);
        const codeIndex = drawflowStore.code.findIndex((n) => n.id == id);

        console.log(nodeIndex);

        drawflowStore.$patch((state) => {
          state.nodes[nodeIndex].data = data;
        });

        /* drawflowStore.$patch((state) => {
          state.code[codeIndex].code = code;
        });*/
      });

      //Al seleccionar un nodo se imprime el nodo, y el estado nodos y codigo
      df.value.on("nodeSelected", function (id) {
        console.log("Node selected " + id);
        console.log(df.value.getNodeFromId(id));
        console.log(drawflowStore.nodes);
        console.log(drawflowStore.code);
      });

      df.value.on("moduleCreated", function (name) {
        console.log("Module Created " + name);
      });

      df.value.on("moduleChanged", function (name) {
        console.log("Module Changed " + name);
      });

      //Al crear conexión
      //Aqui ocurre la magia!!
      df.value.on("connectionCreated", function (connection) {
        //Se imprime la conexión creada
        console.log("Connection created");
        console.log(connection);

        //Se obtiene la input y la output
        const input = df.value.getNodeFromId(connection.input_id);
        const output = df.value.getNodeFromId(connection.output_id);

        //Obtener código input
        var codeInput = drawflowStore.getLineCodeById(input.id).code;
        var codeOutput = drawflowStore.getLineCodeById(output.id);
        var aux = {};

        //Codigo para realizar operaciones de los nodos
        const input_class = connection.input_class;

        //Si ya existe una input en esa entrada, se elimina la conexión
        //Reglas: IF no se puede conectar a otro if, ni a un imprimir o un asignar
        //Reglas: FOR no se puede conectar a otro for, ni a un asignar, o un if o un imprimir
        if (
          (input_class == "input_1" &&
            input.inputs.input_1.connections.length > 1) ||
          (input_class == "input_2" &&
            input.inputs.input_2.connections.length > 1) ||
          (output.name == "If" &&
            (input.name == "If" ||
              input.name == "Asignar" ||
              input.name == "Imprimir")) ||
          (output.name == "For" &&
            (input.name == "Asignar" ||
              input.name == "For" ||
              input.name == "If" ||
              input.name == "Imprimir"))
        ) {
          df.value.removeSingleConnection(
            connection.output_id,
            connection.input_id,
            connection.output_class,
            connection.input_class
          );
        } else {
          //Se agrega variable data, variable a actualizar
          var data = {};
          if (output.name == "If" && input.name == "For") {
            //Si entra un if a un for

            const n1 = output.data.n1;
            const n2 = output.data.n2;

            //Se elimina un input del for
            df.value.removeNodeInput(
              input.id,
              input_class == "input_1" ? "input_2" : "input_1"
            );

            //Se obtiene index del codigo de la store
            const codeIndexOutputNode = drawflowStore.code.findIndex(
              (n) => n.id == output.id
            );

            const codeIndexInputNode = drawflowStore.code.findIndex(
              (n) => n.id == input.id
            );

            //Se obtiene codigo de la store
            const codeInputOp = drawflowStore.getLineCodeById(input.id);

            const codeOp = drawflowStore.code;

            //Se agrega el codigo de input abajo del output
            codeOp.splice(codeIndexOutputNode + 1, 0, codeInputOp);

            //Se elimina repeticion restante
            if (codeIndexInputNode > codeIndexOutputNode) {
              codeOp.splice(codeIndexInputNode + 1, 1);
            } else {
              codeOp.splice(codeIndexInputNode, 1);
            }

            //Se actualiza codigo
            drawflowStore.$patch((state) => {
              state.code = codeOp;
            });

            //Se agrega un tabulador al for
            var vars = drawflowStore.getLineCodeById(output.id).aux;
            const TAB = "\t";
            codeInput[0] = TAB + codeInput[0];

            aux = vars;

            //Se actualiza la data
            data = {
              n1: parseInt(n1),
              n2: parseInt(n2),
              repeat: input.data.repeat,
            };

            //Se hace un for para actualizar el codigo de las conexiones existentes al for
            //para actualizar los datos y agregar un tab extra
            for (
              var i = 0;
              i < input.outputs.output_1.connections.length;
              i++
            ) {
              const connection = input.outputs.output_1.connections[i];
              const inputNode = df.value.getNodeFromId(connection.node);

              var codeInputCon = drawflowStore.getLineCodeById(
                inputNode.id
              ).code;
              if (
                inputNode.name == "Suma" ||
                inputNode.name == "Resta" ||
                inputNode.name == "Multiplicacion" ||
                inputNode.name == "Division"
              ) {
                codeInputCon[0] = TAB + codeInputCon[0];
                codeInputCon[2] = aux.v1;
                codeInputCon[4] = aux.v2;

                const codeIndexCon = drawflowStore.code.findIndex(
                  (n) => n.id == inputNode.id
                );
                drawflowStore.$patch((state) => {
                  state.code[codeIndexCon].code = codeInputCon;
                });
              }
            }
          } else if (
            output.name == "If" &&
            (input.name == "Suma" ||
              input.name == "Resta" ||
              input.name == "Multiplicacion" ||
              input.name == "Division")
          ) {
            //Si la entrada es de un IF y va a una Operacion
            const n1 = output.data.n1;
            const n2 = output.data.n2;

            //Se elimina un node de conexión
            df.value.removeNodeInput(
              input.id,
              input_class == "input_1" ? "input_2" : "input_1"
            );

            //Se actualiza el codigo de la operación
            const codeIndexOutputNode = drawflowStore.code.findIndex(
              (n) => n.id == output.id
            );

            const codeIndexInputNode = drawflowStore.code.findIndex(
              (n) => n.id == input.id
            );

            const codeInputOp = drawflowStore.getLineCodeById(input.id);

            const codeOp = drawflowStore.code;

            //Se agrega el codigo bajo el if
            codeOp.splice(codeIndexOutputNode + 1, 0, codeInputOp);

            //Se elimina el codigo sobrante
            if (codeIndexInputNode > codeIndexOutputNode) {
              codeOp.splice(codeIndexInputNode + 1, 1);
            } else {
              codeOp.splice(codeIndexInputNode, 1);
            }

            //Se actualiza en la store
            drawflowStore.$patch((state) => {
              state.code = codeOp;
            });

            //Si el if es cierto hace la operación
            if (output.data.isTrue) {
              console.log("true");
              const result =
                input.name == "Suma"
                  ? n1 + n2
                  : input.name == "Resta"
                  ? n1 - n2
                  : input.name == "Multiplicacion"
                  ? n1 * n2
                  : input.name == "Division"
                  ? n1 / n2
                  : 0;

              data = {
                n1: n1,
                n2: n2,
                result: result,
              };
            } else {
              //En caso de ser falso no actualiza la data
              data = {
                n1: input.data.n1,
                n2: input.data.n2,
                result: input.data.result,
              };
            }

            //Se obtiene el codigo del if y se actualiza el del input
            var vars = drawflowStore.getLineCodeById(output.id).aux;

            const TAB = "\t";

            codeInput[0] = TAB + codeInput[0];
            codeInput[2] = vars.v1;
            codeInput[4] = vars.v2;
          } else if (
            output.name == "For" &&
            (input.name == "Suma" ||
              input.name == "Resta" ||
              input.name == "Multiplicacion" ||
              input.name == "Division")
          ) {
            //Si va de un for a una operacion

            const n1 = output.data.n1;
            const n2 = output.data.n2;
            var n2Alt = 0;
            var result = 0;

            //Se elimina una input de la operacion
            df.value.removeNodeInput(
              input.id,
              input_class == "input_1" ? "input_2" : "input_1"
            );

            //Se actualiza el codigo de posición
            const codeIndexOutputNode = drawflowStore.code.findIndex(
              (n) => n.id == output.id
            );

            const codeIndexInputNode = drawflowStore.code.findIndex(
              (n) => n.id == input.id
            );

            const codeInputOp = drawflowStore.getLineCodeById(input.id);

            const codeOp = drawflowStore.code;

            //Se agrega el input abajo del for
            codeOp.splice(codeIndexOutputNode + 1, 0, codeInputOp);

            //Se elimina el restante
            if (codeIndexInputNode > codeIndexOutputNode) {
              codeOp.splice(codeIndexInputNode + 1, 1);
            } else {
              codeOp.splice(codeIndexInputNode, 1);
            }

            //Se actualiza la store
            drawflowStore.$patch((state) => {
              state.code = codeOp;
            });

            //Se hace la repetición
            for (var i = 0; i < output.data.repeat; i++) {
              if (input.name == "Suma") {
                if (i == 0) {
                  result = n1 + n2;
                  n2Alt = n2;
                } else {
                  result += n2;
                  n2Alt += n2;
                }
              } else if (input.name == "Resta") {
                if (i == 0) {
                  result = n1 - n2;
                  n2Alt = n2;
                } else {
                  result -= n2;
                  n2Alt += n2;
                }
              } else if (input.name == "Multiplicacion") {
                if (i == 0) {
                  result = n1 * n2;
                  n2Alt = n2;
                } else {
                  result *= n2;
                  n2Alt *= n2;
                }
              } else if (input.name == "Division") {
                if (i == 0) {
                  result = n1 / n2;
                  n2Alt = n2;
                } else {
                  result /= n2;
                  n2Alt *= n2;
                }
              }
            }

            //Se actualiza el codigo del input
            var vars = drawflowStore.getLineCodeById(output.id).aux;
            const TAB = "\t";

            codeInput[0] = TAB + codeInput[0];
            codeInput[2] = vars.v1;
            codeInput[4] = vars.v2;

            data = {
              n1: n1,
              n2: n2Alt,
              result: result,
            };

            //En caso de que el for tenga entradas y una sea un if, agrega otro tab
            var inputsOfOutput =
              output.inputs.input_1.connections.length > 0
                ? output.inputs.input_1.connections
                : false;

            if (inputsOfOutput != false) {
              console.log(inputsOfOutput);
              inputsOfOutput = df.value.getNodeFromId(inputsOfOutput[0].node);

              if (inputsOfOutput.name == "If") {
                codeInput[0] = TAB + codeInput[0];
              }
            }
          } else if (
            input.name == "Suma" ||
            input.name == "Resta" ||
            input.name == "Multiplicacion" ||
            input.name == "Division"
          ) {
            //Si la entrada es una operación
            var n1 = 0;
            var n2 = 0;

            //Obtiene el codigo
            const codeIndexInputNode = drawflowStore.code.findIndex(
              (n) => n.id == input.id
            );

            const codeIndexOutputNode = drawflowStore.code.findIndex(
              (n) => n.id == output.id
            );

            //Si el codigo de entrada esta mas arriba que la salida
            //Cambia las posiciones
            if (codeIndexInputNode < codeIndexOutputNode) {
              const codeOp = drawflowStore.code;

              codeOp.splice(codeIndexInputNode, 0, codeOutput);
              codeOp.splice(codeIndexOutputNode + 1, 1);

              drawflowStore.$patch((state) => {
                state.code = codeOp;
              });
            }

            //Si la entrada es a input 1
            if (input_class == "input_1") {
              //Cambia N1
              n1 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;
              n2 = input.data.n2;

              //Cambia codigo
              codeInput[2] = output.name + "_" + output.id;
            } else {
              n1 = input.data.n1;

              //Cambia N2
              n2 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;

              //Cambia Codigo
              codeInput[4] = output.name + "_" + output.id;
            }

            n1 = parseInt(n1);
            n2 = parseInt(n2);

            //Realiza operacion
            const result =
              input.name == "Suma"
                ? n1 + n2
                : input.name == "Resta"
                ? n1 - n2
                : input.name == "Multiplicacion"
                ? n1 * n2
                : input.name == "Division"
                ? n1 / n2
                : 0;

            data = {
              n1: parseInt(n1),
              n2: parseInt(n2),
              result: result,
            };
          } else if (input.name == "If") {
            //Si la entrada es a un if

            var n1 = 0;
            var n2 = 0;

            //Obtiene el auxiliar del estado code
            var vars = drawflowStore.getLineCodeById(input.id).aux;

            //Obtiene index del codigo
            const codeIndexInputNode = drawflowStore.code.findIndex(
              (n) => n.id == input.id
            );

            const codeIndexOutputNode = drawflowStore.code.findIndex(
              (n) => n.id == output.id
            );

            //Si el if esta mas alto que el output, hace el input abajo del output
            if (codeIndexInputNode < codeIndexOutputNode) {
              const codeOp = drawflowStore.code;

              codeOp.splice(codeIndexInputNode, 0, codeOutput);
              codeOp.splice(codeIndexOutputNode + 1, 1);

              drawflowStore.$patch((state) => {
                state.code = codeOp;
              });
            }

            //Si la entrada es por la clase 1
            if (input_class == "input_1") {
              //Cambia N1
              n1 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;
              n2 = input.data.n2;

              //Cambia variables auxiliares
              aux = {
                v1: output.name + "_" + output.id,
                v2: vars.v2,
              };

              //Cambia codigo
              codeInput[1] = output.name + "_" + output.id;
            } else {
              n1 = input.data.n1;

              //Cambia N2
              n2 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;

              //Cambia codigo
              codeInput[3] = output.name + "_" + output.id;

              //Cambia Variables
              aux = {
                v1: vars.v1,
                v2: output.name + "_" + output.id,
              };
            }

            n1 = parseInt(n1);
            n2 = parseInt(n2);

            //Determina condición
            const isTrue =
              input.data.condition == "mayor" && n1 > n2
                ? true
                : input.data.condition == "menor" && n1 < n2
                ? true
                : input.data.condition == "igual" && n1 == n2
                ? true
                : false;

            //Organiza data
            data = {
              n1: parseInt(n1),
              n2: parseInt(n2),
              condition: input.data.condition,
              isTrue: isTrue,
            };

            //Actualiza todas las outputs del input
            //Actualiza el codigo de lo que se conecta al if
            for (
              var i = 0;
              i < input.outputs.output_1.connections.length;
              i++
            ) {
              const connection = input.outputs.output_1.connections[i];
              const inputNode = df.value.getNodeFromId(connection.node);

              var codeInputCon = drawflowStore.getLineCodeById(
                inputNode.id
              ).code;
              if (
                inputNode.name == "Suma" ||
                inputNode.name == "Resta" ||
                inputNode.name == "Multiplicacion" ||
                inputNode.name == "Division"
              ) {
                codeInputCon[2] = aux.v1;
                codeInputCon[4] = aux.v2;

                const codeIndexCon = drawflowStore.code.findIndex(
                  (n) => n.id == inputNode.id
                );
                drawflowStore.$patch((state) => {
                  state.code[codeIndexCon].code = codeInputCon;
                });
              } else if (inputNode.name == "For") {
                const codeIndexCon = drawflowStore.code.findIndex(
                  (n) => n.id == inputNode.id
                );
                drawflowStore.$patch((state) => {
                  state.code[codeIndexCon].aux = aux;
                });

                for (
                  var j = 0;
                  j < inputNode.outputs.output_1.connections.length;
                  j++
                ) {
                  const connectionFor =
                    inputNode.outputs.output_1.connections[j];
                  const inputNodeFor = df.value.getNodeFromId(
                    connectionFor.node
                  );

                  var codeInputConFor = drawflowStore.getLineCodeById(
                    inputNodeFor.id
                  ).code;
                  console.log("CONNECTION FOR");
                  console.log(codeInputConFor);

                  if (
                    inputNodeFor.name == "Suma" ||
                    inputNodeFor.name == "Resta" ||
                    inputNodeFor.name == "Multiplicacion" ||
                    inputNodeFor.name == "Division"
                  ) {
                    codeInputConFor[2] = aux.v1;
                    codeInputConFor[4] = aux.v2;

                    const codeIndexConFor = drawflowStore.code.findIndex(
                      (n) => n.id == inputNodeFor.id
                    );
                    drawflowStore.$patch((state) => {
                      state.code[codeIndexConFor].code = codeInputConFor;
                    });
                  }
                }
              }
            }
          } else if (input.name == "For") {
            //Si la input es for

            var n1 = 0;
            var n2 = 0;
            var var1 = 0;
            var var2 = 0;

            //Obtiene variables auxiliares del for
            var vars = drawflowStore.getLineCodeById(input.id).aux;

            //Obtiene index del codigo
            const codeIndexInputNode = drawflowStore.code.findIndex(
              (n) => n.id == input.id
            );

            const codeIndexOutputNode = drawflowStore.code.findIndex(
              (n) => n.id == output.id
            );

            //Si la input esta mas arriba, hace que baje
            if (codeIndexInputNode < codeIndexOutputNode) {
              const codeOp = drawflowStore.code;

              codeOp.splice(codeIndexInputNode, 0, codeOutput);
              codeOp.splice(codeIndexOutputNode + 1, 1);

              drawflowStore.$patch((state) => {
                state.code = codeOp;
              });
            }

            //Si entro por clase 1
            if (input_class == "input_1") {
              //Cambia N1
              n1 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;
              n2 = input.data.n2;

              //Cambia Variables auxiliares v1
              var1 = output.name + "_" + output.id;
              var2 = vars.v2;
            } else {
              n1 = input.data.n1;

              //Cambia N2
              n2 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;

              //Cambia v2 auxiliar
              var1 = vars.v1;
              var2 = output.name + "_" + output.id;
            }

            //Prepara variables auxiliares y data
            aux = {
              v1: var1,
              v2: var2,
            };

            data = {
              n1: parseInt(n1),
              n2: parseInt(n2),
              repeat: input.data.repeat,
            };

            //Actualiza todas las outputs del input
            //Actualiza el codigo de lo que se conecta al For
            for (
              var i = 0;
              i < input.outputs.output_1.connections.length;
              i++
            ) {
              const connection = input.outputs.output_1.connections[i];
              const inputNode = df.value.getNodeFromId(connection.node);

              var codeInputCon = drawflowStore.getLineCodeById(
                inputNode.id
              ).code;
              if (
                inputNode.name == "Suma" ||
                inputNode.name == "Resta" ||
                inputNode.name == "Multiplicacion" ||
                inputNode.name == "Division"
              ) {
                codeInputCon[2] = aux.v1;
                codeInputCon[4] = aux.v2;

                const codeIndexCon = drawflowStore.code.findIndex(
                  (n) => n.id == inputNode.id
                );
                drawflowStore.$patch((state) => {
                  state.code[codeIndexCon].code = codeInputCon;
                });
              }
            }
          } else if (input.name == "Asignar") {
            //Si el nodo es de asignación

            //Busca los index del codigo
            const codeIndexInputNode = drawflowStore.code.findIndex(
              (n) => n.id == input.id
            );

            const codeIndexOutputNode = drawflowStore.code.findIndex(
              (n) => n.id == output.id
            );

            //Hace el input mas bajo que el output
            if (codeIndexInputNode < codeIndexOutputNode) {
              const codeOp = drawflowStore.code;

              codeOp.splice(codeIndexInputNode, 0, codeOutput);
              codeOp.splice(codeIndexOutputNode + 1, 1);

              drawflowStore.$patch((state) => {
                state.code = codeOp;
              });
            }

            //Cambia la data
            data = {
              number: parseInt(
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result
              ),
            };

            //Cambia el codigo
            codeInput[2] = output.name + "_" + output.id;
          } else if (input.name == "Imprimir") {
            //Si el input es imprimir

            //Busca el index del codigo
            const codeIndexInputNode = drawflowStore.code.findIndex(
              (n) => n.id == input.id
            );

            const codeIndexOutputNode = drawflowStore.code.findIndex(
              (n) => n.id == output.id
            );

            //Si el input es mas alto que el output
            //Hace el input mas bajo
            if (codeIndexInputNode < codeIndexOutputNode) {
              const codeOp = drawflowStore.code;

              codeOp.splice(codeIndexInputNode, 0, codeOutput);
              codeOp.splice(codeIndexOutputNode + 1, 1);

              drawflowStore.$patch((state) => {
                state.code = codeOp;
              });
            }

            //Prepara data a guardar
            data = {
              var: output.name + "_" + output.id,
            };

            //Cambia Codigo
            codeInput[1] = output.name + "_" + output.id;
          }

          //Actualiza data del nodo input
          df.value.updateNodeDataFromId(input.id, data);

          //Busca el index del input en store
          const nodeIndex = drawflowStore.nodes.findIndex(
            (n) => n.id == input.id
          );

          //Actualiza la data del nodo en store
          drawflowStore.$patch((state) => {
            state.nodes[nodeIndex].data = data;
          });

          //Busca index del codigo en la store
          const codeIndexNode = drawflowStore.code.findIndex(
            (n) => n.id == input.id
          );

          //Actualiza codigo y variables auxiliares
          drawflowStore.$patch((state) => {
            state.code[codeIndexNode].code = codeInput;
          });
          drawflowStore.$patch((state) => {
            state.code[codeIndexNode].aux = aux;
          });
        }
      });

      //Al remover conexion
      df.value.on("connectionRemoved", function (connection) {
        console.log("Connection removed");
        console.log(connection);

        //Se obtiene input y output
        const input = df.value.getNodeFromId(connection.input_id);
        const output = df.value.getNodeFromId(connection.output_id);

        //Se obtiene la input especifica
        const input_class = connection.input_class;

        var data = {};

        //Si la output era IF o FOR se agrega un input a la operacion y se cambia la data
        if (
          (output.name == "If" || output.name == "For") &&
          (input.name == "Suma" ||
            input.name == "Resta" ||
            input.name == "Multiplicacion" ||
            input.name == "Division")
        ) {
          df.value.addNodeInput(input.id);

          n1 = input.name == "Suma" || input.name == "Resta" ? 0 : 1;
          n2 = input.name == "Suma" || input.name == "Resta" ? 0 : 1;

          const result =
            input.name == "Suma"
              ? parseInt(n1) + parseInt(n2)
              : input.name == "Resta"
              ? parseInt(n1) - parseInt(n2)
              : input.name == "Multiplicacion"
              ? parseInt(n1) * parseInt(n2)
              : input.name == "Division"
              ? parseInt(n1) / parseInt(n2)
              : 0;

          data = {
            n1: parseInt(n1),
            n2: parseInt(n2),
            result: result,
          };
        } else if (
          input.name == "Suma" ||
          input.name == "Resta" ||
          input.name == "Multiplicacion" ||
          input.name == "Division"
        ) {
          //Si la input era operacion de un numero o asignación, se cambia la data
          var n1 = 0;
          var n2 = 0;
          if (input_class == "input_1") {
            n1 = input.name == "Suma" || input.name == "Resta" ? 0 : 1;
            n2 = input.data.n2;
          } else {
            n1 = input.data.n1;
            n2 = input.name == "Suma" || input.name == "Resta" ? 0 : 1;
          }
          const result =
            input.name == "Suma"
              ? parseInt(n1) + parseInt(n2)
              : input.name == "Resta"
              ? parseInt(n1) - parseInt(n2)
              : input.name == "Multiplicacion"
              ? parseInt(n1) * parseInt(n2)
              : input.name == "Division"
              ? parseInt(n1) / parseInt(n2)
              : 0;

          data = {
            n1: parseInt(n1),
            n2: parseInt(n2),
            result: result,
          };
        } else if (input.name == "If") {
          //Si la input era un if se cambia la data de la input eliminada
          var n1 = input_class == "input_1" ? 0 : parseInt(input.data.n1);
          var n2 = input_class == "input_2" ? 0 : parseInt(input.data.n2);

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
            condition: input.data.condition,
            isTrue: isTrue,
          };
        } else if (input.name == "For") {
          //Si la input era un for se cambia la data que fue eliminada
          data = {
            n1: input_class == "input_1" ? 0 : parseInt(input.data.n1),
            n2: input_class == "input_2" ? 0 : parseInt(input.data.n2),
            repeat: input.data.repeat,
          };
        } else if (input.name == "Asignar") {
          data = {
            number: 0,
          };
        }

        //Se actualiza la data del nod
        df.value.updateNodeDataFromId(input.id, data);

        //Se buca y se actualiza el nodo en la store
        const nodeIndex = drawflowStore.nodes.findIndex(
          (n) => n.id == input.id
        );
        drawflowStore.$patch((state) => {
          state.nodes[nodeIndex].data = data;
        });
      });

      df.value.on("mouseMove", function (position) {
        //console.log("Position mouse x:" + position.x + " y:" + position.y);
      });

      df.value.on("nodeMoved", function (id) {
        //console.log("Node moved " + id);
      });

      df.value.on("zoom", function (zoom) {
        //console.log("Zoom level " + zoom);
      });

      df.value.on("translate", function (position) {
        //console.log("Translate x:" + position.x + " y:" + position.y);
      });

      df.value.on("addReroute", function (id) {
        console.log("Reroute added " + id);
      });

      df.value.on("removeReroute", function (id) {
        console.log("Reroute removed " + id);
      });

      var dataExport = df.value.export();
    });

    //Se retornan metodos y variables pertinentes
    return {
      drawflowStore,
      drag,
      drop,
      allowDrop,
      internalInstance,
      keyPress,
    };
  },
  methods: {
    suma(n1, n2) {
      const s = this.drawflowStore.suma(n1, n2);
      console.log(s);
    },
  },
};
</script>

<style scoped>
#drawflow {
  width: calc(100%);
  height: calc(100% - 60px);
  text-align: initial;
  background-size: 20px 20px;
  border-radius: 10px;
}

h4 {
  text-align: center;
  font-size: 16px;
  padding: 10px;
  font-weight: bold;
}

.card {
  text-align: center;
  height: 40px;
  border-radius: 25px;
}
.card-body {
  padding: 5px;
}

.node {
  border-radius: 10px;
  border: 1px solid #ccc;
  height: 30px;
  text-align: center;
  cursor: move;
  background-color: beige;
}

.drawflow .drawflow-node {
  border-radius: 10px;
  border: 1px solid #ccc;
  height: 30px;
  text-align: center;
  cursor: move;
  background-color: beige !important;
}
.card:hover {
  background-color: #e3e3e3;
  cursor: pointer;
}
</style>
