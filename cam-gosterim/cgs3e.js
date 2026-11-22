/* Cam Gösterim Stüdyosu — Göz ve cam 3B (bakışın camdan geçtiği bölge)
   cagataygulumser.com · three.js r128 (MIT) */
(function () {
  'use strict';
  var T3 = 'https://cdn.jsdelivr.net/npm/three@0.128.0/';
  var LW = 25, LH = 19, LZ = 26, EXP = 2.7;
  var st = { ready: false, loading: false, cbs: [], vis: false, raf: 0, key: '', P: null, fy: 0 };
  function ls(src, cb) { var s = document.createElement('script'); s.src = src; s.async = true; s.onload = function () { cb(null); }; s.onerror = function () { cb(new Error(src)); }; document.head.appendChild(s); }
  function V(x, y, z) { return new THREE.Vector3(x, y, z); }
  function LC(h) { return new THREE.Color(h).convertSRGBToLinear(); }
  function inside(u, v) { return Math.pow(Math.abs(u), EXP) + Math.pow(Math.abs(v), EXP) <= 1; }
  function lz(x, y) { return LZ + 2.4 - (x * x + y * y) / 190; }
  function edge(t) { var c = Math.cos(t), s = Math.sin(t), e = 2 / EXP; return [LW * (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), e), LH * (s < 0 ? -1 : 1) * Math.pow(Math.abs(s), e)]; }
  function sprite(text, bg, fg) {
    var c = document.createElement('canvas'); c.width = 320; c.height = 96; var g = c.getContext('2d'); g.font = '700 40px Arial'; var w = Math.min(312, g.measureText(text).width + 48), x = (320 - w) / 2, r = 32;
    g.fillStyle = bg || 'rgba(8,20,45,.82)'; g.beginPath(); g.moveTo(x + r, 16); g.arcTo(x + w, 16, x + w, 80, r); g.arcTo(x + w, 80, x, 80, r); g.arcTo(x, 80, x, 16, r); g.arcTo(x, 16, x + w, 16, r); g.closePath(); g.fill();
    g.fillStyle = fg || '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 160, 50);
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false, transparent: true, toneMapped: false, sizeAttenuation: false })); sp.scale.set(0.11, 0.033, 1); sp.renderOrder = 30; return sp;
  }
  function cyl(mat) { var m = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 14, 1), mat); return m; }
  function span(m, a, b, r) { var d = b.clone().sub(a), l = d.length(); m.scale.set(r, l, r); m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); }

  function setup(el) {
    var r = new THREE.WebGLRenderer({ antialias: true, alpha: true }); st.r = r; r.outputEncoding = THREE.sRGBEncoding; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 0.9;
    r.domElement.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;display:block;touch-action:none'; el.appendChild(r.domElement); st.el = el;
    var sc = new THREE.Scene(); st.sc = sc;
    try { if (THREE.RoomEnvironment && THREE.PMREMGenerator) sc.environment = new THREE.PMREMGenerator(r).fromScene(new THREE.RoomEnvironment(), 0.04).texture; } catch (x) {}
    sc.add(new THREE.HemisphereLight(0xffffff, 0x9aa6b8, sc.environment ? 0.3 : 0.9)); var k = new THREE.DirectionalLight(0xffffff, 0.6); k.position.set(80, 140, 160); sc.add(k);
    st.cam = new THREE.PerspectiveCamera(28, 16 / 9, 2, 2000); st.cam.position.set(-82, 30, 112);
    st.ctl = new THREE.OrbitControls(st.cam, r.domElement); st.ctl.target.set(0, -3, 30); st.ctl.enableDamping = true; st.ctl.dampingFactor = 0.08; st.ctl.enablePan = false; st.ctl.minDistance = 55; st.ctl.maxDistance = 420; st.ctl.rotateSpeed = 0.7; st.ctl.update();
    /* göz */
    var eye = new THREE.Group(); st.eye = eye; sc.add(eye);
    eye.add(new THREE.Mesh(new THREE.SphereGeometry(12, 48, 32), new THREE.MeshStandardMaterial({ color: LC(0xf6f2ec), roughness: 0.32, envMapIntensity: 0.5 })));
    [[0.2, 0.525, 0x6b4020, 12.06], [0.0, 0.2, 0x05070b, 12.09], [0.5, 0.045, 0x2a1709, 12.08]].forEach(function (c) { var m = new THREE.Mesh(new THREE.SphereGeometry(c[3], 40, 10, 0, Math.PI * 2, c[0], c[1] - (c[0] && c[0] < 0.4 ? c[0] : 0)), new THREE.MeshStandardMaterial({ color: LC(c[2]), roughness: 0.35, envMapIntensity: 0.4 })); m.rotation.x = Math.PI / 2; eye.add(m); });
    var cor = new THREE.Mesh(new THREE.SphereGeometry(7.9, 32, 16, 0, Math.PI * 2, 0, 0.84), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, roughness: 0, clearcoat: 1, envMapIntensity: 1.0, depthWrite: false })); cor.rotation.x = Math.PI / 2; cor.position.z = 5.55; eye.add(cor);
    var lid = new THREE.Mesh(new THREE.SphereGeometry(12.6, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.36), new THREE.MeshStandardMaterial({ color: LC(0xdcb9a5), roughness: 0.75, side: THREE.DoubleSide })); lid.rotation.x = -0.5; sc.add(lid);
    var lid2 = new THREE.Mesh(new THREE.SphereGeometry(12.6, 40, 20, 0, Math.PI * 2, Math.PI * 0.72, Math.PI * 0.28), new THREE.MeshStandardMaterial({ color: LC(0xdcb9a5), roughness: 0.75, side: THREE.DoubleSide })); lid2.rotation.x = 0.42; sc.add(lid2);
    /* cam */
    var NR = 14, NS = 72, pos = [], uv = [], idx = [], i, j;
    for (i = 0; i <= NR; i++) for (j = 0; j < NS; j++) { var e = edge(j / NS * Math.PI * 2), t = i / NR, x = e[0] * t, y = e[1] * t; pos.push(x, y, lz(x, y)); uv.push(0.5 - x / LW / 2, 0.5 + y / LH / 2); }
    for (i = 0; i < NR; i++) for (j = 0; j < NS; j++) { var a = i * NS + j, b = i * NS + (j + 1) % NS, c = (i + 1) * NS + j, d = (i + 1) * NS + (j + 1) % NS; idx.push(a, c, b, b, c, d); }
    var lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); lg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); lg.setIndex(idx); lg.computeVertexNormals();
    st.cv = document.createElement('canvas'); st.cv.width = 384; st.cv.height = 292; st.tex = new THREE.CanvasTexture(st.cv); st.tex.encoding = THREE.sRGBEncoding;
    var lens = new THREE.Group(); st.lens = lens; sc.add(lens);
    var lm = new THREE.Mesh(lg, new THREE.MeshBasicMaterial({ map: st.tex, transparent: true, side: THREE.DoubleSide, depthWrite: false, toneMapped: false })); lm.renderOrder = 6; lens.add(lm);
    var gl = new THREE.Mesh(lg, new THREE.MeshPhysicalMaterial({ color: LC(0xd4ebff), transparent: true, opacity: 0.12, roughness: 0, clearcoat: 1, envMapIntensity: 1.6, side: THREE.DoubleSide, depthWrite: false })); gl.renderOrder = 7; lens.add(gl);
    var rp = []; for (j = 0; j < NS; j++) { var q = edge(j / NS * Math.PI * 2); rp.push(V(q[0], q[1], lz(q[0], q[1]))); }
    lens.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rp, true), 144, 0.75, 10, true), new THREE.MeshStandardMaterial({ color: LC(0x16181d), metalness: 0.9, roughness: 0.3 })));
    /* bakış ışını */
    var ym = new THREE.MeshBasicMaterial({ color: 0xffd400, toneMapped: false }), ym2 = new THREE.MeshBasicMaterial({ color: 0xffd400, toneMapped: false, transparent: true, opacity: 0.45 });
    st.ray1 = cyl(ym); st.ray2 = cyl(ym2); sc.add(st.ray1, st.ray2);
    st.tip = new THREE.Mesh(new THREE.ConeGeometry(2.2, 6, 16), ym); sc.add(st.tip);
    st.ring = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.5, 10, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, depthTest: false })); st.ring.renderOrder = 20; sc.add(st.ring);
    st.dot = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffd400, toneMapped: false, depthTest: false })); st.dot.renderOrder = 21; sc.add(st.dot);
    st.labels = new THREE.Group(); sc.add(st.labels);
    window.addEventListener('resize', resize); st.ready = true; resize();
  }
  function paint(P) {
    var c = st.cv, g = c.getContext('2d'), w = c.width, h = c.height, im = g.createImageData(w, h), d = im.data, x, y, k = 0;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++, k += 4) { var u = x / (w - 1) * 2 - 1, v = 1 - y / (h - 1) * 2; if (!inside(u, v)) { d[k + 3] = 0; continue; } var b = Math.max(0, Math.min(1, P.map(u, v))), t = Math.min(1, b / 0.7);
      d[k] = Math.round(90 + (255 - 90) * t); d[k + 1] = Math.round(190 + (132 - 190) * t); d[k + 2] = Math.round(255 + (30 - 255) * t); d[k + 3] = Math.round(255 * (0.2 + 0.52 * t)); }
    g.putImageData(im, 0, 0); st.tex.needsUpdate = true;
    while (st.labels.children.length) { var o = st.labels.children[0]; st.labels.remove(o); if (o.material.map) o.material.map.dispose(); o.material.dispose(); }
    (P.labels || []).forEach(function (L) { var sp = sprite(L[0]), px = -L[1] * LW, py = L[2] * LH - st.fy; sp.position.set(px, py, lz(px, py + st.fy) + 1.5); st.labels.add(sp); });
  }
  function update() {
    var P = st.P; if (!st.ready || !P) return null;
    st.fy = P.fy || 0; st.lens.position.y = -st.fy;
    if (P.key !== st.key) { st.key = P.key; paint(P); }
    var ya = (P.yaw || 0) * Math.PI / 180, pi = (P.pitch || 0) * Math.PI / 180, dir = V(-Math.sin(ya) * Math.cos(pi), Math.sin(pi), Math.cos(ya) * Math.cos(pi));
    st.eye.rotation.set(0, 0, 0); st.eye.quaternion.setFromUnitVectors(V(0, 0, 1), dir);
    var t = LZ / dir.z, hx = dir.x * t, hy = dir.y * t, i; for (i = 0; i < 3; i++) { t = lz(hx, hy + st.fy) / dir.z; hx = dir.x * t; hy = dir.y * t; }
    var hit = V(hx, hy, lz(hx, hy + st.fy)), u = -hx / LW, v = (hy + st.fy) / LH, ins = inside(u, v), p0 = dir.clone().multiplyScalar(13.2), end = hit.clone().addScaledVector(dir, 40);
    span(st.ray1, p0, hit, 0.42); span(st.ray2, hit, end, 0.42); st.tip.position.copy(end).addScaledVector(dir, 3); st.tip.quaternion.setFromUnitVectors(V(0, 1, 0), dir);
    st.ring.position.copy(hit); st.ring.quaternion.setFromUnitVectors(V(0, 0, 1), dir); st.dot.position.copy(hit); st.ring.visible = st.dot.visible = ins;
    return { u: u, v: v, inside: ins, blur: ins ? P.map(u, v) : 0 };
  }
  function resize() { if (!st.ready) return; var w = st.el.clientWidth || 2, h = st.el.clientHeight || 2; st.r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); st.r.setSize(w, h, false); st.cam.aspect = w / h; st.cam.fov = w / h < 1.2 ? 40 : 28; st.cam.zoom = h < 300 ? 0.7 : 1; st.cam.setViewOffset && (h < 300 ? st.cam.setViewOffset(w, h, 0, -h * 0.12, w, h) : st.cam.clearViewOffset()); st.cam.updateProjectionMatrix();
    var lk = Math.max(1, Math.min(1.8, 430 / h)); st.labels.children.forEach(function (sp) { sp.scale.set(0.11 * lk, 0.033 * lk, 1); }); }
  function loop() { st.raf = 0; if (!st.vis) return; st.ctl.update(); st.r.render(st.sc, st.cam); st.raf = requestAnimationFrame(loop); }
  window.CGS3E = {
    mount: function (el, cb) {
      if (st.ready) { cb && cb(null); return; } if (cb) st.cbs.push(cb); if (st.loading) return; st.loading = true;
      function done(e) { st.loading = false; var a = st.cbs; st.cbs = []; a.forEach(function (f) { f(e); }); }
      function s3() { try { setup(el); done(null); } catch (x) { done(x); } }
      function s2() { if (THREE.OrbitControls) return s25(); ls(T3 + 'examples/js/controls/OrbitControls.js', function (e) { if (e) return done(e); s25(); }); }
      function s25() { if (THREE.RoomEnvironment) return s3(); ls(T3 + 'examples/js/environments/RoomEnvironment.js', function () { s3(); }); }
      if (window.THREE && THREE.REVISION) s2(); else ls(T3 + 'build/three.min.js', function (e) { if (e) return done(e); s2(); });
    },
    set: function (P) { st.P = P; return update(); },
    show: function (on) { st.vis = on; if (on) { resize(); if (!st.raf && st.ready) st.raf = requestAnimationFrame(loop); } },
    resize: resize, state: st
  };
})();
