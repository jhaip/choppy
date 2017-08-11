function loadSTL() {
  var loader = new THREE.STLLoader();

  // var model_path = '../../models/stl/binary/JuliaVase001_-_Aqua_-_2mm.stl';
  var model_path = '../../models/stl/binary/dino.stl';

  loader.load( model_path, function ( geometry ) {
    var geometry2 = new THREE.Geometry().fromBufferGeometry( geometry );
    var mesh = new THREE.Mesh( geometry2, material );
    mesh.position.set(0,0,-0.5);
    mesh.scale.set( .01, .01, .01 );
    addMesh(mesh);
    render();
    enterIdle();
  });
}
