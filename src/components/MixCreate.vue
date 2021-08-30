<template>
  <div>
    <div class="spacer"/>
    <div id="songSelect">
      <div class="stepDescription">
        <span>1. Select Songs for the new Mix</span>
      </div>
      <div id="track1select">
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
        <v-tooltip bottom :nudge-top="10">
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs"
                 v-on="on"
                 class="entryPointSlider">
              <v-slider
                  max="100"
                  min="0"
                  hint="Entry Point"
                  :color="exitPointSliderColors.preface"
                  :track-color="exitPointSliderColors.exit"
                  :thumb-color="sliderThumbColor"
                  v-model="exitPoint"/>
            </div>

          </template>
          <span>
            Control what part of the first track will be considered for beginning the transition
          </span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs"
                 v-on="on"
                 class="sliderControl">
              <span>
                {{ convertExitPoint }}
              </span>
            </div>
          </template>
          <span>The last {{
              convertExitPointPercent
            }}% of the first track will be scanned for usable transition areas</span>
        </v-tooltip>
      </div>
      <div id="track2select">
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
        <v-tooltip bottom :nudge-top="10">
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs"
                 v-on="on"
                 class="entryPointSlider">
              <v-slider
                  max="100"
                  min="0"
                  hint="Entry Point"
                  :color="entryPointSliderColors.entry"
                  :track-color="entryPointSliderColors.trail"
                  :thumb-color="sliderThumbColor"
                  v-model="entryPoint"/>
            </div>
          </template>
          <span>Control what part of the second Track will be used in the transition</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <span class="entryPointLabel"
                  v-bind="attrs"
                  v-on="on">
              {{ convertEntryPoint }}
            </span>
          </template>
          <span>The first {{ convertEntryPointPercent }}% of the second track will be scanned for usable transition areas</span>
        </v-tooltip>

      </div>
      <div class="spacer"></div>
      <div id="tempoOverride">
        <div class="tempoOverride">
          <v-tooltip bottom nudge-top="5">
            <template v-slot:activator="{ on, attrs }">
              <div class="tempoOverrideLabel"
                   v-bind="attrs"
                   v-on="on">

                <label>
                  Override Mix Tempo?
                </label>
              </div>

            </template>
            <span>You may override the Results tempo to your desired BPM. By default, the first tracks' tempo is used.</span>
          </v-tooltip>
        </div>
        <div class="tempoOverride">
          <input type="checkbox" class="tempoOverrideCheck" v-model="tempoOverride"/>
        </div>
        <v-tooltip bottom
                   :disabled="tempoOverride === false"
                   nudge-top="5">
          <template v-slot:activator="{ on, attrs }">
            <div class="tempoOverride"
                 v-bind="attrs"
                 v-on="on">
              <input class="tempoOverrideInput"
                     v-model="mixTempo"
                     :placeholder="mixTempo"
                     :disabled="tempoOverride === false"/>
            </div>
          </template>
          <span>Enter the BPM you want the resulting mix to have.</span>
        </v-tooltip>
      </div>
    </div>
    <div id="previewSelect"
         v-if="songsSelected"
         v-smoothscroll="{duration: 500, context: undefined, axis:'y'}">
      <div class="stepDescription">
        <span>2. Select a Mix Scenario</span>
      </div>
      <div class="scenarioLegend">
        <div class="scenarioExplanation">
          <div>
            <label class="scenarioExplanationLabel">
              Select one of the available pre-defined Mix Scenarios with the Buttons below.
            </label>
          </div>
          <div>
            <label class="scenarioExplanationLabel">
              Each Scenario represents volume control for both tracks' High-, Mid- and Low-Frequency-Bands.
            </label>
          </div>
        </div>
      </div>
      <div id="scenarioBlocks1">
        <div class="scenarioBlock">
          <button class="scenarioButton"
                  v-on:click="selectScenario('EQ_1.0')"
                  :disabled="scenario === 'EQ_1.0'">
            EQ_1.0
          </button>
          <div v-if="scenario==='EQ_1.0'">
            <v-tooltip top nudge-bottom="10">
              <template v-slot:activator="{ on, attrs }">
                <img class="scenarioPreview" src="@/assets/EQ.png"
                     v-bind="attrs"
                     v-on="on"/>
              </template>
              <img src="@/assets/legend.png"
                   class="scenarioLegendImage"/>
            </v-tooltip>
            <div>Audio Sample for EQ 1 Transition</div>
            <div id="audio-player1" class="player-wrapper">
              <div class="player">
                <div class="player-controls">
                  <div id="play1">
                    <a v-on:click.prevent="playing = !playing" :title="(playing) ? 'Pause' : 'Play'" href="#">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path v-if="!playing" fill="currentColor"
                              d="M15,10.001c0,0.299-0.305,0.514-0.305,0.514l-8.561,5.303C5.51,16.227,5,15.924,5,15.149V4.852c0-0.777,0.51-1.078,1.135-0.67l8.561,5.305C14.695,9.487,15,9.702,15,10.001z"/>
                        <path v-else fill="currentColor"
                              d="M15,3h-2c-0.553,0-1,0.048-1,0.6v12.8c0,0.552,0.447,0.6,1,0.6h2c0.553,0,1-0.048,1-0.6V3.6C16,3.048,15.553,3,15,3z M7,3H5C4.447,3,4,3.048,4,3.6v12.8C4,16.952,4.447,17,5,17h2c0.553,0,1-0.048,1-0.6V3.6C8,3.048,7.553,3,7,3z"/>
                      </svg>
                    </a>
                  </div>
                  <div id="seek1">
                    <div v-on:click="seek" class="player-progress" title="Time played : Total time">
                      <div :style="{ width: percentComplete + '%' }" class="player-seeker"></div>
                    </div>
                    <div class="player-time">
                      <div class="player-time-current">{{ currentTime }}</div>
                      <div class="player-time-total">{{ durationTime }}</div>
                    </div>
                  </div>
                  <div id="volume1">
                    <a v-on:click.prevent="" v-on:mouseenter="showVolume = true" v-on:mouseleave="showVolume = false"
                       :title="volumeTitle" href="#">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path fill="currentColor"
                              d="M19,13.805C19,14.462,18.462,15,17.805,15H1.533c-0.88,0-0.982-0.371-0.229-0.822l16.323-9.055C18.382,4.67,19,5.019,19,5.9V13.805z"/>
                      </svg>
                      <input v-model.lazy.number="volume" v-show="showVolume" class="player-volume" type="range" min="0"
                             max="100"/>
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
            EQ_1.1
          </button>
          <div v-if="scenario==='EQ_1.1'">
            <v-tooltip top nudge-bottom="10">
              <template v-slot:activator="{ on, attrs }">
                <img class="scenarioPreview" src="@/assets/EQ_cut.png"
                     v-bind="attrs"
                     v-on="on"/>
              </template>
              <img src="@/assets/legend.png"
                   class="scenarioLegendImage"/>
            </v-tooltip>
            <div>Audio Sample for EQ 1.1 Transition</div>
            <div id="audio-player2" class="player-wrapper">
              <div class="player">
                <div class="player-controls">
                  <div id="play2">
                    <a v-on:click.prevent="playing = !playing" :title="(playing) ? 'Pause' : 'Play'" href="#">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path v-if="!playing" fill="currentColor"
                              d="M15,10.001c0,0.299-0.305,0.514-0.305,0.514l-8.561,5.303C5.51,16.227,5,15.924,5,15.149V4.852c0-0.777,0.51-1.078,1.135-0.67l8.561,5.305C14.695,9.487,15,9.702,15,10.001z"/>
                        <path v-else fill="currentColor"
                              d="M15,3h-2c-0.553,0-1,0.048-1,0.6v12.8c0,0.552,0.447,0.6,1,0.6h2c0.553,0,1-0.048,1-0.6V3.6C16,3.048,15.553,3,15,3z M7,3H5C4.447,3,4,3.048,4,3.6v12.8C4,16.952,4.447,17,5,17h2c0.553,0,1-0.048,1-0.6V3.6C8,3.048,7.553,3,7,3z"/>
                      </svg>
                    </a>
                  </div>
                  <div id="seek2">
                    <div v-on:click="seek" class="player-progress" title="Time played : Total time">
                      <div :style="{ width: percentComplete + '%' }" class="player-seeker"></div>
                    </div>
                    <div class="player-time">
                      <div class="player-time-current">{{ currentTime }}</div>
                      <div class="player-time-total">{{ durationTime }}</div>
                    </div>
                  </div>
                  <div id="volume2">
                    <a v-on:click.prevent="" v-on:mouseenter="showVolume = true" v-on:mouseleave="showVolume = false"
                       :title="volumeTitle" href="#">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path fill="currentColor"
                              d="M19,13.805C19,14.462,18.462,15,17.805,15H1.533c-0.88,0-0.982-0.371-0.229-0.822l16.323-9.055C18.382,4.67,19,5.019,19,5.9V13.805z"/>
                      </svg>
                      <input v-model.lazy.number="volume" v-show="showVolume" class="player-volume" type="range" min="0"
                             max="100"/>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="scenarioNames1">
        <div class="scenarioName">
          <label>Three-Band-EQ 1</label>
        </div>
        <div class="scenarioName">
          <label>Three-Band-EQ 2 (Bass Cut)</label>
        </div>
      </div>
      <div id="scenarioBlocks2">
        <div class="scenarioBlock">
          <button class="scenarioButton"
                  v-on:click="selectScenario('VFF_1.0')"
                  :disabled="scenario === 'VFF_1.0'">
            VFF_1.0
          </button>
          <div v-if="scenario==='VFF_1.0'">
            <v-tooltip top nudge-bottom="10">
              <template v-slot:activator="{ on, attrs }">
                <img class="scenarioPreview" src="@/assets/VFF.png"
                     v-bind="attrs"
                     v-on="on"/>
              </template>
              <img src="@/assets/legend.png"
                   class="scenarioLegendImage"/>
            </v-tooltip>
            <div>Audio Sample for VFF 1 Transition</div>
            <div id="audio-player3" class="player-wrapper">
              <div class="player">
                <div class="player-controls">
                  <div id="play3">
                    <a v-on:click.prevent="playing = !playing" :title="(playing) ? 'Pause' : 'Play'" href="#">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path v-if="!playing" fill="currentColor"
                              d="M15,10.001c0,0.299-0.305,0.514-0.305,0.514l-8.561,5.303C5.51,16.227,5,15.924,5,15.149V4.852c0-0.777,0.51-1.078,1.135-0.67l8.561,5.305C14.695,9.487,15,9.702,15,10.001z"/>
                        <path v-else fill="currentColor"
                              d="M15,3h-2c-0.553,0-1,0.048-1,0.6v12.8c0,0.552,0.447,0.6,1,0.6h2c0.553,0,1-0.048,1-0.6V3.6C16,3.048,15.553,3,15,3z M7,3H5C4.447,3,4,3.048,4,3.6v12.8C4,16.952,4.447,17,5,17h2c0.553,0,1-0.048,1-0.6V3.6C8,3.048,7.553,3,7,3z"/>
                      </svg>
                    </a>
                  </div>
                  <div id="seek3">
                    <div v-on:click="seek" class="player-progress" title="Time played : Total time">
                      <div :style="{ width: percentComplete + '%' }" class="player-seeker"></div>
                    </div>
                    <div class="player-time">
                      <div class="player-time-current">{{ currentTime }}</div>
                      <div class="player-time-total">{{ durationTime }}</div>
                    </div>
                  </div>
                  <div id="volume3">
                    <a v-on:click.prevent="" v-on:mouseenter="showVolume = true" v-on:mouseleave="showVolume = false"
                       :title="volumeTitle" href="#">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path fill="currentColor"
                              d="M19,13.805C19,14.462,18.462,15,17.805,15H1.533c-0.88,0-0.982-0.371-0.229-0.822l16.323-9.055C18.382,4.67,19,5.019,19,5.9V13.805z"/>
                      </svg>
                      <input v-model.lazy.number="volume" v-show="showVolume" class="player-volume" type="range" min="0"
                             max="100"/>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="scenarioBlock">
          <button class="scenarioButton"
                  v-on:click="selectScenario('VFF_1.1')"
                  :disabled="scenario === 'VFF_1.1'">
            VFF_1.1
          </button>
          <div v-if="scenario==='VFF_1.1'">
            <v-tooltip top nudge-bottom="10">
              <template v-slot:activator="{ on, attrs }">
                <img class="scenarioPreview" src="@/assets/VFF_cut.png"
                     v-bind="attrs"
                     v-on="on"/>
              </template>
              <img src="@/assets/legend.png"
                   class="scenarioLegendImage"/>
            </v-tooltip>
            <div>Audio Sample for VFF 1.1 Transition</div>
            <div id="audio-player4" class="player-wrapper">
              <div class="player">
                <div class="player-controls">
                  <div id="play4">
                    <a v-on:click.prevent="playing = !playing" :title="(playing) ? 'Pause' : 'Play'" href="#">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path v-if="!playing" fill="currentColor"
                              d="M15,10.001c0,0.299-0.305,0.514-0.305,0.514l-8.561,5.303C5.51,16.227,5,15.924,5,15.149V4.852c0-0.777,0.51-1.078,1.135-0.67l8.561,5.305C14.695,9.487,15,9.702,15,10.001z"/>
                        <path v-else fill="currentColor"
                              d="M15,3h-2c-0.553,0-1,0.048-1,0.6v12.8c0,0.552,0.447,0.6,1,0.6h2c0.553,0,1-0.048,1-0.6V3.6C16,3.048,15.553,3,15,3z M7,3H5C4.447,3,4,3.048,4,3.6v12.8C4,16.952,4.447,17,5,17h2c0.553,0,1-0.048,1-0.6V3.6C8,3.048,7.553,3,7,3z"/>
                      </svg>
                    </a>
                  </div>
                  <div id="seek4">
                    <div v-on:click="seek" class="player-progress" title="Time played : Total time">
                      <div :style="{ width: percentComplete + '%' }" class="player-seeker"></div>
                    </div>
                    <div class="player-time">
                      <div class="player-time-current">{{ currentTime }}</div>
                      <div class="player-time-total">{{ durationTime }}</div>
                    </div>
                  </div>
                  <div id="volume4">
                    <a v-on:click.prevent="" v-on:mouseenter="showVolume = true" v-on:mouseleave="showVolume = false"
                       :title="volumeTitle" href="#">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path fill="currentColor"
                              d="M19,13.805C19,14.462,18.462,15,17.805,15H1.533c-0.88,0-0.982-0.371-0.229-0.822l16.323-9.055C18.382,4.67,19,5.019,19,5.9V13.805z"/>
                      </svg>
                      <input v-model.lazy.number="volume" v-show="showVolume" class="player-volume" type="range" min="0"
                             max="100"/>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="scenarioNames2">
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
          <vue-ellipse-progress :progress="currentProgress"
                                :legend-value="currentProgress"
                                :size="50"
                                color="#76b900">

          </vue-ellipse-progress>
        </div>
        <div v-if="submitted" class="mixDownload">
          <button class="downloadButton"
                  @click="download(mixId)"
                  :disabled="currentProgress < 100">Download
          </button>
        </div>
      </div>
    </div>
    <div class="resetDiv" v-if="submitted">
      <div>
        <span>Mix was created and will be available for downloading here or in the Mix List view, where you'll also find Metadata for the Mix.  </span>
      </div>
      <button @click="reset" class="resetButton">
        <div>
          <span>Create new Mix</span>
        </div>
        <div>
          <img alt="reset" src="@/assets/icons8-refresh-24.png"/>
        </div>
      </button>
    </div>
    <audio ref="audio" id="audio-driver" :src="currentPreview" preload="none" style="display: none;"></audio>
  </div>
