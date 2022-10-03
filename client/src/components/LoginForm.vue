<template>

 <div v-if="!isAuthenticated">
   <q-btn color="accent" @click="open=true" v-bind="$attrs">Login</q-btn>
   <auth-form @submit="onLogin" v-model="open">
     <template #title>
       <h5>Login Form</h5>
     </template>

     <p/>
     <template #Submit-button>
       <q-btn no-caps  color="primary" label="Sign in" type="submit"/>
     </template>

   </auth-form>
 </div>

</template>
<script setup>
  import AuthForm from 'components/AuthForm';
  import useLogin from 'src/composables/useLogin';
  //import {ref} from 'vue'

  const {open, onLogin,  isAuthenticated} = useLogin();

</script>

<style scoped>

</style>
