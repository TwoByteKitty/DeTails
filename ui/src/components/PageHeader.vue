<script setup lang="ts">
defineProps<{
  msg: string;
}>();
</script>

<script lang="ts">
export default {};
</script>

<template>
  <h1>{{ msg }}</h1>
</template>

<style scoped lang="css">
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
  text-align: center;
}

@media (min-width: 1024px) {
  h1 {
    text-align: left;
  }
}
</style>
