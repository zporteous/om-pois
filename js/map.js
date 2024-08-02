require(["esri/Map", "esri/views/MapView"],
  (Map, MapView) => {
    // Create the Map
    const map = new Map({
      basemap: "topo-vector"
    });

    // Create the view set the view padding to be 320 px from the right
    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-74.045459, 40.690083], // Liberty Island, NY, USA
      zoom: 16,
    });
});