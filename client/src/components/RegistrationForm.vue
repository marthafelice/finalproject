<template>
  <div>
    <q-btn color="primary" @click="open=true">Register</q-btn>
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

  const {open, onLogin} = useLogin();


  async function onSubmit(login) {
    try {
      const loginToSave = new models.api.Logins(login);   // creating a new instance of Logins from login
      await loginToSave.save();  //-sends code to the database
      await onLogin(login);
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: e.message
      });
    }
  }

</script>
