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
      <div v-if="length1 > 0">
        <input type="range"
               v-model="exitPoint"
               max="100"
               min="1"
               hint="Exit Point"
               class="entryPointSlider"/>
        <label class="entryPointLabel">
          {{ convertExitPoint }}
        </label>
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
      <div v-if="length2 > 0">
        <input type="range"
               v-model="entryPoint"
               max="100"
               min="0"
               hint="Entry Point"
               class="entryPointSlider"/>
        <label class="entryPointLabel">
          {{ convertEntryPoint }}
        </label>
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
              Each Scenario represents volume control for both tracks' High-, Mid- and Low-Frequency-Bands, similar to
              how a Three-Band-EQ functions in standard DJ equipment.
            </label>
          </div>
        </div>
        <div class="scenarioLegend">
          <img width="140px"
               height="140px"
               src="@/assets/legend.png"/>
        </div>
      </div>
      <div>
        <div class="scenarioBlock">
          <button class="scenarioButton"
                  v-on:click="selectScenario('EQ_1.0')"
                  :disabled="scenario === 'EQ_1.0'">
            <img class="scenarioPreview" src="@/assets/EQ_01.png"/>
          </button>
        </div>
        <div class="scenarioBlock">
          <button class="scenarioButton"
                  v-on:click="selectScenario('EQ_2.0')"
                  :disabled="scenario === 'EQ_2.0'">
            <img class="scenarioPreview" src="@/assets/EQ_02.png"/>
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
            <img class="scenarioPreview" src="@/assets/VFF_nocut.png"/>
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
  </div>
</template>

<script>
import Song from '../model/Song'
import Mix from '../model/Mix'
import {v4 as uuidv4} from 'uuid'
import LoginState from "@/components/LoginState";

export default {
  components: {LoginState},
  data() {
    return {
      selected1: new Song("stub", 0.0, 0.0, "0"),
      tempo1: 0.0,
      length1: 0.0,
      numSongs1: 0,
      selected2: new Song("stub", 0.0, 0.0, "0"),
      tempo2: 0.0,
      length2: 0.0,
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
    }
  },
  computed: {
    convertExitPoint() {
      return (this.exitPoint / 100);
    },
    convertEntryPoint() {
      return (this.entryPoint / 100);
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
      let adjustedSong2Length = (this.tempo1 / this.tempo2) * this.length2;
      adjustedSong2Length = Math.round(adjustedSong2Length * 100) / 100
      return this.length1 + adjustedSong2Length;
    },
    newMix() {
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
      if (this.length1 > 0) numSongs++;
      if (this.length2 > 0) numSongs++;
      if (numSongs === 2) {
        this.songsSelected = true

      }
    },
    selectScenario(pName) {
      this.scenario = pName;
      this.previewSelected = true;
    },
    submit() {
      this.submitted = true;
      this.$store.dispatch('fakeProgress')
      let newMix = new Mix(this.mixName, this.newMixLength, this.mixNumSongs, this.mixTempo, uuidv4(), 1)
      this.$store.dispatch('submitMix', {newMix})
    }
  },
  // beforeCreate() {
  //   this.$store.dispatch('fetchMixes')
  //   this.$store.dispatch('fetchAvailableMixes')
  // }
}
</script>

<style scoped>
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
  background: #d3d3d3; /* Grey background */
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
  background: #4CAF50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.entryPointSlider::-moz-range-thumb {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #4CAF50; /* Green background */
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
  background-color: lightgray;
  width: 100%;
  margin: 10px;
  border-radius: 4px;
}

.scenarioButton:disabled {
  background-color: white;
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
</style>