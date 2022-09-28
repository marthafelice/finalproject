<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:model-value',$event)"
            position="right"
            seamless
            persistent
            :maximized="maximizedToggle"
            transition-show="fade-in"
            transition-hide="fade-out"
  >
    <q-card class="q-pa-sm column items-center bg-primary text-white" >

      <q-form
        :style="`height:100%;`"
        @submit="onSubmit"
        @reset="onReset"
        class="q-mt-none q-gutter-lg q-pa-md"
      >

          <slot name="title" >
            <h5 class="text-center text-white">{{service._id? 'Edit': 'New'}} Service</h5>
          </slot>

        <j-file-pond
          class="self-center"
         :div-attrs="{ style:`height:auto; margin-top:-20px; ${$q.screen.gt.sm ? 'width: 15rem;':''}`,}"
          @upload-error="failed"
          @revert-success="reverted"
          @upload-success="success"
          stylePanelLayout=""
        />
        <q-input
          filled
          dense
         bg-color="grey-4"
         label-color="dark"
          v-model="formData.serviceName"
          label="Service Name *"
          lazy-rules
          required
          :rules="[ val => val.length > 3 || 'Please enter a valid service name.']"
        >
          <template #hint>
            <span class="text-caption text-grey-4">Enter Service Name</span>
          </template>
        </q-input>
        <q-input
          filled
          dense
          bg-color="grey-4"
          label-color="dark"
          v-model="formData.serviceCost"
          label="Service Cost *"
          mask="######"
          unmasked-value
          lazy-rules
          required
          :rules="[ val => isCurrency(val,{symbol: 'UGX', require_symbol: false, allow_space_after_symbol: true, symbol_after_digits: true, allow_negatives: false, thousands_separator: ',', allow_decimal: false, allow_space_after_digits: false}) || 'Please enter valid currency']"
        >
          <template #hint>
            <span class="text-caption text-grey-4">Enter Service Cost (ugx 1,690)</span>
          </template>
          <template #prepend>
            <span class="text-caption text-bold ">USH</span>
          </template>
          <template #append>
            <span class="text-caption text-bold ">/=</span>
          </template>
        </q-input>
        <q-input
          filled
          dense
          bg-color="grey-4"
          label-color="dark"
          type="textarea"
          autogrow
          v-model="formData.serviceDescription"
          label="Service Description *"
          lazy-rules
          required
          :rules="[ val => val.length > 15 || 'Description must be more than 15 words']"
        >
          <template #hint>
          <span class="text-caption text-grey-4">Enter Service Description</span>
        </template>
        </q-input>
          <div class="q-pt-lg row justify-between q-gutter-sm">
          <q-btn label="Close" type="reset" color="white" outline class="q-ml-sm" />

          <slot name="Submit-button">
            <q-btn :label="service?._id ? 'Update':'Save'" type="submit" color="secondary"/>
          </slot>

        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import JFilePond from 'components/j-uploader/JFilePond';
  import {ref, watch} from 'vue';
  import isCurrency from 'validator/lib/isCurrency';
  import {models} from 'feathers-pinia';
  import {useQuasar} from 'quasar';

  const $q = useQuasar();
  const props = defineProps(['modelValue','service']);
  const $emit = defineEmits(['submit','update:model-value']);

  let  formData = ref({});
  let  maximizedToggle = ref(true);

  watch(()=>props.service,(newVal)=>{
    if(newVal) {
      formData.value = new models.api.Services(newVal);
    }else{
      formData.value = new models.api.Services();
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
        message: 'Service saved!'
      });
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: e.message
      });
    }
  }

  function onReset() {
    formData.value = new models.api.Services();
    $emit('update:model-value', false);
  // open.value = false;
  }
  function reverted() {
    formData.value.serviceImage = null;
    $q.notify({
      type: 'positive',
      message: 'Successfully reverted upload',
    });
  }

  function success(val) {
    console.log(val);
    formData.value.serviceImage = val;
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
