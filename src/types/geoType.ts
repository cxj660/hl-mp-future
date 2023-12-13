export interface featureType {
  type: string
  properties: any
  geometry: {
    type: 'MultiPolygon'
    coordinates: []
  }
}

export interface GeonjsonType {
  type: string
  features: featureType[]
}

export interface PointDataType {
  userData: any
  coordinate: string
}
