<template>
  <q-page class="column items-center justify-center bg-accent" >
    <p :class="$q.screen.width> 350? 'text-h1':'text-h5'">EMPLOYEES</p>
    <div :class="[$q.screen.width> 350?'row':'column', 'justify-center q-gutter-sm']">
      <q-card class="col cursor-pointer text-center column items-center justify-center bg-grey-4 q-pa-md "
              @click="openAccountForm=true">
        <q-card-section>
          New Employee
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

<!--    <account-form v-model="openAccountForm" :account="accountToEdit"/>-->
  </q-page>
</template>

<script setup>
  import AccountAvatar from 'components/AccountAvatar';
  import useAccounts from 'src/composables/useAccounts';


  const {
    handleDeleteAccount,
    handleOpenAccountForm,
    accounts,
    openAccountForm,
  } = useAccounts({
    query: {
      accountModel: 'employees',
    }
  });

  async function navigateToAccount(accountId) {
    if (accountId) {
      window.location.href = `/accounts/${accountId}`;
    }
  }

</script>

<style scoped>

</style>
