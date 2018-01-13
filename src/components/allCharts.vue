<template>
  <section class="container" v-if="word">
    <h1>{{word.name}}</h1>
    <div class="columns">
    <div class="column">
      
    </div>
    <div class="column" v-if="showSettings">
        <datepicker input-class="Search__input" placeholder="Start Date" v-model="periodStart" name="start-date" ></datepicker>
        <datepicker input-class="Search__input" placeholder="End Date" v-model="periodEnd" name="end-date" ></datepicker>
        <div class="error-message" v-if="showError">
       {{ errorMessage }}
      </div>
      <div class="column">
      <button class="Search__button" @click="requestData">Find</button>
      </div>
      <hr>
      <div v-if="loading" class="loading">
        🔧  Building Charts ...
        <div class="sk-cube-grid">
        <div class="sk-cube sk-cube1"></div>
        <div class="sk-cube sk-cube2"></div>
        <div class="sk-cube sk-cube3"></div>
        <div class="sk-cube sk-cube4"></div>
        <div class="sk-cube sk-cube5"></div>
        <div class="sk-cube sk-cube6"></div>
        <div class="sk-cube sk-cube7"></div>
        <div class="sk-cube sk-cube8"></div>
        <div class="sk-cube sk-cube9"></div>
      </div>
      </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-three-quarters">
        <line-chart v-if="loaded" :chart-data="counts" :chart-labels="labels" v-on:get_point_click="getPointDataPosts"></line-chart>
      </div>
      <div class="column">
        <div v-if='showPosts'>
<div class="card" v-for='(post,index) in posts' :key='index'>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <p class="title is-4">{{post.owner}}</p>
        <p class="subtitle is-6">{{post.name}}</p>
      </div>
    </div>

    <div class="content">
      {{post.text}}
      <br>
      <time datetime=''>{{post.time}}</time>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */

import axios from "axios";
import Datepicker from "vuejs-datepicker";
import LineChart from "@/components/LineChart";
import moment from 'moment';

import {
  dateToYear,
  dateToMonth,
  dateToWeek,
  dateToDay,
  dateBeautify
} from "../utils/dateFormatter";

import { removeDuplicate, groupData } from "../utils/downloadFormatter.js";

import { getPosts } from "../utils/countPosts.js";

export default {
  name: "allCharts",
  props: {
      wordSet: {
        type: Object,
        required: true
      }
    },
  components: {
    LineChart,
    Datepicker
  },
  metaInfo() {
    return {
      news: [{}, {}]
    };
  },
  data() {
    return {
      word:null,
      source: null,
      searchWord: "",
      loaded: false,
      loading: false,
      counts: [],
      countsYear: [],
      countsMonth: [],
      countsWeek: [],
      labels: [],
      labelsYear: [],
      labelsMonth: [],
      labelsWeek: [],
      showError: false,
      showSettings: true,
      errorMessage: "Please enter a ",
      periodStart: "",
      periodEnd: "",
      rawData: "",
      totalCounts: "",
      lineColors: [
        "#ff4d4d",
        "#5500ff",
        "#cc6666",
        "#ff3377",
        "#ff5500",
        "#331100",
        "#ff8c1a",
        "#4d4d00",
        "#608000",
        "#0099ff"
      ],
      posts: [],
      showPosts: false
    };
  },
  mounted() {
    this.word = this._props.wordSet;
    //на клик?
    if (this.$route.params.source) {
      this.source = this.$route.params.source;
      this.requestData();
    }
  },

  computed: {
    _endDate() {
      return dateToDay(this.periodEnd);
    },
    _startDate() {
      return dateToDay(this.periodStart);
    },
    period() {
      return this.periodStart
        ? `${this._startDate}:${this._endDate}`
        : "last-month";
    },
    formattedPeriod() {
      return this.periodStart
        ? `${dateBeautify(this._startDate)} - ${dateBeautify(this._endDate)}`
        : "last-month";
    }
  },

  methods: {
    resetState() {
      this.loaded = false;
      this.showError = false;
    },
    requestData() {
      // if (this.package === null || this.package === '' || this.package === 'undefined') {
      //   this.showError = true
      //   return
      // }
      this.resetState();
      this.loading = true;
      axios
        .post(
          `localhost:8090/api/user/wordcounts/1/`+this.word.name,
          {
            startDate: moment(this.periodStart).format("YYYY-MM-DDTHH:mm"),
            endDate: moment(this.periodEnd).format("YYYY-MM-DDTHH:mm")
          },
          {
            "Access-Control-Allow-Origin": "localhost:8090",
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json"
          }
        )
        .then(response => {
          this.rawData = response.data.countInfos;
          this.counts = response.data.countInfos;
          //this.counts.label = response.data.word
          this.labels = response.data.labels;
          this.searchWord = response.data.word;
          //this.totalCounts = this.counts.reduce((total, count) => total + count)
          this.groupDataByDate();
          this.loaded = true;
          this.loading = false;
          for (let i = 0; i < this.counts.length; i++) {
            this.counts[i].borderColor = this.lineColors[i];
          }
        })
        .catch(err => {
          this.errorMessage = err.response.data.error;
          this.showError = true;
        });
    },
    getPointDataPosts(countData) {
      axios
        .post(
          `localhost:8090/api/user/wordcounts/countposts/`,
          {
            startDate: moment(countData.startDate).format("YYYY-MM-DDTHH:mm"),
            endDate:moment(countData.endDate).format("YYYY-MM-DDTHH:mm"),
            word: countData.word,
            source: countData.sourceShortName,
            pointCountDate:moment(countData.pointCountDate).format("YYYY-MM-DDTHH:mm")
          },
          {
            "Access-Control-Allow-Origin": "localhost:8090",
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json"
          }
        )
        .then(response => {
          this.posts = getPosts(response.data, countData);
          if (this.posts != null) this.showPosts = true;
        })
        .catch(err => {
          this.errorMessage = err.response.data.error;
          this.showError = true;
        });
    },
    groupDataByDate() {
      this.formatYear();
      this.formatMonth();
      this.formatWeek();
    },
    formatYear() {
      this.labelsYear = this.rawData
        .map(entry => dateToYear(entry.day))
        .reduce(removeDuplicate, []);
      this.countsYear = groupData(this.rawData, dateToYear);
    },
    formatMonth() {
      this.labelsMonth = this.rawData
        .map(entry => dateToMonth(entry.day))
        .reduce(removeDuplicate, []);
      this.countsMonth = groupData(this.rawData, dateToMonth);
    },
    formatWeek() {
      this.labelsWeek = this.rawData
        .map(entry => dateToWeek(entry.day))
        .reduce(removeDuplicate, []);
      this.countsWeek = groupData(this.rawData, dateToWeek);
    },
    toggleSettings() {
      this.showSettings = !this.showSettings;
      this.$ga.event({
        eventCategory: "Settings",
        eventAction: "toggle"
      });
    },
    clickjs() {
      alert("hh");
    }
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>