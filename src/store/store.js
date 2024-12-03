import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      selectedProvince: '',
      clinics: []
    };
  },
  mutations: {
    SELECT_PROVINCE(state, province) {
      state.selectedProvince = province;
      // Fetch or filter clinics based on the selected province
      state.clinics = getClinicsByProvince(province);
    }
  },
  actions: {
    selectProvince({ commit }, province) {
      commit('SELECT_PROVINCE', province);
    }
  },
  getters: {
    selectedProvince: state => state.selectedProvince,
    clinics: state => state.clinics
  }
});

function getClinicsByProvince(province) {
  // Fetch or filter clinics based on the province
  const clinics = [
    { id: 1, name: 'Clinic 1', province: 'Ontario' },
    { id: 2, name: 'Clinic 2', province: 'Ontario' },
    { id: 3, name: 'Clinic 3', province: 'Quebec' }
    // Add more clinics here
  ];
  return clinics.filter(clinic => clinic.province === province);
}

export default store;
