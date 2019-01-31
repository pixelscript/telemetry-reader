<template>
  <div id="map"></div>
</template>

<script>
import GoogleMapsLoader from 'google-maps';
 

export default {
  name: 'GpsMap',
  data: function() {
    return {
    }
  },
  mounted: function(){
    GoogleMapsLoader.KEY = 'AIzaSyDISYIikzKG6gzSg11jPvsaMtlIxzsiygc';
    GoogleMapsLoader.load(google => {
       this.initMap();
    });
  },
  sockets: {
    gps: function(gps){
      if(this.poly) {
          this.path.push(new google.maps.LatLng(gps.lat,gps.long));
          this.poly.setPath(this.path);
          this.pathB.push(new google.maps.LatLng(gps.lat,gps.long));
          this.polyB.setPath(this.pathB);
          this.map.panTo(new google.maps.LatLng(gps.lat,gps.long));
          this.trackerpath = [this.home, new google.maps.LatLng(gps.lat,gps.long)];
          this.tracker.setPath(this.trackerpath);
          var heading = google.maps.geometry.spherical.computeHeading(this.trackerpath[0], this.trackerpath[1]);
          var distance = google.maps.geometry.spherical.computeDistanceBetween(this.trackerpath[0], this.trackerpath[1]);
          console.log(heading, distance);
        }
    }
  },
  methods: {
    initMap: function () {
      this.home = new google.maps.LatLng(54.5915776,-1.30729);
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(54.4544342,-1.0602203),
        zoom: 15,
        mapTypeId: 'terrain'
      });

      this.poly = new google.maps.Polyline({
        strokeColor: '#FFFFFF',
        strokeOpacity: 1.0,
        strokeWeight: 4
      });
      this.poly.setMap(this.map);
      this.path = this.poly.getPath();

      this.polyB = new google.maps.Polyline({
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });
      this.polyB.setMap(this.map);
      this.pathB = this.poly.getPath();

      this.tracker = new google.maps.Polyline({
        strokeColor: '#00FF00',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        geodesic: true
      });
      this.tracker.setMap(this.map);
      this.trackerpath = this.tracker.getPath();
    }
  }
}
</script>
<style>
  #map {
    width:100%;
    height:100%;
  }
</style>