function createCutPlane() {
  var cut_plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry( 40, 40 ),
    new THREE.MeshBasicMaterial( { color: 0x0000ff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 } )
  )
    .translateZ(-1)
    .rotateX(Math.PI/4);
  cut_plane.visible = false;
  scene.add( cut_plane );
  scene_store.cut_plane = {
    "mesh": cut_plane
  };
}

function moveCutPlaneZ(z) {
  scene_store.cut_plane.mesh.position.z = z;
  render();
}

function showCutPlane() {
  scene_store.cut_plane.mesh.visible = true;
  scene_store.cut_plane.mesh.material.visible = true;
  render();
}

function hideCutPlane() {
  // scene_store.cut_plane.mesh.visible = false;
  scene_store.cut_plane.mesh.material.visible = false;
  render();
}


function getCutBox(flip) {
  var translation_vector = scene_store.cut_plane.mesh.position;
  var rotation_vector = scene_store.cut_plane.mesh.rotation;
  var cut_plane2_D = 4.0;
  var cut_plane2 = new THREE.Mesh(
    new THREE.CubeGeometry( 4, 4, cut_plane2_D ),
    new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide, transparent: true, opacity: 0.5 } )
  )
    .translateX(translation_vector.x)
    .translateY(translation_vector.y)
    .translateZ(translation_vector.z)
    .rotateX(rotation_vector.x)
    .rotateY(rotation_vector.y)
    .rotateZ(rotation_vector.z)
    .translateZ(-cut_plane2_D/2.0);
  if (flip) {
    // cut_plane2 = cut_plane2.rotateY(Math.PI/2);
    cut_plane2 = cut_plane2.translateZ(cut_plane2_D);
  }
  return cut_plane2;
  // scene.add( cut_plane2 );
  // var cubeBSP2 = new ThreeBSP( cut_plane2 );
}

function cutMeshOnPlane(mesh, material) {
  var cut_plane_positive = getCutBox(false);
  var cut_plane_positive_BSP = new ThreeBSP( cut_plane_positive );
  // could use one cut plane box and do subtract and intersect to get each half
  var cut_plane_negative = getCutBox(true);
  var cut_plane_negative_BSP = new ThreeBSP( cut_plane_negative );

  // scene.add( cut_plane_positive );
  // scene.add( cut_plane_negative );

  var meshBSP = new ThreeBSP( mesh );

  var positive_mesh_BSP = meshBSP.subtract( cut_plane_positive_BSP );
  var positive_mesh = positive_mesh_BSP.toMesh( material.clone() );
  // positive_mesh.material.color.set(new THREE.Color( 0x00ff00 ));

  var negative_mesh_BSP = meshBSP.subtract( cut_plane_negative_BSP );
  var negative_mesh = negative_mesh_BSP.toMesh( material.clone() );
  // negative_mesh.material.color.set(new THREE.Color( 0xff0000 ));

  return {
    "positive": positive_mesh,
    "negative": negative_mesh
  }
}

function cutUpdate() {
  console.log("INSDIE CUT UPDATE");
  var mesh = scene_store.models[0].mesh;
  for (var i=0; i<scene_store.models.length; i+=1) {
    if (scene_store.models[i].selected) {
      console.log("FOUND SLECTED MESH IN LIST");
      mesh = scene_store.models[i].mesh;
    }
  }
  var r = cutMeshOnPlane(mesh, material);
  var positive_mesh = r.positive;
  var negative_mesh = r.negative;
  positive_mesh.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
  positive_mesh.scale.set(mesh.scale.x, mesh.scale.y, mesh.scale.z);
  negative_mesh.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
  negative_mesh.scale.set(mesh.scale.x, mesh.scale.y, mesh.scale.z);

  console.log("here");
  removeMesh(mesh);
  addMesh(positive_mesh, {keyactive: true, "keyactive__positive-target": true});
  addMesh(negative_mesh, {keyactive: true, "keyactive__negative-target": true});

  hideCutPlane()

  render();

  enterAddKeyState();
}
