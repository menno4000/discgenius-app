<template>
  <div>
    <div class="spacer"/>
    <div id="upload">
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
    </div>
    <div id="tableHeader">
      <div class="songDiv">
        <div class="songNameLabel">
          <span>Song Name</span>
        </div>
        <div class="songLengthLabel">
          <span>Length</span>
        </div>
        <div class="songTempoLabel">
          <span>Tempo</span>
        </div>
        <div class="collapsePlaceholder">

        </div>
      </div>
    </div>
    <div id="songItems">
      <v-expansion-panels>
        <v-expansion-panel v-for="song in songs"
                           :key="song.id"
                           @change="playbackSong(song)">
          <v-expansion-panel-header>
            <div class="songDiv">
              <div class="songNameLabel">{{ song.title }}</div>
              <div class="songLengthLabel">{{ song.length }}</div>
              <div class="songTempoLabel">{{ song.tempo }}</div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="songDiv">
              <div id="audio-player" class="player-wrapper">
                <div class="player">
                  <div class="player-controls">
                    <div id="play">
                      <a v-on:click.prevent="playing = !playing"  :title="(playing) ? 'Pause' : 'Play'" href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path v-if="!playing" fill="currentColor" d="M15,10.001c0,0.299-0.305,0.514-0.305,0.514l-8.561,5.303C5.51,16.227,5,15.924,5,15.149V4.852c0-0.777,0.51-1.078,1.135-0.67l8.561,5.305C14.695,9.487,15,9.702,15,10.001z"/>
                          <path v-else fill="currentColor" d="M15,3h-2c-0.553,0-1,0.048-1,0.6v12.8c0,0.552,0.447,0.6,1,0.6h2c0.553,0,1-0.048,1-0.6V3.6C16,3.048,15.553,3,15,3z M7,3H5C4.447,3,4,3.048,4,3.6v12.8C4,16.952,4.447,17,5,17h2c0.553,0,1-0.048,1-0.6V3.6C8,3.048,7.553,3,7,3z"/>
                        </svg>
                      </a>
                    </div>
                    <div id="seek">
                        <div v-on:click="seek" class="player-progress" title="Time played : Total time">
                          <div :style="{ width: percentComplete + '%' }" class="player-seeker"></div>
                        </div>
                        <div class="player-time">
                          <div class="player-time-current">{{ currentTime }}</div>
                          <div class="player-time-total">{{ durationTime }}</div>
                        </div>
                    </div>
                    <div id="volume">
                      <a v-on:click.prevent="" v-on:mouseenter="showVolume = true" v-on:mouseleave="showVolume = false" :title="volumeTitle" href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path fill="currentColor" d="M19,13.805C19,14.462,18.462,15,17.805,15H1.533c-0.88,0-0.982-0.371-0.229-0.822l16.323-9.055C18.382,4.67,19,5.019,19,5.9V13.805z"/>
                        </svg>
                        <input v-model.lazy.number="volume" v-show="showVolume" class="player-volume" type="range" min="0" max="100"/>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="deleteDiv">
                  <button class="deleteButton" v-on:click="deleteSong(song)">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
<!--    <audio ref="audio" id="audio-driver" :src="currentSong" v-on:timeupdate="update" v-on:loadeddata="load" v-on:pause="playing = false" v-on:seek="playing = true" preload="auto" style="display: none;" controls></audio>-->
    <audio ref="audio" id="audio-driver" :src="currentSong"  preload="none" style="display: none;"></audio>
  </div>
</template>

<script>
import Song from "../model/Song";
import DataService from "@/services/DataService";

const convertTimeHHMMSS = (val) => {
  let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);

  return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
};

