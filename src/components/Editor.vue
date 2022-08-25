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

    <div class="col-8" id="editor">
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
      ],
    };
  },
  setup() {
    const df = shallowRef({});
    const internalInstance = getCurrentInstance();
    internalInstance.appContext.app._context.config.globalProperties.$df = df;
    const Vue = { version: 3, h, render };

    const drawflowStore = useDrawflowStore();

    const drag = (event, eventType) => {
      event.dataTransfer.setData(
        "node",
        event.target.getAttribute("data-node")
      );
    };

    const drop = (event) => {
      event.preventDefault();
      const data = event.dataTransfer.getData("node");
      addNodeToDrawFlow(data, event.clientX, event.clientY);
    };

    const allowDrop = (event) => {
      event.preventDefault();
    };

    const addNodeToDrawFlow = (name, pos_x, pos_y) => {
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
      }
    };

    onMounted(() => {
      var id = document.getElementById("drawflow");

      df.value = new Drawflow(
        id,
        Vue,
        internalInstance.appContext.app._context
      );

      df.value.editor_mode = "edit"; // Default

      df.value.start();

      df.value.registerNode("Numero", Numero, {}, {});
      df.value.registerNode("Suma", Suma, {}, {});
      df.value.registerNode("Resta", Resta, {}, {});
      df.value.registerNode("Multiplicacion", Multiplicacion, {}, {});
      df.value.registerNode("Division", Division, {}, {});
      df.value.registerNode("If", If, {}, {});
      df.value.registerNode("For", For, {}, {});
      df.value.registerNode("Asignar", Asignar, {}, {});

      df.reroute = true;

      //Events
      // Events!
      df.value.on("nodeCreated", function (id) {
        console.log("Node created " + id);
        const node = df.value.getNodeFromId(id);

        var code = [];

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
        }

        drawflowStore.$patch((state) => {
          state.nodes.push({
            id: id,
            name: node.name,
            data: node.data,
          });
        });

        drawflowStore.$patch((state) => {
          state.code.push({
            id: id,
            code: code,
            aux: { v1: 0, v2: 0 },
          });
        });
      });

      df.value.on("nodeRemoved", function (id) {
        console.log("Node removed " + id);

        const nodeIndex = drawflowStore.nodes.findIndex((n) => n.id == id);
        const codeIndex = drawflowStore.code.findIndex((n) => n.id == id);

        drawflowStore.$patch((state) => {
          state.nodes.splice(nodeIndex, 1);
        });

        drawflowStore.$patch((state) => {
          state.code.splice(codeIndex, 1);
        });
      });

      df.value.on("nodeDataChanged", function (id) {
        console.log("Node data changed " + id);
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

      df.value.on("connectionCreated", function (connection) {
        console.log("Connection created");
        console.log(connection);

        const input = df.value.getNodeFromId(connection.input_id);
        const output = df.value.getNodeFromId(connection.output_id);

        //Obtener código input
        var codeInput = drawflowStore.getLineCodeById(input.id).code;
        var aux = {};

        //Codigo para realizar operaciones de los nodos
        const input_class = connection.input_class;
        if (
          (input_class == "input_1" &&
            input.inputs.input_1.connections.length > 1) ||
          (input_class == "input_2" &&
            input.inputs.input_2.connections.length > 1) ||
          (output.name == "If" &&
            (input.name == "If" || input.name == "Asignar")) ||
          (output.name == "For" &&
            (input.name == "Asignar" ||
              input.name == "For" ||
              input.name == "If"))
        ) {
          df.value.removeSingleConnection(
            connection.output_id,
            connection.input_id,
            connection.output_class,
            connection.input_class
          );
        } else {
          var data = {};
          if (output.name == "If" && input.name == "For") {
            const n1 = output.data.n1;
            const n2 = output.data.n2;

            df.value.removeNodeInput(
              input.id,
              input_class == "input_1" ? "input_2" : "input_1"
            );

            var vars = drawflowStore.getLineCodeById(output.id).aux;
            const TAB = "\t";
            codeInput[0] = TAB + codeInput[0];

            aux = vars;

            data = {
              n1: parseInt(n1),
              n2: parseInt(n2),
              repeat: input.data.repeat,
            };

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
            const n1 = output.data.n1;
            const n2 = output.data.n2;

            df.value.removeNodeInput(
              input.id,
              input_class == "input_1" ? "input_2" : "input_1"
            );

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
              data = {
                n1: input.data.n1,
                n2: input.data.n2,
                result: input.data.result,
              };
            }

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
            const n1 = output.data.n1;
            const n2 = output.data.n2;
            var n2Alt = 0;
            var result = 0;

            df.value.removeNodeInput(
              input.id,
              input_class == "input_1" ? "input_2" : "input_1"
            );

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
            var n1 = 0;
            var n2 = 0;

            if (input_class == "input_1") {
              n1 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;
              n2 = input.data.n2;

              codeInput[2] = output.name + "_" + output.id;
            } else {
              n1 = input.data.n1;
              n2 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;

              codeInput[4] = output.name + "_" + output.id;
            }

            n1 = parseInt(n1);
            n2 = parseInt(n2);

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
            var n1 = 0;
            var n2 = 0;
            var vars = drawflowStore.getLineCodeById(input.id).aux;

            if (input_class == "input_1") {
              n1 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;
              n2 = input.data.n2;

              aux = {
                v1: output.name + "_" + output.id,
                v2: vars.v2,
              };

              codeInput[1] = output.name + "_" + output.id;
            } else {
              n1 = input.data.n1;
              n2 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;
              codeInput[3] = output.name + "_" + output.id;

              aux = {
                v1: vars.v1,
                v2: output.name + "_" + output.id,
              };
            }

            n1 = parseInt(n1);
            n2 = parseInt(n2);

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
            var n1 = 0;
            var n2 = 0;
            var var1 = 0;
            var var2 = 0;
            var vars = drawflowStore.getLineCodeById(input.id).aux;

            if (input_class == "input_1") {
              n1 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;
              n2 = input.data.n2;

              var1 = output.name + "_" + output.id;
              var2 = vars.v2;
            } else {
              n1 = input.data.n1;
              n2 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;

              var1 = vars.v1;
              var2 = output.name + "_" + output.id;
            }

            aux = {
              v1: var1,
              v2: var2,
            };

            data = {
              n1: parseInt(n1),
              n2: parseInt(n2),
              repeat: input.data.repeat,
            };

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
            data = {
              number: parseInt(
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result
              ),
            };

            codeInput[2] = output.name + "_" + output.id;
          }

          df.value.updateNodeDataFromId(input.id, data);

          const nodeIndex = drawflowStore.nodes.findIndex(
            (n) => n.id == input.id
          );
          drawflowStore.$patch((state) => {
            state.nodes[nodeIndex].data = data;
          });

          const codeIndexNode = drawflowStore.code.findIndex(
            (n) => n.id == input.id
          );

          drawflowStore.$patch((state) => {
            state.code[codeIndexNode].code = codeInput;
          });
          drawflowStore.$patch((state) => {
            state.code[codeIndexNode].aux = aux;
          });
        }
      });

      df.value.on("connectionRemoved", function (connection) {
        console.log("Connection removed");
        console.log(connection);

        const input = df.value.getNodeFromId(connection.input_id);
        const output = df.value.getNodeFromId(connection.output_id);

        const input_class = connection.input_class;

        var data = {};

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

        df.value.updateNodeDataFromId(input.id, data);

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

    return {
      drawflowStore,
      drag,
      drop,
      allowDrop,
      internalInstance,
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
</style>
