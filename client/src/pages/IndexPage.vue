
<template>
  <q-page class="column items-center justify-center bg-accent q-px-lg">
<h4 class="text-center" style="margin-top: 0;">Salon Booking System</h4>
<logout-button v-if="authStore.isAuthenticated" color="primary"/>
      <services-list/>
  </q-page>
</template>

<script setup>

  import ServicesList from 'components/Gallery';
  import {useAuth} from 'stores/auth';
  import LogoutButton from 'components/LogoutButton';
  const authStore = useAuth();

</script>
