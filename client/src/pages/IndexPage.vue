
<template>
  <q-page class="column items-center justify-center bg-accent q-px-lg">
    <h4 class="text-center" style="margin-top: 0;">Gallery App</h4>
    <logout-button v-if="authStore.isAuthenticated" color="primary"/>
    <photos-list/>
  </q-page>
</template>

<script setup>

  import PhotosList from 'components/PhotosList';
  import {useAuth} from 'stores/auth';
  import LogoutButton from 'components/LogoutButton';
  const authStore = useAuth();

</script>
