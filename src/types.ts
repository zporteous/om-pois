export interface NestedObject {
  [key: string]: string | number | boolean | NestedObject | {};
}

  //


export interface FeatureCollectionResponse {
  featureCollection: {
    layers: Layer[];
  };
  geocodeResults: {
    accepted: number;
    rejected: number;
  };
}


export interface Layer {
  layerDefinition: LayerDefinition;
  featureSet: FeatureSet;
}


export interface LayerDefinition {
  currentVersion: number;
  id: number;
  name: string;
  type: string;
  displayField: string;
  description: string;
  copyrightText: string;
  defaultVisibility: boolean;
  editFieldsInfo: EditFieldsInfo;
  relationships: any[]; // Assuming an array of objects; replace with a specific type if available
  isDataVersioned: boolean;
  supportsRollbackOnFailureParameter: boolean;
  supportsAdvancedQueries: boolean;
  geometryType: string;
  minScale: number;
  maxScale: number;
  extent: Extent;
  drawingInfo: DrawingInfo;
  allowGeometryUpdates: boolean;
  hasAttachments: boolean;
  htmlPopupType: string;
  hasM: boolean;
  hasZ: boolean;
  objectIdField: string;
  globalIdField: string;
  typeIdField: string;
  fields: Field[];
  indexes: any[]; // Assuming an array of objects; replace with a specific type if available
  types: any[]; // Assuming an array of objects; replace with a specific type if available
  templates: any[]; // Assuming an array of objects; replace with a specific type if available
  supportedQueryFormats: string;
  hasStaticData: boolean;
  maxRecordCount: number;
  capabilities: string;
}

export interface EditFieldsInfo {
  creationDateField: string;
  creatorField: string;
  editDateField: string;
  editorField: string;
}

export interface Extent {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  spatialReference: SpatialReference;
}

export interface SpatialReference {
  wkid: number;
  latestWkid: number;
}

export interface DrawingInfo {
  renderer: Renderer;
  labelingInfo: any; // Assuming a nullable object; replace with a specific type if available
}

export interface Renderer {
  type: string;
  symbol: Symbol;
  label: string;
  description: string;
}

export interface Symbol {
  type: string;
  url: string;
  imageData: string;
  contentType: string;
  color: null | any; // Assuming a nullable color object; replace with a specific type if available
  width: number;
  height: number;
  angle: number;
  xoffset: number;
  yoffset: number;
}

export interface Field {
  name: string;
  type: string;
  alias: string;
  sqlType: string;
  length?: number; // Optional since it's not present on all fields
  nullable: boolean;
  editable: boolean;
  domain: null | any; // Assuming a nullable domain object; replace with a specific type if available
  defaultValue: null | any; // Assuming a nullable default value; replace with a specific type if available
}

export interface FeatureSet {
  features: Feature[];
  geometryType: string;
}

export interface Feature {
  attributes: {
    Address: string;
    City: string;
    State: string;
    Zip: string;
    Value: number;
    FID: number;
  };
  geometry: Geometry;
}

export interface Geometry {
  x: number;
  y: number;
  spatialReference: SpatialReference;
}

