/* EMPTY
   LOADING_MODEL
   IDLE
   EDIT_CUT_PLANE
   POST_CUT
   ADD_KEY
*/
var scene_store = {
  "state": "EMPTY",
  "models": [],
  "cut_plane": null
};
setState("EMPTY");

function setState(state) {
  scene_store.state = state;
  $(".sidebar__current-state").text("State: "+state);
  console.log("UPDATED STATE: " + state);
  updateUIControls();
  updatePartListDisplay();
}

function enterIdle() {
  hideCutPlane();
  for (var i=0; i<scene_store.models.length; i+=1) {
    scene_store.models[i].mesh.material = material.clone();
    scene_store.models[i].activecut = false;
  }
  sphere_raycast.visible = false;
  render();
  setState("IDLE");
}

function enterCut() {
  setState("EDIT_CUT_PLANE");
  showCutPlane();
}

function enterAddKeyState() {
  setState("ADD_KEY");
  showCutPlane();
  toggleMeshOpacity(0);
  toggleMeshOpacity(1);
  sphere_raycast.visible = true;
  render();
}

function addMesh(mesh, opts) {
  console.log("------> add mesh");
  var model_opts = {
    "id": 1,
    "visible": true,
    "selected": false,
    "activecut": false,
    "color": 0x00ff00,
    "mesh": mesh
  };
  if (opts !== undefined) {
    if (opts.activecut) {
      model_opts.activecut = opts.activecut
    }
  }
  scene_store.models.push(model_opts);
  scene.add( mesh );

  updatePartListDisplay();

  return model_opts;
}

function removeMesh(mesh) {
  console.log("<------ removing mesh");
  for (var i=0; i<scene_store.models.length; i+=1) {
    if (scene_store.models[i].mesh === mesh) {
      console.log("found it");
      console.log(scene_store.models.length);
      // new_models = scene_store.models.splice(i, 1);
      scene_store.models.splice(i, 1);
      scene.remove( mesh );
      updatePartListDisplay();
      return;
    }
  }
  console.error("mesh not found!");
  console.error(scene_store.models);
  console.error(mesh)
}

function enterEditCutPlane() {
  setState("EDIT_CUT_PLANE");
  showCutPlane();
}
