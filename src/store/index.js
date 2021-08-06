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

const initialState = getDefaultState()
const API_URL = 'http://localhost:9001/';

function getLengthFromSeconds(length) {
  let minutes = Math.floor(length / 60)
  let seconds = Math.round(length - (minutes*60))
  if (seconds < 10)
    return minutes +':0'+seconds
  else
    return minutes+':'+seconds
}


const actions =  {
  async submitMix(context, payload) {
    const {newMix} = payload
    // context.state.mixes.forEach(mix => console.log(mix))
    context.commit("addMix", newMix)
    await context.dispatch('progressLoop', payload);
  },
  async progressLoop(context, payload) {
    let {newMix} = payload

      async function pLoop(){
      setTimeout(async function() {
        await context.dispatch('fetchMixes')
        const mix = context.state.mixes.filter(m => m.id === newMix.id)[0]
        context.commit('setProgress', mix.progress)
        if (context.state.currentProgress < 100) {
          await pLoop()
        } else {
          context.commit("refreshAvailableMixes")
        }
      }, 10000)
    }

    await pLoop()
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
      }, 10000)
    }

    progressLoop()
  },
  async fetchSongs(context){
    const song_response = await DataService.getSongs()
    const song_data = song_response.data.data[0]
    let _songs = [];
    song_data.forEach(s => {
      let newSong = new Song(
          s.title.split('_')[0],
          s.title,
          getLengthFromSeconds(s.length),
          s.length,
          s.bpm,
          s.id
      )
      if ('title_mp3' in s){
        newSong.url = API_URL + 'getSongBytes/' + s.title_mp3
        newSong.title_mp3 = s.title_mp3
      }
      _songs.push(newSong)
    })
    context.commit("setSongs", _songs)
  },
  async fetchMixes(context){
    const mixes_response = await DataService.getMixes()
    const mixes_data = mixes_response.data.data[0]
    let _mixes = []
    mixes_data.forEach(m => {
      if (m !== null){
        console.log(m)
        let newMix = new Mix(
            m.title.split('_')[0],
            m.title,
            m.num_songs,
            m.bpm,
            m.id,
            m.progress,
            getLengthFromSeconds(m.length),
            m.length)
        if ('title_mp3' in m){
          const title_mp3 = m.title.substring(0, m.title.length-4)+'.mp3'
          newMix.title_mp3 = title_mp3
          newMix.url = API_URL + 'getMixBytes/' + title_mp3
        }
        if ('song_list' in m){
          newMix.song_list = m.song_list
        }
        if ('transition_points' in m){
          newMix.transition_points = m.transition_points
        }
        _mixes.push(newMix)
      }
    })
    context.commit("setMixes", _mixes)
  },
  login: ({commit, dispatch}, {token, user}) => {
    commit('SET_TOKEN', token);
    commit('SET_USER', user);

    Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    dispatch('fetchSongs')
    dispatch('fetchMixes')
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
  setProgress(state, progress){
    state.currentProgress = progress
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
    // console.log(state.mixes)
    return state.mixes
        .filter(mix => mix !== null)
        .filter(mix => mix !== undefined)
        .filter(mix => mix.progress >= 100)
  },
  isLoggedIn: state => {
    return !!state.token;
  },
  getUser: state => {
    return state.user;
  }
}


export default new Vuex.Store({
  state: initialState,
  actions: actions,
  mutations: mutations,
  getters: getters,
  plugins: [createPersistedState()]
})
