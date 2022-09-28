
import {useQuasar} from 'quasar';
import {models, useFind} from 'feathers-pinia';
import {computed, ref} from 'vue';

import {useRouter} from 'vue-router/dist/vue-router';


export default function (){


  const $q = useQuasar();
  const $router = useRouter();
  const openEmployeeForm = ref(false);
  const employeeToEdit = ref({});


  // 2. Create a computed property for the params
  const  employeesParams = computed(() => {
    return {
      /*
      query: {
        login: authStore?.payload?._id,
      },
     * */
    };
  });
  // 3. Provide the Model class and params in the options
  const {items: employees} = useFind({
    model:models.api.Employees,
    params: employeesParams
  });


  async function navigateToEmployee(employeeId) {
    if (employeeId) {
      await $router.push(`/employees/${employeeId}`);
    }
  }
  function handleOpenEmployeeForm(employee){
   if(employee?._id){
     employeeToEdit.value = employee;
   }
    openEmployeeForm.value=true;
  }

  async function handleDeleteEmployee(employee) {
    $q.dialog({
      dark: true,
      title: 'Confirm Delete',
      message: 'Would you like to delete this employee ?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      // console.log('>>>> OK')
    }).onOk(async () => {
      try{
        await models.api.Employees.remove(employee._id);
        $q.notify({
          type: 'positive',
          message: 'Successfully deleted the employee.',
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
    employeeToEdit,
    openEmployeeForm,
    employees,
    navigateToEmployee,
    handleOpenEmployeeForm,
    handleDeleteEmployee,
  };

}
