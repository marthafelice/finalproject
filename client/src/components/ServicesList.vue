<template>
  <div :class="[$q.screen.width> 350?'row':'row', 'justify-center q-gutter-sm wrap']" >
  <q-card
    style="min-width: 240px;"
    @click="navigateToService(service._id)"
    :class=" [$q.screen.width> 350?'col':'','cursor-pointer text-center column items-center justify-center bg-primary text-white']"
    v-for="service in services" :key="service._id"
  >
    <q-img :src="service?.serviceImage" crossorigin="anonymous" style="object-fit: contain; " />

    <q-card-section>
      <q-btn
        fab
        color="secondary"
        :label="`${ugx(service.serviceCost)}/=`"
        class="absolute"
        style="top: 0; right: 12px; transform: translateY(-50%);"
        @click="navigateToService(service._id)"
      />

      <q-card-section class="row no-wrap items-center">
        <div class="col text-h6 ellipsis">
          {{service?.serviceName }}
        </div>
        <!--
         <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
           <q-icon name="place" />
           250 ft
         </div>
        -->
      </q-card-section>

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

    <q-card-actions>
<!--      <q-btn flat dense  icon="fas fa-eye"  @click="navigateToService(service._id)"/>-->

        <q-btn dense color="dark"  glossy @click.stop="handleOpenReservationForm">
          Reserve
        </q-btn>
        <q-btn color="dark" glossy dense icon="edit" @click.stop="handleOpenServiceForm(service)"/>
        <q-btn dense icon="delete" glossy color="negative" @click.stop="handleDeleteService(service)"/>

    </q-card-actions>
    <reservation-form v-model="openReservationForm" :service="service"  :reservation="reservationToEdit"/>
  </q-card>
    <service-form v-model="openServiceForm" :service="serviceToEdit"/>

  </div>
</template>

<script setup>
  import ServiceForm from 'components/ServiceForm';
  import useServices from 'src/composables/useServices';
  import useReservations from 'src/composables/useReservations';
  import ReservationForm from 'components/ReservationForm';


  const {
    serviceToEdit,
    openServiceForm,
    services,
    navigateToService,
    handleOpenServiceForm,
    handleDeleteService,

  } = useServices();

  const {
    openReservationForm,
    reservationToEdit,
    handleOpenReservationForm,
  } = useReservations();
  const ugx = value => new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(value);

</script>

<style scoped>

</style>
