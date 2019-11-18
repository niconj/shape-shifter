<template>
  <div id="app">
    <ShapeCanvas />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ShapeCanvas from './components/ShapeCanvas.vue';

@Component({
  components: {
    ShapeCanvas,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "./scss/_variables.scss";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: $background-gradient;
}
</style>
