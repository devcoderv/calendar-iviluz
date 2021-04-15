export const state = () => ({
  user: {
    uid: null,
  },
})

export const getters = {
  isNotLoggedIn: (state) => {
    return state.user.uid === null
  },
}

export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    console.log('user1')
    // Don't do this:
    // state.user = authUser

    // Do this:
    const { uid, email, emailVerified } = authUser
    state.user = { uid, email, emailVerified }
  },
}

export const actions = {
  onAuthStateChangedAction: (ctx, { authUser }) => {
    if (!authUser) {
      // claims = null
      // Perform logout operations
      const payload = {
        uid: null,
      }
      ctx.commit('ON_AUTH_STATE_CHANGED_MUTATION', { authUser: payload })
      console.log('user', authUser)
    } else {
      console.log('user2', authUser)
      // Do something with the authUser and the claims object...
      //   const { uid, email, emailVerified } = authUser
      //  state.user = { uid, email, emailVerified }
      ctx.commit('ON_AUTH_STATE_CHANGED_MUTATION', { authUser })
    }
  },
}
