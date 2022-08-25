<template>
  <div class="col python" id="drag">
    <ul class="list-group list-group-flush">
      <li
        class="list-group-item itemCode"
        v-for="n in drawflowStore.code"
        :key="n.id"
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

<style>
.python {
  height: calc(100vh - 60px);
  overflow: scroll;
}

.itemCode {
  height: 45px;
  padding: 5px;
}
</style>
