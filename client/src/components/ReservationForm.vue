<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:model-value',$event)"
            position="right"
            seamless
            persistent
            :maximized="maximizedToggle"
            transition-show="fade-in"
            transition-hide="fade-out"
  >
    <q-card class=" column items-center bg-primary text-white">
      <q-form
        v-if="authStore?.payload?.activeAccount"
        :style="`height:100%; ${$q.screen.gt.sm ? 'width: 20rem;':''}`"
        @submit="onSubmit"
        @reset="onReset"
        class="q-mt-none q-gutter-xs"
      >

        <slot name="title">
          <h5 class="text-center text-white" style="margin-bottom:5px;">
            {{ reservation._id ? 'Edit' : 'New' }} Reservation
          </h5>
          <q-card flat class="bg-primary text-white" dark style="z-index:1000; margin-top:-11px; margin-bottom: 10px;">
            <q-card-section class="text-caption text-center">
              (For {{service.serviceName}})
            </q-card-section>
          </q-card>
        </slot>

        <div class="q-gutter-md column items-center">
          <q-date v-model="formData.reservationTime" mask="YYYY-MM-DD HH:mm" dark style="z-index:1; margin-top:-10px;" today-btn/>
          <q-time
            style="margin-top: -20px;"
            dark
            v-model="formData.reservationTime"
            mask="YYYY-MM-DD HH:mm"
            format24h
            flat
            now-btn
            minimal
          />
        </div>

        <div class="q-pa-lg row justify-between q-gutter-sm">
          <q-btn label="Close" type="reset" color="white" outline class="q-ml-sm"/>

          <slot name="Submit-button">
            <q-btn :label="reservation?._id ? 'Update':'Save'" type="submit" color="secondary" :disabled="!formData.reservationTime"/>
          </slot>

        </div>
      </q-form>
      <div v-if="!authStore?.payload?._id">
        <h6 class="text-center">To make reservations</h6>
        <p class="text-caption text-center" style="margin-top:-40px;">
          You must have a registered account<br/>
          with our saloon
        </p>
        <div class="q-pa-md row justify-around" style="max-width: 400px">
          <registration-form class="q-mx-sm"/>
          <login-form class="q-mx-sm"/>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import RegistrationForm from 'components/RegistrationForm';
  import LoginForm from 'components/LoginForm';
  import {ref, watch} from 'vue';
  import {models} from 'feathers-pinia';
  import {useQuasar} from 'quasar';
  import {useAuth} from 'stores/auth';
  import useCustomers from 'stores/services/customers';


  const $q = useQuasar();

  const props = defineProps(['modelValue', 'service', 'reservation']);
  const $emit = defineEmits(['submit', 'update:model-value']);

  const authStore = useAuth();
  const customerStore = useCustomers();

  let formData = ref({reservationTime: Date.now()});
  let maximizedToggle = ref(true);
  // let  disabledDates = ref({ weekdays: [1] });

  watch(() => props.reservation, (newVal) => {
    if (newVal._id) {
      formData.value = new models.api.Reservations(newVal);
    } else {
      formData.value = new models.api.Reservations({service:props?.service?._id});
    }
  }, {
    immediate: true,
    deep: true,
  });


  async function onSubmit() {
    try {
      if (authStore?.payload?.activeAccount) {

        let {data} = await customerStore.find({
          query: {
            account: authStore?.payload?.activeAccount,
          },
        });
        let customer = data[0];

        if (!customer) {
          customer = await customerStore.create({account: authStore?.payload?.activeAccount});
        }
        formData.value.customer = customer._id;
        formData.value.service = props?.service?._id;
        await formData.value.save();
        onReset();
        $q.notify({
          type: 'positive',
          message: 'Reservation saved!',
        });

      }
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: e.message,
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
