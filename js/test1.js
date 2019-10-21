import { random, randomColorStr } from './utilities.js'

export function test1(THREE) {
  let group
  for (let a = 0, la = 100; a < la; a++) {
    group = new THREE.Group('g-' + a)
    group.position.x = random(-400, 400)
    group.position.y = random(10, 100)
    group.position.z = random(-400, 400)

    for (let b = 0, lb = 100; b < lb; b++) {
      const color = randomColorStr()
      // console.log('color: #' + color.toString(16))
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshBasicMaterial({ color: color, wireframe: false })
      )
      mesh.name = 'mesh-' + a + '-' + b
      group.add(mesh)
    }
    this.getScene().add(group)
  }

  // test element add to rayReceiveObjects
  // this.rayReceiveObjects = this.rayReceiveObjects.concat(
  //  this.getScene().children
  // )
  this.rayReceiveObjects.push(group)
}
