var trackball_controls;
var transform_controls;

function addShadowedLight( x, y, z, color, intensity ) {

  var directionalLight = new THREE.DirectionalLight( color, intensity );
  directionalLight.position.set( x, y, z );
  scene.add( directionalLight );

  directionalLight.castShadow = true;

  var d = 1;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;

  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 4;

  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;

  directionalLight.shadow.bias = -0.005;

}

function showGround() {
  var plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry( 40, 40 ),
    new THREE.MeshPhongMaterial( { color: 0xFFFFFF, specular: 0x101010 } )
  );
  plane.rotation.x = -Math.PI/2;
  plane.position.y = -0.5;
  scene.add( plane );

  plane.receiveShadow = true;
}

function initLights() {
  scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
  addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
  addShadowedLight( 0.5, 1, -1, 0xffaa00, 1 );
}

function initTrackballControl() {
  trackball_controls = new THREE.TrackballControls( camera, container );
  trackball_controls.rotateSpeed = 1.0;
  trackball_controls.zoomSpeed = 1.2;
  trackball_controls.panSpeed = 0.8;
  trackball_controls.noZoom = false;
  trackball_controls.noPan = false;
  trackball_controls.staticMoving = true;
  trackball_controls.dynamicDampingFactor = 0.3;
  trackball_controls.keys = [ 65, 83, 68 ];
  trackball_controls.addEventListener( 'change', render );
}

function initTransformControls() {
  transform_controls = new THREE.TransformControls( camera, renderer.domElement );
  transform_controls.addEventListener( 'change', render );
}

function showTransformControls() {
  transform_controls.attach( scene_store.cut_plane.mesh );
  scene.add( transform_controls );
}

function hideTransformControls() {
  transform_controls.detach();
  scene.remove(transform_controls);
}
