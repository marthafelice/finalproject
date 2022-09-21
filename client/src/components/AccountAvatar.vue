<template>
  <q-avatar color="dark">
    <q-img v-if="account?.avatar" :src="account?.avatar"/>
    <span v-else>{{ account?.name ? getInitials(account?.name) : 'A' }}</span>
  </q-avatar>
</template>

<script setup>
  defineProps({
    account: {
      type: Object,
      required: true
    }
  });
  import {getInitials} from 'src/utils';
</script>

<style scoped>

</style>
