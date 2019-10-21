export function test0(THREE) {
  /* center */
  let mesh = new THREE.Mesh(
    new THREE.BoxGeometry(10, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
  )
  mesh.position.y = 5
  this.getScene().add(mesh)

  /* left */
  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(10, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false })
  )
  mesh.position.x = -15
  mesh.position.y = 5
  this.getScene().add(mesh)

  /* right */
  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(10, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false })
  )
  mesh.position.x = 15
  mesh.position.y = 5
  this.getScene().add(mesh)

  /* back */
  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(10, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false })
  )
  mesh.position.y = 5
  mesh.position.z = 25
  this.getScene().add(mesh)

  // test element add to rayReceiveObjects
  // this.rayReceiveObjects = this.rayReceiveObjects.concat(
  //  this.getScene().children
  // )
  this.rayReceiveObjects.push(mesh)
}
