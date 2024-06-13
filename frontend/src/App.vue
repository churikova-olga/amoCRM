<template>
  <vTable />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import vTable from './components/v-table.vue';

export default defineComponent({
  name: 'App',
  components: {
    vTable
  }
});
</script>
