<template>
  <q-page class="column items-center justify-center">
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
  import {models, useFind} from 'feathers-pinia';
  import {computed, ref} from 'vue';

  import {useRouter} from 'vue-router/dist/vue-router';
  import AccountForm from 'components/AccountForm';
  import {useAuth} from 'stores/auth';
  import AccountAvatar from 'components/AccountAvatar';
  import {useQuasar} from 'quasar';

  const $q = useQuasar();
  const $router = useRouter();
  const authStore = useAuth();
  const openAccountForm = ref(false);
  const accountToEdit = ref({});

  // 2. Create a computed property for the params
  const accountsParams = computed(() => {
    return {
      query: {
        login: authStore?.payload?._id,
      },
    };
  });
  // 3. Provide the Model class and params in the options
  const {items: accounts} = useFind({
    model:models.api.Accounts,
    params: accountsParams
  });


  async function navigateToAccount(accountId) {
    if (accountId) {
      await $router.push(`/accounts/${accountId}`);
    }
  }
  function handleOpenAccountForm(account){
    accountToEdit.value = account;
    openAccountForm.value=true;
  }
  async function handleDeleteAccount(account) {
    $q.dialog({
      dark: true,
      title: 'Confirm Delete',
      message: `Would you like to delete the ${account?.name} account ?`,
      cancel: true,
      persistent: true
    }).onOk(() => {
    // console.log('>>>> OK')
    }).onOk(async () => {
      try{
        await models.api.Accounts.remove(account._id);
        $q.notify({
          type: 'positive',
          message: `Successfully deleted the ${account?.name} account.`,
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: `Error: ${e.message}`,
        });
      }
    // console.log('>>>> second OK catcher')
    }).onCancel(() => {
    // console.log('>>>> Cancel')
    }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
    });
  }
</script>
<style lang="css" scoped>

</style>
