var sphere_raycast;
var positive_key;
var negative_key;
var key_radiusTop = 0.02;
var key_radiusBottom = key_radiusTop;
var key_height = 0.1;

function createKeys() {

  positive_key = new THREE.Mesh(
    new THREE.CylinderGeometry( key_radiusTop, key_radiusBottom, key_height),
    new THREE.MeshBasicMaterial( { color: 0x0000ff, side: THREE.DoubleSide, transparent: false } )
  );
  negative_key = new THREE.Mesh(
    new THREE.CylinderGeometry( key_radiusTop, key_radiusBottom, key_height),
    new THREE.MeshBasicMaterial( { color: 0x0000ff, side: THREE.DoubleSide, transparent: false } )
  );
  positive_key.visible = false;
  negative_key.visible = false;
  scene.add( positive_key );
  scene.add( negative_key );
}

function moveKeys(position) {
  var translation_vector = scene_store.cut_plane.mesh.position;
  var rotation_vector = scene_store.cut_plane.mesh.rotation;
  positive_key.position.copy(position);
  positive_key.rotation.copy(rotation_vector);
  positive_key.translateZ(-key_height/2.0);
  positive_key.rotateX(Math.PI/2.);

  negative_key.position.copy(position);
  negative_key.rotation.copy(rotation_vector);
  negative_key.translateZ(-key_height/2.0);
  negative_key.rotateX(Math.PI/2.);


}

function showKeys() {
  positive_key.visible = true;
  negative_key.visible = true;
  render();
}

function hideKeys() {
  positive_key.visible = false;
  negative_key.visible = false;
  render();
}

function cutKey(mesh, key_mesh, is_positive_key) {
  var mesh_BSP = new ThreeBSP( mesh );
  var key_mesh_BSP = new ThreeBSP( key_mesh );

  var result_mesh_BSP;
  if (is_positive_key) {
    console.log("PERFORMING UNION");
    result_mesh_BSP = mesh_BSP.union( key_mesh_BSP );
  } else {
    console.log("PERFORMING SUBTRACT");
    result_mesh_BSP = mesh_BSP.subtract( key_mesh_BSP );
  }
  var result_mesh = result_mesh_BSP.toMesh( material.clone() );
  // scene.add(result_mesh);
  return result_mesh;
}

function commitKey() {
  hideCutPlane();
  // var mesh0 = scene_store.models[0].mesh.clone();
  // var mesh1 = scene_store.models[1].mesh.clone();
  var mesh0, mesh1;
  for (var i=0; i<scene_store.models.length; i+=1) {
    if (scene_store.models[i].keyactive) {
      if (mesh0 === undefined) {
        mesh0 = scene_store.models[i].mesh;
      } else {
        mesh1 = scene_store.models[i].mesh;
      }
    }
  }
  mesh0.material.transparent = false;
  mesh0.material.opacity = 1.0;
  mesh1.material.transparent = false;
  mesh1.material.opacity = 1.0;
  var positive_key_clone = positive_key.clone();
  var negative_key_clone = negative_key.clone();
  // key.material = mesh0.material;
  var positive_mesh = cutKey(mesh0, positive_key_clone, true);
  var negative_mesh = cutKey(mesh1, negative_key_clone, false);

  positive_mesh.position.set(mesh0.position.x, mesh0.position.y, mesh0.position.z);
  positive_mesh.scale.set(mesh0.scale.x, mesh0.scale.y, mesh0.scale.z);
  negative_mesh.position.set(mesh1.position.x, mesh1.position.y, mesh1.position.z);
  negative_mesh.scale.set(mesh1.scale.x, mesh1.scale.y, mesh1.scale.z);

  // TODO: only remove keys that where involved in the cut
  for (var i=0; i<scene_store.models.length; i+=1) {
    if (scene_store.models[i].keyactive) {
      removeMesh(scene_store.models[i].mesh);
    }
  }
  for (var i=0; i<scene_store.models.length; i+=1) {
    if (scene_store.models[i].keyactive) {
      removeMesh(scene_store.models[i].mesh);
    }
  }
  // while (scene_store.models.length > 0) {
  // 	console.log("trying to remove ");
  // 	removeMesh(scene_store.models[0].mesh);
  // }
  addMesh(positive_mesh, {keyactive: true});
  addMesh(negative_mesh, {keyactive: true});
  hideKeys();
  render();

  enterAddKeyState();
}
