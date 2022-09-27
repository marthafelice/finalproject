<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:model-value',$event)"
            position="right"
            seamless
            persistent
            :maximized="maximizedToggle"
            transition-show="fade-in"
            transition-hide="fade-out"
  >
    <q-card class="q-pa-sm bg-white column items-center"  >

      <q-form
        style="height:100%;width: 20rem; "
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md column"
      >
        <div class="text-center">
          <slot name="title" >
            <h5>{{account._id? 'Edit': 'New'}} Account</h5>
          </slot>
        </div>
        <j-file-pond
          style="width: 150px; height: 150px;"
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
          :rules="[ val => val.length > 3 || 'Please enter a valid name.']"
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
          <q-btn label="Close" type="reset" color="primary" outline class="q-ml-sm" />

          <slot name="Submit-button">
            <q-btn :label="account ? 'Update':'Save'" type="submit" color="primary"/>
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

  const $q = useQuasar();
  const props = defineProps(['modelValue','account']);
  const $emit = defineEmits(['submit','update:model-value']);

  let  formData = ref({});
  let  maximizedToggle = ref(true);

  watch(()=>props.account,(newVal)=>{
    if(newVal) {
      formData.value = new models.api.Accounts(newVal);
    }else{
      formData.value = new models.api.Accounts();
    }
  },{
    immediate: true,
    deep: true
  });

  async function onSubmit(){
    try{
      await formData.value.save();
      onReset();
      $q.notify({
        type: 'positive',
        message: 'Account saved!'
      });
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: e.message
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
    console.log(val);
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
