<template>
  <div>
    <div class="spacer"/>
    <div id="songSelect">
      <div class="stepDescription">
        <span>1. Select Songs for the new Mix</span>
      </div>
      <div>
        <select v-model="selected1"
                @change="selectFirstSong"
                class="audioSelect"
                outlined>
          <option v-for="song in songs"
                  :key="song.id"
                  :value="song">{{ song.title }}
          </option>
          <option v-for="mix in mixes"
                  :key="mix.id"
                  :value="mix">{{ mix.title }}
          </option>
        </select>
        <label class="songInfo">tempo: {{ tempo1 }}</label>
        <label class="songInfo">length: {{ length1 }}</label>
        <label class="songInfo">number of songs: {{ numSongs1 }}</label>
      </div>
      <div v-if="length1 !== 0">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <input type="range"
                   v-model="exitPoint"
                   max="100"
                   min="1"
                   v-bind="attrs"
                   v-on="on"
                   class="entryPointSlider"/>
          </template>
          <span>
            Control what part of the first track will be considered for beginning the transition
          </span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
                v-bind="attrs"
                v-on="on">
              {{ convertExitPoint }}
            </span>
          </template>
          <span>The last {{ convertExitPointPercent }}% of the first track will be scanned for usable transition areas</span>
        </v-tooltip>
      </div>
      <div>
        <select v-model="selected2"
                @change="selectSecondSong"
                class="audioSelect"
                outlined>
          <option v-for="song in songs"
                  :key="song.id"
                  :value="song">{{ song.title }}
          </option>
          <option v-for="mix in mixes"
                  :key="mix.id"
                  :value="mix">{{ mix.title }}
          </option>
        </select>
        <label class="songInfo">tempo: {{ tempo2 }}</label>
        <label class="songInfo">length: {{ length2 }}</label>
        <label class="songInfo">number of songs: {{ numSongs2 }}</label>
      </div>
      <div v-if="length2 !== 0">
        <v-slider
            max="100"
            min="0"
            hint="Entry Point"
            :color="entryPointSliderColors.entry"
            :track-color="entryPointSliderColors.trail"
            :thumb-color="sliderThumbColor"
            v-model="entryPoint"
            class="entryPointSlider">

        </v-slider>
