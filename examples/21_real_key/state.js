/* EMPTY
   LOADING_MODEL
   IDLE
   EDIT_CUT_PLANE
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
    scene_store.models[i].keyactive = false;
    scene_store.models[i]["keyactive__positive-target"] = false;
    scene_store.models[i]["keyactive__negative-target"] = false;
    if (scene_store.models[i].selected) {
      selectModel(i);
    }
  }
  hideKeys();
  hideTransformControls();
  render();
  setState("IDLE");
}

function enterEditCutPlane() {
  setState("EDIT_CUT_PLANE");
  showCutPlane();
  showTransformControls();
  var any_selected = false;
  for (var i=0; i<scene_store.models.length; i+=1) {
    if (scene_store.models[i].selected) {
      any_selected = true;
    }
  }
  if (!any_selected) {
    selectModel(0);
  }
  updatePartListDisplay();
}

function enterAddKeyState() {
  setState("ADD_KEY");
  hideCutPlane();
  hideTransformControls();
  // TODO:
  // set color of positive-target
  // set color of negative-target
  // set color of non-targets
  toggleMeshOpacity(0);
  toggleMeshOpacity(1);
  showKeys();
  render();
}

function addMesh(mesh, opts) {
  console.log("------> add mesh");
  var model_opts = {
    "id": 1,
    "visible": true,
    "selected": false,
    "keyactive": false,
    "keyactive__positive-target": false,
    "keyactive__negative-target": false,
    "color": 0x00ff00,
    "mesh": mesh
  };
  if (opts !== undefined) {
    if (opts.keyactive) {
      model_opts.keyactive = opts.keyactive;
    }
    if (opts["keyactive__positive-target"]) {
      model_opts["keyactive__positive-target"] = opts["keyactive__positive-target"];
    }
    if (opts["keyactive__negative-target"]) {
      model_opts["keyactive__negative-target"] = opts["keyactive__negative-target"];
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
