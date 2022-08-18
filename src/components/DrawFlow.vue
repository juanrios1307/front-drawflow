<template>
  <div class="container1">
    <div class="row">
      <div class="col-2 border border-primary" id="drag">
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
              <span style="color: #17202a; font-weight: bold">{{
                n.name
              }}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="col-5 border border-secondary" id="editor">
        <h4>Editor</h4>
        <div id="drawflow"></div>
      </div>
      <div class="col-3 border border-success" id="pythonCode">
        <h4>Código Python</h4>
        <p>
          {{ dataExport }}
        </p>
      </div>
      <div class="col-2 border border-danger" id="api">
        <h4>Operaciones Backend</h4>
      </div>
    </div>
  </div>
</template>

<script>
import Drawflow from "drawflow";
import "drawflow/dist/drawflow.min.css";

export default {
  name: "draw-flow",
  components: {},
  data() {
    return {
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
          item: "Número",
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
          item: "Multiplicación",
          input: 1,
          output: 1,
        },
        {
          ID: 5,
          type: "Division",
          name: "División",
          color: "#449C43",
          item: "División",
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
    var id = document.getElementById("drawflow");
    const editor = new Drawflow(id);

    editor.start();
    editor.reroute = true;

    editor.addNode(
      "foo",
      1,
      1,
      0,
      100,
      "action",
      {},
      "<b>If Condition</b>",
      false
    );

    editor.addNode(
      "foo",
      1,
      1,
      0,
      300,
      "action",
      {},
      "<b>If Condition</b>",
      false
    );

    //editor.zoom = 0.5;

    var dataExport = editor.export();
  },
};
</script>

<style scoped>
.container1 {
  height: 100vh;
  padding: 10px;
  border: 2px black dotted;
}
.row {
  width: 100%;
  height: 100%;
  margin: 0;
}

h4 {
  text-align: center;
  font-size: 16px;
  padding: 10px;
}

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

.col {
  padding: 10px;
}

#drawflow {
  width: calc(100%);
  height: calc(100% - 40px);
  text-align: initial;
  background: #ecf1f0;
  background-size: 20px 20px;
}
</style>
