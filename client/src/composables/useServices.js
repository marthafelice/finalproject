
import {useQuasar} from 'quasar';
import {models, useFind} from 'feathers-pinia';
import {computed, ref} from 'vue';

import {useRouter} from 'vue-router';
import {useAuth} from 'stores/auth';
import {storeToRefs} from 'pinia';

export default function (){
  const $q = useQuasar();
  const $router = useRouter();
  const openServiceForm = ref(false);
  const serviceToEdit = ref({});

  const authStore = useAuth();

  const{payload} = storeToRefs(authStore);

  // 2. Create a computed property for the params
  const servicesParams = computed(() => {
    return {
      /*
      query: {
        login: authStore?.payload?._id,
      },
     * */
    };
  });
  // 3. Provide the Model class and params in the options
  const {items: services} = useFind({
    model:models.api.Services,
    params: servicesParams
  });


  async function navigateToService(serviceId) {
    if (serviceId && payload?.value?.activeAccount) {
      await $router.push(`/services/${serviceId}`);
    }
  }
  function handleOpenServiceForm(service){
   if(service?._id){
     serviceToEdit.value = service;
   }
    openServiceForm.value=true;
  }

  async function handleDeleteService(service) {
    $q.dialog({
      dark: true,
      title: 'Confirm Delete',
      message: `Would you like to delete the ${service?.serviceName} service ?`,
      cancel: true,
      persistent: true
    }).onOk(() => {
      // console.log('>>>> OK')
    }).onOk(async () => {
      try{
        await models.api.Services.remove(service._id);
        $q.notify({
          type: 'positive',
          message: `Successfully deleted the ${service?.serviceName} service.`,
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
    serviceToEdit,
    openServiceForm,
    services,
    navigateToService,
    handleOpenServiceForm,
    handleDeleteService,
    payload
  };

}
