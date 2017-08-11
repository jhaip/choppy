function updateUIControls() {
  $(".sidebar__load-stl").hide();
  $(".sidebar__start-cut").hide();
  $(".sidebar__cut").hide();
  $(".sidebar__export").hide();
  $(".sidebar__exit-add-key").hide();
  $(".sidebar__exit-cut").hide();
  switch (scene_store.state) {
  case "EMPTY":
    $(".sidebar__load-stl").show();
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
      if (scene_store.models[i].activecut) {
        $el.addClass("is-active-cut");
      } else {
        $el.removeClass("is-active-cut");
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
    enterCut();
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
  $(".sidebar__export").click(function() {
    exportAllModels();
  });
  $(".canvas-container").mousemove(onDocumentMouseMove);
  $(".canvas-container").dblclick(function(event) {
    if (scene_store.state === "ADD_KEY") {
      commitKey();
    }
  });

  window.addEventListener( 'resize', onWindowResize, false );
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
