<template>
  <Bar  :chart-data="chartData"/> <!--Chart-->
</template>
  
<script>
  import { Bar } from 'vue-chartjs' //https://vue-chartjs.org/ and https://www.chartjs.org
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
  import axios from 'axios'

  let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/dash/`; //API URL for Chart
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

  export default {
    name: 'BarChart',
    components: { Bar },
    async setup() { // data() cannot be used with async so setup() must be used
      async function getNames () { //Creates an array that returns the names of events from backend data
        return axios.get(apiURL).then(resp => {
          const eventNames = []
          for (const key in resp.data) {
          eventNames.push(resp.data[key].eventName)
          }
          return eventNames
        }).catch(error => {
        console.log(error);
        return Promise.reject(error);
        });
      }
      async function getNums () { //Creates an array that returns the number of attendees from backend data
        return axios.get(apiURL).then(resp => {
          const numAttend = []
          for (const key in resp.data) {
          numAttend.push(resp.data[key].numberOfAttendees)
          }
          return numAttend
        }).catch(error => {
        console.log(error);
        return Promise.reject(error);
        });
      }
      const namePromise = await getNames(); // PROMISE - waiting to get array of event names
      const numPromise = await getNums();   // PROMISE - waiting to get array of number of Attendees
      return {
        chartData: {
          labels: namePromise, // event names
          datasets: [
            {
              label: 'Number of Attendees',
              backgroundColor: '#f87979',
              data: numPromise // number of attendees
            }
          ]
        }
      }
    }
  }
</script>