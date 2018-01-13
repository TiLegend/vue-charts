<template>
<div>
  <div class="loading" v-if="loading">
      Loading...
    </div>
    <div v-if="error">
      {{ errorMessage }}
    </div>
    <div v-if="words" class="content">
    <div v-for='(word,index) in words' :key='index'>
        <all-charts :word-set = 'word'></all-charts>
    </div>
    </div>
</div>
</template>
<<script>
/* eslint-disable */
import axios from "axios";
import allCharts from "@/components/allCharts";
export default {
  name: 'chartList',
    components: {
      allCharts
    },
    data(){
        return {loading: false,
                error: null,
                words:null,
                errorMessage:null
                }
    },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.wordConfigs = this.errorMessage = null
      this.loading = true
      
      axios.get(`localhost:8090/api/user/words/1`)
      .then(response => {
          this.words = response.data;
          this.loading = false
        })
      .catch(err => {
          this.errorMessage = err.response.data.error;
          this.error = true;
        });
    }
  }
}
</script>
