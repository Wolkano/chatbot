<template>
  <div class="flex flex-col space-y-2">
    <input
      type="range"
      :min="question.min"
      :max="question.max"
      v-model="selectedValue"
      class="w-full cursor-pointer"
    />
    <p class="text-center font-semibold">{{ selectedValue }}</p>
    <button
      @click="confirmSelection"
      class="bg-blue-500 text-white px-4 py-2 rounded-md"
    >
      Bekräfta
    </button>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: ["question"],
  setup(props, { emit }) {
    const selectedValue = ref((props.question.min + props.question.max) / 2);

    const confirmSelection = () => {
      emit("answer", selectedValue.value);
    };

    return { selectedValue, confirmSelection };
  },
};
</script>
