
import {useQuasar} from 'quasar';
import {models, useFind} from 'feathers-pinia';
import {computed, ref} from 'vue';

import {useRouter} from 'vue-router';


export default function (){


  const $q = useQuasar();
  const $router = useRouter();
  const openReservationForm = ref(false);
  const reservationToEdit = ref({});


  // 2. Create a computed property for the params
  const reservationsParams = computed(() => {
    return {
      /*
      query: {
        login: authStore?.payload?._id,
      },
     * */
    };
  });
  // 3. Provide the Model class and params in the options
  const {items: reservations} = useFind({
    model:models.api.Reservations,
    params: reservationsParams
  });


  async function navigateToReservation(reservationId) {
    if (reservationId) {
      await $router.push(`/reservations/${reservationId}`);
    }
  }
  function handleOpenReservationForm(reservation){
   if(reservation?._id){
     reservationToEdit.value = reservation;
   }
    openReservationForm.value=true;
  }

  async function handleDeleteReservation(reservation) {
    $q.dialog({
      dark: true,
      title: 'Confirm Delete',
      message: 'Would you like to delete this reservation ?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      // console.log('>>>> OK')
    }).onOk(async () => {
      try{
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
    reservations,
    navigateToReservation,
    handleOpenReservationForm,
    handleDeleteReservation,
  };

}
