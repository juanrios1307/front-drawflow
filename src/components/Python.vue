<template>
  <div class="col python" id="drag">
    <div class="containerCode">
      <ul class="list-group list-group-flush codeItem">
        <li
          class="list-group-item itemCode codeItem"
          v-for="n in drawflowStore.code"
          :key="n.id"
        >
          <div class="codeItem">
            <code class="codeItem" style="color: #17202a">
              <pre class="codeItem">{{ "".concat(...n.code) }}</pre>
            </code>
          </div>
        </li>
      </ul>
    </div>
    <div class="results">
      <code class="out titleOut">RESULTS: </code>
      <ul class="list-group list-group-flush">
        <li
          class="list-group-item itemCode itemOut"
          v-for="n in drawflowStore.outCode"
          :key="n"
        >
          <div>
            <code class="out"> {{ n }}</code>
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
  height: 45px;
  padding: 5px;
}

.results {
  margin-top: 25px;
}

.itemOut {
  background-color: #cdcdcd;
}

.out {
  font-weight: bolder;
}

.titleOut {
  text-align: center;
}

li {
  background-color: black;
}

.containerCode {
  background-color: aqua;
  border-radius: 100%;
}

.codeItem {
  background-color: black;
  color: rgba(63, 160, 84, 1);
  font-weight: bolder;
}
</style>
