import { ref, onMounted } from '@nuxtjs/composition-api';

export function test(root) {
  const post = ref({});
  post.value.first = 'composition api template';
  //   console.log("setup root");

  const mounted = val => {
    console.log('setup post', val);
  };

  onMounted(() => {
    mounted(1);
  });

  return {
    post
  };
}
