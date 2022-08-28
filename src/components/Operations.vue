<template>
  <div id="actions">
    <div class="row list">
      <div class="col">
        <h5>Lista De Programas</h5>
        <div class="programList">
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item"
              v-for="n in drawflowStore.programs"
              :key="n.uid"
              :data-node="n.uid"
            >
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <div class="col-6">
                      <p class="card-title">{{n.uid.substring(2)}}</p>
                    </div>
                    <div class="col-6">
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

      <button 
        type="button" 
        class="btn btn-success btn-lg btn-block" 
        @click="execute"
      > 
        Ejecutar Programa
      </button>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";
import { useDrawflowStore } from "../stores/drawflow";
import axios from "axios";
import { saveAs } from 'file-saver';

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

    this.list()
  },
  setup() {
    const drawflowStore = useDrawflowStore();

    return {
      drawflowStore,
    };
  },
  methods: {
    async save(event) {
      
      console.log(this.drawflowStore.getCode)
      var code = JSON.parse ( JSON.stringify ( this.drawflowStore.getCode) )

      for(var i = 0; i<code.length; i++){
        code[i]=String(i).concat(...code[i].code)
      }


      var data = {
        "CodePython":code,
        "Code":JSON.stringify(this.df.export())
      }

      var config = {
        method: 'post',
        url: 'http://localhost:9000/',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };

      const response = await axios(config)

      if(response.statusText == "OK"){
          alert("Programa Guardado")
          this.list()
        }
    },

    async list() {

      var config = {
        method: 'get',
        url: 'http://localhost:9000/',
        headers: { }
      };

      const response = await axios(config)
      const data = response.data.getAll
      console.log(data)

      this.drawflowStore.programs= [];

      for(var i=0;i<data.length;i++){
        const uid = data[i].uid
        const df = JSON.parse(data[i].Code)
        const pythonCode = data[i].CodePython

        this.drawflowStore.$patch((state) => {
          state.programs.push({
            uid:uid,
            df:df,
            pythonCode:pythonCode,
          });
        });

      }

      console.log(this.drawflowStore.programs)
     
    },

    async open(event) {
      
      console.log(event.target.__vnode.key)

      const key = event.target.__vnode.key

      const data = {Uid : key}
      console.log(data)
       var config = {
        method: 'get',
        url: 'http://localhost:9000/'+key,
       headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };

      const response = await axios(config)
      const program = response.data.node[0]
      console.log(program)

      //const program = this.listPrograms.find((line) => line.uid == key);

      const data1 = JSON.parse(program.Code);
      console.log(program)

      var pythonCode = program.CodePython
      var id =[]

      for(var i =0; i<pythonCode.length; i++){
        id[i] = pythonCode[i].substring(0,1)
        pythonCode[i]={
          id: pythonCode[i].substring(0,1),
          code:pythonCode[i].substring(1,pythonCode[i].length)
          }
      }

      pythonCode.sort(function (a, b) {
        if (a.id > b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });

      this.drawflowStore.$patch((state) => {
              state.code = pythonCode;
            });

      console.log(this.drawflowStore.code)

      this.df.import(data1);
      this.df.editor_mode = 'fixed'
    },
    
    async execute (event){

      const vm = this

      var code = JSON.parse ( JSON.stringify ( this.drawflowStore.getCode) )

      for(var i = 0; i<code.length; i++){
        code[i]="".concat(...code[i].code)
        code[i]=code[i].concat("\n")
      }

      var file = new File(code, "script.py", {type: "text/plain;charset=utf-8"});
      saveAs(file)

      setTimeout(async ()=>{
        var config = {
          method: 'get',
          url: 'http://localhost:9000/exec',
          headers: { }
        };

        const response = await axios(config)
        const data = response.data

        var dataN = data.split(/\r?\n/);

        if(dataN.length>1){
          dataN.shift()
        }

        vm.drawflowStore.$patch((state) => {
          state.outCode=dataN
        });


      },10000)
      
      

    
    }
    
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
