// modified from:
// https://stackoverflow.com/questions/19190331/unable-to-retain-line-breaks-when-writing-text-file-as-blob
// https://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
function download(filename, data) {
  blob = new Blob([data], {type:'text/plain'});
  var a = document.createElement('a');
  a.download = filename;
  a.innerHTML = 'download';
  a.href = URL.createObjectURL(blob);
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function exportToObj(filename, mesh) {
  console.log("trying to export "+filename);
  console.log(mesh);
  var exporter = new THREE.OBJExporter();
  var result = exporter.parse( mesh );
  download(filename, result);
}

function exportAllModels() {
  for (var i=0; i<scene_store.models.length; i+=1) {
    var mesh = scene_store.models[i].mesh;
    var filename = "model" + i + ".obj"
    exportToObj(filename, mesh);
  }
}
