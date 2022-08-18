<template>
  <div class="container1">
    <div class="row">
      <div class="col-2 border border-primary" id="drag">
        <h4>Modulo de Operaciones</h4>
        <Menu />
      </div>
      <div class="col-5 border border-secondary" id="editor">
        <h4>Editor</h4>
        <Editor />
      </div>
      <div class="col-3 border border-success" id="pythonCode">
        <h4>Código Python</h4>
      </div>
      <div class="col-2 border border-danger" id="api">
        <h4>Operaciones Backend</h4>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from "./Menu.vue";
import Editor from "./Editor.vue";

export default {
  name: "draw-flow",

  components: { Menu, Editor },
};
</script>

<style scoped>
.container1 {
  height: 100vh;
  padding: 10px;
  border: 2px black dotted;
}
.row {
  width: 100%;
  height: 100%;
  margin: 0;
}

h4 {
  text-align: center;
  font-size: 16px;
  padding: 10px;
}

.col {
  padding: 10px;
}
</style>
