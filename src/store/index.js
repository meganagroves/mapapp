import { createStore } from 'vuex';
import { loadClinicData } from '@/utils/loadClinics'; // Make sure this path is correct

const store = createStore({
  state() {
    return {
      selectedProvinces: [],
      clinics: []
    };
  },
  mutations: {
    SET_SELECTED_PROVINCES(state, provinces) {
      state.selectedProvinces = provinces;
      state.clinics = getClinicsByProvinces(state.clinics, provinces);
    },
    SET_CLINICS(state, clinics) {
      state.clinics = clinics;
    }
  },
  actions: {
    async fetchClinics({ commit }) {
      try {
        const clinics = await loadClinicData(); // Load clinics from the spreadsheet
        commit('SET_CLINICS', clinics);
      } catch (error) {
        console.error('Failed to fetch clinics from spreadsheet:', error);
      }
    },
    selectProvinces({ commit }, provinces) {
      commit('SET_SELECTED_PROVINCES', provinces);
    }
  },
  getters: {
    clinics: state => state.clinics
  }
});

// Helper function to filter clinics by selected provinces
function getClinicsByProvinces(clinics, provinces) {
  return provinces.length
    ? clinics.filter(clinic => provinces.includes(clinic.province))
    : clinics;
}

export default store;
