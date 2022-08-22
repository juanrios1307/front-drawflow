<template>
  <div class="node1">
    <div class="title-box">If Condition</div>
    <div class="box">
      <select df-condition>
        <option value="mayor">N1 &#62; N2</option>
        <option value="menor">N1 &#60; N2</option>
        <option value="igual">N1 == N2</option>
      </select>
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
