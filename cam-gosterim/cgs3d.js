/* Cam Gösterim Stüdyosu — 3B kalınlık önizlemesi
   cagataygulumser.com · three.js r128 (MIT)
   Baş modeli: "Infinite, 3D Head Scan" — Lee Perry-Smith, CC BY 3.0 (www.triplegangers.com / ir-ltd.net) */
(function () {
  'use strict';
  var T3 = 'https://cdn.jsdelivr.net/npm/three@0.128.0/';
  var DENS = { '1.5': 1.32, '1.56': 1.23, '1.59': 1.20, '1.6': 1.30, '1.67': 1.36, '1.74': 1.47 };
  var COLORS = { siyah: 0x16181d, altin: 0xc9a24a, gumus: 0xb8c0c9, kahve: 0x6b4428, lacivert: 0x1d3a6e };
  var HEAD_S = 48, HEAD_OFF = [0, -77.5, -111];
  var EAR = [74, 9, -99];
  var st = { ready: false, loading: false, el: null, r: null, sc: null, cam: null, ctl: null, glasses: null, head: null, shadow: null,
    raf: 0, vis: false, auto: false, P: null, stats: null, labels: [], headOn: true, cbs: [] };

  function loadScript(src, cb) { var s = document.createElement('script'); s.src = src; s.async = true; s.onload = function () { cb(null); }; s.onerror = function () { cb(new Error(src)); }; document.head.appendChild(s); }
  function cl(x, a, b) { return x < a ? a : x > b ? b : x; }

  /* ---------- optik ---------- */
  function ctMin(n) { return n >= 1.67 ? 1.2 : n >= 1.59 ? 1.5 : n >= 1.56 ? 1.6 : 2.0; }
  function ssag(F, n, r) { if (Math.abs(F) < 0.01) return 0; var R = (n - 1) * 1000 / Math.abs(F), q = Math.min(r, R * 0.97), s = R - Math.sqrt(R * R - q * q); return F > 0 ? s : -s; }
  function contour(shape, A, phi, side) {
    var a = A / 2, c = Math.cos(phi), s = Math.sin(phi), x, y, e;
    if (shape === 'yuvarlak') { x = a * c; y = a * s; }
    else if (shape === 'oval') { x = a * c; y = a * 0.8 * s; }
    else if (shape === 'pilot') { x = a * c; y = a * (s < 0 ? 0.98 : 0.78) * s; if (s < 0) x += side * a * 0.10 * (-s); x *= (1 - 0.10 * Math.max(0, -s) * (side * c < 0 ? 1 : 0)); }
    else { e = 2 / 4.2; x = a * (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), e); y = a * 0.7 * (s < 0 ? -1 : 1) * Math.pow(Math.abs(s), e); }
    return [x, y];
  }
  function buildLens(rx, P, side) {
    var NR = 22, NS = 96, n = rx.n, S = rx.s, C = rx.c, ax = rx.a * Math.PI / 180;
    var dec = (P.A + P.dbl - P.pd) / 2, ocx = -side * dec, ocy = 2;
    var se = S + C / 2, base = se >= 0 ? cl(se + 4, 4, 10) : cl(se / 2 + 5, 0.5, 5), Rb = 530 / base;
    function fsag(x, y) { var r = Math.min(Math.sqrt(x * x + y * y), Rb * 0.95); return Rb - Math.sqrt(Rb * Rb - r * r); }
    function sg(x, y) { var dx = x - ocx, dy = y - ocy, r = Math.sqrt(dx * dx + dy * dy), th = Math.atan2(dy, dx), F = S + C * Math.pow(Math.sin(th - ax), 2); return ssag(F, n, r); }
    var pts = [], i, j, k, maxS = -1e9;
    for (i = 0; i <= NR; i++) { pts.push([]); for (j = 0; j < NS; j++) { var t = i / NR, p = contour(P.shape, P.A, j / NS * Math.PI * 2, side), x = p[0] * t, y = p[1] * t, s = sg(x, y); if (s > maxS) maxS = s; pts[i].push([x, y, s]); } }
    var t0 = Math.max(ctMin(n), 1.0 + maxS);
    var fp = [], bp = [], idx = [];
    for (i = 0; i <= NR; i++) for (j = 0; j < NS; j++) { var q = pts[i][j], zf = -fsag(q[0], q[1]), th2 = t0 - q[2]; q[3] = zf; q[4] = th2; fp.push(q[0], q[1], zf); bp.push(q[0], q[1], zf - th2); }
    for (i = 0; i < NR; i++) for (j = 0; j < NS; j++) { var a = i * NS + j, b = i * NS + (j + 1) % NS, c = (i + 1) * NS + j, d = (i + 1) * NS + (j + 1) % NS; idx.push(a, c, b, b, c, d); }
    var gf = new THREE.BufferGeometry(); gf.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3)); gf.setIndex(idx); gf.computeVertexNormals();
    var gb = new THREE.BufferGeometry(); gb.setAttribute('position', new THREE.Float32BufferAttribute(bp, 3)); gb.setIndex(idx.slice().reverse()); gb.computeVertexNormals();
    var ep = [], ei = [], rim = [], maxE = -1, minE = 1e9, maxP = null, vol = 0;
    for (j = 0; j < NS; j++) { var o = pts[NR][j]; ep.push(o[0], o[1], o[3], o[0], o[1], o[3] - o[4]); rim.push(new THREE.Vector3(o[0], o[1], o[3] - Math.min(o[4] * 0.3, 1.2))); if (o[4] > maxE) { maxE = o[4]; maxP = [o[0], o[1], o[3] - o[4] / 2]; } if (o[4] < minE) minE = o[4]; }
    for (j = 0; j < NS; j++) { k = (j + 1) % NS; ei.push(j * 2, j * 2 + 1, k * 2, k * 2, j * 2 + 1, k * 2 + 1); }
    var ge = new THREE.BufferGeometry(); ge.setAttribute('position', new THREE.Float32BufferAttribute(ep, 3)); ge.setIndex(ei); ge.computeVertexNormals();
    for (i = 0; i < NR; i++) for (j = 0; j < NS; j++) { var A0 = pts[i][j], B0 = pts[i][(j + 1) % NS], C0 = pts[i + 1][j], D0 = pts[i + 1][(j + 1) % NS];
      var ar = Math.abs((C0[0] - A0[0]) * (B0[1] - A0[1]) - (B0[0] - A0[0]) * (C0[1] - A0[1])) / 2 + Math.abs((C0[0] - D0[0]) * (B0[1] - D0[1]) - (B0[0] - D0[0]) * (C0[1] - D0[1])) / 2;
      vol += ar * (A0[4] + B0[4] + C0[4] + D0[4]) / 4; }
    return { gf: gf, gb: gb, ge: ge, rim: rim, stats: { maxE: maxE, minE: minE, ct: t0 - sg(ocx, ocy), g: vol / 1000 * (DENS[String(n)] || 1.3), maxP: maxP, n: n } };
  }
  function label(text, color) {
    var c = document.createElement('canvas'); c.width = 256; c.height = 96; var g = c.getContext('2d'); g.font = '700 44px Arial'; var w = Math.min(248, g.measureText(text).width + 44);
    g.fillStyle = color || '#ffd400'; var x = (256 - w) / 2, r = 34; g.beginPath(); g.moveTo(x + r, 14); g.arcTo(x + w, 14, x + w, 82, r); g.arcTo(x + w, 82, x, 82, r); g.arcTo(x, 82, x, 14, r); g.arcTo(x, 14, x + w, 14, r); g.closePath(); g.fill();
    g.fillStyle = '#14233b'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 128, 50);
    var tx = new THREE.CanvasTexture(c), sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, depthTest: false, transparent: true, toneMapped: false, sizeAttenuation: false })); sp.scale.set(0.088, 0.033, 1); sp.renderOrder = 20; return sp;
  }
  function tube(points, rad, closed, mat, seg) { var cv = new THREE.CatmullRomCurve3(points, !!closed, 'catmullrom', 0.5); return new THREE.Mesh(new THREE.TubeGeometry(cv, seg || 64, rad, 10, !!closed), mat); }
  function V(x, y, z) { return new THREE.Vector3(x, y, z); }
  function LC(h) { return new THREE.Color(h).convertSRGBToLinear(); }

  function rebuild() {
    var P = st.P; if (!st.ready || !P) return;
    if (st.glasses) { st.sc.remove(st.glasses); st.glasses.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } }); }
    var G = new THREE.Group(); st.glasses = G; st.labels = [];
    var acet = P.frame === 'asetat', col = COLORS[P.color] != null ? COLORS[P.color] : COLORS.siyah;
    var fm = new THREE.MeshStandardMaterial({ color: LC(col), metalness: acet ? 0.0 : 0.9, roughness: acet ? 0.28 : 0.3, envMapIntensity: acet ? 0.35 : 0.9 });
    var lm = new THREE.MeshPhysicalMaterial({ color: LC(0xd4ebff), transparent: true, opacity: 0.3, roughness: 0.0, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.0, envMapIntensity: 1.6, side: THREE.DoubleSide, depthWrite: false });
    var em = new THREE.MeshStandardMaterial({ color: LC(0xcdeee4), transparent: true, opacity: 0.93, roughness: 0.5, metalness: 0, envMapIntensity: 0.6, side: THREE.DoubleSide });
    var rr = acet ? 2.3 : 0.95, xc = (P.A + P.dbl) / 2, stats = {}, rims = {};
    [['r', -1], ['l', 1]].forEach(function (e) {
      var key = e[0], side = e[1], L = buildLens(P[key], P, side), g = new THREE.Group(); g.position.set(side * xc, 0, 0);
      var mb = new THREE.Mesh(L.gb, lm), me = new THREE.Mesh(L.ge, em), mf = new THREE.Mesh(L.gf, lm); mb.renderOrder = 5; me.renderOrder = 6; mf.renderOrder = 7; g.add(mb, me, mf);
      var rp = L.rim.map(function (v) { var k = 1 + (acet ? rr * 0.75 : rr * 0.6) / Math.max(8, Math.sqrt(v.x * v.x + v.y * v.y)); return V(v.x * k, v.y * k, v.z); });
      g.add(tube(rp, rr, true, fm, 120)); rims[key] = rp.map(function (v) { return V(v.x + side * xc, v.y, v.z); });
      var plus = L.stats.ct > L.stats.maxE, lp = plus ? [-side * (P.A + P.dbl - P.pd) / 2, 2, 1.5] : L.stats.maxP, sp = label((plus ? L.stats.ct : L.stats.maxE).toFixed(1).replace('.', ',') + ' mm'); sp.position.set(lp[0] * (plus ? 1 : 1.16), lp[1] * (plus ? 1 : 1.16) - (plus ? 0 : 3), lp[2] + (plus ? 4 : 0)); g.add(sp); st.labels.push(sp);
      var dot = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffd400, toneMapped: false })); dot.position.set(lp[0], lp[1], lp[2]); g.add(dot); L.stats.plus = plus;
      stats[key] = L.stats; G.add(g);
    });
    function pick(arr, fn) { var b = null, bv = -1e9; arr.forEach(function (v) { var s = fn(v); if (s > bv) { bv = s; b = v; } }); return b; }
    var nr = pick(rims.r, function (v) { return v.x * 1 + v.y * 0.55; }), nl = pick(rims.l, function (v) { return -v.x * 1 + v.y * 0.55; });
    G.add(tube([nr, V(nr.x * 0.5, nr.y + 1.6, nr.z + 1.2), V(0, nr.y + 2.2, nr.z + 1.6), V(nl.x * 0.5, nl.y + 1.6, nl.z + 1.2), nl], acet ? 2.1 : 0.9, false, fm, 40));
    if (!acet) { [-1, 1].forEach(function (s) { var pr = pick(s < 0 ? rims.r : rims.l, function (v) { return -s * v.x * 1 - v.y * 0.7; });
      G.add(tube([pr, V(pr.x - s * 1.5, pr.y - 2, pr.z - 4), V(s * 8.5, pr.y - 4.5, pr.z - 7)], 0.45, false, fm, 16));
      var pad = new THREE.Mesh(new THREE.SphereGeometry(3.2, 16, 12), new THREE.MeshStandardMaterial({ color: 0xf2f4f7, transparent: true, opacity: 0.8, roughness: 0.2 })); pad.scale.set(0.45, 1, 0.75); pad.position.set(s * 8.2, pr.y - 5, pr.z - 7.6); pad.rotation.z = s * 0.35; G.add(pad); }); }
    [-1, 1].forEach(function (s) { var tp = pick(s < 0 ? rims.r : rims.l, function (v) { return s * v.x * 1 + v.y * 0.45; }), tr = acet ? 1.9 : 0.85, ex = s * Math.max(Math.abs(tp.x) + 6, 70);
      G.add(tube([tp, V(tp.x + s * 3.2, tp.y + 0.4, tp.z - 1.5), V(tp.x + s * 4.5, tp.y, tp.z - 9), V(ex + s * 1.5, tp.y * 0.55 + EAR[1] * 0.45, -52), V(s * EAR[0], EAR[1], EAR[2]), V(s * (EAR[0] - 1), EAR[1] - 5, EAR[2] - 13), V(s * (EAR[0] - 3), EAR[1] - 19, EAR[2] - 21), V(s * (EAR[0] - 5), EAR[1] - 34, EAR[2] - 22)], tr, false, fm, 90)); });
    st.sc.add(G); st.stats = stats; fitShadow();
  }
  function fitShadow() { if (!st.shadow) return; st.shadow.position.y = st.headOn && st.head ? -78 - 3.9 * HEAD_S + 2 : -34; var k = st.headOn && st.head ? 1 : 0.42; st.shadow.scale.set(k, k, k); }
  var VIEWS = { on: [0, 2, 1], yan: [1, 0.04, 0.06], ust: [0, 1, 0.16], capraz: [0.62, 0.2, 0.76], arka: [-0.5, 0.28, -0.8] };
  function view(name, instant) {
    if (!st.ready) return; var v = VIEWS[name] || VIEWS.capraz, d = (st.headOn && st.head ? 520 : 300) * Math.max(1, 1.7 / (st.cam.aspect || 1.7)), n = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    var tgt = st.headOn && st.head ? V(0, -18, -40) : V(0, 0, -10), to = V(tgt.x + v[0] / n * d, tgt.y + v[1] / n * d + (name === 'on' ? -d * 0.86 : 0), tgt.z + v[2] / n * d);
    if (name === 'on') to.set(tgt.x, tgt.y + 6, tgt.z + d);
    st.anim = { p0: st.cam.position.clone(), p1: to, t0: st.ctl.target.clone(), t1: tgt, k: instant ? 1 : 0 };
  }
  function loop() {
    st.raf = 0; if (!st.vis) return;
    if (st.anim) { var a = st.anim; a.k = Math.min(1, a.k + 0.06); var e = a.k * a.k * (3 - 2 * a.k); st.cam.position.lerpVectors(a.p0, a.p1, e); st.ctl.target.lerpVectors(a.t0, a.t1, e); if (a.k >= 1) st.anim = null; }
    st.ctl.autoRotate = st.auto && !st.anim; st.ctl.update(); st.r.render(st.sc, st.cam); st.raf = requestAnimationFrame(loop);
  }
  function resize() { if (!st.ready) return; var w = st.el.clientWidth || 2, h = st.el.clientHeight || 2, oa = st.cam.aspect; st.r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); st.r.setSize(w, h, false); st.cam.aspect = w / h; st.cam.updateProjectionMatrix(); if (Math.abs(oa - w / h) > 0.15 && st.vis) view(st.viewName || 'capraz', true); }
  function setup(base) {
    var r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: false }); st.r = r; r.outputEncoding = THREE.sRGBEncoding; r.domElement.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;display:block;touch-action:none'; st.el.appendChild(r.domElement);
    var sc = new THREE.Scene(); st.sc = sc;
    r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 0.82; r.physicallyCorrectLights = false;
    try { if (THREE.RoomEnvironment && THREE.PMREMGenerator) { var pm = new THREE.PMREMGenerator(r); sc.environment = pm.fromScene(new THREE.RoomEnvironment(), 0.04).texture; } } catch (x) {}
    sc.add(new THREE.HemisphereLight(0xffffff, 0x9aa6b8, sc.environment ? 0.25 : 0.8)); var k = new THREE.DirectionalLight(0xffffff, sc.environment ? 0.55 : 0.8); k.position.set(120, 220, 300); sc.add(k); var f = new THREE.DirectionalLight(0xdfe9ff, 0.2); f.position.set(-260, 60, 120); sc.add(f);
    st.cam = new THREE.PerspectiveCamera(26, 16 / 9, 5, 4000); st.cam.position.set(260, 60, 360);
    st.ctl = new THREE.OrbitControls(st.cam, r.domElement); st.ctl.enableDamping = true; st.ctl.dampingFactor = 0.08; st.ctl.enablePan = false; st.ctl.minDistance = 120; st.ctl.maxDistance = 900; st.ctl.autoRotateSpeed = 1.4; st.ctl.addEventListener('start', function () { st.anim = null; });
    var c = document.createElement('canvas'); c.width = c.height = 256; var g = c.getContext('2d'), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, 'rgba(20,40,80,.3)'); gr.addColorStop(1, 'rgba(20,40,80,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    st.shadow = new THREE.Mesh(new THREE.PlaneGeometry(520, 520), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })); st.shadow.rotation.x = -Math.PI / 2; sc.add(st.shadow);
    new THREE.GLTFLoader().load(base + 'head.glb', function (gl) { var h = gl.scene; h.traverse(function (o) { if (o.isMesh) o.material = new THREE.MeshStandardMaterial({ color: LC(0xd9b9a6), roughness: 0.82, metalness: 0, envMapIntensity: 0.55 }); }); h.scale.set(HEAD_S, HEAD_S, HEAD_S); h.position.set(HEAD_OFF[0], HEAD_OFF[1], HEAD_OFF[2]); h.visible = st.headOn; st.head = h; sc.add(h); fitShadow(); view(st.viewName || 'capraz', true); if (st.onHead) st.onHead(); }, undefined, function () { st.headFail = true; if (st.onHead) st.onHead(); });
    window.addEventListener('resize', resize); st.ready = true; resize(); rebuild(); view(st.viewName || 'capraz', true);
  }
  window.CGS3D = {
    mount: function (el, base, cb) {
      st.el = el; if (st.ready) { cb && cb(null); return; } if (cb) st.cbs.push(cb); if (st.loading) return; st.loading = true;
      function done(err) { st.loading = false; var a = st.cbs; st.cbs = []; a.forEach(function (f) { f(err); }); }
      function step2() { loadScript(T3 + 'examples/js/controls/OrbitControls.js', function (e) { if (e) return done(e); loadScript(T3 + 'examples/js/loaders/GLTFLoader.js', function (e2) { if (e2) return done(e2); loadScript(T3 + 'examples/js/environments/RoomEnvironment.js', function () { try { setup(base); done(null); } catch (x) { done(x); } }); }); }); }
      if (window.THREE && THREE.REVISION) step2(); else loadScript(T3 + 'build/three.min.js', function (e) { if (e) return done(e); step2(); });
    },
    set: function (P) { st.P = P; var hv = P.head !== false; if (hv !== st.headOn) { st.headOn = hv; if (st.head) st.head.visible = hv; if (st.ready) view(st.viewName || 'capraz'); } st.auto = !!P.auto; rebuild(); return st.stats; },
    view: function (n) { st.viewName = n; view(n); },
    show: function (on) { st.vis = on; if (on) { resize(); if (!st.raf && st.ready) st.raf = requestAnimationFrame(loop); } },
    resize: resize, stats: function () { return st.stats; }, onHead: function (f) { st.onHead = f; }, state: st
  };
})();
