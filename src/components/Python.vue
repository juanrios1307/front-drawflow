<template>
  <div class="col" id="drag">
    <h4>Python Code</h4>

    <ul class="list-group list-group-flush">
      <li
        class="list-group-item a"
        v-for="n in drawflowStore.code"
        :key="n.id"
        draggable="true"
      >
        <div class="a">
          <code style="color: #17202a">
            <pre>{{ "".concat(...n.code) }}</pre>
          </code>
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
    return {};
  },
  setup() {
    const drawflowStore = useDrawflowStore();

    return {
      drawflowStore,
    };
  },
};
</script>
