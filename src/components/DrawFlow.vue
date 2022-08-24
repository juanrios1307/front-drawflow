<template>
  <div class="container1">
    <div class="row">
      <div class="col-6" id="drag">
        <Editor />
      </div>
      <div class="col-4" id="python">
        <h4>Python Code</h4>
        <Python />
      </div>
      <div class="col-2" id="api">
        <h4>Operaciones Backend</h4>
        <Operations />
      </div>
    </div>
  </div>
</template>

<script>
import Editor from "./Editor.vue";
import Python from "./Python.vue";
import Operations from "./Operations.vue";

export default {
  name: "draw-flow",

  components: { Editor, Python, Operations },
};
</script>

<style scoped>
.container1 {
  height: 100vh;
  padding: 10px;
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
  font-weight: bold;
}

.col {
  padding: 10px;
}
</style>
