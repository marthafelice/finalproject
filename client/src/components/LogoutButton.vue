<template>
    <q-btn v-if="isAuthenticated" no-caps @click="onLogout" v-bind="attrs"/>
</template>

<script setup>
  import useLogin from 'src/composables/useLogin';
  import {computed, useAttrs} from 'vue';

  const {onLogout,isAuthenticated} = useLogin();

  const attrs = computed(()=>{
    const btnAttrs = useAttrs();
    return {
      'no-caps': true,
      label: 'logout',
      ...btnAttrs
    };
  });

</script>
