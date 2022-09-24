<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:model-value',$event)"
            position="right"
            persistent
            :maximized="maximizedToggle"
            transition-show="fade-in"
            transition-hide="fade-out"
  >
    <q-card class="q-pa-sm column items-center"  >

      <q-form
        style="height:100%;width: 20rem; "
        @submit="onSubmit"
        @reset="onReset"
        class="q-mt-none q-gutter-sm q-pa-md"
      >

          <slot name="title" >
            <h5 class="text-center">{{service._id? 'Edit': 'New'}} Service</h5>
          </slot>

        <j-file-pond
          class="self-center"
         :div-attrs="{ style: 'width:270px; height:auto; margin-top:-20px;',}"
          @upload-error="failed"
          @revert-success="reverted"
          @upload-success="success"
          imageCropAspectRatio="16:9"
          :imageResizeTargetWidth="400"
          :imageResizeTargetHeight="100"
          stylePanelLayout=""
        />
        <q-input
          filled
          dense
          v-model="formData.serviceName"
          label="Service Name *"
          hint="Enter Service Name"
          lazy-rules
          required
          :rules="[ val => val.length > 3 || 'Please enter a valid service name.']"
        />
        <q-input
          filled
          dense
          v-model="formData.serviceCost"
          label="Mobile Phone *"
          hint="Enter Mobile Phone"
          lazy-rules
          required
          :rules="[ val => isCurrency(val,{symbol: 'UGX', require_symbol: false, allow_space_after_symbol: true, symbol_after_digits: true, allow_negatives: false, thousands_separator: ',', allow_decimal: false, allow_space_after_digits: false}) || 'Please enter valid currency']"
        />
        <q-input
          filled
          dense
          type="textarea"
          autogrow
          v-model="formData.serviceDescription"
          label="Service Description *"
          hint="Enter Service Description"
          lazy-rules
          required
          :rules="[ val => val.length > 15 || 'Description must be more than 15 words']"
        />
        <div class="q-pt-lg row justify-between q-gutter-sm">
          <q-btn label="Close" type="reset" color="primary" outline class="q-ml-sm" />

          <slot name="Submit-button">
            <q-btn :label="service ? 'Update':'Save'" type="submit" color="primary"/>
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
