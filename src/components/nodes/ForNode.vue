<template>
  <div class="node1">
    <div class="title-box">For Loop</div>
    <div class="box">
      <input type="number" df-n1 placeholder="N1" disabled />
      <input type="number" df-n2 placeholder="N2" disabled />
      <input type="number" min="1" df-repeat placeholder="Repetición" />
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
