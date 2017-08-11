if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, cameraTarget, scene, renderer;
var raycaster;
var mouse = new THREE.Vector2();

var material = new THREE.MeshPhongMaterial( { color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );
var materialNormal = new THREE.MeshNormalMaterial();

init();
animate();

function init() {
  var container = $(".canvas-container").get(0);

  camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
  camera.position.set( 3, 0.15, 3 );

  initTrackballControl();

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0xE9EAEC, 2, 15 );

  // raycaster
  raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = 0.1;

  // showGround();

  createCutPlane();

  createKeys();

  initLights();

  // renderer
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( scene.fog.color );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.renderReverseSided = false;

  container.appendChild( renderer.domElement );

  initTransformControls();

  // stats
  stats = new Stats();
  container.appendChild( stats.dom );

  initUIEventListeners();

  render();
}

function animate() {
  requestAnimationFrame( animate );
  trackball_controls.update();
  transform_controls.update();
  stats.update();
}

function render() {
  if (scene_store.state === "ADD_KEY" && scene_store.cut_plane) {
    raycaster.setFromCamera( mouse, camera );
    var intersections = raycaster.intersectObjects( [scene_store.cut_plane.mesh] );
    intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;
    if (intersection !== null) {
      moveKeys(intersection.point);
    }
  }
  renderer.render( scene, camera );
}
