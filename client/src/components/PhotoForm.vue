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
          <h5 class="text-center text-white">{{photo?._id? 'Edit': 'New'}} Photo</h5>
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
          label="Photo title *"
          lazy-rules
          required
          :rules="[ val => $lget(val,'length') > 3 || 'Please enter a valid photo name.']"
        >
          <template #hint>
            <span class="text-caption text-grey-4">Enter Photo Title</span>
          </template>
        </q-input>

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

  import JFilePond from 'components/j-uploader/JFilePond';
  import {ref, watch} from 'vue';
  import {models} from 'feathers-pinia';
  import {useQuasar} from 'quasar';
  import usePhotos from 'src/composables/usePhotos';

  const $q = useQuasar();
  const props = defineProps(['modelValue','photo']);
  const $emit = defineEmits(['submit','update:model-value']);

  let  formData = ref({});
  let  maximizedToggle = ref(true);

  watch(()=>props.photo,(newVal)=>{
    if(newVal) {
      formData.value = new models.api.Photos(newVal);
    }else{
      formData.value = new models.api.Photos({});
    }
  },{
    immediate: true,
    deep: true
  });

  const {
    payload,
  } = usePhotos();

  async function onSubmit(){
    try{
      formData.value.account = payload.value?.activeAccount;
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
    formData.value = new models.api.Photos({});
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
