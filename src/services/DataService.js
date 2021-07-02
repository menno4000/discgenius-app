import axios from 'axios'

const API_URL = 'http://localhost:9001/';

export default {
    uploadSong,
    getSongs,
    getSongFile,
    deleteSong,
    getMixes,
    getMixFile,
    deleteMix,
    submitMix
}

//TODO remove excessive console logging
function uploadSong(filename, extension, file) {
    const params = {
        filename: filename,
        extension: extension
    }
    // let formData = new FormData()
    // formData.append('file', file)
    return axios.post(
        API_URL+'upload',
        file,
        {
            params: params,
        }
    ).then(function (response){
        // console.log(response)
        return response
    }).catch(function (error) {
        console.log(error)
    })
}
function getSongs() {
    return axios.get(
        API_URL+'songs'
    ).then(function (response) {
        // console.log(response)
        return response
    }).catch(function (error) {
        console.log(error)
    })
}
function getSongFile(songName){
    return axios.get(
        API_URL+'getSong',
        {
            params: {
                name: songName
            }
        }
    ).then(function(response) {
        console.log(response)
        return response
    }).catch(function(error){
        console.log(error)
    })
}
function deleteSong(songId){
    return axios.delete(
        API_URL+'songs',
        {
            params: {
                target_id: songId
            }
        }
    ).then(function(response){
        console.log(response)
        return response
    }).catch(function(error){
        console.log(error)
    })
}
function getMixes() {
    return axios.get(
        API_URL+'mixes'
    ).then(function (response){
        // console.log(response)
        return response
    }).catch(function(error){
        console.log(error)
    })
}
function getMixFile(mixName){
    return axios.get(
        API_URL+'getMix',
        {
            params: {
                name: mixName
            }
        }
    ).then(function (response){
        console.log(response)
        return response
    }).catch(function(error){
        console.log(error)
    })
}
function deleteMix(mixId){
    return axios.delete(
        API_URL+'mixes',
        {
            params: {
                target_id: mixId
            }
        }
    ).then(function (response){
        console.log(response)
        return response
    }).catch(function(error){
        console.log(error)
    })
}
function submitMix(mix){

}