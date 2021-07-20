<template>
  <div>
    <div id="tableHeader">
      <div class="songDiv">
        <div class="mixNameLabel">
          <span>Mix Name</span>
        </div>
        <div class="mixNumSongsLabel">
          <span>Number of Songs</span>
        </div>
        <div class="mixLengthLabel">
          <span>Length</span>
        </div>

        <div class="mixTempoLabel">
          <span>Tempo</span>
        </div>
        <div class="mixProgress">
          <div class="progressPlaceholder"></div>
        </div>
        <div class="downloadDiv">
          <button class="downloadButtonPlaceholder">
            Download
          </button>
        </div>
      </div>
    </div>
    <v-expansion-panels>
      <v-expansion-panel v-for="mix in mixesWithProgress"
                         :key="mix.mix.id"
                         @click="playbackMix(mix.mix)">
        <v-expansion-panel-header>
          <div class="songDiv">
            <div class="mixNameLabel">{{mix.mix.title}}</div>
            <div class="mixNumSongsLabel">{{mix.mix.numSongs}}</div>
            <div class="mixLengthLabel">{{mix.mix.length_seconds}}</div>
            <div class="mixTempoLabel">{{mix.mix.tempo}}</div>
            <vue-ellipse-progress :progress="mix.progress"
                                  :legend="true"
                                  :legend-value="mix.progress"
                                  :size="50"
                                  color="#76b900"
                                  class="mixProgress">
            </vue-ellipse-progress>
            <div class="downloadDiv">
              <button class="downloadButton"
                      :disabled="mix.progress < 100"
                      @click="downloadMix(mix.mix)">
                Download
              </button>
            </div>

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
                    <div class="player-timeline">
                      <div :style="progressStyle" class="player-progress"></div>
                      <div v-on:click="seek" class="player-seeker" title="Seek"></div>
                    </div>
                    <div class="player-time">
                      <div class="player-time-current">{{ currentSeconds | convertTimeHHMMSS(currentSeconds)}}</div>
                      <div class="player-time-total">{{ durationSeconds | convertTimeHHMMSS(durationSeconds) }}</div>
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
            <button class="deleteButton" v-on:click="deleteMix(mix.mix)">
              Delete
            </button>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <audio ref="audio" id="audio-driver" :src="currentMix" v-on:timeupdate="update" v-on:loadeddata="load" v-on:pause="playing = false" v-on:seek="playing = true" preload="auto" style="display: none;"></audio>
  </div>
</template>

