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

        <q-toolbar-title :class="[$q.screen.lt.md? 'text-h6':'text-h4']">
          Salon Booking System
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      class="bg-primary text-white"
      style="position: relative;"
      v-model="leftDrawerOpen"
      show-if-above
      bordered

    >

      <div class="row justify-between q-pa-md q-ma-md">
        <q-item-label
          header
          class="col-8 text-white text-h6  text-bold"
        >
          {{ account ? account?.name : 'Add Your 1st Account Info' }}
        </q-item-label>

        <div v-if="leftDrawerOpen && screen.lt.md">
          <q-btn color="accent" @click="leftDrawerOpen = false" outline round icon="menu"/>
        </div>
      </div>

      <q-separator dark spaced color="white"/>
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
            <logout-button label="sign out" color="secondary"/>
          </q-item-section>

        </q-item>
      </div>
    </q-drawer>

    <q-page-container style=" max-width: 100%;
    overflow-x: hidden;">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import {ref, computed, watch} from 'vue';
  import EssentialLink from 'components/EssentialLink.vue';
  import {useQuasar} from 'quasar';
  import LogoutButton from 'components/LogoutButton';
  import {models, useGet} from 'feathers-pinia';
  import AccountAvatar from 'components/AccountAvatar';
  import {useAuth} from 'stores/auth';
  import {useRoute} from 'vue-router';

  const essentialLinks = ref([
    {
      title: 'Accounts',
      caption: 'Manage Accounts',
      icon: 'fas fa-users',
      link: '/accounts',
    },
  ]);

  let leftDrawerOpen = ref(true);
  let {screen} = useQuasar();


  const route = useRoute();
  const authStore = useAuth();


  const id = computed(() => route?.params?.id || authStore?.payload?.activeAccount);

  const {item: account} = useGet({
    model: models.api.Accounts,
    id,
  });

  watch(() => account.value, (newVal) => {
    if (newVal) {

      essentialLinks.value = [
        {
          title: 'Accounts',
          caption: 'Manage Accounts',
          icon: 'fas fa-users',
          link: '/accounts',
        },
        // {
        //   title: 'Reservations',
        //   caption: 'Manage Orders',
        //   icon: 'chat',
        //   link: '/reservations',
        // },
        {
          title: 'Services',
          caption: 'Saloon Services',
          icon: 'fas fa-icons',
          link: '/services',
        },
      ];
      if(authStore?.payload?.roles==='admin'){
        essentialLinks.value = [
          {
            title: 'Accounts',
            caption: 'Manage Accounts',
            icon: 'fas fa-users',
            link: '/accounts',
          },
          {
            title: 'Employees',
            caption: 'Salon Employees',
            icon: 'school',
            link: '/employees',
          },
          {
            title: 'Customers',
            caption: 'Salon Customers',
            icon: 'code',
            link: '/customers',
          },
          {
            title: 'Reservations',
            caption: 'Manage Orders',
            icon: 'chat',
            link: '/reservations',
          },
          {
            title: 'Services',
            caption: 'Saloon Services',
            icon: 'fas fa-icons',
            link: '/services',
          },
        ];
      }
    } else {
      essentialLinks.value = [
        {
          title: 'Accounts',
          caption: 'Manage Accounts',
          icon: 'fas fa-users',
          link: '/accounts',
        },
      ];
    }
  }, {immediate: true});

</script>
