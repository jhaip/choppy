function selectModel(index) {
  for (var i=0; i<scene_store.models.length; i+=1) {
    scene_store.models[i].selected = false;
    setColor(scene_store.models[i].mesh, 0xffffff);
  }
  scene_store.models[index].selected = true;
  setColor(scene_store.models[index].mesh, 0x0055ff);
  disableMeshOpacity(scene_store.models[index].mesh);
  // scene_store.models[index].mesh.visible = !current_visibility;
  render();
}

function disableMeshOpacity(mesh) {
  mesh.material.transparent = false;
  mesh.material.opacity = 1.0;
}

function toggleMeshOpacity(index) {
  var current_transparency = scene_store.models[index].mesh.material.transparent;
  if (current_transparency) {
    disableMeshOpacity(scene_store.models[index].mesh);
  } else {
    scene_store.models[index].mesh.material.transparent = true;
    scene_store.models[index].mesh.material.opacity = 0.4;
  }
  render();
}

function setColor(mesh, color) {
  // use like setColor(scene_store.models[0].mesh, 0x00ff00)
  mesh.material.color.set(new THREE.Color( color ));
  mesh.material.transparent = true;
  mesh.material.opacity = 1.0;
  render();
}

function toggleMeshVisibility(index) {
  var current_visibility = scene_store.models[index].mesh.visible;
  scene_store.models[index].visible = !current_visibility;
  scene_store.models[index].mesh.visible = !current_visibility;
  render();
}
