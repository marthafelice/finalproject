<template>
  <q-page class="column items-center justify-center bg-accent q-pa-md" style="">
    <!--
    <p :class="$q.screen.width> 350? 'text-h1':'text-h5'">MY SERVICES</p>
    -->
   <div>
     <div>
       <q-btn label="new service" @click="handleOpenServiceForm" color="primary"/>
     </div>
  <services-list/>
     <service-form v-model="openServiceForm" :service="serviceToEdit"/>
   </div>
  </q-page>
</template>

<script setup>
  import ServicesList from 'components/ServicesList';
  import ServiceForm from 'components/ServiceForm';
  import useServices from 'src/composables/useServices';
  const {handleOpenServiceForm,openServiceForm,serviceToEdit} = useServices();
</script>
<style lang="css" scoped>

</style>
