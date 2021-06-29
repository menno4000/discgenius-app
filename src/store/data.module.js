import { UserService } from '../services/UserService';

const user = JSON.parse(localStorage.getItem('user'))
const initialState = user
    ? { status: {loggedIn:true}, user}
    : { status: {loggedIn:false}, user: null}

export const dataStore = {
    namespaces: true,
    state: initialState,
    actions: {
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
        }
    },
    mutations: {
        login(state){
            state.authState = true
        },
        logout(state){
            state.authState = false
        },
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
        setMixes(state, {current_mixes}){
            state.mixes = current_mixes;
        },
        refreshAvailableMixes(state){
            state.availableMixes = [...state.mixes.filter(x=>x.progress >= 100)];
        },
        addMix(state, mix){
            state.mixes.push(mix);
        },
        addSong(state, song){
            state.songs.push(song);
        },
        deleteMix(state, mix){
            state.mixes.splice(state.mixes.indexOf(mix), 1);
        },
        deleteSong(state, song){
            state.songs.splice(state.songs.indexOf(song), 1);
        }
    }
};