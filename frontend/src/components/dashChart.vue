<template>
  <Bar  :chart-data="chartData"/>
</template>
  
<script>
  let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/dash/`;
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
  import axios from 'axios'

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
export default {
  name: 'BarChart',
  components: { Bar },
  async setup() {
    async function getNames () {
      return axios.get(apiURL)
      .then(resp => {
        const eventNames = []
        for (const key in resp.data) {
        eventNames.push(resp.data[key].eventName)
        }
        return eventNames
      })
      .catch(error => {
      console.log(error);
      return Promise.reject(error);
      });
    }
    async function getNums () {
      return axios.get(apiURL)
      .then(resp => {
        const numAttend = []
        for (const key in resp.data) {
        numAttend.push(resp.data[key].numberOfAttendees)
        }
        return numAttend
      })
      .catch(error => {
      console.log(error);
      return Promise.reject(error);
      });
    }
    const namePromise = await getNames();
    const numPromise = await getNums();
    console.log(namePromise)
    console.log(numPromise)
    return {
      chartData: {
        labels: namePromise,
        datasets: [
          {
            label: 'Number of Attendees',
            backgroundColor: '#f87979',
            data: numPromise
          }
        ]
      }
    }
  },

}
  /* export default {
    name: 'BarChart',
    components: { Bar },
    data: () => ({
    loaded: false,
    chartData: null
  }),
  async mounted () {
    this.loaded = false
    try {
      let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/dash/`;
      axios.get(apiURL).then((resp) => {
        this.chartdata = resp.data;
        console.log(this.chartdata)
      });
      this.loaded = true
    } catch (e) {
      console.error(e)
    }
  }
  } */
</script>