export default {
  data() {
    return {
      defaultSong:
          "https://res.cloudinary.com/dmf10fesn/video/upload/v1548882863/audio/Post_Malone_-_Wow._playvk.com.mp3",
      uploading: false,
      file: '',

      audio: undefined,
      currentSong: '',
      currentSeconds: 0,
      durationSeconds: 0,
      loaded: false,
      playing: false,
      previousVolume: 20,
      showVolume: false,
      volume: 20
    }
  },
  mounted() {
    this.audio = this.$el.querySelectorAll('audio')[0];
    this.audio.addEventListener('timeupdate', this.update);
    this.audio.addEventListener('loadeddata', this.load);
    this.audio.addEventListener('pause', () => { this.playing = false; });
    this.audio.addEventListener('play', () => { this.playing = true; });
    console.log(this.songs)

  },
  computed: {
    songs() {
      return this.$store.getters.getSongs;
    },
    canUpload() {
      return !!this.$store.getters.isLoggedIn;
    },
    currentTime() {
      return convertTimeHHMMSS(this.currentSeconds);
    },
    durationTime() {
      return convertTimeHHMMSS(this.durationSeconds);
    },
    percentComplete() {
      return parseInt(this.currentSeconds / this.durationSeconds * 100);
    },
    progressStyle() {
      return { width: `${this.percentComplete}%` };
    },
    volumeTitle() {
      return `Volume (${this.volume}%)`;
    }
  },
  created() {
    if (this.$store.getters.isLoggedIn) {
      this.$store.dispatch('fetchSongs')
    }
  },
  watch: {
    playing(value) {
      if (value) { return this.audio.play(); }
      this.audio.pause();
    },
    volume(value) {
      this.audio.volume = this.volume / 100;
    },
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
          await this.$store.dispatch('fetchSongs')
        }
      }
    },
    startUpload() {
      this.uploading = true
    },
    handleFileUpload() {
      this.file = this.$refs.songFile.files[0]
    },
    async uploadSong() {
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
    load() {
      if (this.audio.readyState >= 2) {
        this.loaded = true;
        this.durationSeconds = parseInt(this.audio.duration);
        return this.playing = true;
      }
      throw new Error('Failed to load sound file.');
    },
    seek(e) {
      if (!this.playing || e.target.tagName === 'SPAN') {
        return;
      }
      const el = e.target.getBoundingClientRect();
      const seekPos = (e.clientX - el.left) / el.width;
      const newTime = parseInt(this.audio.duration * seekPos) + ".0";
      this.audio.currentTime = newTime.toString()
    },
    stop() {
      this.playing = false;
      this.audio.currentTime = 0;
    },
    update(e) {
      this.currentSeconds = parseInt(this.audio.currentTime);
    },

    async playbackSong(song) {
      console.log('initiating track playback from url: ',song.url)
      this.loaded = false
      this.audio.src = song.url
      this.currentSong = song.url
      this.durationSeconds = Math.round(song.length_seconds)
      console.log('loaded song is ', this.durationSeconds, ' seconds long.')
      this.currentSeconds = 0
      this.playing = false

    }
  }

}
</script>

<style scoped lang="scss">
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
  width: 200px;
  margin-left: 10%;
}

.songNameLabel > span {
  font-size: medium;
}

.songTempoLabel {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  width: 5%;
  margin-left: 25px;
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

.deleteDiv {
  display: inline-block;
  vertical-align: middle;
  align-self: center;
  width: 5%;
}

.deleteButton {
  size: auto;
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

$player-bg: #fff;
$player-border-color: darken($player-bg, 12%);
$player-link-color: darken($player-bg, 75%);
$player-progress-color: $player-border-color;
$player-text-color: $player-link-color;
$player-seeker-color: $player-link-color;

.player-wrapper {
  align-items: center;
  background-color: $player-bg;
  display: flex;
  justify-content: center;
}

.player {
  background-color: $player-bg;
  border: 1px solid $player-border-color;
  border-radius: 5px;
  box-shadow: 0 5px 8px rgba(0,0,0,0.15);
  color: $player-text-color;
  display: inline-block;
  line-height: 1.5625;
}

.player-controls {
  display: flex;

  > div {
    border-right: 1px solid $player-border-color;

    &:last-child {
      border-right: none;
    }

    a {
      color: $player-link-color;
      display: block;
      line-height: 0;
      padding: 1em;
      text-decoration: none;

      svg {
        display: inline-block;
        width: 1.125rem;
      }
    }
  }
}
.player-progress {
  background-color: $player-progress-color;
  cursor: pointer;
  height: 50%;
  min-width: 200px;
  position: relative;

  .player-seeker {
    background-color: $player-seeker-color;
    bottom: 0;
    left: 0;
    position: absolute;
    top: 0;
  }
}

.player-time {
  display: flex;
  justify-content: space-between;

  .player-time-current {
    font-weight: 700;
    padding-left: 5px;
  }

  .player-time-total {
    opacity: 0.5;
    padding-right: 5px;
  }
}

.player-volume {
  display: inline-block;
  height: 1.1rem;
  margin: 0 0 0 2px;
  width: 6rem;
}

.collapsePlaceholder {
  display: inline-block;
  margin-left: 30px;
}

</style>