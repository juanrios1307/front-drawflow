<template>
  <div id="actions">
    <div class="row list">
      <div class="col">
        <h5>Lista De Programas</h5>
        <div class="programList">
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item a"
              v-for="n in listPrograms"
              :key="n.name"
              :data-node="n.name"
            >
              <div class="card">
                <div class="card-header">{{ n.name }}</div>
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <p class="card-title">{{ n.date }}</p>
                      <p class="card-text">
                        {{ n.nodos }}
                      </p>
                    </div>
                    <div class="col">
                      <button
                        type="button"
                        class="btn btn-success"
                        @click="open"
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row">
      <button
        type="button"
        class="btn btn-success btn-lg btn-block"
        @click="list"
      >
        Listar Programas
      </button>

      <button
        type="button"
        class="btn btn-success btn-lg btn-block"
        @click="save"
      >
        Guardar Programa
      </button>

      <button type="button" class="btn btn-success btn-lg btn-block">
        Abrir Programa
      </button>
    </div>
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
      listPrograms: "",
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

    list(event) {
      this.listPrograms = [
        {
          name: "Suma",
          date: "hoy",
          nodos: "3",
        },
        {
          name: "Resta",
          date: "hoy",
          nodos: "3",
        },
        {
          name: "Multiplicacion",
          date: "hoy",
          nodos: "3",
        },
        {
          name: "For",
          date: "hoy",
          nodos: "3",
        },
        {
          name: "If",
          date: "hoy",
          nodos: "3",
        },
      ];
    },

    open(event) {
      const data = {};

      this.df.import(data);
    },
  },
};
</script>

<style>
.list {
  height: 60vh;
  margin-bottom: 10px;
}

.programList {
  height: 50vh;
  overflow: scroll;
}

.btn {
  border-radius: 125px;
}
</style>
