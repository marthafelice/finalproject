<template>
  <div v-if="!isAuthenticated">
    <q-btn color="accent" @click="open=true" v-bind="$attrs">Register</q-btn>
    <auth-form @submit="onSubmit" v-model="open">
      <template #Submit-button>
        <q-btn no-caps color="primary" label="Sign up" type="submit"/>
      </template>
    </auth-form>

  </div>
</template>

<script setup>
  import {models} from 'feathers-pinia';
  import {useQuasar} from 'quasar';
  import AuthForm from 'components/AuthForm';
  import useLogin from 'src/composables/useLogin';

  //import {ref} from 'vue'
  const $q = useQuasar();


  const {open, onLogin, isAuthenticated} = useLogin();


  async function onSubmit(login) {
    try {
      const loginToSave = new models.api.Logins(login);   // creating a new instance of Logins from login
      console.log({loginToSave});
      await loginToSave.save();  //-sends code to the database
      await onLogin(login);
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: e.message,
      });
    }
  }

</script>
