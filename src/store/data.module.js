import DataService from '@/services/DataService';
import { stubState } from "@/store/StubState"
import UserService from "@/services/UserService";

// const initialstate = {
//     currentProgress: 0,
//     songs: DataService.getSongs().data,
//     mixes: DataService.getMixes().data,
// }
//
// const actions =  {
//     // TODO rework the first four methods
//     async submitMix(context, payload) {
//         const {newMix} = payload
//         context.state.mixes.forEach(mix => console.log(mix))
//         context.commit("addMix", newMix)
//         await context.dispatch('fakeProgressLoop', payload);
//     },
//     async fakeProgressLoop(context, payload) {
//         let {newMix} = payload
//
//         function progressLoop() {
//             setTimeout(function () {
//                 context.commit("increaseProgress", 10)
//                 context.commit({
//                     type: "updateMixProgress",
//                     mixTitle: newMix.title,
//                     amount: 10
//                 })
//                 context.commit("refreshAvailableMixes")
//                 if (context.state.currentProgress < 100) {
//                     progressLoop()
//                 }
//             }, 1000)
//         }
//
//         progressLoop()
//     },
//     deleteMix(context, payload){
//         const {newMix} = payload
//         context.commit("deleteMix", newMix)
//     },
//     fakeProgress(context){
//         function fakeProgressLoop(){
//             setTimeout(function(){
//                 context.commit('incrementProgress', context.state)
//                 if(context.state.currentProgress < 100){
//                     fakeProgressLoop()
//                 }
//             },10000)
//         }
//         fakeProgressLoop();
//     },
//     async getSongs(context){
//         const songs = await DataService.getSongs()
//         context.commit("setSongs", songs)
//     }
// }
//
// const mutations = {
//     incrementProgress(state) {
//         state.currentProgress += 10;
//     },
//     increaseProgress(state, progress){
//         state.currentProgress += progress;
//     },
//     updateMixProgress(state, payload){
//         let mix = state.mixes.find(x => x.title === payload.mixTitle)
//         mix.progress = mix.progress + payload.amount
//         state.mixes = [...state.mixes.filter(x => x.title !== payload.mixTitle), mix]
//     },
//     setMixes(state, {current_mixes}){
//         state.mixes = current_mixes
//     },
//     setSongs(state, {current_songs}){
//         state.songs = current_songs
//     },
//     refreshAvailableMixes(state){
//         state.availableMixes = [...state.mixes.filter(x=>x.progress >= 100)];
//     },
//     addMix(state, mix){
//         state.mixes.push(mix);
//     },
//     addSong(state, {song}){
//         state.songs.push(song);
//     },
//     deleteMix(state, mix){
//         state.mixes.splice(state.mixes.indexOf(mix), 1);
//     },
//     deleteSong(state, song){
//         state.songs.splice(state.songs.indexOf(song), 1);
//     }
// }
//
// const getters = {
//     getSongs: state => {
//         return state.songs
//     },
//     getMixes: state => {
//         return state.mixes
//     },
//     getAvailableMixes: state => {
//         return state.mixes.filter(mix => mix.progress >= 100)
//     }
// }
//
// export const dataStore = {
//     state: initialstate,
//     namespaces: true,
//     actions: actions,
//     mutations: mutations,
//     getters: getters
// };