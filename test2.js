// import { createMap } from './planeMap.js'

export function test2(MapPlane, width = 100, height = 100) {
  // const mapUrl = '/models/maps/m8192/{0}/{1}/{2}.jpg'
  const mapUrl = '/models/maps/gaode0/tiles/{0}/{1}/r{2}.jpg'
  const plane = new MapPlane({
    mapUrl: mapUrl,
    mapMin: 0,
    mapMax: 5,
    width: width,
    height: height,
    name: 'test-map',
    y: -0.1,
    zoom: 2
  })
  plane.synchronize(
    this,
    this.renderer.domElement
    //  this.getScene(),
    //  this.activeCamera,
    //  this.raycaster
  )
  this.updateMapHandler = plane.updateMapHandler()
  // this.getScene().add(plane)
  // test element add to rayReceiveObjects
  // this.rayReceiveObjects = this.rayReceiveObjects.concat(
  //  this.getScene().children
  // )
  // plane.tiles.forEach(tile => {
  //  this.rayReceiveObjects.push(tile)
  // })
  return plane
}
