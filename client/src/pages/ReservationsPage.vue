<template>
  <q-page class="column items-center justify-center bg-accent" >
    <p :class="$q.screen.width> 350? 'text-h1':'text-h5'">RESERVATIONS</p>
    <div :class="[$q.screen.width> 350?'row':'column', 'justify-center q-gutter-sm']">
      <scheduler/>
    </div>
  </q-page>
</template>

<script setup>
  import Scheduler from 'components/Calendar/Scheduler';
</script>

<style scoped>

</style>
