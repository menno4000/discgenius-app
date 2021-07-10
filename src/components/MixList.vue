<template>
  <v-expansion-panels>
    <v-expansion-panel v-for="mix in mixesWithProgress" :key="mix.mix.id">
      <v-expansion-panel-header>
        <div class="songDiv">
          <div class="mixNameLabel">{{mix.mix.title}}</div>
          <div class="mixNumSongsLabel">{{mix.mix.numSongs}}</div>
          <div class="mixLengthLabel">{{mix.mix.length}}</div>
          <div class="mixTempoLabel">{{mix.mix.tempo}}</div>
          <vue-ellipse-progress :progress="mix.progress"
                                :legend="true"
                                :legend-value="mix.progress"
                                :size="50"
                                color="#76b900"
                                class="mixProgress">
          </vue-ellipse-progress>
          <button class="downloadButton"
                  :disabled="mix.progress < 100"
                  @click="downloadMix(mix.mix)">
            Download
          </button>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div class="songDiv">
          <button class="deleteButton" v-on:click="deleteMix(mix.mix)">
            Delete
          </button>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import Mix from "@/model/Mix";
import DataService from "@/services/DataService";
// TODO unfold for songs in mix, mix playback
export default{
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
    }
  },
  created() {
    this.pollMixes()
  },
  methods: {
    async pollMixes() {
      setInterval(() => {
        this.$store.dispatch('fetchMixes')
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
.mixNameLabel{
  display: inline-block;
  text-align: left;
  vertical-align: middle;
  margin-left: 10%;
  width: 200px;
}
.mixTempoLabel{
  display: inline-block;
  vertical-align: middle;
  width: 5%;
  margin-left: 10px;
}
.mixLengthLabel{
  display: inline-block;
  vertical-align: middle;
  width: 5%;
  margin-left: 10px;
}
.mixNumSongsLabel{
  display: inline-block;
  vertical-align: middle;
  text-align: left;
  width: 5%;
  margin-left: 10px;
}
.mixProgress{
  display: inline-block;
  vertical-align: middle;
  margin-left: 20px;
  margin-right: 20px;
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
</style>