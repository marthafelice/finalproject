import {useQuasar} from 'quasar';
import {models} from 'feathers-pinia';
import {computed, ref} from 'vue';

import {useRouter} from 'vue-router';
import useFindPaginate from 'src/composables/useFindPaginate';


export default function () {


  const $q = useQuasar();
  const $router = useRouter();
  const openReservationForm = ref(false);
  const reservationToEdit = ref({});
  const reservationServiceToEdit = ref({});

const query = computed(() => ({}));
  // 2. Create a computed property for the params
  const params = computed(() => {
    return {
      /*
      query: {
        login: authStore?.payload?._id,
      },
     * */
      debounce: 500,
    };
  });
  // 3. Provide the Model class and params in the options
  const {items: reservations} = useFindPaginate({
    limit: ref(30),
    model: models.api.Reservations,
    params,
    query,
    useFindOptions:{
      immediate: true
    }
  });


  async function navigateToReservation(reservationId) {
    if (reservationId) {
      await $router.push(`/reservations/${reservationId}`);
    }
  }

  function handleOpenReservationForm(reservation) {

    if (reservation?._id) {
      reservationToEdit.value = reservation;
    }

    if (reservation?.service) {
      reservationServiceToEdit.value = reservation?.service;
    }
    openReservationForm.value = true;

  }

  async function handleDeleteReservation(reservation) {
    $q.dialog({
      dark: true,
      title: 'Confirm Delete',
      message: 'Would you like to delete this reservation ?',
      cancel: true,
      persistent: true,
    }).onOk(() => {
      // console.log('>>>> OK')
    }).onOk(async () => {
      try {
        await models.api.Reservations.remove(reservation._id);
        $q.notify({
          type: 'positive',
          message: 'Successfully deleted the reservation.',
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: `Error: ${e.message}`,
        });
      }
      // console.log('>>>> second OK catcher')
    }).onCancel(() => {
      // console.log('>>>> Cancel')
    }).onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
  }

  return {
    reservationToEdit,
    openReservationForm,
    reservationServiceToEdit,
    reservations,
    navigateToReservation,
    handleOpenReservationForm,
    handleDeleteReservation,
  };

}
