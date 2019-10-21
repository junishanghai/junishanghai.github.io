/* global modelmagic */
// import { createMap } from './planeMap.js'

export function test2x(XMap, width = 100, height = 100) {
  // const mapUrl = '/models/maps/m8192/{0}/{1}/{2}.jpg'
  const LMAP = modelmagic.LMAP({
    fov: 60,
    min: 1,
    max: 20
  })
  const map = modelmagic.XMap(LMAP)
  map.addTo(
    this.getScene(),
    this.renderer,
    this.activeCamera,
    this.cameraControls
  )
  this.updateCache.push(function() {
    map.bufferedRender.apply(map, arguments)
  })
  return map
}
