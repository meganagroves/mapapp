<template>
  <div id="container">
    <div id="map"></div>
    <div id="filters">
      <label><input type="checkbox" value="All" :checked="isAllSelected" @change="toggleAll"> All</label>
      <label><input type="checkbox" value="Ontario" :checked="selectedProvinces.includes('Ontario')" @change="toggleProvince('Ontario')"> Ontario</label>
      <label><input type="checkbox" value="Quebec" :checked="selectedProvinces.includes('Quebec')" @change="toggleProvince('Quebec')"> Quebec</label>
      <label><input type="checkbox" value="Manitoba" :checked="selectedProvinces.includes('Manitoba')" @change="toggleProvince('Manitoba')"> Manitoba</label>
      <label><input type="checkbox" value="Saskatchewan" :checked="selectedProvinces.includes('Saskatchewan')" @change="toggleProvince('Saskatchewan')"> Saskatchewan</label>
      <label><input type="checkbox" value="Alberta" :checked="selectedProvinces.includes('Alberta')" @change="toggleProvince('Alberta')"> Alberta</label>
      <label><input type="checkbox" value="British Columbia" :checked="selectedProvinces.includes('British Columbia')" @change="toggleProvince('British Columbia')"> British Columbia</label>
      <label><input type="checkbox" value="Yukon" :checked="selectedProvinces.includes('Yukon')" @change="toggleProvince('Yukon')"> Yukon</label>
      <label><input type="checkbox" value="Northwest Territories" :checked="selectedProvinces.includes('Northwest Territories')" @change="toggleProvince('Northwest Territories')"> Northwest Territories</label>
      <label><input type="checkbox" value="Nunavut" :checked="selectedProvinces.includes('Nunavut')" @change="toggleProvince('Nunavut')"> Nunavut</label>
      <label><input type="checkbox" value="Nova Scotia" :checked="selectedProvinces.includes('Nova Scotia')" @change="toggleProvince('Nova Scotia')"> Nova Scotia</label>
      <label><input type="checkbox" value="New Brunswick" :checked="selectedProvinces.includes('New Brunswick')" @change="toggleProvince('New Brunswick')"> New Brunswick</label>
      <label><input type="checkbox" value="Newfoundland" :checked="selectedProvinces.includes('Newfoundland')" @change="toggleProvince('Newfoundland')"> Newfoundland</label>
      <label><input type="checkbox" value="PEI" :checked="selectedProvinces.includes('PEI')" @change="toggleProvince('PEI')"> PEI</label>
    </div>
  </div>
  
    <h2>Clinic List</h2>
    <div class="scrollable-container">
    <p v-if="selectedProvinces.length === 0" class="no-region-message">No region selected.</p>
    <div id="clinic-list" v-if="shouldShowClinicList">
    <ul>
      <li v-for="clinic in filteredClinics" :key="clinic.id">
        <clinic>{{ clinic.name }}</clinic><br>
        {{ clinic.address }}, {{ clinic.city}}<br> {{ clinic.province }}<br>
        <a v-if="clinic.website" :href="clinic.website" target="_blank">Click here to visit website</a>
      </li>
    </ul></div>
    <p v-if="filteredClinics.length === 0 && selectedProvinces.length > 0">We do not have any clinics listed in this region.</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import L from 'leaflet'; // Ensure you have Leaflet installed

// Import custom icon image
import clinicIconUrl from '/clinicicon.png';

