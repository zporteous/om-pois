
require([
  "esri/widgets/Sketch",
  "esri/Map",
  "esri/layers/GraphicsLayer",
  "esri/views/MapView",
  "esri/request",
  "esri/Graphic",
  "esri/layers/support/Field",
  "esri/layers/FeatureLayer",
  "utils",
  "categories",
], (Sketch, Map, GraphicsLayer, MapView, 
  request, Graphic, Field, FeatureLayer, utils, categories) => {


const graphicsLayer = new GraphicsLayer();

const map = new Map({
  basemap: "topo-vector",
  layers: [graphicsLayer]
});

const view = new MapView({
  container: "viewDiv",
  map: map,
  zoom: 4,
  center: [ -98.30437001245608,39.33320882729786],
  padding:'1000px',
});

view.when(() => {
  var treeContainer = document.getElementById("tree-container")
  utils.renderCategories(categories,treeContainer)

  // make sketch widget, add to map
  const sketch = new Sketch({
    layer: graphicsLayer,
    view: view,
    layout:"vertical",
    availableCreateTools:['rectangle', 'polygon'],
    // graphic will be selected as soon as it is created
    creationMode: "single",
    visibleElements:{
      selectionTools:{
        "rectangle-selection":false,
        "lasso-selection": false
      },
      settingsMenu: false,
      undoRedoMenu:false,
    },
    visible:true,
  });
  view.ui.add(sketch, "top-left");

  // action button for draw + upload
  var drawOrUpload = document.getElementById("draw-or-upload")
  var uploadShpBtn = document.getElementById("upload-shp")
  var inputButton = document.getElementById("inFile")
  var uploadUi = document.getElementById("upload-ui")
  uploadUi.style.opacity=.4;
  uploadShpBtn.disabled=true;

  drawOrUpload.addEventListener('calciteRadioButtonGroupChange', (value)=>{
    let v=value.target.selectedItem.value
    map.layers.removeAll();
    if(v === "draw") {
      console.log("working")
      map.layers.add(graphicsLayer)
      sketch.layer.graphics=[];
      sketch.visible=true;
      uploadUi.style.opacity=.4;
      inputButton.disabled=true;
    } else if (v === "upload") {
      sketch.visible=false;
      inputButton.disabled=false;
      uploadUi.style.opacity=1;
    }
  })

  var uploadStatus = document.getElementById("upload-status")

  uploadShpBtn.addEventListener('change',(event) => {
    const fileName = event.target.value.toLowerCase();
    sketch.layer.graphics=[];
    if (fileName.indexOf(".zip") !== -1) {
      inputButton.loading = true;
      generateFeature(fileName);
    } else {
      uploadStatus.innerHTML="File must be shp."
    }
  })

  // erase any existing features that have been drawn
  // show sketch UI, when complete, hide sketch UI
  sketch.on("create", function(event) {
    if (event.state === "complete") {
      sketch.visible=false;
    }
  })

  function uploadShpActions(){
    sketch.layer.graphics=[];
  }

  function generateFeature(fileName) {
    let name = fileName.split(".");
    // Chrome adds c:\fakepath to the value - we need to remove it
    name = name[0].replace("c:\\fakepath\\", "");
    const params = {
      name: name,
      targetSR: view.spatialReference,
      maxRecordCount: 1000,
      enforceInputFileSizeLimit: true,
      enforceOutputJsonSizeLimit: true
    };

    const myContent = {
      filetype: "shapefile",
      publishParameters: JSON.stringify(params),
      f: "json"
    };

    // use the REST generate operation to generate a feature collection from the zipped shapefile
    let portalUrl ="https://zjp.maps.arcgis.com"
    request(portalUrl + "/sharing/rest/content/features/generate", {
      query: myContent,
      body: document.getElementById("upload-shp"),
      responseType: "json"
    })
      .then((response) => {
        console.log(response)
        const layerName = response.data.featureCollection.layers[0].layerDefinition.name;
        addShapefileToMap(response.data.featureCollection);
      })
      .catch(errorHandler);
  };

  function errorHandler(error) {
    console.log(error)
    uploadShpBtn.color="error";
  }
  var sourceGraphics = [];
  function addShapefileToMap(featureCollection) {
    const layers = featureCollection.layers.map((layer) => {
      const graphics = layer.featureSet.features.map((feature) => {
        return Graphic.fromJSON(feature);
      });
      sourceGraphics = sourceGraphics.concat(graphics);
      const featureLayer = new FeatureLayer({
        objectIdField: "FID",
        source: graphics,
        fields: layer.layerDefinition.fields.map((field) => {
          return Field.fromJSON(field);
        })
      });
      return featureLayer;
      // associate the feature with the popup on click to enable highlight and zoom to
    });
    map.addMany(layers);
    inputButton.loading = false;
    view.goTo(sourceGraphics).catch((error) => {
      if (error.name != "AbortError") {
        console.error(error);
      }
    });
  };
});
  
});