<!--        <v-tooltip bottom>-->
<!--          <template v-slot:activator="{ on, attrs }">-->
<!--            <input type="range"-->
<!--                   v-model="entryPoint"-->
<!--                   max="100"-->
<!--                   min="0"-->
<!--                   v-bind="attrs"-->
<!--                   v-on="on"-->
<!--                   class="entryPointSlider"/>-->
<!--          </template>-->
<!--          <span>Control what part of the second Track will be used in the transition</span>-->
<!--        </v-tooltip>-->

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <span class="entryPointLabel"
                  v-bind="attrs"
                  v-on="on">
              {{convertEntryPoint}}
            </span>
          </template>
          <span>The first {{convertEntryPointPercent}}% of the second track will be scanned for usable transition areas</span>
        </v-tooltip>

      </div>
      <div class="tempoOverride">
        <label class="tempoOverrideLabel">Override Mix Tempo?</label>
        <input type="checkbox" class="tempoOverrideCheck" v-model="tempoOverride"/>
        <input class="tempoOverrideInput" v-model="mixTempo" :placeholder="mixTempo"
               :disabled="tempoOverride === false"/>
      </div>
    </div>
    <div id="previewSelect"
         v-if="songsSelected"
         v-smoothscroll="{duration: 500, context: undefined, axis:'y'}">
      <div class="stepDescription">
        <span>2. Select a Mix Scenario</span>
      </div>
      <div>
        <div class="scenarioExplanation">
          <div>
            <label class="scenarioExplanationLabel">
              Select one of the available pre-defined Mix Scenarios with the Buttons below.
            </label>
          </div>
          <div>
            <label>
              Each Scenario represents volume control for both tracks' High-, Mid- and Low-Frequency-Bands.
            </label>
          </div>
        </div>
        <div class="scenarioLegend">
          <img src="@/assets/legend.png"/>
        </div>
      </div>
      <div>

        <div class="scenarioBlock">
          <button class="scenarioButton"
                  v-on:click="selectScenario('EQ_1.0')"
                  :disabled="scenario === 'EQ_1.0'">
            <img class="scenarioPreview" src="@/assets/EQ.png"/>
          </button>
          <div v-if="scenario==='EQ_1.0'">
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
            </div>
          </div>
        </div>
        <div class="scenarioBlock">
          <button class="scenarioButton"
                  v-on:click="selectScenario('EQ_1.1')"
                  :disabled="scenario === 'EQ_1.1'">
            <img class="scenarioPreview" src="@/assets/EQ_cut.png"/>
          </button>
        </div>
        <div>
          <div class="scenarioName">
            <label>Three-Band-EQ 1</label>
          </div>
          <div class="scenarioName">
            <label>Three-Band-EQ 2 (Bass Cut)</label>
          </div>
        </div>
      </div>
      <div>
        <div class="scenarioBlock">
          <button class="scenarioButton"
                  v-on:click="selectScenario('VFF_1.0')"
                  :disabled="scenario === 'VFF_1.0'">
            <img class="scenarioPreview" src="@/assets/VFF.png"/>
          </button>
        </div>
        <div class="scenarioBlock">
          <button class="scenarioButton"
                  v-on:click="selectScenario('VFF_1.1')"
                  :disabled="scenario === 'VFF_1.1'">
            <img class="scenarioPreview" src="@/assets/VFF_cut.png"/>
          </button>
        </div>
      </div>
      <div>
        <div class="scenarioName">
          <label>Volumetric Fade 1</label>
        </div>
        <div class="scenarioName">
          <label>Volumetric Fade 2 (Bass Cut)</label>
        </div>
      </div>
    </div>
    <div id="mixNameAndSend"
         v-if="previewSelected"
         v-smoothscroll="{duration: 500, context: undefined, axis:'y'}">
      <div class="stepDescription">
        <label>3. Name the Mix, Hit Submit and Download when it's ready</label>
      </div>
      <div class="flexContainer">
        <div class="mixSubmit">
          <input ref="mixName"
                 v-if="previewSelected"
                 class="mixNameInput"
                 v-model="mixName"
                 placeholder="Mix Name"/>
        </div>
        <div class="mixSubmit">
          <button class="submitButton"
                  :disabled="mixName===''"
                  v-on:click="submit">Submit
          </button>
        </div>
        <div v-if="submitted" class="mixProgress">
          <vue-ellipse-progress :progress="calcedProgress"
                                :legend-value="calcedProgress"
                                :size="50"
                                color="#76b900">

          </vue-ellipse-progress>
        </div>
        <div v-if="submitted" class="mixDownload">
          <button class="downloadButton"
                  :disabled="calcedProgress < 100">Download
          </button>
        </div>
      </div>
    </div>
    <audio ref="audio" id="audio-driver" :src="currentPreview" v-on:timeupdate="update" v-on:loadeddata="load" v-on:pause="playing = false" v-on:seek="playing = true" preload="auto" style="display: none;"></audio>
  </div>
</template>

<script>
import Song from '../model/Song'
import Mix from '../model/Mix'
import {v4 as uuidv4} from 'uuid'
import LoginState from "@/components/LoginState";
import DataService from "@/services/DataService";

