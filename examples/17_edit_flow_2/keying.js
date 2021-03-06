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
    if (scene_store.models[i].activecut) {
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
  var key = sphere_raycast.clone();
  key.material = mesh0.material;
  var positive_mesh = cutKey(mesh0, sphere_raycast, true);
  var negative_mesh = cutKey(mesh1, key, false);

  positive_mesh.position.set(mesh0.position.x, mesh0.position.y, mesh0.position.z);
  positive_mesh.scale.set(mesh0.scale.x, mesh0.scale.y, mesh0.scale.z);
  negative_mesh.position.set(mesh1.position.x, mesh1.position.y, mesh1.position.z);
  negative_mesh.scale.set(mesh1.scale.x, mesh1.scale.y, mesh1.scale.z);

  // TODO: only remove keys that where involved in the cut
  for (var i=0; i<scene_store.models.length; i+=1) {
    if (scene_store.models[i].activecut) {
      removeMesh(scene_store.models[i].mesh);
    }
  }
  for (var i=0; i<scene_store.models.length; i+=1) {
    if (scene_store.models[i].activecut) {
      removeMesh(scene_store.models[i].mesh);
    }
  }
  // while (scene_store.models.length > 0) {
  // 	console.log("trying to remove ");
  // 	removeMesh(scene_store.models[0].mesh);
  // }
  addMesh(positive_mesh);
  addMesh(negative_mesh);
  sphere_raycast.visible = false;
  render();

  enterIdle();
}
