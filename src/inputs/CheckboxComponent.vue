<template>
  <div class="flex flex-col space-y-2">
    <div
      v-for="option in question.options"
      :key="option"
      class="flex items-center space-x-2"
    >
      <input
        type="checkbox"
        :id="option"
        :value="option"
        v-model="selectedOptions"
        class="w-5 h-5 cursor-pointer"
        @change="handleSelection(option)"
      />
      <label :for="option" class="cursor-pointer">{{ option }}</label>
    </div>
    <button
      @click="$emit('answer', selectedOptions)"
      class="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
    >
      Confirm Selection
    </button>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: ["question"],
  setup(props) {
    const selectedOptions = ref([]);

    const handleSelection = (option) => {
      if (!props.question.multiple) {
        // If only one selection is allowed, reset the array to the latest choice
        selectedOptions.value = [option];
      }
    };

    return { selectedOptions, handleSelection };
  },
};
</script>
