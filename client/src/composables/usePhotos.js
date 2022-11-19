
import {useQuasar} from 'quasar';
import {models} from 'feathers-pinia';
import {computed, ref} from 'vue';
import {useRouter} from 'vue-router';
import {useAuth} from 'stores/auth';
import {storeToRefs} from 'pinia';
import useFindPaginate from 'src/composables/useFindPaginate';

export default function (){
  const $q = useQuasar();
  const $router = useRouter();
  const openPhotoForm = ref(false);
  const photoToEdit = ref({});


  const authStore = useAuth();

  const{payload} = storeToRefs(authStore);

  // 2. Create a computed property for the params
  const photosQuery = computed(() => {
    return {
    };
  });

  const photosParams = computed(() => {
    return {
    };
  });
  // 3. Provide the Model class and params in the options
  const {items: photos, itemsCount: photosTotal, currentPage: photosCurrentPage} = useFindPaginate({
    model: models.api.Photos,
    qid: ref('photosQid'),
    query: photosQuery,
    params: photosParams,
    limit: ref(10),
    infinite: ref(true),
  });

  async function navigateToPhoto(photoId) {
    if (photoId && payload?.value?.activeAccount) {
      await $router.push(`/photos/${photoId}`);
    }
  }
  function handleOpenPhotoForm(photo){
   if(photo?._id){
     photoToEdit.value = photo;
   }
    openPhotoForm.value=true;
  }

  async function handleDeletePhoto(photo) {
    $q.dialog({
      dark: true,
      title: 'Confirm Delete',
      message: `Would you like to delete the ${photo?.title} photo ?`,
      cancel: true,
      persistent: true
    }).onOk(() => {
      // console.log('>>>> OK')
    }).onOk(async () => {
      try{
        await models.api.Photos.remove(photo._id);
        $q.notify({
          type: 'positive',
          message: `Successfully deleted the ${photo?.title} photo.`,
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
    photoToEdit,
    openPhotoForm,
    photos,
    navigateToPhoto,
    handleOpenPhotoForm,
    handleDeletePhoto,
    payload,
    photosTotal,
    photosCurrentPage,

  };

}
