<template>
  <div class="col" id="drag">
    <h4>Python Code</h4>
    <ul class="list-group list-group-flush">
      <li
        class="list-group-item a"
        v-for="n in code"
        :key="n.id"
        draggable="true"
      >
        <div class="a">
          <span style="color: #17202a">{{ n.code }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { useDrawflowStore } from "../stores/drawflow";

export default {
  name: "python-draw-flow",
  components: {},
  data() {
    return {
      code: [],
    };
  },
  watch: {
    "code.code": function (newData, oldData) {
      console.log("CHANGING CODE WATCH");
    },
  },
  mounted() {},
  updated() {
    console.log("CHANGING CODE");
    this.code = this.drawflowStore.code;
    console.log(this.code);
  },
  setup() {
    const drawflowStore = useDrawflowStore();
    return {
      drawflowStore,
    };
  },
};
</script>
