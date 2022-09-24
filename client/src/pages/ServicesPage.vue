<template>
  <q-page class="column items-center justify-center">
    <p :class="$q.screen.width> 350? 'text-h1':'text-h5'">MY SERVICES</p>
    <div :class="[$q.screen.width> 350?'row':'column', 'justify-center q-gutter-sm']">
      <q-card class="col cursor-pointer text-center column items-center justify-center bg-grey-4 q-pa-md "
              @click="openServiceForm=true">
        <q-card-section>
          New Service
        </q-card-section>
      </q-card>
      <q-card
        class="col cursor-pointer text-center column items-center justify-center bg-primary text-white q-pa-md"
              v-for="service in services" :key="service._id"
      >
        <q-img :src="service?.serviceImage" />

        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="eye"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%);"
            @click="navigateToService(service._id)"
          />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{service?.serviceName }}
            </div>
           <!--
            <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
              <q-icon name="place" />
              250 ft
            </div>
           -->
          </div>

         <!--
          <q-rating v-model="service.serviceRating" :max="5" size="32px" @click="addRating(service)" />
         -->
        </q-card-section>

        <q-card-section class="q-pt-none">

          <div class="text-caption text-grey">
            {{service.serviceDescription }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="between">
          <q-btn flat round icon="eye" label="see more" @click="navigateToService(service._id)"/>
          <div>
            <q-btn flat icon="edit" @click.stop="handleOpenServiceForm(service)"/>
            <q-btn flat icon="delete" color="negative" @click.stop="handleDeleteService(service)"/>
          <q-btn flat color="primary">
            Reserve
          </q-btn>
          </div>
        </q-card-actions>
      </q-card>

    </div>

    <service-form v-model="openServiceForm" :service="serviceToEdit"/>
  </q-page>
</template>

<script setup>
  import {models, useFind} from 'feathers-pinia';
  import {computed, ref} from 'vue';

  import {useRouter} from 'vue-router/dist/vue-router';
  import ServiceForm from 'components/ServiceForm';
  import {useQuasar} from 'quasar';

  const $q = useQuasar();
  const $router = useRouter();
  const openServiceForm = ref(false);
  const serviceToEdit = ref({});

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
    if (serviceId) {
      await $router.push(`/services/${serviceId}`);
    }
  }
  function handleOpenServiceForm(service){
    serviceToEdit.value = service;
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
        await models.api.Service.remove(service._id);
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
</script>
<style lang="css" scoped>

</style>
