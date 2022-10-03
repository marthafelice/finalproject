<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:model-value',$event)">
    <div class="q-pa-md bg-white" style="height:100%;width: 20rem; " >
      <div class="text-center">
      <slot name="title" >
          <h5>Register</h5>
      </slot>
      </div>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md  "
      >
        <q-input
          filled
          v-model="login.email"
          label="Email *"
          hint="Enter Valid Email"
          lazy-rules
          required
          :rules="[ val => isEmail(val) || 'Please enter a valid name.']"
       />

        <q-input
          :type="isPwd ? 'password' : 'text'"
          filled
          v-model="login.password"
          label="Password *"
          hint="Valid Password Should be between 8 and 12 characters"
          lazy-rules
          :rules="[
          val => val !== null && val !== '' || 'Please type Valid Password',
          val => $lget(val,'length') >= 8 && $lget(val,'length') < 12 || 'Please type a Valid Password'
        ]"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class = "cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <slot>
          <q-toggle v-model="login.accept" label="I accept the license and terms" />
        </slot>
        <div class="q-pt-lg row justify-between">
          <q-btn label="Close" type="reset" color="primary" outline class="q-ml-sm" />

          <slot name="Submit-button">
            <q-btn label="Submit" type="submit" color="primary"/>
          </slot>

        </div>
      </q-form>

    </div>
  </q-dialog>
</template>

<script setup>
  import {ref} from 'vue';
  import isEmail from 'validator/lib/isEmail';
  import $lget from 'lodash.get';
  // import $lset from 'lodash.set';


  //const $router = useRouter();
  defineProps(['modelValue']);
  const $emit = defineEmits(['submit','update:model-value']);

  let isPwd = ref(true);
  let  login = ref({
    email: '',
    password: '',
    accept: false
  });

  function onSubmit(){
    $emit('submit',login.value);
    onReset();

  }

  function onReset() {
    login.value = {
      email: '',
      password: '',
      accept: false
    };
    $emit('update:model-value', false);
  // open.value = false;
  }

</script>

<style scoped>

</style>
