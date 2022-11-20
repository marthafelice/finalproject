<template>
  <q-page class="column items-center justify-center bg-accent">

    <q-card dark class="bg-primary">
      <q-img :src="photo?.photoImage" crossorigin="anonymous"/>

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

          <q-fab-action color="secondary" @click="handleDeletePhoto(photo)">
            <template v-slot:icon>
              <q-icon name="delete"/>
            </template>
            <template v-slot:label>
              Delete Profile
            </template>
          </q-fab-action>

          <q-fab-action color="accent" @click="handleOpenPhotoForm(photo)" icon="edit" label="Edit Profile"/>
        </q-fab>
        <p :class="$q.screen.width> 350? 'text-h1':'text-h5'">{{ photo?.title }}</p>
        <div :class="[$q.screen.width> 350?'row':'column', 'justify-center q-gutter-sm']">
          {{ photo?.description }}
        </div>
      </q-card-section>
    </q-card>

    <photo-form v-model="openPhotoForm" :photo="photoToEdit" />
  </q-page>
</template>

<script setup>
  import {useRoute} from 'vue-router';
  import {computed} from 'vue';
  import {models, useGet} from 'feathers-pinia';
  import usePhotos from 'src/composables/usePhotos';

  const $route = useRoute();



  const photoId = computed(() => $route.params.id);

  const {item: photo} = useGet({
    model: models.api.Photos,
    id: photoId.value,
  });

  const {
    photoToEdit,
    openPhotoForm,
    // photos,
    // navigateToPhoto,
    handleOpenPhotoForm,
    handleDeletePhoto,
    payload
  } = usePhotos({
    query: {},
  });

</script>
