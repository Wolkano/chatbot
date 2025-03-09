<template>
  <div>
    <button
      v-for="option in question.options"
      :key="option"
      @click="$emit('answer', option)"
    >
      {{ option }}
    </button>
  </div>
</template>

<script>
export default {
  props: ["question"],
};
</script>
