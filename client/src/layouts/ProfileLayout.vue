<template>
  <q-layout view="hHh lpR fFf">

    <q-drawer show-if-above v-model="rightDrawerOpen" :side="$q.screen.sm? 'left':'right'" bordered>
      <!-- drawer content -->
      <q-item v-if="!isPending"  class="q-mb-md q-py-lg  bg-primary text-white" clickable v-ripple>
        <q-item-section avatar class="q-ml-sm">
          <account-avatar :account="account"/>
        </q-item-section>

        <q-item-section >
          <q-item-label class="text-white" >{{ account?.name }}</q-item-label>
          <q-item-label caption lines="1" class="text-grey-1" >({{ account?.phone }})</q-item-label>
        </q-item-section>

        <q-item-section side>


          <logout-button  :no-caps="false"  color="accent"  />
        </q-item-section>
      </q-item>

    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
  import {ref,} from 'vue';

  import AccountAvatar from 'components/AccountAvatar';
  import {Accounts} from 'stores/services/accounts';
  import {useGet} from 'feathers-pinia';

  import {useRoute} from 'vue-router';
  import LogoutButton from 'components/LogoutButton';
  const rightDrawerOpen = ref(true);

  const route = useRoute();

  const { item: account, isPending } = useGet({model: Accounts, id: route.params.id});
</script>
