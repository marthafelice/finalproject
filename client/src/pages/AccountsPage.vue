<template>
  <q-page class="column items-center justify-center">
    <h1>MY ACCOUNTS</h1>
    <div class="row justify-center q-gutter-sm">
      <q-card class="col cursor-pointer text-center column items-center justify-center bg-grey-4 "
              @click="openAccountForm=true">
        <q-card-section>
          New Account
        </q-card-section>
      </q-card>
      <q-card
        class="col cursor-pointer text-center column items-center justify-center bg-primary text-white"
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
      </q-card>
    </div>

    <account-form v-model="openAccountForm"/>
  </q-page>
</template>

<script setup>
  import {useFind} from 'feathers-pinia';
  import {computed, ref} from 'vue';
  import {Accounts} from 'stores/services/accounts';

  import {useRouter} from 'vue-router/dist/vue-router';
  import AccountForm from 'components/AccountForm';
  import {useAuth} from 'stores/auth';
  import AccountAvatar from 'components/AccountAvatar';

  const $router = useRouter();
  const authStore = useAuth();
  const openAccountForm = ref(false);

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
    model: Accounts,
    params: accountsParams
  });

  async function navigateToAccount(accountId) {
    if (accountId) {
      await $router.push(`/accounts/${accountId}`);
    }
  }


</script>
<style lang="css" scoped>

</style>
