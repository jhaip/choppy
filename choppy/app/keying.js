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

  if (scene_store.key_direction_positive) {
    positive_key.translateZ(-key_height/2.0);
    positive_key.rotateX(Math.PI/2.);
  } else {
    positive_key.translateZ(key_height/2.0);
    positive_key.rotateX(-Math.PI/2.);
  }

  negative_key.position.copy(position);
  negative_key.rotation.copy(rotation_vector);

  if (scene_store.key_direction_positive) {
    negative_key.translateZ(-key_height/2.0);
    negative_key.rotateX(Math.PI/2.);
  } else {
    negative_key.translateZ(key_height/2.0);
    negative_key.rotateX(-Math.PI/2.);
  }


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
  var positive_mesh_target, negative_mesh_target;
  for (var i=0; i<scene_store.models.length; i+=1) {
    if (scene_store.models[i]["keyactive__positive-target"]) {
      positive_mesh_target = scene_store.models[i].mesh;
    } else if (scene_store.models[i]["keyactive__negative-target"]) {
      negative_mesh_target = scene_store.models[i].mesh;
    }
  }
  var positive_key_clone = positive_key.clone();
  var negative_key_clone = negative_key.clone();
  var positive_mesh = cutKey(positive_mesh_target, positive_key_clone, true);
  var negative_mesh = cutKey(negative_mesh_target, negative_key_clone, false);

  positive_mesh.position.set(
    positive_mesh_target.position.x,
    positive_mesh_target.position.y,
    positive_mesh_target.position.z);
  positive_mesh.scale.set(
    positive_mesh_target.scale.x,
    positive_mesh_target.scale.y,
    positive_mesh_target.scale.z);
  negative_mesh.position.set(
    negative_mesh_target.position.x,
    negative_mesh_target.position.y,
    negative_mesh_target.position.z);
  negative_mesh.scale.set(
    negative_mesh_target.scale.x,
    negative_mesh_target.scale.y,
    negative_mesh_target.scale.z);

  // Iterate twice throught the list of models to remove the
  // two keyactive meshes from the scene_store.models list
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

  addMesh(positive_mesh, {keyactive: true, "keyactive__positive-target": true});
  addMesh(negative_mesh, {keyactive: true, "keyactive__negative-target": true});
  hideKeys();
  render();

  enterAddKeyState();
}
