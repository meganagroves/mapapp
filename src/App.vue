<template>
  <div id="app">
    <MapComponent />
  
  </div>
</template>

<script>
import MapComponent from './components/MapComponent.vue';
import ClinicList from './components/ClinicList.vue';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'App',
  components: {
    MapComponent,
    ClinicList
  }
};
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
}

h1, h2, h3, h4, h5, h6, p, a, input, button {
  font-family: 'Roboto', sans-serif;
}
</style>