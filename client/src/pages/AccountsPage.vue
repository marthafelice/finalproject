<template>
  <q-page class="column items-center justify-center bg-accent" >
    <p :class="$q.screen.width> 350? 'text-h1':'text-h5'">MY ACCOUNTS</p>
    <div :class="[$q.screen.width> 350?'row':'column', 'justify-center q-gutter-sm']">
      <q-card class="col cursor-pointer text-center column items-center justify-center bg-grey-4 q-pa-md "
              @click="openAccountForm=true">
        <q-card-section>
          New Account
        </q-card-section>
      </q-card>
      <q-card
        class="col cursor-pointer text-center column items-center justify-center bg-primary text-white q-pa-md"
        v-for="account in accounts" :key="account._id"
        @click="navigateToAccount(account._id)"
      >
        <q-card-section>
          <account-avatar :account="account"/>
          <div>
            {{ account?.name }}
          </div>
          <span class="text-caption">{{ account?.phone }}</span>
        </q-card-section>
        <q-card-actions align="left" class="q-gutter-sm">
          <q-btn flat icon="edit" @click.stop="handleOpenAccountForm(account)"/>
          <q-btn flat icon="delete" color="negative" @click.stop="handleDeleteAccount(account)"/>
        </q-card-actions>
      </q-card>
    </div>

    <account-form v-model="openAccountForm" :account="accountToEdit"/>
  </q-page>
</template>

<script setup>

  import AccountForm from 'components/AccountForm';
  import {useAuth} from 'stores/auth';
  import AccountAvatar from 'components/AccountAvatar';
  import {useQuasar} from 'quasar';
  import useAccounts from 'src/composables/useAccounts';
  import {models} from 'feathers-pinia';

  const $q = useQuasar();
  //const $router = useRouter();
  const authStore = useAuth();

  const query = authStore?.payload?.roles==='admin' ? {}: {
    login: authStore?.payload?._id,
  };

  const {
    handleDeleteAccount,
    handleOpenAccountForm,
    accounts,
    accountToEdit,
    openAccountForm,
  } = useAccounts({
    query
  });

  async function navigateToAccount(accountId) {
    if (accountId) {
      const loginInstance = new models.api.Logins({_id:authStore?.payload?._id});
      await loginInstance.save({data:{activeAccount:accountId}});
      loginInstance.addToStore();
      // await $router.push(`/accounts/${accountId}`);
      window.location.href = `/accounts/${accountId}`;
    }
  }
</script>
<style lang="css" scoped>

</style>
