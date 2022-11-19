<template>
  <q-page class="column items-center justify-center bg-accent q-pa-md" style="">
    <!--
    <p :class="$q.screen.width> 350? 'text-h1':'text-h5'">MY SERVICES</p>
    -->
   <div>
     <div v-if="authStore?.payload?.roles==='admin'">
       <q-btn label="new service" @click="handleOpenServiceForm" color="primary"/>
     </div>
  <services-list/>
     <service-form v-model="openServiceForm" :service="serviceToEdit"/>
   </div>
  </q-page>
</template>

<script setup>
  import ServicesList from 'components/Gallery';
  import ServiceForm from 'components/GalleryForm';
  import useServices from 'src/composables/usePhotos';
  import {useAuth} from 'stores/auth';
  const {handleOpenServiceForm,openServiceForm,serviceToEdit} = useServices();
  const authStore = useAuth();
</script>
<style lang="css" scoped>

</style>
