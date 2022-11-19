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
            <h5 class="text-center text-white">{{photo._id? 'Edit': 'New'}} Photo </h5>
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
          v-model="formData.title"
          label="Title*"
          lazy-rules
          required
          :rules="[ val => $lget(val,'length') > 3 || 'Please enter a valid photo title.']"
        >
          <template #hint>
            <span class="text-caption text-grey-4">Enter Photo Title</span>
          </template>
        </q-input>
<!--        <q-input-->
<!--          filled-->
<!--          dense-->
<!--          bg-color="grey-4"-->
<!--          label-color="dark"-->
<!--          v-model="formData.serviceCost"-->
<!--          label="Service Cost *"-->
<!--          mask="######"-->
<!--          unmasked-value-->
<!--          lazy-rules-->
<!--          required-->
<!--          :rules="[ val => isCurrency(val,{symbol: 'UGX', require_symbol: false, allow_space_after_symbol: true, symbol_after_digits: true, allow_negatives: false, thousands_separator: ',', allow_decimal: false, allow_space_after_digits: false}) || 'Please enter valid currency']"-->
<!--        >-->
<!--          <template #hint>-->
<!--            <span class="text-caption text-grey-4">Enter Service Cost (ugx 1,690)</span>-->
<!--          </template>-->
<!--          <template #prepend>-->
<!--            <span class="text-caption text-bold ">USH</span>-->
<!--          </template>-->
<!--          <template #append>-->
<!--            <span class="text-caption text-bold ">/=</span>-->
<!--          </template>-->
<!--        </q-input>-->
<!--       <div class="column">-->
<!--         <span class="text-caption">-->
<!--           Service Duration-->
<!--         </span>-->
<!--         <vue-number-input v-model="formData.serviceDuration" :min="1" :max="10" inline controls :disabled="formData.serviceDuration>10"/>-->
<!--       </div>-->
        <q-input
          filled
          dense
          bg-color="grey-4"
          label-color="dark"
          type="textarea"
          autogrow
          v-model="formData.description"
          label="Photo Description *"
          lazy-rules
          required
          :rules="[ val => $lget(val,'length') > 15 || 'Description must be more than 15 words']"
        >
          <template #hint>
          <span class="text-caption text-grey-4">Enter Photo Description</span>
        </template>
        </q-input>
          <div class="q-pt-lg row justify-between q-gutter-sm">
          <q-btn label="Close" type="reset" color="white" outline class="q-ml-sm" />

          <slot name="Submit-button">
            <q-btn :label="photo?._id ? 'Update':'Save'" type="submit" color="secondary"/>
          </slot>

        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import $lget from 'lodash.get';
  // import $lset from 'lodash.set';
  // import VueNumberInput from '@chenfengyuan/vue-number-input';
  import JFilePond from 'components/j-uploader/JFilePond';
  import {ref, watch} from 'vue';
  // import isCurrency from 'validator/lib/isCurrency';
  // import {models} from 'feathers-pinia';
  import {useQuasar} from 'quasar';

  const $q = useQuasar();
  const props = defineProps(['modelValue','photo']);
  const $emit = defineEmits(['submit','update:model-value']);

  let  formData = ref({});
  let  maximizedToggle = ref(true);

  watch(()=>props.photo,(newVal)=>{
    if(newVal) {
      formData.value = (newVal);
    }else{
      formData.value = {};
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
        message: 'Photo saved!'
      });
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: e.message
      });
    }
  }

  function onReset() {
    formData.value = {};
    $emit('update:model-value', false);
  // open.value = false;
  }
  function reverted() {
    formData.value.url = null;
    $q.notify({
      type: 'positive',
      message: 'Successfully reverted upload',
    });
  }

  function success(val) {
    console.log(val);
    formData.value.url = val;
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
