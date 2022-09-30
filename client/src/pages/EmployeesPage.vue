<template>
  <q-page class="column items-center justify-center bg-accent">
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
          <q-btn flat icon="delete" color="negative" @click.stop="handleDeleteEmployeeAccount(account)"/>
        </q-card-actions>
      </q-card>
    </div>
    <employee-form v-model="openAccountForm" :account="accountToEdit" :employee="employeeToEdit"/>
    <!--    <account-form v-model="openAccountForm" :account="accountToEdit"/>-->
  </q-page>
</template>

<script setup>
  import AccountAvatar from 'components/AccountAvatar';
  import useAccounts from 'src/composables/useAccounts';
  import EmployeeForm from 'components/EmployeeForm';
  import {ref} from 'vue';
  import useEmployees from 'stores/services/employees';
  // import {models} from 'feathers-pinia';
  import {useQuasar} from 'quasar';

  const employeesStore = useEmployees();
  const $q = useQuasar();

  const employeeToEdit = ref({});


  const {
    accounts,
    openAccountForm,
    accountToEdit,
  } = useAccounts({
    query: {
      'accountType.Model': 'employees',
    },
  });

  async function handleOpenAccountForm(account) {
    const employeeId = account.accountType.find(act => act.Model === 'employees')['_id'];
    employeeToEdit.value = await employeesStore.get(employeeId);
    openAccountForm.value = true;
  }

  async function handleDeleteEmployeeAccount(account) {
    $q.dialog({
      dark: true,
      title: 'Confirm Delete',
      message: `Would you like to delete ${account?.name} as an employee?`,
      cancel: true,
      persistent: true,
    }).onOk(() => {
      // console.log('>>>> OK')
    }).onOk(async () => {
      try {
        const employeeId = account.accountType.find(act => act.Model === 'employees')['_id'];
        await account.save({
          data: {
            $pull: {
              'accountType': {
                _id: employeeId,
                Model: 'employees'
              },
            },
          },
        });
        $q.notify({
          type: 'positive',
          message: `Successfully deleted ${account?.name}.`,
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

  async function navigateToAccount(accountId) {
    if (accountId) {
      window.location.href = `/accounts/${accountId}`;
    }
  }

</script>

<style scoped>

</style>
