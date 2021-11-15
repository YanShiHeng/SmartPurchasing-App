const state = {
  token: '',
  userInfo: {},
  userRights: []
}
const getters = {
  token(state) {
    return state.token
  },
  userInfo: state => state.userInfo,
  userRights: state => state.userRights
}
const actions = {
  // userInfoAct(context, userInfo) {
  // context是一个对象，可以进行解构赋值
  // context.commit('mutationUserInfo', userInfo)
  userInfoAct({
    commit
  }, userInfo) {
    commit('userInfoMut', userInfo)
  }
}
const mutations = {
  userInfoMut(state, userInfo) {
    state.userInfo = userInfo
  },
  tokenMut(state, token) {
    state.token = token
  },
  mutationRights(state, rights) {
    state.userRights = rights
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
