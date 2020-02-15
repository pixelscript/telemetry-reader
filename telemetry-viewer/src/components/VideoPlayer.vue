<template>
  <vue-plyr> 
    <video poster="" >
      <source type="video/mp4" size="320">
      <track kind="captions" label="English" srclang="en" src="captions-en.vtt" default>
    </video>
  </vue-plyr>
</template>

<script>

export default {
  name: 'VideoPlayer',
  data: function() {
    return {
    }
  },
  mounted: function(){},
  sockets: {
  },
  computed: {
  },
  methods: {
  }
}
</script>
<style>
</style>