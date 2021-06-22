import Vue from 'vue'
import Vuex from 'vuex'
import Song from "@/model/Song";
import Mix from "@/model/Mix";
import {accountStore} from './account.module'
import {dataStore} from './data.module'

Vue.use(Vuex)

let username_stub = "Test User";

let songs_stub = [
  new Song("Song 1", 361, 130, "s1"),
  new Song("Song 2", 382, 134, "s2"),
  new Song("Song 3", 304, 127, "s3"),
];
let mixes_stub = [
  new Mix("Mix 1", 702, 2, 130, "m1", 100),
  new Mix("Mix 2", 1240, 3, 120, "m2", 55),
];
let available_mixes = [mixes_stub[0]]
export default new Vuex.Store({
  state: {
    currentProgress: 0,
    songs: songs_stub,
    mixes: mixes_stub,
    username: username_stub,
    authState: false,
    availableMixes: available_mixes
  },
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
  modules: {
    accountStore,
    dataStore
  }
})
