onconnect = function(e) {
  const port = e.ports[0]

  onmessage = function(e) {
    console.log('shared-worker e ' + e)
    port.postMessage(e)
  }
}
