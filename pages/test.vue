<template>
  <div>{{ post.first }}</div>
</template>

<script>
import { defineComponent } from "@nuxtjs/composition-api";
import { test } from "@/composables";
export default defineComponent({
  setup(props, { root }) {
    const { post } = test(root);

    return { post };
  }
});
</script>
