
import {useQuasar} from 'quasar';
import {models} from 'feathers-pinia';
import {computed, ref} from 'vue';
import useFindPaginate from 'src/composables/useFindPaginate';



export default function ({query}={}){
  const $q = useQuasar();
  //const $router = useRouter();

  const openAccountForm = ref(false);
  const accountToEdit = ref({});

  // 2. Create a computed property for the params
  const accountsQuery = computed(() => ({
    ...query
  }));
  const accountsParams = computed(() => ({
  debounce:500,
  }));
  // 3. Provide the Model class and params in the options
  const {items: accounts} = useFindPaginate({
    model:models.api.Accounts,
    query:accountsQuery,
    params: accountsParams
  });



  function handleOpenAccountForm(account){
    accountToEdit.value = account;
    openAccountForm.value=true;
  }
  async function handleDeleteAccount(account) {
    $q.dialog({
      dark: true,
      class:'bg-secondary',
      title: 'Confirm Delete',
      message: `Would you like to delete ${account?.name} ?`,
      cancel: true,
      persistent: true
    }).onOk(() => {
      // console.log('>>>> OK')
    }).onOk(async () => {
      try{
        const accountId = account._id;
        await account.save({
          data: {
            $pull: {
              'accountType': {
                _id: accountId,
                Model: 'accounts'
              },
            },
          },
        });
        await models.api.Accounts.remove(account._id);
        $q.notify({
          type: 'positive',
          message: `Successfully deleted ${account?.name}.`,
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
    accountToEdit,
    openAccountForm,
    accounts,
    handleOpenAccountForm,
    handleDeleteAccount,
  };

}
