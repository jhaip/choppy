function updateUIControls() {
  $(".sidebar__load-stl").hide();
  $(".sidebar__start-cut").hide();
  $(".sidebar__cut").hide();
  $(".sidebar__export").hide();
  $(".sidebar__exit-add-key").hide();
  $(".sidebar__exit-cut").hide();
  $(".sidebar__load-user-stl").hide();
  $(".sidebar__flip-key-direction").hide();
  switch (scene_store.state) {
  case "EMPTY":
    $(".sidebar__load-stl").show();
    $(".sidebar__load-user-stl").show();
    break;
  case "LOADING_MODEL":
    break;
  case "IDLE":
    $(".sidebar__start-cut").show();
    $(".sidebar__export").show();
    break;
  case "EDIT_CUT_PLANE":
    $(".sidebar__cut").show();
    $(".sidebar__exit-cut").show();
    break;
  case "ADD_KEY":
    $(".sidebar__exit-add-key").show();
    $(".sidebar__flip-key-direction").show();
    break;
  }
}

function updatePartListDisplay() {
  var $part_list = $(".part-list");
  $part_list.empty();
  for (var i=0; i<scene_store.models.length; i+=1) {
      var $el = $("<div></div>");
      $el.addClass("part-list__item");
      if (scene_store.models[i].selected) {
        $el.addClass("is-selected");
      } else {
        $el.removeClass("is-selected");
      }
      if (scene_store.models[i].keyactive) {
        if (scene_store.models[i]["keyactive__positive-target"]) {
          $el.addClass("is-active-cut is-active-cut--positive");
        } else if (scene_store.models[i]["keyactive__negative-target"]) {
          $el.addClass("is-active-cut is-active-cut--negative");
        }
      } else {
        $el.removeClass("is-active-cut is-active-cut--positive is-active-cut--negative");
      }

      var text = "Model "+i;
      var $modelName = $("<span></span>")
        .text(text)
        .click(function() {
          selectModel($(this).parent().data("id"));
          updatePartListDisplay();
        });
      $el.append($modelName);
      var $visibilityIcon = $("<span></span>")
        .addClass("part-list__item__visibility")
        .text("[@]")
        .click(function() {
          toggleMeshVisibility($(this).parent().data("id"));
          updatePartListDisplay();
        });
      if (!scene_store.models[i].visible) {
        $visibilityIcon.text("[-]");
      }
      $el.append($visibilityIcon);
      $el.data("id", i)
      $part_list.append($el);
  }
}

function initUIEventListeners() {
  $(".sidebar__load-stl").click(function() {
    loadSTL();
  });
  $(".sidebar__start-cut").click(function() {
    enterEditCutPlane();
  });
  $(".sidebar__exit-cut").click(function() {
    enterIdle();
  });
  $(".sidebar__cut").click(function() {
    cutUpdate();
  });
  $(".sidebar__exit-add-key").click(function() {
    enterIdle();
  });
  $(".sidebar__flip-key-direction").click(function() {
    flipKeyDirection();
  });
  $(".sidebar__export").click(function() {
    exportAllModels();
  });
  $(".canvas-container").mousemove(onDocumentMouseMove);
  $(".canvas-container").dblclick(function(event) {
    if (scene_store.state === "ADD_KEY") {
      commitKey();
    }
  });

  $(".sidebar__load-user-stl").change(function() {
    // modified from https://stackoverflow.com/questions/22255580/javascript-upload-image-file-and-draw-it-into-a-canvas
    if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
          console.log(e);
          loadUserSTL(e.target.result);
          //  var img = new Image();
          //  img.addEventListener("load", function() {
          //    context.drawImage(img, 0, 0);
          //  });
          //  img.src = e.target.result;
        };
        FR.readAsDataURL( this.files[0] );
    }
  });

  window.addEventListener( 'resize', onWindowResize, false );

  window.addEventListener( 'keydown', function ( event ) {

    switch ( event.keyCode ) {

      case 81: // Q
        transform_controls.setSpace( transform_controls.space === "local" ? "world" : "local" );
        break;

      case 17: // Ctrl
        transform_controls.setTranslationSnap( 100 );
        transform_controls.setRotationSnap( THREE.Math.degToRad( 15 ) );
        break;

      case 87: // W
        transform_controls.setMode( "translate" );
        break;

      case 69: // E
        transform_controls.setMode( "rotate" );
        break;

      case 82: // R
        transform_controls.setMode( "scale" );
        break;

      case 187:
      case 107: // +, =, num+
        transform_controls.setSize( transform_controls.size + 0.1 );
        break;

      case 189:
      case 109: // -, _, num-
        transform_controls.setSize( Math.max( transform_controls.size - 0.1, 0.1 ) );
        break;

    }

  });
}

function onDocumentMouseMove( event ) {
  event.preventDefault();
  // console.log(event);
  mouse.x = ( (event.clientX - $(".canvas-container").position().left) / $(".canvas-container").width() ) * 2 - 1;
  mouse.y = - ( (event.clientY - $(".canvas-container").position().top) / $(".canvas-container").height() ) * 2 + 1;
  render();
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();

}
