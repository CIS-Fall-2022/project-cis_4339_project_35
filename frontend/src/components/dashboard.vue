<template>
  <main>
    <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome</h1>
    <Suspense> <!--Suspense is needed to use async-->
      <BarChart /> <!--Chart is Here-->
    </Suspense><!--Suspense is needed to use async-->
  </main>
</template>
<script>
import BarChart from '../components/dashChart.vue'
export default {
  components: { BarChart },
  methods: {
    routePush(routeName) {
      this.$router.push({ name: routeName });
    },
  },
};
</script>
