import {ref, toRefs} from 'vue';
import {useAuth} from 'stores/auth';
import {useQuasar} from 'quasar';
import {useRouter} from 'vue-router';

export default function () {

  const $q = useQuasar();
  const $router = useRouter();

  let open = ref(false);

  const auth = useAuth();

  async function onLogin(login) {
    try {
      const result = await auth.authenticate({
        strategy: 'local',
        email: login.email,
        password: login.password,
      });
      console.log({result});
      const pathTo = result.login.activeAccount ? `accounts/${result.login.activeAccount}` : '/profile-info';
      await $router.push(pathTo);

      open.value = false;
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: e.message,
      });
    }
  }

  async function onLogout() {
    try {
      if (localStorage.getItem('feathers-jwt')) {
        localStorage.removeItem('feathers-jwt');
        window.location.replace('/');
        $q.notify({
          type: 'positive',
          message: 'Successfully Logged Out.',
        });
      }
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: e.message,
      });
    }
  }

  const {payload, isAuthenticated, authenticate} = toRefs(auth);
  return {
    open,
    onLogin,
    onLogout,
    authUser: payload,
    isAuthenticated,
    authenticate,
  };

}
