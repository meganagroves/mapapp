const state = {
  exampleData: []
};

const mutations = {
  SET_EXAMPLE_DATA(state, data) {
    state.exampleData = data;
  }
};

const actions = {
  fetchExampleData({ commit }) {
    // Simulate fetching data from an API
    const data = ['Item 1', 'Item 2', 'Item 3'];
    commit('SET_EXAMPLE_DATA', data);
  }
};

const getters = {
  exampleData: state => state.exampleData
};

export default {
  state,
  mutations,
  actions,
  getters
};
