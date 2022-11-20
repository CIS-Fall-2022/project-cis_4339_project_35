<template>
  <div class="grid place-items-center">
    <!--Chart-->
    <Bar class="shadow-md rounded" 
    :chart-data="chartData"
    :chart-options="chartOptions"
    :width="1080"
    :height="180"
    />
    <!--Table-->
    <table class=" min-w-full shadow-md rounded border-separate border-spacing-1 border border-slate-400">
      <thead class="bg-[#f87171]">
        <tr>
          <!--Table Headers-->
          <th>Event Name</th>
          <th>Number of Attendees</th>
        </tr>
      </thead>
      <tbody class="bg-[#f87171]">
        <!--Table Body-->
        <td class="border border-slate-300">
          <!--NAMES-->
          <tr v-for="(nam,index) in names" v-bind:key="index">{{nam}}</tr>
        </td>
        <td class="border border-slate-300">
          <!--NUMBER OF ATTENDEES-->
          <tr v-for="(num,index) in numbers" v-bind:key="index">{{num}}</tr>
        </td>
      </tbody>
    </table>
  </div>
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
          return eventNames // Gathering names of all events for the x-axis variables
        }).catch(error => {
        console.log(error);
        return Promise.reject(error);
        });
      }
      async function getNums () { //Creates an array that returns the number of attendees from backend data
        return axios.get(apiURL).then(resp => {
          const numAttend = []
          for (const key in resp.data) {
          numAttend.push(resp.data[key].numberOfAttendees)// push numAttend variable into numberofAttendees 
          }
          return numAttend // Gathering the count of attendees for each event for the y-axis data 
        }).catch(error => {
        console.log(error);
        return Promise.reject(error);
        });
      }
      const namePromise = await getNames(); // PROMISE - waiting to get array of event names
      const numPromise = await getNums();   // PROMISE - waiting to get array of number of Attendees
      return {
        /*Using the Promised names and numbers for both the Table and the Chart */
        names : namePromise,
        numbers : numPromise,
        chartData: {
          labels: namePromise, // event names
          datasets: [
            {
              label: 'Number of Attendees',
              backgroundColor: '#f87979',
              data: numPromise, // number of attendees
            }
          ],
        },
        chartOptions:{
          scales: {
            yAxis: 
              {
                ticks: {
                  stepSize: 1 //y-axis ticks are shown in increments of 1 as whole numbers
                }
              }
          }
        }
      }
    }
  }
</script>
