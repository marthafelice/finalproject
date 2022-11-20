<template>
  <q-page :class="[$q.screen.gt.xs?'column items-center justify-start bg-accent':'q-pa-md bg-accent']">

    <q-tabs
      v-model="tab"
      class="text-primary q-pb-xs"
    >
<!--      <q-tab class="text-grey-4"  dense v-if="employeeId" name="schedule" icon="fas fa-calendar" label="My Schedule"/>-->
<!--      <q-tab class="text-grey-4"  dense v-if="customerId" name="reservations" icon="fas fa-pray" label="My Reservations"/>-->
      <q-tab class="text-grey-4"  dense name="profile" icon="fas fa-user" label="My Profile"/>
    </q-tabs>
<!--    <scheduler v-if="customerId&&tab==='reservations'" account-type="customers" :query-prop="{customer:customerId}"/>-->
<!--      <scheduler v-if="employeeId&&tab==='schedule'" account-type="employees" :query-prop="{employee:employeeId}"/>-->
    <q-card v-if="tab==='profile'" dark flat class="bg-primary" :style="$q.screen.gt.xs?{minWidth: '35vw'}:{minWidth: '90vw'}">
      <q-img v-if="account?.avatar" :src="account?.avatar" crossorigin="anonymous"/>
      <q-card-section>

        <q-fab direction="up"  color="secondary"
               icon="edit"
               class="absolute"
               style="top: 0; right: 35px; transform: translateY(-50%);"
        >
          <template v-slot:icon="{ opened }">
            <q-icon :class="{ 'example-fab-animate--hover': opened !== true }" name="keyboard_arrow_up" />
          </template>

          <template v-slot:active-icon="{ opened }">
            <q-icon :class="{ 'example-fab-animate': opened === true }" name="close" />
          </template>

          <q-fab-action color="secondary" @click="handleDeleteAccount(account)" >
            <template v-slot:icon>
              <q-icon name="delete" />
            </template>
            <template v-slot:label>
              Delete Profile
            </template>
          </q-fab-action>

          <q-fab-action color="accent" @click="handleOpenAccountForm(account)"   icon="edit" label="Edit Profile" />
        </q-fab>
        <div class="column items-center">
          <h5>{{account?.name}}</h5>
          <p style="margin-top:-40px;">{{ account?.phone }}</p>
        </div>
      </q-card-section>
    </q-card>
    <account-form v-model="openAccountForm" :account="accountToEdit"/>
  </q-page>
</template>

<script setup>

  import {ref} from 'vue';
  import AccountForm from 'components/AccountForm';
  import {models, useGet} from 'feathers-pinia';
  import {useRoute} from 'vue-router';
  import useAccounts from 'src/composables/useAccounts';
  // import Scheduler from 'components/Calendar/Scheduler';

  let tab = ref('profile');


  const $route = useRoute();

  const {item: account} = useGet({
    model: models.api.Accounts,
    id: $route?.params?.id
  });
  const {
    handleDeleteAccount,
    handleOpenAccountForm,
    accountToEdit,
    openAccountForm,
  } = useAccounts({
    query:{}
  });

  // const customerId = computed(() =>{
  //   const customer = account?.value?.accountType.find(account => account.Model==='customers');
  //   return customer?._id;
  // });

  // const employeeId = computed(() =>{
  //   const customer = account?.value?.accountType.find(account => account.Model==='employees');
  //   return customer?._id;
  // });


</script>
