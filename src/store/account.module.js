import {userService} from '@/services/UserService'
import {router} from '../router'
import createPersistedState from 'vuex-persistedstate'
import Axios from 'axios'

const getDefaultState = () => {
    return {
        token: '',
        user: {}
    };
};

const actions = {
    // login({dispatch, commit}, {username, password}) {
    //     commit('loginRequest', {username});
    //     userService.login(username, password)
    //         .then(
    //             user => {
    //                 commit('loginSuccess', user)
    //                 router.push('/')
    //             },
    //             error => {
    //                 commit('loginFailure', error);
    //                 dispatch('alert/error', error, {root:true})
    //             }
    //         )
    // },
    login: ({commit, dispatch}, {token, user}) => {
        commit('SET_TOKEN', token);
        commit('SET_USER', user);

        Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    // logout({commit}){
    //     userService.logout()
    //     commit('logout')
    // },
    logout: ({commit}) => {
        commit('RESET', '')
    },
    register({dispatch, commit}, user) {
        commit('registerRequest', user);
        userService.register(user).then(
            user => {
                commit('registerSuccess', user)
                router.push('/login')
                setTimeout(() => {
                    dispatch('alert/success', 'Registration successful', {root: true})
                })
            },
            error => {
                commit('registerFailure', error)
                dispatch('alert/error', error, {root: true})
            }
        )
    }
}

const getters = {
    isLoggedIn: state => {
        return !!state.token;
    },
    getUser: state => {
        return state.user;
    }
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_USER: (state, user) => {
        state.user = user;
    },
    RESET: state => {
        Object.assign(state, getDefaultState());
    },
    // loginRequest(state, user) {
    //     state.status = { loggingIn: true };
    //     state.user = user;
    // },
    // loginSuccess(state, user) {
    //     state.status = { loggedIn: true };
    //     state.user = user;
    // },
    // loginFailure(state) {
    //     state.status = {};
    //     state.user = null;
    // },
    logout(state) {
        state.status = {};
        state.user = null;
    },
    registerRequest(state, user) {
        state.status = { registering: true };
    },
    registerSuccess(state, user) {
        state.status = {};
    },
    registerFailure(state, error) {
        state.status = {};
    }

}

export const accountStore = {
    strict: true,
    plugins: [createPersistedState()],
    namespaced: true,
    state: getDefaultState(),
    getters: getters,
    actions,
    mutations
}