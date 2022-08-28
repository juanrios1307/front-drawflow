<template>
  <div class="col python" id="drag">
    <ul class="list-group list-group-flush">
      <li
        class="list-group-item itemCode"
        v-for="n in drawflowStore.code"
        :key="n.id"
      >
        <div>
          <code style="color: #17202a">
            <pre>{{ "".concat(...n.code) }}</pre>
          </code>
        </div>
      </li>
    </ul>
    <div class="results">
      <code class="out titleOut">RESULTS: </code>
      <ul class="list-group list-group-flush">
        <li
          class="list-group-item itemCode itemOut"
          v-for="n in drawflowStore.outCode"
          :key="n"
        >
          <div>
            <code class="out"> {{n}}</code>
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

.results{
  margin-top: 25px;

}

.itemOut{
  background-color: #CDCDCD;
}

.out{
  font-weight: bolder;
}

.titleOut{
  text-align: center;
}

</style>
