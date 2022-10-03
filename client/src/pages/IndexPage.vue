
<template>
  <q-page class="column items-center justify-center bg-accent q-px-lg">
<logout-button v-if="authStore.isAuthenticated" color="primary"/>
      <services-list/>
  </q-page>
</template>

<script setup>

  import ServicesList from 'components/ServicesList';
  import {useAuth} from 'stores/auth';
  import LogoutButton from 'components/LogoutButton';
  const authStore = useAuth();

</script>
