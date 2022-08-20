<template>
  <div>
    <div class="title-box">Enter a number</div>
    <div class="box">
      <input type="number" df-number />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ID: "",
      nodeId: "",
      bizStep: "",
      allNodeInfo: [],
      identifierSyntax: "URN",
    };
  },
  mounted() {
    console.log("MOUNTED");
  },
};
</script>
