<template>
  <div id="actions">
    <div class="row list">
      <div class="col">
        <h5>Lista De Programas</h5>
        <div class="programList">
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item"
              v-for="n in listPrograms"
              :key="n.uid"
              :data-node="n.uid"
            >
              <div class="card">
                <div class="card-header">{{ n.uid }}</div>
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <p class="card-title">Nodos :{{ Object.values(n.drawflow.Home.data).length }}</p>
                      <p class="card-text">
                        Nodo 1 : {{ n.drawflow.Home.data['1'].name }}
                      </p>
                    </div>
                    <div class="col">
                      <button
                        type="button"
                        class="btn btn-success"
                        :key="n.uid"
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
import axios from "axios";

export default {
  name: "operations",
  components: {},
  data() {
    return {
      id: "",
      df: "",
      listPrograms: [],
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
      
      console.log(this.drawflowStore.getCode)
      var code = JSON.parse ( JSON.stringify ( this.drawflowStore.getCode) )
      console.log(code)

      for(var i = 0; i<code.length; i++){
        code[i]="".concat(...code[i].code)
      }

      console.log(code)

      var data = {
        "CodePython":code,
        "Code":JSON.stringify(this.df.export())
      }

      console.log(this.df.export())
      console.log(Object.values(this.df.export().drawflow.Home.data).length)
      console.log(data)


      var config = {
        method: 'post',
        url: 'http://localhost:9000/',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };

      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });

    },

    async list(event) {

      var config = {
        method: 'get',
        url: 'http://localhost:9000/',
        headers: { }
      };

      const response = await axios(config)
      this.listPrograms = response.data.getAll
      console.log(this.listPrograms)
     
    },

    open(event) {
      
      console.log(event.target.__vnode.key)

      const key = event.target.__vnode.key

      const program = this.listPrograms.find((line) => line.uid == key);

      const data = JSON.parse(program.Code);
      console.log(data)

      /*drawflowStore.$patch((state) => {
              state.code = program.code;
            });*/

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

.list-group-item {
  padding: 10px;
}
</style>