<script>
import Mix from "@/model/Mix";
import DataService from "@/services/DataService";
// TODO unfold for songs in mix, mix playback
export default{
  data(){
    return {
      defaultSong:
          "https://res.cloudinary.com/dmf10fesn/video/upload/v1548882863/audio/Post_Malone_-_Wow._playvk.com.mp3",
      currentMix: '',
      currentSeconds: 0,
      durationSeconds: 0,
      loaded: false,
      playing: false,
      previousVolume: 35,
      showVolume: false,
      volume: 100
    }
  },
  mounted() {
    console.log(this.mixes)
  },
  computed: {
    mixes(){
      return this.$store.getters.getMixes;
    },
    mixesWithProgress() {
      const mixesWithProg = []
      for (let i = 0, len = this.mixes.length; i < len; i++){
        if (this.mixes[i] !== null){
          mixesWithProg.push({
            mix: this.mixes[i],
            progress: this.mixes[i].progress
          })
        }
      }
      return mixesWithProg
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
      this.$store.dispatch('fetchMixes')
    }
    this.pollMixes()
  },
  filters: {
    convertTimeHHMMSS(val) {
      console.log('incoming time (s): ', val)
      let hhmmss = new Date(0).toISOString().substr(11, 8)
      if (!isNaN(val)){
        hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
      }
      return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
    }
  },
  methods: {
    async pollMixes() {
      setInterval(() => {
        if (this.mixes.filter(x => x.progress < 0).size > 0){
          this.$store.dispatch('fetchMixes')
        }
      }, 60000)
    },
    async deleteMix(mix){
      if (confirm("Do you really want to delete Mix "+mix.title+"?")){
        const delete_response = await DataService.deleteMix(mix.id)
        if (delete_response === undefined)
          alert("Mix Deletion failed")
        else {
          console.log(delete_response)
          await this.$store.commit('deleteMix', mix)
        }
      }
    },
    async downloadMix(mix){
      console.log(mix)
      const download_response = await DataService.getMixFile(mix.title_mp3)
      if (download_response === undefined)
        alert("Mix Download failed")
      else {
        console.log(download_response)
        let blob = new Blob([download_response.data])
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.setAttribute('download', mix.title_mp3)
        document.body.appendChild(link)
        link.click()
      }
    },
    load() {
      if (this.$refs.audio.readyState >= 2) {
        this.loaded = true;
        return this.playing = false;
      }
      throw new Error('Failed to load sound file.');
    },
    seek(e) {
      if (!this.loaded) return;
      const bounds = e.target.getBoundingClientRect();
      const seekPos = (e.clientX - bounds.left) / bounds.width;
      const currentDuration = this.durationSeconds
      const newTime = parseInt(currentDuration * seekPos);
      console.log('new currentTime: ', newTime)
      let player = document.getElementById('audio-driver')
      player.currentTime = newTime;
      console.log(player.currentTime)
    },
    stop() {
      this.playing = false;
      this.$refs.audio.currentTime = 0;
    },
    update(e) {
      this.currentSeconds = parseInt(this.$refs.audio.currentTime);
    },
    async playbackMix(mix) {
      console.log('initiating mix playback from url: ',mix.url)
      console.log(this.mixes)
      this.$refs.audio.src = mix.url
      this.currentMix = mix.url
      this.durationSeconds = Math.round(mix.length_seconds)
      console.log('loaded mix is ', this.durationSeconds, ' seconds long.')
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
.songDiv{
  width: 100%;
  margin-bottom: 20px;
}
.mixNameLabel{
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  margin-left: 10%;
  width: 200px;
}
.mixTempoLabel{
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  align-content: center;
  font-size: small;
  width: 50px;
  margin-left: 10px;
}
.mixLengthLabel{
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  align-content: center;
  font-size: small;
  width: 50px;
  margin-left: 10px;
}
.mixNumSongsLabel{
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  font-size: small;
  width: 50px;
  margin-left: 10px;
  align-content: center;
}
.mixProgress{
  align-content: center;
  display: inline-block;
  vertical-align: middle;
  margin-left: 20px;
  margin-right: 20px;
}
.progressPlaceholder{
  width: 50px;
}
.downloadButton{
  display: inline-block;
  vertical-align: middle;
  color: white;
  font-size: 16px;
  background-color: #00b9ff;
  margin: 20px;
  padding: 10px 20px;
  border-radius: 4px;
}
.downloadButton:disabled{
  color: white;
  font-size: 16px;
  background-color: grey;
  margin: 20px;
  padding: 10px 20px;
  border-radius: 4px;
}
.downloadButtonPlaceholder {
  color: white;
  font-size: 16px;
  background-color: white;
  margin: 20px;
  padding: 10px 20px;
  border-radius: 4px;
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
$player-bg: #fff;
$player-border-color: darken($player-bg, 12%);
$player-link-color: darken($player-bg, 75%);
$player-progress-color: $player-link-color;
$player-text-color: $player-link-color;
$player-timeline-color: $player-border-color;

.player {
  background-color: $player-bg;
  border-radius: 5px;
  border: 1px solid $player-border-color;
  box-shadow: 0 5px 8px rgba(0,0,0,0.15);
  color: $player-text-color;
  display: inline-block;
  line-height: 1.5625;
  position: relative;
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
.player-timeline {
  background-color: $player-timeline-color;
  height: 50%;
  min-width: 200px;
  position: relative;

  .player-progress,
  .player-seeker {
    bottom: 0;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
  }

  .player-progress {
    background-color: $player-progress-color;
    z-index: 1;
  }

  .player-seeker {
    cursor: pointer;
    width: 100%;
    z-index: 2;
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
</style>