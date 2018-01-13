import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import allCharts from '@/components/allCharts'
import chartList from '@/components/chartList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/allcharts',
      name: 'allCharts',
      component: allCharts
    },
    {
      path: '/chartList',
      name: 'chartList',
      component: chartList
    }
  ]
})
