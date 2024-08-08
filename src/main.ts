import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Sketch from '@arcgis/core/widgets/Sketch';
import request from '@arcgis/core/request';
import Graphic from '@arcgis/core/Graphic';
import Field from '@arcgis/core/layers/support/Field';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import {createTreesFromObject} from './utils';
import categories from '../config/categories.json';
import * as ResponseTypes from "./types"

import "./style.css";
import "@esri/calcite-components";

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
  // padding:'1000px',
});



view.when(() => {
  var treeContainer= document.getElementById("tree-container") as HTMLDivElement;
  createTreesFromObject(categories,treeContainer);

  // Declaration of Esri items
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
  var drawOrUpload = document.getElementById("draw-or-upload") as HTMLCalciteRadioButtonGroupElement;
  var uploadShpBtn = document.getElementById("upload-shp") as HTMLInputElement;
  var inputButton = document.getElementById("inFile") as HTMLInputElement;
  var uploadUi = document.getElementById("upload-ui") as HTMLDivElement;
  uploadUi!.style.opacity='.4';
  uploadShpBtn.disabled=true;

  drawOrUpload.addEventListener('calciteRadioButtonGroupChange', (event: CustomEvent)=>{
    const target = event.target as HTMLCalciteRadioButtonGroupElement;
    let v=target.selectedItem.value
    map.layers.removeAll();
    if(v === "draw") {
      console.log("working")
      map.layers.add(graphicsLayer)
      sketch.layer.destroy();
      sketch.visible=true;
      uploadUi.style.opacity=".4";
      inputButton.disabled=true;
    } else if (v === "upload") {
      sketch.visible=false;
      inputButton.disabled=false;
      uploadUi.style.opacity='1';
    }
  })

  var uploadStatus = document.getElementById("upload-status")

  uploadShpBtn.addEventListener('change',(event:Event) => {
    const fileNameEl = event.target as HTMLInputElement
    var fileName = fileNameEl.value
    sketch.layer.destroy();
    if (fileName.indexOf(".zip") !== -1) {
      generateFeature(fileName);
    } else {
      uploadStatus!.innerHTML="File must be shp."
    }
  })

  // erase any existing features that have been drawn
  // show sketch UI, when complete, hide sketch UI
  sketch.on("create", function(event) {
    if (event.state === "complete") {
      sketch.visible=false;
    }
  })

  function generateFeature(fileName:string) {
    let name = fileName.split(".");
    // Chrome adds c:\fakepath to the value - we need to remove it
    let finalName = name[0].replace("c:\\fakepath\\", "");
    const params = {
      name: finalName,
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

    //get Form Data
    let data = document.getElementById("upload-shp") as HTMLFormElement
    // use the REST generate operation to generate a feature collection from the zipped shapefile
    let portalUrl ="https://zjp.maps.arcgis.com"
    request(portalUrl + "/sharing/rest/content/features/generate", {
      query: myContent,
      body: data,
      responseType: "json"
    })
      .then((response) => {
        console.log(response)
        addShapefileToMap(response.data.featureCollection);
      })
      .catch(errorHandler);
  };

  function errorHandler(error:unknown) {
    console.log(error)
    uploadShpBtn.style.color='error';
  }

  var sourceGraphics:Graphic[] = [];
  function addShapefileToMap(json:ResponseTypes.FeatureCollectionResponse) {
    const layers = json.featureCollection!.layers.map((layer:ResponseTypes.Layer) => {
    const graphics:Graphic[] = layer.featureSet.features.map((feature) => {
      return Graphic.fromJSON(feature);
    });
    sourceGraphics = sourceGraphics.concat(graphics);
    const featureLayer = new FeatureLayer({
      objectIdField: "FID",
      source: graphics,
      fields: layer.layerDefinition.fields.map((field:ResponseTypes.Field) => {
        return Field.fromJSON(field);
      })
    });
    return featureLayer;
    // associate the feature with the popup on click to enable highlight and zoom to
  });

  map.addMany(layers);
  
  view.goTo(sourceGraphics).catch((error) => {
    if (error.name != "AbortError") {
        console.error(error);
      }
    });
  };
});

