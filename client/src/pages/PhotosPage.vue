<template>
  <q-page class="column items-center justify-center bg-accent q-pa-md" style="">
    <!--
    <p :class="$q.screen.width> 350? 'text-h1':'text-h5'">MY SERVICES</p>
    -->
    <div>
      <div v-if="authStore?.payload?.roles==='admin'">
        <q-btn label="new photo" @click="handleOpenPhotoForm" color="primary"/>
      </div>
      <photos-list/>
      <pre> {{photos}}</pre>
      <photo-form v-model="openPhotoForm" :service="photoToEdit"/>
    </div>
  </q-page>
</template>

<script setup>
  import PhotosList from 'components/PhotosList';
  import PhotoForm from 'components/PhotoForm';
  import usePhotos from 'src/composables/usePhotos';
  import {useAuth} from 'stores/auth';
  const {handleOpenPhotoForm,openPhotoForm,photoToEdit} = usePhotos();
  const authStore = useAuth();
</script>
<style lang="css" scoped>

</style>
