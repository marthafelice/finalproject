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
          @click="leftDrawerOpen=!leftDrawerOpen"
        />

        <q-toolbar-title>
      Salon Booking System
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
{{authUser?.activeAccount}}
      <div class="row justify-between q-pa-md q-ma-md">
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
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import {ref, computed, onMounted} from 'vue';
  import EssentialLink from 'components/EssentialLink.vue';
  import {useQuasar} from 'quasar';
  import LogoutButton from 'components/LogoutButton';
  import {models, useGet} from 'feathers-pinia';
  import AccountAvatar from 'components/AccountAvatar';
  import {useRoute} from 'vue-router';
  import useLogin from 'src/composables/useLogin';
  import useLogins from 'stores/services/logins';
  const essentialLinks = ref([
    {
      title: 'Employees',
      caption: 'Salon Employees',
      icon: 'school',
      link: '/employees'
    },
    {
      title: 'Customers',
      caption: 'Salon Customers',
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
      link: '/services'
    },
  ]);

  const leftDrawerOpen = ref(true);
  const {screen,} = useQuasar();


  const route = useRoute();

  const {authUser} = useLogin();
  const loginStore = useLogins();

  onMounted(async () => {
    if(authUser?.value?._id) {
      const res = await loginStore.patch(authUser.value._id,{activeAccount: route.params.id});
      console.log({res});
    }
    console.log({authUser:authUser?.value});
  });

  const id = computed(() => route.params.id || authUser?.activeAccount);

  const {item: account} = useGet({
    model: models.api.Accounts,
    id,
  });

</script>
