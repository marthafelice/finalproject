<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:model-value',$event)"
            position="right"
            seamless
            persistent
            :maximized="maximizedToggle"
            transition-show="fade-in"
            transition-hide="fade-out"
  >
    <q-card class="q-pa-sm column items-center bg-primary text-white">

      <q-form
        :style="`height:100%; ${$q.screen.gt.sm ? 'width: 20rem;':''}`"
        @submit="onSubmit"
        @reset="onReset"
        class="q-mt-none q-gutter-lg q-pa-md"
      >

        <slot name="title">
          <h5 class="text-center text-white">{{ employee?._id ? 'Edit' : 'New' }} Employee</h5>
        </slot>
        <select-input @input-value="search = $event"
                      @input="$emit('input', $event)"
                      @keydown="preventSpecialCharacter($event)"
                      v-model="formData.account"
                      path="searchAccounts"
                      :slots="['after-options', 'option']"
                      :div-attrs="{class: ''}"
                      :attrs="searchAcctAttrs"
                      style="flex: 1;">


          <template v-slot:after-options v-if="$lget(searchAccounts,'length') < searchAccountsTotal">
            <q-item>
              <q-item-section @click="searchAccountsCurrentPage +=1">
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
                <account-avatar :account="scope.opt"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $lget(scope.opt, 'name', '') }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </select-input>
        <select-input @input-value="search = $event"
                      @input="$emit('input', $event)"
                      @keydown="preventSpecialCharacter($event)"
                      v-model="formData.services"
                      path="auto"
                      :slots="['after-options', 'option']"
                      :div-attrs="{class: ''}"
                      :attrs="selectAttrs"
                      style="flex: 1;">


          <template v-slot:after-options v-if="$lget(services,'length') < servicesTotal">
            <q-item>
              <q-item-section @click="currentPg +=1">
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
                <q-avatar text-color="white" color="accent">
                  <q-img
                    v-if="$lget(scope.opt, 'serviceImage')"
                    crossorigin="anonymous"
                    :src="$lget(scope.opt, 'serviceImage', '')"/>
                  <template v-else>{{ $lget(scope.opt, 'serviceName', '').charAt(0) }}</template>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $lget(scope.opt, 'serviceName', '') }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </select-input>

        <q-select
          filled
          bg-color="grey-4"
          label-color="dark"
          v-model="formData.workingDays"
          :options="workingDaysOption"
          map-options
          option-value="day"
          option-label="label"
          emit-value
          label="Working Days"
          multiple
          dense
          use-chips
        />
        <div class="q-pt-lg row justify-between q-gutter-sm">
          <q-btn label="Close" type="reset" color="white" outline class="q-ml-sm"/>

          <slot name="Submit-button">
            <q-btn :label="employee?._id ? 'Update':'Save'" type="submit" color="secondary"/>
          </slot>

        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import $lget from 'lodash.get';
  // import $lset from 'lodash.set';
  import {computed, ref, watch} from 'vue';
  import {models} from 'feathers-pinia';
  import {useQuasar} from 'quasar';
  import SelectInput from 'components/SelectInput';
  import useFindPaginate from 'src/composables/useFindPaginate';
  import AccountAvatar from 'components/AccountAvatar';

  const $q = useQuasar();
  const props = defineProps(['modelValue', 'account', 'employee']);
  const $emit = defineEmits(['submit', 'update:model-value']);

  let formData = ref({});
  let maximizedToggle = ref(true);
  let search = ref('');
  let currentPg = ref(1);

  let workingDaysOption = ref([
    {
      day: 1,
      label: 'Monday',
    },
    {
      day: 2,
      label: 'Tuesday',
    },
    {
      day: 3,
      label: 'Wednesday',
    },
    {
      day: 4,
      label: 'Thursday',
    },
    {
      day: 5,
      label: 'Friday',
    },
    {
      day: 6,
      label: 'Saturday',
    },
    {
      day: 7,
      label: 'Sunday',
    },
  ]);
  // let  disabledDates = ref({ weekdays: [1] });

  watch(() => props.employee, (newVal) => {
    if (newVal) {
      formData.value = new models.api.Employees(newVal);
    } else {
      formData.value = new models.api.Employees();
    }
  }, {
    immediate: true,
    deep: true,
  });

  const selectAttrs = computed(() => ({
    filled: true,
    dense: true,
    'use-chips': true,
    'bg-color': 'grey-4',
    label: 'Assign Services',
    'label-color': 'dark',
    // eslint-disable-next-line no-unused-vars
    filterFn(val, update, abort) {
      update(() => {
      });
    },
    'fill-input': false,
    'map-options': true,
    'emit-value': true,
    'option-value': '_id',
    'option-label': 'serviceName',
    multiple: true,
    'hide-selected': false,
    behavior: 'menu',
    style: 'border-radius: 0.6em; overflow: hidden;',
    options: services.value,
  }));
  const searchAcctAttrs = computed(() => ({
    filled: true,
    dense: true,
    'bg-color': 'grey-4',
    label: 'Select Employee Account',
    'label-color': 'dark',
    // eslint-disable-next-line no-unused-vars
    filterFn(val, update, abort) {
      update(() => {
      });
    },
    'fill-input': false,
    'map-options': true,
    'option-value': '_id',
    'option-label': 'name',
    multiple: false,
    'emit-value': true,
    'hide-selected': false,
    behavior: 'menu',
    style: 'border-radius: 0.6em; overflow: hidden;',
    options: searchAccounts.value,
  }));

  const employeeServicesQuery = computed(() => ({}));
  const employeeServicesParams = computed(() => ({
    debounce: 500,
  }));
  const {items: services, itemsCount: servicesTotal, currentPage: servicesCurrentPage} = useFindPaginate({
    model: models.api.Services,
    qid: ref('employeeServices'),
    query: employeeServicesQuery,
    params: employeeServicesParams,
    limit: ref(5),
    infinite: ref(true),
  });

  watch(() => servicesCurrentPage.value, (newVal) => {
    currentPg.value = newVal;
  }, {});

  const searchAccountsQuery = computed(() => ({
    'accountType.Model': {$ne: 'employees'},
  }));
  const searchAccountsParams = computed(() => ({
    debounce: 500,
  }));
  const {
    items: searchAccounts,
    itemsCount: searchAccountsTotal,
    currentPage: searchAccountsCurrentPage,
  } = useFindPaginate({
    model: models.api.Accounts,
    qid: ref('searchAccountsServices'),
    query: searchAccountsQuery,
    params: searchAccountsParams,
    limit: ref(5),
    infinite: ref(true),
  });

  function preventSpecialCharacter(e) {
    if (/[^\w ]/.test(e.key)) {
      e.preventDefault();
    }
  }

  async function onSubmit() {
    try {
      await formData.value.save();
      onReset();
      $q.notify({
        type: 'positive',
        message: 'Employee saved!',
      });
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: e.message,
      });
    }
  }

  function onReset() {
    formData.value = new models.api.Employees();
    $emit('update:model-value', false);
    // open.value = false;
  }


  /* function isValidHours(hour, { weekday }) {
     return ![1, 7].includes(weekday) || (hour >=8 && hour <= 17);
   }*/
</script>

<style scoped>

</style>