export default {
  name: 'MapComponent',
  data() {
    return {
      selectedProvinces: [] // Array to hold selected provinces
    };
  },
  computed: {
    ...mapGetters(['clinics']),
    isAllSelected() {
      // Check if all provinces/territories are selected
      const allProvinces = [
        'Ontario', 'Quebec', 'Manitoba', 'Saskatchewan', 'Alberta', 'British Columbia',
        'Yukon', 'Northwest Territories', 'Nunavut', 'Nova Scotia', 'New Brunswick',
        'Newfoundland', 'PEI'
      ];
      return allProvinces.every(province => this.selectedProvinces.includes(province));
    },
    filteredClinics() {
      if (this.isAllSelected) {
        return this.clinics; // Show all clinics if all filters are selected
      } else {
        return this.clinics.filter(clinic => this.selectedProvinces.includes(clinic.province));
      }
    },
    shouldShowClinicList() {
      return this.selectedProvinces.length > 0; // Show the list only if one or more filters are selected
    }
  },
  methods: {
    ...mapActions(['fetchClinics']),
    toggleAll() {
      const allProvinces = [
        'Ontario', 'Quebec', 'Manitoba', 'Saskatchewan', 'Alberta', 'British Columbia',
        'Yukon', 'Northwest Territories', 'Nunavut', 'Nova Scotia', 'New Brunswick',
        'Newfoundland', 'PEI'
      ];
      if (this.isAllSelected) {
        this.selectedProvinces = []; // Deselect all if "All" is currently selected
      } else {
        this.selectedProvinces = allProvinces; // Select all provinces
      }
      this.updateMap(); // Update map markers based on selection
    },
    toggleProvince(province) {
      const index = this.selectedProvinces.indexOf(province);
      if (index === -1) {
        this.selectedProvinces.push(province); // Select province if not already selected
      } else {
        this.selectedProvinces.splice(index, 1); // Deselect province if already selected
      }
      
      // Automatically select or deselect "All" based on the selected filters
      if (this.isAllSelected) {
        this.selectedProvinces = [
          'Ontario', 'Quebec', 'Manitoba', 'Saskatchewan', 'Alberta', 'British Columbia',
          'Yukon', 'Northwest Territories', 'Nunavut', 'Nova Scotia', 'New Brunswick',
          'Newfoundland', 'PEI'
        ];
      } else {
        this.selectedProvinces = this.selectedProvinces.filter(p => p !== 'All');
      }
      this.updateMap(); // Update map markers based on selection
    },
    initMap() {
      const map = L.map('map').setView([56.1304, -106.3468], 3);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      this.updateMap = () => {
        // Clear existing markers
        map.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });

        // Add clinic markers for the filtered clinics
        const clinicIcon = L.icon({
          iconUrl: clinicIconUrl, // Use imported icon URL
          iconSize: [10, 15], // Adjust the size of the icon
          iconAnchor: [5, 15], // Point of the icon which will correspond to marker's location
          popupAnchor: [1, -34] // Point from which the popup should open relative to the iconAnchor
        });

        this.filteredClinics.forEach(clinic => {
          const popupContent = `
            <div>
              <b>${clinic.name}</b><br>
              ${clinic.address}<br>
              ${clinic.website ? `<a href="${clinic.website}" target="_blank">Click here to visit website</a>` : ''}
            </div>
          `;

          L.marker(clinic.location, { icon: clinicIcon })
            .bindPopup(popupContent)
            .addTo(map);
        });
      };
      
      this.updateMap(); // Initialize the map with the current filter
    }
  },
  mounted() {
    this.fetchClinics().then(() => {
      this.initMap();
    });
  }
};
</script>

<style>

h2 {
  color:#7A003C;
  font-weight: bolder;
  margin-left: 10px;
  margin-bottom: 15px;
}
clinic {
  font-weight: bold;
  color: #7A003C;
}

ul {
list-style-type: none;
padding-left: 20px;

}

li {
  margin-bottom: 10px;
  margin-top: 2px;
}
#container {
  display: flex;
}

#map {
  height: 50vh;
  width: 50%; /* Adjust width as needed */
}

#filters {
  width: 30%; /* Adjust width as needed */
  padding-left: 2px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr; /* Two columns */
  gap: 1px; /* Space between items */
}

/* Clinic list styles */
#clinic-list ul.clinic-list {
  list-style-type: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

#clinic-list ul.clinic-list li {
  margin-bottom: 10px !important;
}

.no-region-message {
  margin-left: 20px; /* Adjust the value as needed */
}

.scrollable-container {
  max-height: 200px; /* Adjust the height as needed */
  max-width:725px;
  overflow-y: auto;
  border: 1px solid #ccc; /* Optional for better visual distinction */
  padding: 10px;
  background-color: #f9f9f9; /* Optional for aesthetic */
}
</style>

