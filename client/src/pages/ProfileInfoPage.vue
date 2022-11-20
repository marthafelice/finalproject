<template>
  <q-page class="bg-primary column items-center justify-center">
    <services-list/>
    <account-form v-model="openAccountForm" @submit="sendToProfile" :account="{}" maximized/>
  </q-page>
</template>

<script setup>
  import {ref, onMounted} from 'vue';
  import AccountForm from 'components/AccountForm';
  import {useRouter} from 'vue-router';
  import ServicesList from 'components/PhotosList';
  import {useAuth} from 'stores/auth';

  const $router = useRouter();
  let authStore = useAuth();
  let openAccountForm = ref(true);


  onMounted(async () => {
    if (authStore?.payload?.activeAccount) {
      const pathTo = `accounts/${authStore?.payload?.activeAccount}`;
      await $router.push(pathTo);
    }
  });

  async function sendToProfile() {
    await authStore.authenticate();
    window.location.reload();
  }
</script>

<style scoped>

</style>
