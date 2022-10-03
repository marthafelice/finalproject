<template>
  <div class="Calendar">
    <div class="q-gutter-sm">
      <q-radio dark v-model="config.viewType" val="Day" keep-color checked-icon="task_alt"
               unchecked-icon="panorama_fish_eye" color="grey-4">
        <span class="text-grey-4">Today</span>
      </q-radio>
      <q-radio dark v-model="config.viewType" val="Week" keep-color checked-icon="task_alt"
               unchecked-icon="panorama_fish_eye" color="grey-4">
        <span class="text-grey-4">This Week</span>
      </q-radio>
      <q-toggle
        v-model="config.durationBarVisible"
        color="green"
      >
        <span class="text-grey-4">Show Duration Bar</span>
      </q-toggle>
    </div>
    <DayPilotCalendar id="dp" :config="config" ref="calendar"/>
    <manage-reservation-form v-model="openManageReservation" :reservation="reservationToEdit"/>
  </div>
</template>

<script setup>
  import {DayPilotCalendar} from '@daypilot/daypilot-lite-vue';
  import {computed, defineAsyncComponent, ref, watch} from 'vue';
  import {date, colors} from 'quasar';
  import useFindPaginate from 'src/composables/useFindPaginate';
  import {models} from 'feathers-pinia';

  const  ManageReservationForm = defineAsyncComponent(()=>import( 'components/ManageReservationForm'));

  const props = defineProps({
    accountType: {
      type: Object,
      default() {
        return {};
      },
    },
    queryProp:{
      type: Object,
      default() {
        return {};
      },
    },
  });

  const config = ref({
    viewType: 'Week',
    durationBarVisible: true,
    onEventClick: onEventClick,
  });
  const calendar = ref(null);
  const openManageReservation = ref(false);
  const reservationToEdit = ref(false);

  const control = computed(() => calendar.value.control);
  const {addToDate} = date;
  const {getPaletteColor} = colors;

  const reservationsQuery = computed(() => ({
    ...props.queryProp
  }));
  const reservationsParams = computed(() => ({
    debounce: 500,
  }));

  const {items: reservations} = useFindPaginate({
    model: models.api.Reservations,
    qid: ref('reservations'),
    query: reservationsQuery,
    params: reservationsParams,
    limit: ref(5),
    infinite: ref(true),
  });

  const events = computed(() => reservations.value.map(
    reservation => {
      let color = 'info';
      switch (reservation.status) {
        case 'requested':
          color = 'info';
          break;
        case 'confirmed':
          color = 'orange';
          break;
        case 'canceled':
          color = 'negative';
          break;
        case 'attended to':
          color = 'positive';
          break;
      }
      // const ownerType = props?.accountType?.Model === 'customers' ? 'customerAccount' : 'employeeAccount';

      const html = `
          <div style="position: relative;">
        <div class="q-ml-none" style="width: 100%; height:20%;">
          <img
          crossorigin="anonymous"
          src="${reservation?.serviceObject?.serviceImage}"
          style="width: 90%; height: 90%; object-fit: cover;"
          alt="${reservation?.serviceObject?.serviceName}"/>
        </div>

        <div style="position:absolute; top:15px; left:20%; opacity:0.9;" class="column items-center bg-accent q-pa-sm">
          <span class="text-caption text-bold text-center">${reservation?.serviceObject?.serviceName}</span>
          <span class="text-caption text-bold text-center">${reservation?.serviceObject?.serviceCost}/=</span>

        </div>

      </div>

        `;
      const hours = reservation?.serviceObject?.serviceDuration;
      return {
        id: reservation?._id,
        start: reservation?.reservationTime,
        end: addToDate(reservation?.reservationTime, {hours}),
        html,
        barBackColor: getPaletteColor('grey-4'),
        barColor: getPaletteColor('primary'),
        fontColor: getPaletteColor('grey-4'),
        backColor: getPaletteColor(color),
      };
    },
  ));

  watch(() => events.value, (newVal) => {
    console.log(newVal);
    control.value?.update({events: newVal});
  }, {deep: true});

  async function onEventClick(args) {
    reservationToEdit.value = await models.api.Reservations.get(args?.e?.data?.id);
    openManageReservation.value = true;
  }


</script>
<style lang="css" scoped>
  .calendar_default_event_inner {
    background: #2e78d6;
    color: white;
    border-radius: 5px;
    opacity: 0.9;
  }
</style>
