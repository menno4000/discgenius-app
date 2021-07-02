<template>
  <div>
    <div class="spacer"/>
    <div v-if="!uploading">
      <button class="uploadButton" v-on:click="startUpload()">
        Upload New Song
      </button>
    </div>
    <div v-else-if="uploading">
      <div class="songUploadDiv">
        <label>
          Song File
          <input type="file" id="songFile" ref="songFile" @change="handleFileUpload"/>
        </label>
      </div>
      <div class="songUploadDiv">
        <button class="uploadButton" v-on:click="uploadSong()">
          Upload
        </button>
      </div>
    </div>
    <div v-for="song in songs" :key="song.id">
      <div class="songDiv">
        <div class="songNameLabel">{{song.title}}</div>
        <div class="songLengthLabel">{{song.length}}</div>
        <div class="songTempoLabel">{{song.tempo}}</div>
        <button class="deleteButton" v-on:click="deleteSong(song)">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script >
import Song from "../model/Song";
import DataService from "@/services/DataService";

export default {
  data() {
    return {
      uploading: false,
      file: ''
    }
  },
  computed: {
    songs(){
      return this.$store.getters.getSongs;
    }
  },
  created() {
    this.$store.dispatch('fetchSongs')
  },
  methods: {
    deleteSong(song){

    },
    startUpload(){
      this.uploading = true
    },
    handleFileUpload(){
      this.file = this.$refs.songFile.files[0]
    },
    async uploadSong(song){
      const song_filename = this.file.name
      const song_data = song_filename.split('.')
      const song_name = song_data[0]
      const song_extension = song_data[1]
      const song_response = await DataService.uploadSong(song_name, song_extension, this.file)
      if (song_response === undefined) {
        alert("Song upload failed")
      } else {
        console.log(song_response)
        const song = new Song(
            song_response.data.title,
            song_response.data.length,
            song_response.data.bpm,
            song_response.data.id
        )
        await this.$store.commit('addSong', song)
        this.uploading = false
        await this.$store.dispatch("fetchSongs")
      }
    }
  }

}
</script>

<style scoped>
.spacer {
  width: 100%;
  height: 20px;
}
.songDiv{
  width: 100%;
  margin-bottom: 20px;
}
.songUploadDiv{
  display: inline-block;
  vertical-align: middle;
  width: 40%;
}
.songNameLabel{
  display: inline-block;
  vertical-align: middle;
  text-align: left;
  margin-left: 10%;
  width: 30%;
}
.songTempoLabel{
  display: inline-block;
  vertical-align: middle;
  text-align: left;
  width: 5%;
  margin-left: 5%;
}
.songLengthLabel{
  display: inline-block;
  vertical-align: middle;
  text-align: left;
  width: 5%;
  margin-left: 5%;
}
.deleteButton{
  display: inline-block;
  vertical-align: middle;
  align-self: center;
  color: white;
  font-size: 16px;
  background-color: #ff5d44;
  margin: 20px;
  padding: 10px 20px;
  border-radius: 4px;
}
.uploadButton{
  margin: 20px;
  font-size: 16px;
  background-color: #76b900;
  border-radius: 4px;
  color: white;
  padding: 10px 20px;
}
</style>