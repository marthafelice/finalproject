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
        :style="`height:100%; ${$q.screen.gt.sm ? 'width: 15rem;':''}`"
        @submit="onSubmit"
        @reset="onReset"
        class="q-mt-none q-gutter-lg q-pa-md"
      >

          <slot name="title" >
            <h5 class="text-center text-white">{{reservation._id? 'Edit': 'New'}} Reservation</h5>
          </slot>

        <div class="q-gutter-sm">
          <q-radio v-model="formData.status" val="requested" label="Requested" keep-color checked-icon="task_alt" unchecked-icon="panorama_fish_eye" color="grey-4" />
          <q-radio v-model="formData.status" val="confirmed" label="Confirmed" keep-color checked-icon="task_alt" unchecked-icon="panorama_fish_eye" color="grey-4"/>
          <q-radio v-model="formData.status" val="canceled" label="Canceled" keep-color checked-icon="task_alt" unchecked-icon="panorama_fish_eye" color="grey-4"/>
          <q-radio v-model="formData.status" val="attended to" label="Attended To" keep-color checked-icon="task_alt" unchecked-icon="panorama_fish_eye" color="grey-4"/>
        </div>
        <q-input filled v-model="formData.reservationTime"  bg-color="grey-4"
                 label-color="dark">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy   cover transition-show="scale" transition-hide="scale">
                <q-date v-model="formData.reservationTime" mask="YYYY-MM-DD HH:mm" :landscape="$q.screen.gt.sm" color="accent">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy   cover transition-show="scale" transition-hide="scale">
                <q-time
                  v-model="formData.reservationTime"
                  mask="YYYY-MM-DD HH:mm"
                  format24h
                  flat
                  now-btn
                  :landscape="$q.screen.gt.sm"
                  color="accent"

                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" flat color="primary" />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
<!--        <q-select
          filled
          v-model="formData.customer"
          :options="options"
          label="Standard"
          emit-value
        />-->
          <div class="q-pt-lg row justify-between q-gutter-sm">
          <q-btn label="Close" type="reset" color="white" outline class="q-ml-sm" />

          <slot name="Submit-button">
            <q-btn :label="reservation?._id ? 'Update':'Save'" type="submit" color="secondary"/>
          </slot>

        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>

  import {ref, watch} from 'vue';
  import {models} from 'feathers-pinia';
  import {useQuasar} from 'quasar';
  import {useAuth} from 'stores/auth';
  import useCustomers from 'stores/services/customers';

  const $q = useQuasar();
  const props = defineProps(['modelValue','service','reservation']);
  const $emit = defineEmits(['submit','update:model-value']);

  const authStore = useAuth();
  const customerStore = useCustomers();

  let  formData = ref({reservationTime: Date.now()});
  let  maximizedToggle = ref(true);
  // let  disabledDates = ref({ weekdays: [1] });

  watch(()=>props.reservation,(newVal)=>{
    if(newVal) {
      formData.value = new models.api.Reservations(newVal);
    }else{
      formData.value = new models.api.Reservations();
    }
  },{
    immediate: true,
    deep: true
  });


  async function onSubmit(){
    try{
      console.log(formData.value,{authStore,customerStore});

      let {data} = await customerStore.find({
        query: {
          account: authStore?.payload?.activeAccount
        }
      });
      let customer = data[0];

      if(!customer){
        customer = await customerStore.create({account: authStore?.payload?.activeAccount});
      }
      formData.value.customer = customer._id;
      console.log({cool: props?.service});
      formData.value.service = props?.service?._id;
      console.log(formData.value);
      await formData.value.save();
      console.log(formData.value);
      onReset();
      $q.notify({
        type: 'positive',
        message: 'Reservation saved!'
      });
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: e.message
      });
    }
  }

  function onReset() {
    formData.value = new models.api.Reservations();
    $emit('update:model-value', false);
  // open.value = false;
  }


 /* function isValidHours(hour, { weekday }) {
    return ![1, 7].includes(weekday) || (hour >=8 && hour <= 17);
  }*/
</script>

<style scoped>

</style>