// TODO hover slider explanation (text and slider)
// TODO hover tempo override (text and checkbox)
// TODO scenario preview clips with audio playback
// TODO adjust color scheme
export default {
  components: {LoginState},
  data() {
    return {
      selected1: new Song("stub", 0.0, 0.0, "0"),
      tempo1: 0.0,
      length1: 0,
      numSongs1: 0,
      selected2: new Song("stub", 0.0, 0.0, "0"),
      tempo2: 0.0,
      length2: 0,
      numSongs2: 0,
      yeOldeStub: "",
      songsSelected: false,
      previewSelected: false,
      scenario: "",
      mixName: "",
      submitted: false,
      tempoOverride: false,
      customTempo: 120.0,
      entryPoint: 30.0,
      exitPoint: 70.0,
      sliderThumbColor: '#20b900',
      exitPointSliderColors: {
        preface: '#8a9869',
        exit: '#76b900',
      },
      entryPointSliderColors: {
        entry: '#76b900',
        trail: '#c4d48a',
      },

      defaultPreview:
          "https://res.cloudinary.com/dmf10fesn/video/upload/v1548882863/audio/Post_Malone_-_Wow._playvk.com.mp3",
      currentPreview: '',
      currentSeconds: 0,
      durationSeconds: 0,
      loaded: false,
      playing: false,
      previousVolume: 35,
      showVolume: false,
      volume: 100

    }
  },
  computed: {
    convertExitPoint() {
      return (this.exitPoint / 100);
    },
    convertExitPointPercent() {
      return (this.exitPoint - 100)*-1;
    },
    convertEntryPoint() {
      return (this.entryPoint / 100);
    },
    convertEntryPointPercent() {
      return (this.exitPoint - 100)*-1;
    },
    songs() {
      return this.$store.state.songs;
    },
    mixes() {
      return this.$store.getters.getAvailableMixes
    },
    calcedProgress() {
      return this.$store.state.currentProgress;
    },
    mixNumSongs() {
      let numSongs1 = 1;
      let numSongs2 = 1;
      if (this.selected1 instanceof Mix) {
        numSongs1 = this.selected1.numSongs;
      }
      if (this.selected2 instanceof Mix) {
        numSongs2 = this.selected2.numSongs;
      }
      return numSongs1 + numSongs2;
    },
    mixTempo() {
      if (this.tempoOverride) {
        return this.customTempo;
      } else {
        return this.tempo1;
      }
    },
    newMixLength() {
      let adjustedSong2Length = (this.tempo2 / this.tempo1) * this.length2;
      adjustedSong2Length = Math.round(adjustedSong2Length * 100) / 100
      return this.length1 + adjustedSong2Length;
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
    this.$store.dispatch('fetchMixes')
    this.$store.dispatch('fetchSongs')
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
    selectFirstSong() {
      this.tempo1 = this.selected1.tempo
      this.length1 = this.selected1.length
      if (this.selected1 instanceof Mix) {
        this.numSongs1 = this.selected1.numSongs
      } else {
        this.numSongs1 = 1
      }
      this.checkSongSelection()

    },
    selectSecondSong() {
      this.tempo2 = this.selected2.tempo
      this.length2 = this.selected2.length
      if (this.selected2 instanceof Mix) {
        this.numSongs2 = this.selected2.numSongs
      } else {
        this.numSongs2 = 1
      }
      this.checkSongSelection()
    },
    checkSongSelection() {
      let numSongs = 0;
      if (this.length1 !== 0) numSongs++;
      if (this.length2 !== 0) numSongs++;
      if (numSongs === 2) {
        this.songsSelected = true

      }
    },
    selectScenario(pName) {
      this.scenario = pName;
      this.previewSelected = true;
      this.previewUrl = previewName
    },
    async submit() {
      this.submitted = true;
      const exitPoint = Math.round(((1-this.convertExitPoint) * 100)) / 100

      const submit_response = await DataService.createMix(this.mixName,
          this.selected1.title_wav,
          this.selected2.title_wav,
          this.scenario,
          this.mixTempo,
          this.numSongs1,
          this.numSongs2,
          this.convertEntryPoint,
          exitPoint)
      if (submit_response === undefined){
        alert("Mix Creation failed")
      } else {
        const mixId = submit_response.data.message.split(':')[1].trim()
        const newMix = new Mix(
            this.mixName,
            this.mixNumSongs,
            this.mixTempo,
            mixId,
            this.progress = 10
        )
        await this.$store.dispatch('submitMix', newMix)
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
    async playbackScenariosample(sample) {
      console.log('initiating mix playback from url: ',mix.url)
      console.log(this.mixes)
      this.$refs.audio.src = mix.url
      this.currentSong = mix.url
      this.durationSeconds = Math.round(mix.length_seconds)
      console.log('loaded mix is ', this.durationSeconds, ' seconds long.')
      this.currentSeconds = 0
      this.playing = false
    }
  },
}
</script>

<style scoped lang="scss">
.spacer {
  width: 100%;
  height: 30px;
}

.stepDescription {
  margin-bottom: 20px;
  margin-top: 20px;
}

.audioSelect {
  display: inline-block;
  vertical-align: middle;
  width: 200px;
  margin: 10px;
  outline-color: grey;
  outline-width: 1px;
  padding: 5px;
  background: lightgray;
}

.songInfo {
  display: inline-block;
  vertical-align: middle;
  width: 100px;
  text-align: center;
  margin-left: 5px;
  margin-right: 5px;
}

.entryPointSlider {
  -webkit-appearance: none; /* Override default CSS styles */
  appearance: none;
  height: 25px; /* Specified height */
  color: #76b900;
  //background: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
  display: inline-block;
  vertical-align: middle;
  width: 200px;
}

/* Mouse-over effects */
.entryPointSlider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
.entryPointSlider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #76b900; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.entryPointSlider::-moz-range-thumb {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #76b900; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.entryPointLabel {
  display: inline-block;
  vertical-align: middle;
  width: 40px;
  text-align: center;
}

.tempoOverride {
  margin-top: 10px;
  margin-bottom: 10px;
}

.tempoOverrideCheck {
  display: inline-block;
  vertical-align: middle;
  width: 40px;
  text-align: center;
}

.tempoOverrideInput {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  width: 35px;
}


.scenarioBlock {
  display: inline-block;
  height: 30%;
  width: 40%;
  margin: 10px;
}

.scenarioName {
  display: inline-block;
  height: 30px;
  width: 40%;
  align-content: center;
  text-align: center;
}

.scenarioExplanation {
  display: inline-block;
  width: 40%;
  height: 140px;
  margin-right: 10px;
  text-align: center;
}

.scenarioExplanationLabel {
  padding: 20px;
}

.scenarioLegend {
  display: inline-block;
  align-content: center;
}

.scenarioButton {
  background-color: transparent;
  outline: lightgrey;
  width: 100%;
  margin: 10px;
  border-radius: 4px;
}

.scenarioButton:disabled {
  outline: #76b900;
  background-color: transparent;
  width: 100%;
  margin: 10px;
}

.scenarioPreview {
  padding: 10px;
  height: 100%;
  width: 100%;
  align-content: center;
}

.mixNameInput {
  align-content: center;
  flex-basis: 100px;
}

.mixSubmit {
  margin: 10px;
  display: inline-block;
  vertical-align: middle;
}

.submitButton {
  color: white;
  font-size: 16px;
  background-color: #00b9ff;
  margin: 20px;
  padding: 15px 30px;
  border-radius: 4px;
}

.submitButton:disabled {
  color: white;
  font-size: 16px;
  background-color: grey;
  margin: 20px;
  padding: 10px 20px;
  border-radius: 4px;
}

.mixProgress {
  display: inline-block;
  vertical-align: middle;
}

.mixDownload {
  margin: 10px;
  display: inline-block;
  vertical-align: middle;
}

.downloadButton {
  color: white;
  font-size: 16px;
  background-color: #00b9ff;
  margin: 20px;
  padding: 15px 30px;
  border-radius: 4px;
}

.downloadButton:disabled {
  color: white;
  font-size: 16px;
  background-color: grey;
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