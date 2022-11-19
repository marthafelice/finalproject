<template>
  <q-page class="column items-center justify-center bg-accent">

    <q-card dark class="bg-primary">
      <q-img :src="service?.serviceImage" crossorigin="anonymous"/>

      <q-card-section>
        <q-fab v-if="payload?.roles==='admin'"
          direction="up" color="secondary"
               icon="edit"
               class="absolute"
               style="top: 0; right: 35px; transform: translateY(-50%);"
        >
          <template v-slot:icon="{ opened }">
            <q-icon :class="{ 'example-fab-animate--hover': opened !== true }" name="keyboard_arrow_up"/>
          </template>

          <template v-slot:active-icon="{ opened }">
            <q-icon :class="{ 'example-fab-animate': opened === true }" name="close"/>
          </template>

          <q-fab-action color="secondary" @click="handleDeleteService(service)">
            <template v-slot:icon>
              <q-icon name="delete"/>
            </template>
            <template v-slot:label>
              Delete Profile
            </template>
          </q-fab-action>

          <q-fab-action color="accent" @click="handleOpenServiceForm(service)" icon="edit" label="Edit Profile"/>
        </q-fab>
        <p :class="$q.screen.width> 350? 'text-h1':'text-h5'">{{ service?.serviceName }}</p>
        <div :class="[$q.screen.width> 350?'row':'column', 'justify-center q-gutter-sm']">
          {{ service?.serviceDescription }}
        </div>
        <div :class="[$q.screen.width> 350?'row':'column', 'justify-center q-gutter-sm']">
          <h3>{{ service?.serviceCost }}</h3>

        </div>

      </q-card-section>
      <q-card-actions style="margin-top:-50px;" align="center">
        <q-btn  label="Make Reservation" color="dark" @click="openReservationForm=true"/>
      </q-card-actions>
    </q-card>
    <service-form v-model="openServiceForm" :service="serviceToEdit" />
    <reservation-form v-model="openReservationForm" :service="service"  :reservation="{}"/>
  </q-page>
</template>

<script setup>
  import ServiceForm from 'components/GalleryForm';
  import ReservationForm from 'components/ReservationForm';
  import {useRoute} from 'vue-router';
  import {computed, ref} from 'vue';
  import {models, useGet} from 'feathers-pinia';
  import useServices from 'src/composables/usePhotos';

  const $route = useRoute();

  let openReservationForm = ref(false);

  const serviceId = computed(() => $route.params.id);

  const {item: service} = useGet({
    model: models.api.Services,
    id: serviceId.value,
  });

  const {
    serviceToEdit,
    openServiceForm,
    // services,
    // navigateToService,
    handleOpenServiceForm,
    handleDeleteService,
    payload
  } = useServices({
    query: {},
  });

</script>
