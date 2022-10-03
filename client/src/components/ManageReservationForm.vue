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
        v-if="reservation"
        :style="`height:100%; ${$q.screen.gt.sm ? 'width: 20rem;':''}`"
        @submit="onSubmit"
        @reset="onReset"
        class="q-mt-none q-gutter-xs"
      >

        <slot name="title">
          <h5 class="text-center text-white" style="margin-bottom:5px;">
            Manage Reservation
          </h5>
          <q-card flat class="bg-primary text-white" dark style="z-index:1000; margin-top:-8px; margin-bottom: 9px;">
            <q-card-section class="text-caption text-center">
              {{ reservation?.serviceObject?.serviceName }} For
            </q-card-section>
          </q-card>
        </slot>

        <div class="q-gutter-md column items-center">
          <account-avatar :account="reservation?.customerAccount"/>
          <span> {{ reservation?.customerAccount?.name }} <br/> ({{ reservation?.customerAccount?.phone }})</span>
          <span class="text-caption text-xs q-mx-xl text-center">   {{ formattedDate }}</span>
          <q-input filled v-model="formData.reservationTime" bg-color="grey-4" >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="formData.reservationTime" mask="YYYY-MM-DDTHH:mm:ss" today-btn :disable="employeeId">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="formData.reservationTime" mask="YYYY-MM-DDTHH:mm:ss" format24h :disable="employeeId">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat/>
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div class="q-gutter-sm">

            <q-radio keep-color v-model="formData.status" val="requested" color="grey-4" checked-icon="task_alt"
                     unchecked-icon="panorama_fish_eye" size="xs">
              <span class="text-caption text-white">
              Requested
            </span></q-radio>

            <q-radio :disable="!(reservation.customer === customerId || authStore?.payload?.roles==='admin')" keep-color v-model="formData.status"
                     val="canceled" color="grey-4" checked-icon="task_alt"
                     unchecked-icon="panorama_fish_eye" size="xs">
              <span class="text-caption text-white">
              Cancel
            </span></q-radio>
          </div>
          <div class="q-gutter-sm">
            <q-radio :disable="!(reservation.employee === employeeId || authStore?.payload?.roles==='admin')" keep-color v-model="formData.status" val="confirmed"
                     color="grey-4" checked-icon="task_alt"
                     unchecked-icon="panorama_fish_eye" size="xs">
              <span class="text-caption text-white">
              Confirm
            </span></q-radio>
            <q-radio :disable="!(reservation.employee === employeeId || authStore?.payload?.roles==='admin')" keep-color v-model="formData.status"
                     val="attended to" color="grey-4" checked-icon="task_alt"
                     unchecked-icon="panorama_fish_eye" size="xs">
              <span class="text-caption text-white">
              Served
            </span></q-radio>
          </div>
          <select-input @input-value="search = $event"
                        @input="$emit('input', $event)"
                        @keydown="preventSpecialCharacter($event)"
                        v-model="formData.employee"
                        path="searchEmployees"
                        :slots="['after-options', 'option']"
                        :div-attrs="{class: ''}"
                        :attrs="searchEmployeeAttrs"
                        :disabled="employeeId"
          >


            <template v-slot:after-options v-if="$lget(searchEmployees,'length') < searchEmployeesTotal">
              <q-item>
                <q-item-section @click="searchEmployeesCurrentPage += 1">
                  <div>
                    <div>Load More
                      <q-icon name="add" size="sm"/>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps"
                      v-on="scope.itemEvents">
                <q-item-section avatar>
                  <account-avatar :account="$lget(scope.opt, 'employeeAccount', {})"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $lget(scope.opt, 'employeeAccount.name', '') }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>

          </select-input>
        </div>

        <div class="q-pa-lg row justify-between q-gutter-sm">
          <q-btn label="Close" type="reset" color="white" outline class="q-ml-sm"/>

          <slot name="Submit-button">
            <q-btn :label="reservation?._id ? 'Update':'Save'" type="submit" color="secondary"
                   :disabled="!formData?.reservationTime"/>
          </slot>

        </div>
      </q-form>

    </q-card>
  </q-dialog>
</template>

<script setup>
  import {computed, ref, watch} from 'vue';
  import {useAuth} from 'stores/auth';
  import {models, useGet} from 'feathers-pinia';
  import {useQuasar, date} from 'quasar';
  import AccountAvatar from 'components/AccountAvatar';
  import useFindPaginate from 'src/composables/useFindPaginate';
  import SelectInput from 'components/SelectInput';
  import $lget from 'lodash.get';


  const props = defineProps(['modelValue', 'service', 'reservation']);
  const $emit = defineEmits(['submit', 'update:model-value']);

  const $q = useQuasar();
  const authStore = useAuth();

  let search = ref('');
  let formData = ref({reservationTime: Date.now()});
  let maximizedToggle = ref(true);

  watch(() => props.reservation, (newVal) => {
    formData.value = newVal;

  }, {immediate: true, deep: true});



  const formattedDate = computed(() => new Date(props.reservation.reservationTime));

  const {item: account} = useGet({
    model: models.api.Accounts,
    id: authStore?.payload?.activeAccount,
    queryWhen: computed(() => !authStore?.payload?.activeAccount),
  });

  const customerId = computed(() => {
    const customer = account?.value?.accountType.find(account => account.Model === 'customers');
    return customer?._id;
  });

  console.log({customerId:customerId.value });

  const employeeId = computed(() => {
    const customer = account?.value?.accountType.find(account => account.Model === 'employees');
    return customer?._id;
  });

  async function onSubmit() {
    try {
      if (authStore?.payload?.activeAccount) {
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

  const searchEmployeesQuery = computed(() => ({
    workingDays: date.getDayOfWeek(new Date(props?.reservation?.reservationTime)),
  }));
  const searchEmployeesParams = computed(() => ({
    debounce: 500,
  }));

  const {
    items: searchEmployees,
    itemsCount: searchEmployeesTotal,
    currentPage: searchEmployeesCurrentPage,
  } = useFindPaginate({
    model: models.api.Employees,
    qid: ref('searchEmployeesServices'),
    query: searchEmployeesQuery,
    params: searchEmployeesParams,
    limit: ref(5),
    infinite: ref(true),
  });
  console.log({searchEmployees: searchEmployees.value});
  const searchEmployeeAttrs = computed(() => ({
    filled: true,
    dense: false,
    'bg-color': 'grey-4',
    label: 'Assign Employee',
    'label-color': 'dark',
    // eslint-disable-next-line no-unused-vars
    filterFn(val, update, abort) {
      update(() => {
      });
    },
    'fill-input': false,
    'option-value': (item) => item === null ? null : item._id,
    'option-label': (item) => item === null ? null : item?.employeeAccount?.name,
    'map-options': true,
    'emit-value': true,
    multiple: false,
    'hide-selected': false,
    behavior: 'menu',
    style: 'width: 270px;',
    options: searchEmployees.value,
  }));
  console.log({employees: searchEmployees.value});

  function preventSpecialCharacter(e) {
    if (/[^\w ]/.test(e.key)) {
      e.preventDefault();
    }
  }
</script>

<style scoped>

</style>
