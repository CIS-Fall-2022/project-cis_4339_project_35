<template>
  <main class="flex flex-row">
    <div id="_container" class="h-screen">
      <header class="w-full">
        <section class="text-center">
          <img class="m-auto" src="@\assets\DanPersona.svg" />
        </section>
        <nav class="mt-10">
          <ul class="flex flex-col gap-4">
            <li>
              <router-link to="/">
                <span style="position: relative; top: 6px" class="material-icons">dashboard</span>
                Dashboard
              </router-link>
            </li>
            <li>
              <router-link to="/intakeform">
                <span style="position: relative; top: 6px" class="material-icons">people</span>
                Client Intake Form
              </router-link>
            </li>
            <li>
              <router-link to="/eventform">
                <span style="position: relative; top: 6px" class="material-icons">event</span>
                Create Event
              </router-link>
            </li>
            <li>
              <router-link to="/findclient">
                <span style="position: relative; top: 6px" class="material-icons">search</span>
                Find Client
              </router-link>
            </li>
            <li>
              <router-link to="/findEvents">
                <span style="position: relative; top: 6px" class="material-icons">search</span>
                Find Event
              </router-link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
    <div class="grow w-4/5">
      <section class="justify-end items-center h-24 flex" style="background: linear-gradient(250deg, #C8102E 70%, #efecec 50.6%);">
        <h1 class="mr-20 text-3xl text-white" id="organName">Dataplatform</h1>
      </section>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
export default {
  name: "App",
  async mounted(){
    // https://jasonwatmore.com/post/2022/05/28/vue-3-vite-access-environment-variables-from-dotenv-env
    // Calling Organization ID from dotenv
    let orgID = import.meta.env.VITE_ORG_ID;
    // adding Organization ID to API URL
    //let apiURL = import.meta.env.VITE_ROOT_API + `/organdata/id/`+orgID;
    let apiNew = import.meta.env.VITE_ROOT_API + `/organdata/`;
    // Function to get Name
    async function getName() {
      // API Call
      return axios.get(apiNew).then(resp => {
        // Since each organization has a unique ID the first one should be the only one
        // Trying to get orgVariable to work TAKE 2
        // Original stopped working Instead using another method by gathing all organizations 
        // and comparing their ids and then taking name
        for (let item in resp.data){
          if (orgID == resp.data[item]._id){
            return resp.data[item].orgName
          }
        }
      }).catch(error => {
        console.log(error);
        return Promise.reject(error);
      });
    }
    const orgName = await getName(); //PROMISE - Waiting for promise to be kept
    //console.log(orgName)
    //https://sebhastian.com/display-javascript-variable-html/
    document.getElementById("organName").innerHTML=orgName; //Org Name is added to the HTML by id of the element
  }
};
</script>