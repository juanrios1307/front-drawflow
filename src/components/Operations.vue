<template>
  <div class="col" id="drag">
    <button
      type="button"
      class="btn btn-primary btn-lg btn-block"
      @click="list"
    >
      Listar Programas
    </button>

    <button
      type="button"
      class="btn btn-primary btn-lg btn-block"
      @click="save"
    >
      Guardar Programa
    </button>

    <button
      type="button"
      class="btn btn-primary btn-lg btn-block"
      @click="open"
    >
      Abrir Programa
    </button>
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";
import { useDrawflowStore } from "../stores/drawflow";

export default {
  name: "operations",
  components: {},
  data() {
    return {
      id: "",
      df: "",
    };
  },
  mounted() {
    let df = null;
    df = getCurrentInstance().appContext.config.globalProperties.$df.value;

    console.log(df.nodeId);
    this.id = df.nodeId;
    this.df = df;
  },
  setup() {
    const drawflowStore = useDrawflowStore();

    return {
      drawflowStore,
    };
  },
  methods: {
    save(event) {
      console.log(this.df.export());
    },

    list(event) {},

    open(event) {
      const data = {};

      this.df.import(data);
    },
  },
};
</script>
