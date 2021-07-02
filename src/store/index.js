import Vue from 'vue'
import Vuex from 'vuex'
// import {accountStore} from './account.module'
// import {dataStore} from './data.module'
import createPersistedState from 'vuex-persistedstate';
import DataService from "@/services/DataService";
import Axios from "axios";
import UserService from "@/services/UserService";
import router from "@/router";
import {getDefaultState} from '@/store/StubState';
import Song from "@/model/Song";
import Mix from "@/model/Mix";

Vue.use(Vuex)

const initialstate = getDefaultState()

function getLengthFromSeconds(length) {
  let minutes = Math.floor(length / 60)
  let seconds = Math.round(length - (minutes*60))
  if (seconds < 10)
    return minutes +':0'+seconds
  else
    return minutes+':'+seconds
}


const actions =  {
  // TODO rework the first four methods
  async submitMix(context, payload) {
    const {newMix} = payload
    context.state.mixes.forEach(mix => console.log(mix))
    context.commit("addMix", newMix)
    await context.dispatch('fakeProgressLoop', payload);
  },
  async fakeProgressLoop(context, payload) {
    let {newMix} = payload

    function progressLoop() {
      setTimeout(function () {
        context.commit("increaseProgress", 10)
        context.commit({
          type: "updateMixProgress",
          mixTitle: newMix.title,
          amount: 10
        })
        context.commit("refreshAvailableMixes")
        if (context.state.currentProgress < 100) {
          progressLoop()
        }
      }, 1000)
    }

    progressLoop()
  },
  deleteMix(context, payload){
    const {newMix} = payload
    context.commit("deleteMix", newMix)
  },
  fakeProgress(context){
    function fakeProgressLoop(){
      setTimeout(function(){
        context.commit('incrementProgress', context.state)
        if(context.state.currentProgress < 100){
          fakeProgressLoop()
        }
      },10000)
    }
    fakeProgressLoop();
  },
  async getSongs(context){
    const song_response = await DataService.getSongs()
    const song_data = song_response.data.data[0]
    let _songs = [];
    song_data.forEach(s => {
      _songs.push(new Song(
          s.title,
          getLengthFromSeconds(s.length),
          s.bpm,
          s.id
      ))
    })
    context.commit("setSongs", _songs)
  },
  async getMixes(context){
    const mixes_response = await DataService.getMixes()
    const mixes_data = mixes_response.data.data[0]
    let _mixes = []
    mixes_data.forEach(m => {
      const length_date = new Date(m.length * 1000).toISOString().substr(11, 8)

      _mixes.push(new Mix(
        m.title.split('_')[0],
        getLengthFromSeconds(m.length),
        m.num_songs,
        m.bpm,
        m.id,
        m.progress
      ))
    })
    context.commit("setMixes", _mixes)
  },
  login: ({commit, dispatch}, {token, user}) => {
    commit('SET_TOKEN', token);
    commit('SET_USER', user);

    Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    dispatch('getSongs')
    dispatch('getMixes')
  },
  logout: ({commit}) => {
    commit('RESET', '')
  },
  register({dispatch, commit}, user) {
    commit('registerRequest', user);
    UserService.register(user).then(
        user => {
          commit('registerSuccess', user)
          router.push('/login').then(r =>
              setTimeout(() => {
                dispatch('alert/success', 'Registration successful', {root: true})
              })
          )
        },
        error => {
          commit('registerFailure', error)
          dispatch('alert/error', error, {root: true})
        }
    )
  }
}

