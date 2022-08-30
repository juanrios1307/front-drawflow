<template>
  <div class="col python" id="drag">
    <div class="containerCode">
      <ul class="list-group list-group-flush codeItem">
        <li
          class="list-group-item itemCode li"
          v-for="n in drawflowStore.code"
          :key="n.id"
        >
          <div class="itemCode">
            <code class="itemCode" style="color: #01FF4E">
              <pre class="itemCode">{{ "".concat(...n.code) }}</pre>
            </code>
          </div>
        </li>
      </ul>
    </div>
    <div class="results itemCode containerCode">
      <code class="itemCode">RESULTS: </code>
      <ul class="list-group list-group-flush codeItem">
        <li
          class="list-group-item itemCode li"
          v-for="n in drawflowStore.outCode"
          :key="n"
        >
          <div>
            <code class="itemCode"> {{ n }}</code>
          </div>
        </li>
      </ul>
    </div>
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
  background-color: black;
  color: rgba(63, 160, 84, 1);
  
}

.results {
  margin-top: 25px;
}

.li {
  background-color: black;
  height: 40px;
  padding: 5px;
  border-radius: 25px;
}

code{
  font-size: 20px;
  font-weight: bolder;
}


</style>
