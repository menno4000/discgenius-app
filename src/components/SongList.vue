<template>
  <div>
    <div class="spacer"/>
    <div v-if="!uploading">
      <button class="uploadButton" v-on:click="startUpload()" :disabled="!canUpload">
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
    <div>
      <div class="songNameLabel">
        <span>Song Name</span>
      </div>
      <div class="songLengthLabel">
        <span>Length</span>
      </div>
      <div class="songTempoLabel">
        <span>Tempo</span>
      </div>
      <div class="deleteDiv">
        <button class="deletePlaceholder">
          Delete
        </button>
      </div>
    </div>
    <v-expansion-panels>
      <v-expansion-panel v-for="song in songs"
                         :key="song.id"
                         @click="playbackSong(song)">
        <v-expansion-panel-header>
          <div class="songDiv">
            <div class="songNameLabel">{{ song.title }}</div>
            <div class="songLengthLabel">{{ song.length }}</div>
            <div class="songTempoLabel">{{ song.tempo }}</div>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="songDiv">
            <div v-if="playbackFile !== ''">
              <vue-plyr>
                <audio controls crossorigin playsinline>
                  <source
                      v-bind:src="playbackFile"
                      type="audio/mp3"
                  />
                </audio>
              </vue-plyr>
            </div>
            <div class="deleteDiv">
              <button class="deleteButton" v-on:click="deleteSong(song)">
                Delete
              </button>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import Song from "../model/Song";
import DataService from "@/services/DataService";

// TODO unfold for playback
// TODO table header

export default {
  data() {
    return {
      uploading: false,
      file: '',
      playbackFile: ''
    }
  },
  computed: {
    songs() {
      return this.$store.getters.getSongs;
    },
    canUpload() {
      return !!this.$store.getters.isLoggedIn;
    }
  },
  created() {
    if (this.$store.getters.isLoggedIn) {
      this.$store.dispatch('fetchSongs')
    }
  },
  methods: {
    async deleteSong(song) {
      if (confirm("Do you really want to delete Song " + song.title + "?")) {
        const delete_response = await DataService.deleteSong(song.id)
        if (delete_response === undefined)
          alert("Song Deletion failed")
        else {
          console.log(delete_response)
          await this.$store.commit('deleteSong', song)
        }
      }
    },
    startUpload() {
      this.uploading = true
    },
    handleFileUpload() {
      this.file = this.$refs.songFile.files[0]
    },
    async uploadSong(song) {
      const song_filename = this.file.name
      const song_data = song_filename.split('.')
      const song_name = song_data[0]
      const song_extension = song_data[1]
      const song_upload_response = await DataService.uploadSong(song_name, song_extension, this.file)
      if (song_upload_response === undefined) {
        alert("Song upload failed")
      } else {
        console.log(song_upload_response)
        const song = new Song(
            song_upload_response.data.title,
            song_upload_response.data.length,
            song_upload_response.data.bpm,
            song_upload_response.data.id
        )
        await this.$store.commit('addSong', song)
        this.uploading = false
        await this.$store.dispatch("fetchSongs")
      }
    },
    async playbackSong(song) {
      this.playbackFile = ''
      this.playbackFile = "http://localhost:9001/getSong?name="+song.title_mp3
      console.log("fetching song "+song.title_mp3+" for playback")
      // console.log('fetching song playback')
      // const song_download_response = await DataService.getSongFile(song.title_mp3)
      // if (song_download_response === undefined) {
      //   console.log("song download failed")
      //   this.playbackFile = ''
      // } else {
      //   console.log(song_download_response)
      //   let blob = new Blob([song_download_response.data])
      //   let link = document.createElement('a')
      //   link.href = window.URL.createObjectURL(blob)
      //   link.setAttribute('download', song.title_mp3)
      //
      //   this.playbackFile = link
      //   console.log(this.playbackFile)
      // }
    }
  }

}
</script>

<style scoped>
.spacer {
  width: 100%;
  height: 20px;
}

.songDiv {
  width: 100%;
}

.songUploadDiv {
  display: inline-block;
  vertical-align: middle;
  width: 40%;
}

.songNameLabel {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  margin-left: 10%;
  width: 30%;
}

.songNameLabel > span {
  font-size: medium;
}

.songTempoLabel {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  width: 5%;
  margin-left: 5%;
}

.songTempoLabel > span {
  font-size: medium;
}

.songLengthLabel {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  width: 5%;
  margin-left: 5%;
}

.songLengthLabel > span {
  font-size: medium;
}

.playbackDiv {
  display: inline-block;
  vertical-align: middle;
  align-self: center;

}

.deleteDiv {
  display: inline-block;
  vertical-align: middle;
  align-self: center;
}

.deleteButton {
  color: white;
  font-size: 16px;
  background-color: #ff5d44;
  margin: 20px;
  padding: 10px 20px;
  border-radius: 4px;
}

.deletePlaceholder {
  color: white;
  font-size: 16px;
  background-color: white;
  margin: 20px;
  padding: 10px 20px;
  border-radius: 4px;
}

.uploadButton {
  margin: 20px;
  font-size: 16px;
  background-color: #76b900;
  border-radius: 4px;
  color: white;
  padding: 10px 20px;
}

.uploadButton:disabled {
  margin: 20px;
  font-size: 16px;
  background-color: lightgrey;
  border-radius: 4px;
  color: black;
  padding: 10px 20px;
}
</style>