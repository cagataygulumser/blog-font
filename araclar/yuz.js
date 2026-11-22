/* Ortak yüz işaretleyici yükleyici (MediaPipe Face Landmarker) · cagataygulumser.com */
(function () {
  'use strict';
  var V = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14', MODEL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task', pr = null;
  window.CGYUZ = { load: function () { if (pr) return pr; pr = import(V + '/vision_bundle.mjs').then(function (m) { return m.FilesetResolver.forVisionTasks(V + '/wasm').then(function (fs) { function mk(d) { return m.FaceLandmarker.createFromOptions(fs, { baseOptions: { modelAssetPath: MODEL, delegate: d }, runningMode: 'VIDEO', numFaces: 1, outputFacialTransformationMatrixes: true }); } return mk('GPU').catch(function () { return mk('CPU'); }); }); }); pr.catch(function () { pr = null; }); return pr; } };
})();
