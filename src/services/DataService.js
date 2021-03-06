import axios from 'axios'

const API_URL = 'https://discgenius.f4.htw-berlin.de/';
// const API_URL = 'http://localhost:9001/';

export default {
    uploadSong,
    getSongs,
    getSongFile,
    deleteSong,
    getMixes,
    getMix,
    getMixFile,
    deleteMix,
    createMix
}

function uploadSong(filename, extension, file) {
    const params = {
        filename: filename,
        extension: extension
    }
    // let formData = new FormData()
    // formData.append('file', file)
    return axios.post(
        API_URL + 'upload',
        file,
        {
            params: params,
        }
    ).then(function (response) {
        // console.log(response)
        return response
    }).catch(function (error) {
        console.log(error)
    })
}

function getSongs() {
    return axios.get(
        API_URL + 'songs'
    ).then(function (response) {
        // console.log(response)
        return response
    }).catch(function (error) {
        console.log(error)
    })
}

function getSongFile(songName) {
    return axios.get(
        API_URL + 'getSong',
        {
            params: {
                name: songName
            }
        }
    ).then(function (response) {
        return response
    }).catch(function (error) {
        console.log(error)
    })
}

function deleteSong(songId) {
    return axios.delete(
        API_URL + 'songs',
        {
            params: {
                target_id: songId
            }
        }
    ).then(function (response) {
        return response
    }).catch(function (error) {
        console.log(error)
    })
}

function getMixes() {
    return axios.get(
        API_URL + 'mixes'
    ).then(function (response) {
        return response
    }).catch(function (error) {
        console.log(error)
    })
}

function getMix(mix_id) {
    return axios.get(
    API_URL + 'getMixObject/' + mix_id, {timeout: 10000})
    .then(function (response) {
        return response
    }).catch(function (error) {
        console.log(error)
    })
}

function createMix(mixName,
                   aName,
                   bName,
                   scenario,
                   bpm,
                   numSongsA,
                   numSongsB,
                   entryPoint,
                   exitPoint) {

    const query_params = {
        song_a_name: aName,
        song_b_name: bName,
        mix_name: mixName,
        bpm: bpm,
        scenario_name: scenario,
        num_songs_a: numSongsA,
        num_songs_b: numSongsB,
        exit_point: exitPoint,
        entry_point: entryPoint,
        transition_length: 64,
        transition_midpoint: 32
    }
    console.log(query_params)
    return axios.post(
        API_URL + 'createMix',
        null,
        {
            params: query_params,
        }
    ).then(function (response) {
        return response
    }).catch(function (error) {
        console.log(error)
    })
}

function getMixFile(mixName) {
    const mixNameMp3 = mixName.substring(0, (mixName.length-3))+'mp3'
    return axios.get(
        API_URL + 'getMixMedia/' + mixNameMp3, {
            responseType: "blob"
        }
    ).then(function (response) {
        return response
    }).catch(function (error) {
        console.log(error)
    })
}

function deleteMix(mixId) {
    return axios.delete(
        API_URL + 'mixes',
        {
            params: {
                target_id: mixId
            }
        }
    ).then(function (response) {
        return response
    }).catch(function (error) {
        console.log(error)
    })
}