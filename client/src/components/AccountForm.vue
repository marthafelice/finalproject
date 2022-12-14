<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:model-value',$event)"
            position="right"
            seamless
            persistent
            :maximized="maximizedToggle"
            transition-show="fade-in"
            transition-hide="fade-out"
  >
    <q-card class="q-pa-sm bg-white column items-center">

      <q-form

        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md column"
      >
        <div class="text-center">
          <slot name="title">
            <h5>{{ account._id ? 'Edit' : 'Create An' }} Account</h5>
          </slot>
        </div>
        <j-file-pond
          :div-attrs="{ style:`height:auto; margin-top:-20px; ${$q.screen.gt.sm ? 'width: 15rem;':''}`,}"
          @upload-error="failed"
          @revert-success="reverted"
          @upload-success="success"
          class="self-center"
        />
        <q-input
          filled
          dense
          v-model="formData.name"
          label="Name *"
          hint="Enter Name"
          lazy-rules
          required
          :rules="[ val => $lget(val,'length') > 3 || 'Please enter a valid name.']"
        />
        <q-input
          filled
          dense
          v-model="formData.phone"
          label="Mobile Phone *"
          hint="Enter Mobile Phone"
          lazy-rules
          required
          :rules="[ val => isMobilePhone(val,'en-UG') || 'Please enter a valid name.']"
        />

        <div class="q-pt-lg row justify-between q-gutter-sm">
          <q-btn label="Close" type="reset" color="primary" outline class="q-ml-sm"/>

          <slot name="Submit-button">
            <q-btn :label="account?._id ? 'Update':'Save'" type="submit" color="primary"/>
          </slot>

        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import JFilePond from 'components/j-uploader/JFilePond';
  import {ref, watch} from 'vue';
  import isMobilePhone from 'validator/lib/isMobilePhone';
  import {models} from 'feathers-pinia';
  import {useQuasar} from 'quasar';
  import $lget from 'lodash.get';
  import {useAuth} from 'stores/auth';
  //import $lset from 'lodash.set';

  const $q = useQuasar();
  const authStore = useAuth();
  const props = defineProps(['modelValue', 'account']);
  const $emit = defineEmits(['submit', 'update:model-value']);

  let formData = ref({});
  let maximizedToggle = ref(true);

  watch(() => props.account, (newVal) => {
    if (newVal) {
      formData.value = new models.api.Accounts(newVal);
    } else {
      formData.value = new models.api.Accounts();
    }
  }, {
    immediate: true,
    deep: true,
  });

  async function onSubmit() {
    try {
      await formData.value.save();
      await authStore.authenticate();
      $emit('submit');
      onReset();
      $q.notify({
        type: 'positive',
        message: 'Account saved!',
      });
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: e.message,
      });
    }
  }

  function onReset() {
    formData.value = new models.api.Accounts();
    $emit('update:model-value', false);
    // open.value = false;
  }

  function reverted() {
    formData.value.avatar = null;
    $q.notify({
      type: 'positive',
      message: 'Successfully reverted upload',
    });
  }

  function success(val) {

    formData.value.avatar = val;
    $q.notify({
      type: 'positive',
      message: 'Successfully uploaded',
    });
  }

  function failed(e) {
    $q.notify({
      type: 'negative',
      message: `upload error ${e.message}`,
    });
  }
</script>

<style scoped>

</style>
