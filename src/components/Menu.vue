<template>
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
</template>

<script>
export default {
  name: "menu-drag",
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
</style>
