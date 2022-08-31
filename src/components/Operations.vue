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
                      <p class="card-title">{{ n.uid.substring(2) }}</p>
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
import { saveAs } from "file-saver";

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
    //Obtención de drawflow instanciado en propiedaes globales
    let df = null;
    df = getCurrentInstance().appContext.config.globalProperties.$df.value;

    console.log(df.nodeId);
    this.id = df.nodeId;
    this.df = df;

    //Al montar el programa lista todos los programas existentes
    this.list();
  },
  setup() {
    const drawflowStore = useDrawflowStore();

    return {
      drawflowStore,
    };
  },
  methods: {
    //metodo para guardar programa
    async save(event) {
      console.log(this.drawflowStore.getCode);

      //Obtiene codigo del store
      var code = JSON.parse(JSON.stringify(this.drawflowStore.getCode));

      //Cambia formato de cada linea de codigo, la guarda como string sin id
      //Agrega antes del codigo un string con la posicion que ocupa realmente y un numeral como separador
      for (var i = 0; i < code.length; i++) {
        code[i] = String(i)
          .concat("#")
          .concat(...code[i].code);
      }

      //Data a guardar
      var data = {
        CodePython: code,
        Code: JSON.stringify(this.df.export()),
      };

      //Configuración para guardar datos en BD, a la url envia una data del tipo JSON
      var config = {
        method: "post",
        url: "http://localhost:9000/",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      //Espera respuesta
      const response = await axios(config);

      //Si la respuesta es OK envia alert y lista dde nuevo los programas
      if (response.statusText == "OK") {
        alert("Programa Guardado");
        this.list();
      }
    },

    //Función para listar programas
    async list() {
      //Envia configuración para obtener los registros
      var config = {
        method: "get",
        url: "http://localhost:9000/",
        headers: {},
      };

      //Espera respuesta y la imprime en consola
      const response = await axios(config);
      const data = response.data.getAll;
      console.log(data);

      //Deja vacio el store de programas
      this.drawflowStore.programs = [];

      //Agrega el nuevo programa con la estructura, uid, el drawflow guardado y el codigo python
      for (var i = 0; i < data.length; i++) {
        const uid = data[i].uid;
        const df = JSON.parse(data[i].Code);
        const pythonCode = data[i].CodePython;

        this.drawflowStore.$patch((state) => {
          state.programs.push({
            uid: uid,
            df: df,
            pythonCode: pythonCode,
          });
        });
      }

      console.log(this.drawflowStore.programs);
    },

    //Función para abrir un programa
    async open(event) {
      console.log(event.target.__vnode.key);
      //Obtiene la key del programa a abrir
      const key = event.target.__vnode.key;

      //Se crea la configuración para obtener solo un programa
      const data = { Uid: key };
      console.log(data);
      var config = {
        method: "get",
        url: "http://localhost:9000/" + key,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      //Espera respuesta y la imprime
      const response = await axios(config);
      const program = response.data.node[0];
      console.log(program);

      //Se obtiene el Code drawflow guardado de la respuesta obtenida
      const data1 = JSON.parse(program.Code);
      console.log(program);

      //Se obtiene codigo python del programa
      var pythonCode = program.CodePython;
      var id = [];

      //Se ejecuta un ciclo para obtener el codigo python y dividirlo en id y codigo
      for (var i = 0; i < pythonCode.length; i++) {
        var idx = pythonCode[i].indexOf("#");

        pythonCode[i] = {
          id: parseInt(pythonCode[i].substring(0, idx)),
          code: pythonCode[i].substring(idx + 1, pythonCode[i].length),
        };
      }

      //Se organiza codigo python en orden ascendente
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

      //Se almacena este codigo en la store
      this.drawflowStore.$patch((state) => {
        state.code = pythonCode;
      });

      console.log(this.drawflowStore.code);

      //Se importa programa y se deja de forma fija no editable
      this.df.import(data1);
      this.df.editor_mode = "fixed";
    },

    //Función para guardar el script del programa y ejecutar el codigo
    async execute(event) {
      //Se crea variable para guardar el this correspondiente al scope de la variable
      const vm = this;

      //Se obtiene el codigo de la store
      var code = JSON.parse(JSON.stringify(this.drawflowStore.getCode));

      //Se convierte el codigo almacenado en un array en strings
      for (var i = 0; i < code.length; i++) {
        code[i] = "".concat(...code[i].code);
        code[i] = code[i].concat("\n");
      }

      //Se crea un archivo y se guarda en pc
      var file = new File(code, "script.py", {
        type: "text/plain;charset=utf-8",
      });
      saveAs(file);

      //Se da un tiempo mientras se guarda el script
      setTimeout(async () => {
        //Se hace la configuración para ejecutar el codigo
        var config = {
          method: "get",
          url: "http://localhost:9000/exec",
          headers: {},
        };

        //Se espera respuesta
        const response = await axios(config);
        const data = response.data;

        //Se hace particion de la output de la consola
        var dataN = data.split(/\r?\n/);

        //Si existe esta data se elimina el primer elemento que no tiene formato
        if (dataN.length > 1) {
          dataN.shift();
        }

        //con el scope de función se hace que el outCode sea igual a la dataN
        vm.drawflowStore.$patch((state) => {
          state.outCode = dataN;
        });
      }, 10000);
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
