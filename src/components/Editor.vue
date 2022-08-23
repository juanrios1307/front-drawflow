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
          <div class="a">
            <span style="color: #17202a">{{ n.name }}</span>
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
import { h, getCurrentInstance, render, onMounted, shallowRef } from "vue";
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
            { number: 10 },
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
            { n1: 0, n2: 0, condition: "mayor" },
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
        console.log(node);
        drawflowStore.$patch((state) => {
          state.nodes.push({
            id: id,
            name: node.name,
            data: node.data,
            inputs: [],
            outputs: [],
          });
        });
      });

      df.value.on("nodeRemoved", function (id) {
        console.log("Node removed " + id);

        const nodeIndex = drawflowStore.nodes.findIndex((n) => n.id == id);

        console.log(nodeIndex);

        drawflowStore.$patch((state) => {
          state.nodes.splice(nodeIndex, 1);
        });
      });

      df.value.on("nodeDataChanged", function (id) {
        console.log("Node data changed " + id);
        const data = df.value.getNodeFromId(id).data;

        const nodeIndex = drawflowStore.nodes.findIndex((n) => n.id == id);

        console.log(nodeIndex);

        drawflowStore.$patch((state) => {
          state.nodes[nodeIndex].data = data;
        });
      });

      df.value.on("nodeSelected", function (id) {
        console.log("Node selected " + id);
        //console.log(df.value.getNodeFromId(id));
        console.log(drawflowStore.nodes);
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

        //Codigo para realizar operaciones de los nodos
        const input_class = connection.input_class;
        if (
          (input_class == "input_1" &&
            input.inputs.input_1.connections.length > 1) ||
          (input_class == "input_2" &&
            input.inputs.input_2.connections.length > 1) ||
          (output.name == "If" && input.name == "Asignar") ||
          (output.name == "For" && input.name == "Asignar")
        ) {
          df.value.removeSingleConnection(
            connection.output_id,
            connection.input_id,
            connection.output_class,
            connection.input_class
          );
        } else {
          var data = {};
          if (input.name == "Suma") {
            if (input_class == "input_1") {
              const n1 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;
              const n2 = input.data.n2;

              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) + parseInt(n2),
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
                result: parseInt(n1) + parseInt(n2),
              };
            }
          } else if (input.name == "Resta") {
            if (input_class == "input_1") {
              const n1 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;
              const n2 = input.data.n2;
              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) - parseInt(n2),
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
                result: parseInt(n1) - parseInt(n2),
              };
            }
          } else if (input.name == "Multiplicacion") {
            if (input_class == "input_1") {
              const n1 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;
              const n2 = input.data.n2;
              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) * parseInt(n2),
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
                result: parseInt(n1) * parseInt(n2),
              };
            }
          } else if (input.name == "Division") {
            if (input_class == "input_1") {
              const n1 =
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result;
              const n2 = input.data.n2;
              data = {
                n1: parseInt(n1),
                n2: parseInt(n2),
                result: parseInt(n1) / parseInt(n2),
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

            if (output.data.condition == "mayor") {
              console.log("mayor");
              if (n1 > n2) {
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
            } else if (output.data.condition == "menor") {
              console.log("menor");
              if (n1 < n2) {
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
            } else if (output.data.condition == "igual") {
              console.log("igual");
              if (n1 == n2) {
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
          } else if (
            output.name == "For" &&
            (input.name == "Suma" ||
              input.name == "Resta" ||
              input.name == "Multiplicacion" ||
              input.name == "Division")
          ) {
            const n1 = output.data.n1;
            const n2 = output.data.n2;
            var result = 0;

            df.value.removeNodeInput(
              input.id,
              input_class == "input_1" ? "input_2" : "input_1"
            );

            for (var i = 0; i < output.data.repeat; i++) {
              if (input.name == "Suma") {
                if (i == 0) {
                  result = n1 + n2;
                } else {
                  result += n2;
                }
              } else if (input.name == "Resta") {
                if (i == 0) {
                  result = n1 - n2;
                } else {
                  result -= n2;
                }
              } else if (input.name == "Multiplicacion") {
                if (i == 0) {
                  result = n1 * n2;
                } else {
                  result *= n2;
                }
              } else if (input.name == "Division") {
                if (i == 0) {
                  result = n1 / n2;
                } else {
                  result /= n2;
                }
              }
            }

            data = {
              n1: n1,
              n2: n2,
              result: result,
            };
          } else if (input.name == "Asignar") {
            data = {
              number: parseInt(
                output.name == "Numero" || output.name == "Asignar"
                  ? output.data.number
                  : output.data.result
              ),
            };
          }
          df.value.updateNodeDataFromId(input.id, data);

          const nodeIndex = drawflowStore.nodes.findIndex(
            (n) => n.id == input.id
          );
          drawflowStore.$patch((state) => {
            state.nodes[nodeIndex].data = data;
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
          data = {
            n1: input_class == "input_1" ? 0 : parseInt(input.data.n1),
            n2: input_class == "input_2" ? 0 : parseInt(input.data.n2),
            condition: input.data.condition,
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
#drag .node1 {
  border-radius: 10px;
  border: 1px solid #ccc;
  height: 60px;
  text-align: center;
  cursor: move;
}

#drawflow {
  width: calc(100%);
  height: calc(100% - 40px);
  text-align: initial;
  background: #ecf1f0;
  background-size: 20px 20px;
}

h4 {
  text-align: center;
  font-size: 16px;
  padding: 10px;
  font-weight: bold;
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
