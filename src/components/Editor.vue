<template>
  <div class="row">
    <div class="col-4 border border-primary" id="drag">
      <h4>Modulo de Operaciones</h4>
      <ul>
        <li
          v-for="n in listNodes"
          :key="n.ID"
          draggable="true"
          :data-node="n.item"
          class="drag-drawflow"
          @dragstart="drag($event, n.name)"
        >
          <div class="node" :style="`background: ${n.color}`">
            <span style="color: #17202a; font-weight: bold">{{ n.name }}</span>
          </div>
        </li>
      </ul>
    </div>

    <div class="col-8 border border-secondary" id="editor">
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
import Drawflow from "drawflow";
import "drawflow/dist/drawflow.min.css";

import Numero from "./nodes/NumberNode.vue";

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
          color: "#36FF33",
          item: "Numero",
          input: 0,
          output: 1,
        },
        {
          ID: 2,
          type: "Suma",
          name: "Suma",
          color: "#27C125",
          item: "Suma",
          input: 1,
          output: 1,
        },
        {
          ID: 3,
          type: "Resta",
          name: "Resta",
          color: "#1B881A",
          item: "Resta",
          input: 1,
          output: 1,
        },
        {
          ID: 4,
          type: "Multiplicacion",
          name: "Multiplicación",
          color: "#10520F",
          item: "Multiplicacion",
          input: 1,
          output: 1,
        },
        {
          ID: 5,
          type: "Division",
          name: "División",
          color: "#449C43",
          item: "Division",
          input: 1,
          output: 1,
        },
        {
          ID: 6,
          type: "IF",
          name: "IF",
          color: "#439C82",
          item: "If",
          input: 1,
          output: 1,
        },
        {
          ID: 7,
          type: "For",
          name: "For",
          color: "#63CFB0",
          item: "For",
          input: 1,
          output: 1,
        },
      ],
    };
  },
  async mounted() {
    const vm = this;
    var id = document.getElementById("drawflow");

    this.df = new Drawflow(id);

    this.df.editor_mode = "edit"; // Default

    this.df.start();

    this.df.registerNode("Numero", Numero, {}, {});

    this.df.reroute = true;

    //Events
    // Events!
    this.df.on("nodeCreated", function (id) {
      console.log("Node created " + id);
    });

    this.df.on("nodeRemoved", function (id) {
      console.log("Node removed " + id);
    });

    this.df.on("nodeSelected", function (id) {
      console.log("Node selected " + id);
      const info = vm.df.getNodeFromId(id);
      console.log(info);
    });

    this.df.on("moduleCreated", function (name) {
      console.log("Module Created " + name);
    });

    this.df.on("moduleChanged", function (name) {
      console.log("Module Changed " + name);
    });

    this.df.on("connectionCreated", function (connection) {
      console.log("Connection created");
      console.log(connection);

      //Codigo para sumar los valores de los nodos
      const n = vm.df.getNodeFromId(connection.output_id).data.number;
      const sum = vm.df.getNodeFromId(connection.input_id).data.number;
      console.log(sum);

      vm.df.updateNodeDataFromId(connection.input_id, {
        number: parseInt(sum, 10) + parseInt(n, 10),
      });

      const node = vm.df.getNodeFromId(connection.input_id);
      console.log(node);
    });

    this.df.on("connectionRemoved", function (connection) {
      console.log("Connection removed");
      console.log(connection);
    });

    this.df.on("mouseMove", function (position) {
      //console.log("Position mouse x:" + position.x + " y:" + position.y);
    });

    this.df.on("nodeMoved", function (id) {
      console.log("Node moved " + id);
    });

    this.df.on("zoom", function (zoom) {
      //console.log("Zoom level " + zoom);
    });

    this.df.on("translate", function (position) {
      //console.log("Translate x:" + position.x + " y:" + position.y);
    });

    this.df.on("addReroute", function (id) {
      console.log("Reroute added " + id);
    });

    this.df.on("removeReroute", function (id) {
      console.log("Reroute removed " + id);
    });

    var dataExport = this.df.export();
  },
  methods: {
    drag(event, eventType) {
      event.dataTransfer.setData(
        "node",
        event.target.getAttribute("data-node")
      );
      this.dragEventType = eventType;
    },

    drop(event) {
      event.preventDefault();
      const data = event.dataTransfer.getData("node");
      console.log(data);
      this.addNodeToDrawFlow(data, event.clientX, event.clientY);
    },

    allowDrop(event) {
      event.preventDefault();
    },

    addNodeToDrawFlow(name, pos_x, pos_y) {
      switch (name) {
        case "Numero":
          var numero = `<div class="node">
    <div class="title-box">Enter a number</div>
    <div class="box">
      <input type="number" df-number />
    </div>
  </div>`;
          console.log(name);
          console.log(Numero);
          this.df.addNode(
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
          var numero = `<div class="node">
    <div class="title-box">Add two numbers</div>
    <div class="box">
      <input disabled df-number></input>
    </div>
  </div>`;

          this.df.addNode(
            "Suma",
            2,
            1,
            pos_x,
            pos_y,
            "sum node",
            { number: 0 },
            numero
          );
          break;
      }
    },
  },
};
</script>

<style scoped>
#drag ul {
  padding-inline-start: 0px;
  padding: 10px 10px;
}

#drag li {
  list-style-type: none;
  padding: 10px 10px;
}

#drag .node {
  border-radius: 10px;
  border: 1px solid #ccc;
  height: 30px;
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
}

.node {
  border-radius: 10px;
  border: 1px solid #ccc;
  height: 30px;
  text-align: center;
  cursor: move;
  background-color: beige;
}

input {
  width: 10px;
  height: 100%;
  border: none;
  background: transparent;
  text-align: center;
}
</style>
