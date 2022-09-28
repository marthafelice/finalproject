
<template>
  <q-page class="column items-center justify-center bg-accent q-px-lg">
    <div class="q-pa-md row justify-around" style="max-width: 400px">
      <registration-form class="q-mx-sm"/>
      <login-form class="q-mx-sm"/>
    </div>
      <services-list/>
  </q-page>
</template>

<script setup>
  import RegistrationForm from 'components/RegistrationForm';
  import LoginForm from 'components/LoginForm';
  import ServicesList from 'components/ServicesList';

</script>