</template>

<script>

import Song from '../model/Song'
import Mix from '../model/Mix'
import {v4 as uuidv4} from 'uuid'
import LoginState from "@/components/LoginState";
import DataService from "@/services/DataService";

const API_URL = 'https://discgenius.f4.htw-berlin.de/';
// const API_URL = 'http://localhost:9001/';
const convertTimeHHMMSS = (val) => {
  let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);

  return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
};
// TODO fix scenario preview audio playback
// TODO fix progress bar not updating at all
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
      mixId: "",
      submitted: false,
      tempoOverride: false,
      customTempo: 120.0,
      entryPoint: 30.0,
      exitPoint: 70.0,
      sliderThumbColor: '#20b900',
      exitPointSliderColors: {
        preface: '#c4d48a',
        exit: '#76b900',
      },
      entryPointSliderColors: {
        entry: '#76b900',
        trail: '#c4d48a',
      },

      audio: undefined,

      currentPreview: '',
      currentSeconds: 0,
      durationSeconds: 0,
      loaded: false,
      playing: false,
      previousVolume: 20,
      showVolume: false,
      volume: 20,
      polling: false,
    }
  },
  mounted() {
    this.audio = this.$el.querySelectorAll('audio')[0];
    this.audio.addEventListener('timeupdate', this.update);
    this.audio.addEventListener('loadeddata', this.load);
    this.audio.addEventListener('pause', () => {
      this.playing = false;
    });
    this.audio.addEventListener('play', () => {
      this.playing = true;
    });
  },
  computed: {
    convertExitPoint() {
      return (this.exitPoint / 100);
    },
    convertExitPointPercent() {
      return (this.exitPoint - 100) * -1;
    },
    convertEntryPoint() {
      return (this.entryPoint / 100);
    },
    convertEntryPointPercent() {
      return (this.exitPoint - 100) * -1;
    },
    songs() {
      return this.$store.state.songs;
    },
    mixes() {
      return this.$store.getters.getAvailableMixes
    },
    currentProgress() {
      return this.$store.getters.getCurrentProgress
    },
    currentProgressPercent() {
      return this.$store.getters.getCurrentProgressPercent
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
      return {width: `${this.percentComplete}%`};
    },
    volumeTitle() {
      return `Volume (${this.volume}%)`;
    }
  },
  created() {
    if (this.$store.getters.isLoggedIn) {
      this.$store.dispatch('fetchMixes')
      this.$store.dispatch('fetchSongs')

    }
  },
  watch: {
    playing(value) {
      if (value) {
        return this.audio.play();
      }
      this.audio.pause();
    },
    volume(value) {
      this.audio.volume = this.volume / 100;
    },
  },
  methods: {
    reset() {
      this.submitted = false
      this.previewSelected = false
      this.scenario = ""
      this.currentPreview = ""
      this.mixName = ""
      this.songsSelected = false
      this.tempo1 = 0.0
      this.tempo2 = 0.0
      this.length1 = 0
      this.length2 = 0
      this.numSongs1 = 0
      this.numSongs2 = 0
      this.tempoOverride = false
      this.customTempo = 120.0
      this.entryPoint = 30.0
      this.exitPoint = 70.0
      this.polling = false;
    },
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
        this.scenario = 'EQ_1.0';
        this.playbackPreview('EQ_10.mp3')
        this.previewSelected = true;
      }
    },
    selectScenario(pName) {
      this.scenario = pName;
      this.previewSelected = true;
      const pFileName = pName.replace('.', '') + '.mp3'
      this.playbackPreview(pFileName)
    },
    async submit() {
      this.submitted = true;
      const exitPoint = Math.round(((1 - this.convertExitPoint) * 100)) / 100

      const submit_response = await DataService.createMix(this.mixName,
          this.selected1.title_wav,
          this.selected2.title_wav,
          this.scenario,
          this.mixTempo,
          this.numSongs1,
          this.numSongs2,
          this.convertEntryPoint,
          exitPoint)
      if (submit_response === undefined) {
        alert("Mix Creation failed")
      } else {
        this.mixId = submit_response.data.message.split(':')[2].trim()
        console.log('created mix object id: ', this.mixId)
        // await this.$store.dispatch('submitMix', mixId)
        this.polling = true
        await this.$store.commit('setProgress', 0)
        await this.pollMix(this.mixId)
      }
    },
    async pollMix(id) {
      setInterval(() => {
        if (this.currentProgress < 100) {
          if (this.polling){
            this.$store.dispatch('fetchMix', id)
          } else {
            this.polling = false
          }
        }
      }, 60000)
    },
    async download(id) {
      const mix_response = await DataService.getMix(id)
      if (mix_response === undefined)
        alert("Mix Not Found")
      else {
        console.log(mix_response)
        const mix_title_mp3 = mix_response.data.data[0].title_mp3
        const download_response = await DataService.getMixFile(mix_title_mp3)
        if (download_response === undefined)
          alert("Mix Download failed")
        else {
          let blob = new Blob([download_response.data])
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.setAttribute('download', mix_title_mp3)
          document.body.appendChild(link)
          link.click()
        }
      }
    },
    // audio player methods
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
      console.log(newTime.toString())
      this.audio.currentTime = newTime.toString()
    },
    stop() {
      this.playing = false;
      this.audio.currentTime = 0;
    },
    update(e) {
      this.currentSeconds = parseInt(this.audio.currentTime);
    },
    async playbackPreview(preview) {
      const preview_url = API_URL + "mixPreview/" + preview
      // const preview_url = '@/assets/preview_'+preview+'.mp3'
      console.log('initiating preview playback from url: ', preview_url)
      this.loaded = false
      this.audio.src = preview_url
      this.currentPreview = preview_url
      this.durationSeconds = Math.round(47.0)
      console.log('loaded preview is ', this.durationSeconds, ' seconds long.')

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
  outline-color: darkgray;
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
  height: 30px; /* Specified height */
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

.sliderControl {
  display: inline-block;
  vertical-align: middle;
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
  display: inline-block;
  vertical-align: middle;
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
  padding: 4px;
  border-radius: 5px;
  outline: lightgrey solid thin;
}

.scenarioBlock {
  display: inline-block;
  align-content: center;
  align-items: center;
  horiz-align: center;
  height: 30%;
  width: 40%;
  margin: 10px;
  outline: #e9f1e2 solid 2px;
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
  width: 75%;
  margin-right: 10px;
  text-align: center;
  align-content: center;
  vertical-align: middle;
}

.scenarioExplanationLabel {
  padding: 20px;
  display: inline-block;
  align-content: center;
}

.scenarioLegend {
  display: inline-block;
  align-content: center;
}

.scenarioLegendImage {
  display: inline-block;
  align-content: center;
  vertical-align: middle;
  width: 70%;
}

.scenarioButton {
  background-color: transparent;
  vertical-align: top;
  outline: darkgray;
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
  padding-left: 2px;
  padding-right: 2px;
  height: 100%;
  width: 100%;
  horiz-align: center;
  align-content: center;
  margin-right: 10px;
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

.selectScenarioButton {
  color: white;
  font-size: 16px;
  background-color: #76b900;
  margin: 20px;
  padding: 15px 10px;
  border-radius: 4px;
  display: inline-block;
  align-content: center;
}

.resetDiv {
  align-content: center;
}

.resetButton {
  display: inline-block;
  vertical-align: middle;
  align-self: center;
  font-size: 16px;
  background-color: white;
  margin: 20px;
  border-radius: 4px;
  width: 100px;
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
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.15);
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
</style>