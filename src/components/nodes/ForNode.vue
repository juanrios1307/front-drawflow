<template>
  <div class="node1">
    <div class="title-box">For Loop</div>
    <div class="box">
      <input type="number" df-desde placeholder="desde" />
      <input type="number" df-hasta placeholder="hasta" />
      <input type="number" df-paso placeholder="paso" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
};
</script>

<style>
.node1 {
  text-align: center;
}

input {
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>
