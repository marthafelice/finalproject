
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer

style="position: relative;"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >

      <div class="row justify-between q-pa-md q-ma-md" >
        <q-item-label
          header
          class="col-8 text-primary text-h6  text-bold"
        >
          {{ account?.name }}
        </q-item-label>
        <div v-if="leftDrawerOpen && screen.lt.md">
          <q-btn color="primary" @click="leftDrawerOpen = false" outline round icon="fas fa-arrow-alt-circle-left"/>
        </div>
      </div>
      <q-list class="q-ma-md">
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />

      </q-list>
      <div style="position: absolute; bottom: 0; right: 0; left:0;" class="q-px-md">
        <q-item>
          <q-item-section avatar>
            <account-avatar :account="account"/>
          </q-item-section>
          <q-item-section>
            <logout-button label="sign out" color="primary"/>
          </q-item-section>

        </q-item>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
  import {defineComponent, ref, computed, onMounted} from 'vue';
  import EssentialLink from 'components/EssentialLink.vue';
  import {useQuasar} from 'quasar';
  import LogoutButton from 'components/LogoutButton';
  import {models, useGet} from 'feathers-pinia';
  import AccountAvatar from 'components/AccountAvatar';
  import {useAuth} from 'stores/auth';
  import {useRoute} from 'vue-router';
  // import {useRouter} from 'vue-router/dist/vue-router';
  const linksList = [
    {
      title: 'Employees',
      caption: 'Saloon Employees',
      icon: 'school',
      link: '/employees'
    },
    {
      title: 'Customers',
      caption: 'Saloon Customers',
      icon: 'code',
      link: '/customers'
    },
    {
      title: 'Reservations',
      caption: 'Manage Orders',
      icon: 'chat',
      link: '/reservations'
    },
    {
      title: 'Accounts',
      caption: 'Manage Accounts',
      icon: 'fas fa-users',
      link: '/accounts'
    },
    {
      title: 'Services',
      caption: 'Saloon Services',
      icon: 'fas fa-icons',
      link: '/accounts'
    },
  ];
  export default defineComponent({
    name: 'MainLayout',
    components: {
      AccountAvatar,
      LogoutButton,
      EssentialLink
    },
    setup () {
      const leftDrawerOpen = ref(true);
      const {screen,} = useQuasar();

      const authStore = useAuth();
      const route = useRoute();

      onMounted(async ()=>{

        const res =   await  models.api.Logins.patch(authStore?.payload?._id,{activeAccount:route.params.id});
        console.log({res});

      });

      const id = computed(()=>route.params.id || authStore?.payload?.activeAccount);

      const { item: account, isPending, } = useGet({
        model: models.api.Accounts,
        id,
      });

      return {
        authStore,
        account,
        isPending,
        screen,
        essentialLinks: linksList,
        leftDrawerOpen,
        toggleLeftDrawer () {
          leftDrawerOpen.value = !leftDrawerOpen.value;
        },

      };
    }
  });
</script>