const mutations = {
  incrementProgress(state) {
    state.currentProgress += 10;
  },
  increaseProgress(state, progress){
    state.currentProgress += progress;
  },
  updateMixProgress(state, payload){
    let mix = state.mixes.find(x => x.title === payload.mixTitle)
    mix.progress = mix.progress + payload.amount
    state.mixes = [...state.mixes.filter(x => x.title !== payload.mixTitle), mix]
  },
  setMixes(state, payload){
    state.mixes = payload
    state.availableMixes = payload.filter(x=>x.progress >= 100)
  },
  setSongs(state, payload){
    state.songs = payload
  },
  refreshAvailableMixes(state){
    state.availableMixes = state.mixes.filter(x=>x.progress >= 100);
  },
  addMix(state, mix){
    state.mixes.push(mix);
  },
  addSong(state, {song}){
    state.songs.push(song);
  },
  deleteMix(state, mix){
    state.mixes.splice(state.mixes.indexOf(mix), 1);
  },
  deleteSong(state, song){
    state.songs.splice(state.songs.indexOf(song), 1);
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USER: (state, user) => {
    state.user = user;
  },
  RESET: state => {
    Object.assign(state, getDefaultState());
  }
}

const getters = {
  getSongs: state => {
    return state.songs
  },
  getMixes: state => {
    return state.mixes
  },
  getAvailableMixes: state => {
    return state.mixes.filter(mix => mix.progress >= 100)
  },
  isLoggedIn: state => {
    return !!state.token;
  },
  getUser: state => {
    return state.user;
  }
}


export default new Vuex.Store({
  // state: {
  //   currentProgress: 0,
  //   songs: songs_stub,
  //   mixes: mixes_stub,
  //   username: username_stub,
  //   authState: false,
  //   availableMixes: available_mixes
  // },
  // mutations: {
  //   login(state){
  //     state.authState = true
  //   },
  //   logout(state){
  //     state.authState = false
  //   },
  //   incrementProgress(state) {
  //     state.currentProgress += 10;
  //   },
  //   increaseProgress(state, progress){
  //     state.currentProgress += progress;
  //   },
  //   updateMixProgress(state, payload){
  //     let mix = state.mixes.find(x => x.title === payload.mixTitle)
  //     mix.progress = mix.progress + payload.amount
  //     state.mixes = [...state.mixes.filter(x => x.title !== payload.mixTitle), mix]
  //   },
  //   setMixes(state, {current_mixes}){
  //     state.mixes = current_mixes;
  //   },
  //   refreshAvailableMixes(state){
  //     state.availableMixes = [...state.mixes.filter(x=>x.progress >= 100)];
  //   },
  //   addMix(state, mix){
  //     state.mixes.push(mix);
  //   },
  //   addSong(state, song){
  //     state.songs.push(song);
  //   },
  //   deleteMix(state, mix){
  //     state.mixes.splice(state.mixes.indexOf(mix), 1);
  //   },
  //   deleteSong(state, song){
  //     state.songs.splice(state.songs.indexOf(song), 1);
  //   }
  // },
  // actions: {
  //   async submitMix(context, payload){
  //     const {newMix} = payload
  //     context.state.mixes.forEach(mix => console.log(mix))
  //     context.commit("addMix", newMix)
  //     await context.dispatch('fakeProgressLoop', payload);
  //   },
  //   async fakeProgressLoop(context, payload){
  //     let {newMix} = payload
  //     function progressLoop(){
  //       setTimeout(function(){
  //         context.commit("increaseProgress", 10)
  //         context.commit({
  //           type: "updateMixProgress",
  //           mixTitle: newMix.title,
  //           amount: 10
  //         })
  //         context.commit("refreshAvailableMixes")
  //         if (context.state.currentProgress < 100){
  //           progressLoop()
  //         }
  //       },1000)
  //     }
  //     progressLoop()
  //   },
  //   deleteMix(context, payload){
  //     const {newMix} = payload
  //     context.commit("deleteMix", newMix)
  //   },
  //   fakeProgress(context){
  //     function fakeProgressLoop(){
  //       setTimeout(function(){
  //         context.commit('incrementProgress', context.state)
  //         if(context.state.currentProgress < 100){
  //           fakeProgressLoop()
  //         }
  //       },10000)
  //     }
  //     fakeProgressLoop();
  //   }
  // },
  state: initialstate,
  actions: actions,
  mutations: mutations,
  getters: getters,
  // modules: {
  //   accountStore,
  //   dataStore
  // },
  plugins: [createPersistedState()]
})
