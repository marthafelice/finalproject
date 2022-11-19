<template>
  <div class="column items-center" v-scroll="onscroll">

    <div class="q-pa-md row justify-around" style="max-width: 400px">
      <registration-form class="q-mx-sm" color="primary"/>
      <login-form class="q-mx-sm" color="primary"/>
    </div>

    <div :class="[$q.screen.width> 350?'row':'row', 'justify-center q-gutter-sm wrap']" >
      <q-card
        style="min-width: 240px;"
        @click="navigateToPhoto(photo._id)"
        :class=" [$q.screen.width> 350?'col':'','cursor-pointer text-center column items-center justify-center bg-primary text-white']"
        v-for="photo in photos" :key="photo._id"
      >
        <q-img :src="photo?.url" crossorigin="anonymous" style="object-fit: contain; "/>

        <q-card-section>


          <q-card-section class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{ photo?.title }}
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
            {{ photo.description }}
          </div>
        </q-card-section>

        <q-separator/>

        <q-card-actions>
          <!--      <q-btn flat dense  icon="fas fa-eye"  @click="navigateToService(service._id)"/>-->


          <q-btn color="dark" glossy dense icon="edit" @click.stop="handleOpenPhotoForm(photo)"
                 v-if="payload?.activeAccount&&payload.roles==='admin'"/>
          <q-btn dense icon="delete" glossy color="negative" @click.stop="handleDeletePhoto(photo)"
                 v-if="payload?.activeAccount&&payload.roles==='admin'"/>

        </q-card-actions>
      </q-card>
      <photo-form v-model="openPhotoForm" :service="photoToEdit"/>


    </div>
  </div>
</template>

<script setup>
  import PhotoForm from 'components/PhotoForm';
  import usePhotos from 'src/composables/usePhotos';
  import {vScroll} from '@vueuse/components';
  import $lget from 'lodash.get';
  import RegistrationForm from 'components/RegistrationForm';
  import LoginForm from 'components/LoginForm';


  const {
    photoToEdit,
    openPhotoForm,
    photos,
    payload,
    navigateToPhoto,
    handleOpenPhotoForm,
    handleDeletePhoto,
    photosTotal,
    photosCurrentPage,
  } = usePhotos();

  function onscroll(){

    if($lget(photos.value,'length') < photosTotal){
      photosCurrentPage.value +=1;
    }
  }


</script>

<style scoped>

</style>
