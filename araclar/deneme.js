/* Sanal Gözlük Deneme · cagataygulumser.com · three.js r128 (MIT), MediaPipe Face Landmarker */
(function () {
  'use strict';
  var root = document.getElementById('cgt-deneme'); if (!root || root.querySelector('canvas')) return;
  var cs = document.currentScript, BASE = cs && cs.src ? cs.src.replace(/[^\/]*$/, '') : '', T3 = 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js';
  var SH = [['dikdortgen', 'Dikdörtgen'], ['klasik', 'Klasik'], ['oval', 'Oval'], ['yuvarlak', 'Yuvarlak'], ['pilot', 'Pilot'], ['kedi', 'Kedi gözü']];
  var FC = [['siyah', 'Siyah', '#16181d'], ['altin', 'Altın', '#c9a24a'], ['gumus', 'Gümüş', '#b8c0c9'], ['kahve', 'Kahve', '#6b4428'], ['lacivert', 'Lacivert', '#1d3a6e'], ['bordo', 'Bordo', '#7a1f2e']];
  var TN = [['yok', 'Şeffaf', null, 0.08], ['gri', 'Gri', '#3a3f45', 0.72], ['kahve', 'Kahve', '#5a3a1e', 0.7], ['yesil', 'Yeşil', '#2f4a36', 0.7], ['mavi', 'Mavi', '#27508a', 0.62]];
  var BR = { dikdortgen: 0.7, oval: 0.8, yuvarlak: 1, pilot: 0.88, klasik: 0.82, kedi: 0.74 };
  var S = { sh: 'klasik', fr: 'asetat', col: 'siyah', tn: 'yok', A: 52, src: '' }, lm = null, vid, img = null, three = null, tmr = null, msg = 'Başlamak için kamerayı açın ya da bir yüz fotoğrafı yükleyin', pose = null, mirror = true, key = '';
  function $(i) { return document.getElementById(i); }
  root.innerHTML = '<p class="cgt-lead">Farklı çerçeve şekillerinin yüzünüzde nasıl durduğunu görün. Kameranızı açın ya da bir fotoğraf yükleyin; şekli, rengi ve cam tonunu değiştirin.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="dnP"></div><div class="cgt-col"><div class="cgt-stage" id="dnS" style="aspect-ratio:16/9"><video id="dnV" playsinline muted style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;transform:scaleX(-1);display:none"></video><img id="dnI" alt="" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;display:none"><canvas id="dnC" style="position:absolute;left:0;top:0;width:100%;height:100%"></canvas><div id="dnM" style="position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;color:#cfe3ff;font-weight:700;font-size:17px;padding:0 20px"></div></div><div class="cgt-info" id="dnN"><b>Sanal deneme:</b> Çerçeveler genel şekil örnekleridir, belirli bir ürünü ya da markayı göstermez. Yüzünüze hangi şeklin yakıştığını görmek içindir; ölçü, cam ve uygunluk için optisyeninize danışın.</div></div></div>' +
    '<p class="cgt-note">Görüntünüz cihazınızdan çıkmaz, hiçbir sunucuya gönderilmez ve kaydedilmez. Yerleşim yaklaşıktır; gerçek gözlüğün yüzdeki duruşu burun ve kulak yapısına göre değişir.</p><input type="file" id="dnF" accept="image/*" style="display:none">';
  vid = $('dnV');
  function ls(src, cb) { var s = document.createElement('script'); s.src = src; s.onload = function () { cb(null); }; s.onerror = function () { cb(new Error(src)); }; document.head.appendChild(s); }
  function panel() {
    function chips(k, a, cur) { return '<div class="cgt-chips">' + a.map(function (x) { return '<button type="button" class="cgt-chip' + (x[0] === cur ? ' on' : '') + '" data-k="' + k + '" data-v="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div>'; }
    function dots(k, a, cur) { return '<div class="cgt-chips">' + a.map(function (x) { return '<button type="button" data-k="' + k + '" data-v="' + x[0] + '" title="' + x[1] + '" aria-label="' + x[1] + '" style="width:30px;height:30px;border-radius:50%;padding:0;cursor:pointer;border:2px solid #fff;box-shadow:0 0 0 ' + (x[0] === cur ? '3px #0f3fa6' : '1px #c5cedc') + ';background:' + (x[2] || 'linear-gradient(135deg,#fff 45%,#d5e6fb)') + '"></button>'; }).join('') + '</div>'; }
    $('dnP').innerHTML = '<div><p class="cgt-h">Görüntü</p><div class="cgt-chips"><button type="button" class="cgt-btn' + (S.src === 'kamera' ? '' : ' b') + '" data-a="cam">' + (S.src === 'kamera' ? 'Kamerayı kapat' : 'Kamerayı aç') + '</button><button type="button" class="cgt-btn" data-a="up">Fotoğraf yükle</button></div></div>' +
      '<div><p class="cgt-h">Çerçeve şekli</p>' + chips('sh', SH, S.sh) + '</div><div><p class="cgt-h">Çerçeve</p>' + chips('fr', [['asetat', 'Asetat'], ['metal', 'İnce metal']], S.fr) + '<div style="height:10px"></div>' + dots('col', FC, S.col) + '</div>' +
      '<div><p class="cgt-h">Cam tonu</p>' + dots('tn', TN, S.tn) + '</div>' +
      '<div><div class="cgt-row"><span>Cam genişliği</span><b id="dnA">' + S.A + ' mm</b></div><input type="range" data-k="A" min="44" max="60" step="1" value="' + S.A + '"></div>' +
      '<button type="button" class="cgt-btn y" data-a="snap"' + (S.src ? '' : ' disabled') + '>Fotoğrafı kaydet</button>';
  }
  /* ---- gözlük modeli (mm) ---- */
  function uraw(sh, ns, t) { var n = sh === 'kedi' ? 2.5 : 2.6, c = Math.cos(t), s = Math.sin(t), u = (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 2 / n), v = (s < 0 ? -1 : 1) * Math.pow(Math.abs(s), 2 / n), nz = u * ns; if (sh === 'kedi') { var tz = Math.max(0, -nz); if (v > 0) { v *= 1 + 0.75 * tz * tz; u *= 1 + 0.1 * v * tz; } else u *= 1 - 0.16 * (-v); } return [u, v]; }
  function contour(sh, A, phi, side) {
    var a = A / 2, c = Math.cos(phi), s = Math.sin(phi), x, y, e, i, q;
    if (sh === 'klasik' || sh === 'kedi') { var b = [1e9, -1e9, 1e9, -1e9]; for (i = 0; i < 90; i++) { q = uraw(sh, -side, i / 90 * Math.PI * 2); b[0] = Math.min(b[0], q[0]); b[1] = Math.max(b[1], q[0]); b[2] = Math.min(b[2], q[1]); b[3] = Math.max(b[3], q[1]); } q = uraw(sh, -side, phi); return [((q[0] - b[0]) / (b[1] - b[0]) - .5) * A, ((q[1] - b[2]) / (b[3] - b[2]) - .5) * BR[sh] * A]; }
    if (sh === 'yuvarlak') { x = a * c; y = a * s; } else if (sh === 'oval') { x = a * c; y = a * .8 * s; }
    else if (sh === 'pilot') { x = a * c; y = a * (s < 0 ? .98 : .78) * s; if (s < 0) x += side * a * .1 * (-s); x *= (1 - .1 * Math.max(0, -s) * (side * c < 0 ? 1 : 0)); }
    else { e = 2 / 4.2; x = a * (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), e); y = a * .7 * (s < 0 ? -1 : 1) * Math.pow(Math.abs(s), e); if (y < 0 && side * x < 0) x += side * .2 * (-y) * Math.abs(x) / a; }
    return [x, y];
  }
  function build() {
    var T = THREE, G = new T.Group(), acet = S.fr === 'asetat', col = '#16181d', i; FC.forEach(function (c) { if (c[0] === S.col) col = c[2]; });
    var fm = new T.MeshPhongMaterial({ color: new T.Color(col), specular: acet ? 0x555555 : 0xcccccc, shininess: acet ? 60 : 120 }), tn = TN[0]; TN.forEach(function (t) { if (t[0] === S.tn) tn = t; });
    var lmat = new T.MeshPhongMaterial({ color: new T.Color(tn[2] || '#dcecff'), transparent: true, opacity: tn[3], specular: 0xffffff, shininess: 200, depthWrite: false, side: T.DoubleSide });
    var rr = acet ? 2.2 : 0.95, xc = (S.A + 18) / 2, NS = 72, ends = {};
    [-1, 1].forEach(function (side) {
      var pts = [], sh = new T.Shape(), top = null, nas = null;
      for (i = 0; i < NS; i++) { var p = contour(S.sh, S.A, i / NS * Math.PI * 2, side), x = p[0] + side * xc, y = p[1], z = -(p[0] * p[0] + p[1] * p[1]) / 420; pts.push(new T.Vector3(x, y, z)); if (i) sh.lineTo(x, y); else sh.moveTo(x, y); if (!top || side * x * 1.4 - Math.abs(y - 7) > top.s) top = { s: side * x * 1.4 - Math.abs(y - 7), v: pts[i] }; if (!nas || -side * x * 1.4 - Math.abs(y - 6) > nas.s) nas = { s: -side * x * 1.4 - Math.abs(y - 6), v: pts[i] }; }
      G.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts, true), 120, rr, 10, true), fm));
      var lg = new T.Mesh(new T.ShapeGeometry(sh, 24), lmat); lg.position.z = -1.2; lg.renderOrder = 3; G.add(lg); ends[side] = { t: top.v, n: nas.v };
    });
    var a = ends[-1].n, b = ends[1].n; G.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([a, new T.Vector3(a.x * .5, a.y + 1.6, a.z + 1), new T.Vector3(0, a.y + 2.2, a.z + 1.3), new T.Vector3(b.x * .5, b.y + 1.6, b.z + 1), b]), 30, acet ? 2.1 : 1, 8, false), fm));
    [-1, 1].forEach(function (s) { var t = ends[s].t, tr = acet ? 1.9 : 0.95, h = new T.Vector3(t.x + s * 4.2, t.y, t.z - 4.5), E = new T.Vector3(s * 74, t.y + 4, -104);
      G.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([t, new T.Vector3(t.x + s * 2.6, t.y, t.z - .4), new T.Vector3(t.x + s * 4.2, t.y, t.z - 3), h, h.clone().lerp(E, .5), E, new T.Vector3(E.x, E.y - 1, E.z - 8)]), 60, tr, 8, false), fm)); });
    /* baş: yalnızca derinlik yazan örtücü, sapların başın arkasında kalan kısmını gizler */
    var oc = new T.Mesh(new T.SphereGeometry(1, 32, 24), new T.MeshBasicMaterial(/oc=1/.test(location.search) ? { color: 0xff0000, transparent: true, opacity: .45 } : { colorWrite: false })); oc.scale.set(73, 112, 98); oc.position.set(0, -12, -106); oc.renderOrder = -1; G.add(oc);
    return G;
  }
  function init3() {
    var T = THREE, c = $('dnC'), r = new T.WebGLRenderer({ canvas: c, alpha: true, antialias: true, preserveDrawingBuffer: true }), sc = new T.Scene(), cam = new T.OrthographicCamera(0, 2, 0, -2, -3000, 3000);
    sc.add(new T.AmbientLight(0xffffff, .75)); var d = new T.DirectionalLight(0xffffff, .7); d.position.set(.3, .6, 1); sc.add(d);
    three = { r: r, sc: sc, cam: cam, g: null, w: 0, h: 0 }; size();
  }
  function size() { if (!three) return; var st = $('dnS'), w = st.clientWidth, h = st.clientHeight; if (w === three.w && h === three.h) return; three.w = w; three.h = h; three.r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); three.r.setSize(w, h, false); three.cam.right = w; three.cam.bottom = -h; three.cam.updateProjectionMatrix(); }
  function place(f, sw, sh, mt) {
    if (!three) return; size(); var T = THREE, w = three.w, h = three.h, k = Math.max(w / sw, h / sh), ox = (w - sw * k) / 2, oy = (h - sh * k) / 2;
    function P(i) { var x = f[i].x * sw * k + ox; if (mirror) x = w - x; return new T.Vector3(x, -(f[i].y * sh * k + oy), -f[i].z * sw * k); }
    var a = P(33), b = P(263), il = P(468), ir = P(473), top = P(10), chin = P(152); if (a.x > b.x) { var t = a; a = b; b = t; }
    var X = b.clone().sub(a).normalize(), Yr = top.clone().sub(chin).normalize(), Z = new T.Vector3().crossVectors(X, Yr).normalize(), Y = new T.Vector3().crossVectors(Z, X).normalize();
    if (mt && mt.data && mt.data.length >= 12 && !/lmk=1/.test(location.search)) { var d = mt.data, q = mirror ? -1 : 1; X = new T.Vector3(d[0], q * d[1], q * d[2]).normalize(); Y = new T.Vector3(q * d[4], d[5], d[6]).normalize(); Z = new T.Vector3(q * d[8], d[9], d[10]).normalize(); }
    var s = il.distanceTo(ir) / 63, c = il.clone().add(ir).multiplyScalar(.5).addScaledVector(Z, 13 * s).addScaledVector(Y, -4.5 * s);
    var np = { X: X, Y: Y, Z: Z, c: c, s: s }; if (pose && S.src === 'kamera') { var qq = .55; ['X', 'Y', 'Z', 'c'].forEach(function (n) { np[n] = pose[n].clone().lerp(np[n], qq); }); np.s = pose.s + (np.s - pose.s) * 0.55; np.X.normalize(); np.Z.crossVectors(np.X, np.Y).normalize(); np.Y.crossVectors(np.Z, np.X).normalize(); } pose = np;
    apply();
  }
  function apply() {
    if (!three) return; var kk = S.sh + S.fr + S.col + S.tn + S.A; if (kk !== key || !three.g) { key = kk; if (three.g) { three.sc.remove(three.g); three.g.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); } three.g = build(); three.g.matrixAutoUpdate = false; three.sc.add(three.g); }
    three.g.visible = !!pose; if (pose) { var m = new THREE.Matrix4().makeBasis(pose.X.clone().multiplyScalar(pose.s), pose.Y.clone().multiplyScalar(pose.s), pose.Z.clone().multiplyScalar(pose.s)); m.setPosition(pose.c); three.g.matrix.copy(m); three.g.matrixWorldNeedsUpdate = true; }
    three.r.render(three.sc, three.cam);
  }
  function say(t) { msg = t; $('dnM').textContent = t; }
  function ready(cb) {
    say('Model yükleniyor…');
    function s2() { if (window.CGYUZ) s3(); else ls(BASE + 'yuz.js', function (e) { if (e) return say('Model yüklenemedi; bağlantınızı kontrol edin'); s3(); }); }
    function s3() { window.CGYUZ.load().then(function (m) { lm = m; if (!three) init3(); cb(); }).catch(function () { say('Model yüklenemedi; bağlantınızı kontrol edin'); }); }
    if (lm && three) return cb(); if (window.THREE) s2(); else ls(T3, function (e) { if (e) return say('3B modül yüklenemedi; bağlantınızı kontrol edin'); s2(); });
  }
  function stopCam() { if (tmr) { clearInterval(tmr); tmr = null; } if (vid.srcObject) { vid.srcObject.getTracks().forEach(function (t) { t.stop(); }); vid.srcObject = null; } vid.style.display = 'none'; }
  function tick() { if (S.src !== 'kamera' || !vid.videoWidth) return; var r; try { r = lm.detectForVideo(vid, performance.now()); } catch (x) { return; } var f = r && r.faceLandmarks && r.faceLandmarks[0]; if (f && f.length > 473) { say(''); place(f, vid.videoWidth, vid.videoHeight, r.facialTransformationMatrixes && r.facialTransformationMatrixes[0]); } else { pose = null; say('Yüz bulunamadı; kameraya doğru bakın'); apply(); } }
  function startCam() { ready(function () { lm.setOptions({ runningMode: 'VIDEO' }).then(function () { return navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false }); }).then(function (s) { stopCam(); $('dnI').style.display = 'none'; mirror = true; pose = null; vid.srcObject = s; vid.style.display = 'block'; vid.play(); S.src = 'kamera'; $('dnS').style.aspectRatio = '16/9'; panel(); say('Yüz aranıyor…'); tmr = setInterval(tick, 60); }).catch(function () { say('Kamera açılamadı; izin verin ya da fotoğraf yükleyin'); }); }); }
  function usePhoto(im) { ready(function () { stopCam(); lm.setOptions({ runningMode: 'IMAGE' }).then(function () { img = im; mirror = false; pose = null; var el = $('dnI'); el.src = im.src; el.style.display = 'block'; S.src = 'foto'; $('dnS').style.aspectRatio = im.naturalWidth + '/' + im.naturalHeight; panel(); setTimeout(function () { var r = lm.detect(im), f = r && r.faceLandmarks && r.faceLandmarks[0]; if (f && f.length > 473) { say(''); place(f, im.naturalWidth, im.naturalHeight, r.facialTransformationMatrixes && r.facialTransformationMatrixes[0]); } else { say('Bu fotoğrafta yüz bulunamadı; önden çekilmiş bir fotoğraf deneyin'); apply(); } }, 60); }); }); }
  function snap() {
    if (!three || !S.src) return; var w = three.r.domElement.width, h = three.r.domElement.height, c = document.createElement('canvas'), g = c.getContext('2d'), src = S.src === 'kamera' ? vid : img, sw = src.videoWidth || src.naturalWidth, sh = src.videoHeight || src.naturalHeight, k = Math.max(w / sw, h / sh); c.width = w; c.height = h;
    g.save(); if (mirror) { g.translate(w, 0); g.scale(-1, 1); } g.drawImage(src, (w - sw * k) / 2, (h - sh * k) / 2, sw * k, sh * k); g.restore(); three.r.render(three.sc, three.cam); g.drawImage(three.r.domElement, 0, 0);
    c.toBlob(function (b) { if (!b) return; var l = document.createElement('a'); l.href = URL.createObjectURL(b); l.download = 'sanal-gozluk-deneme.png'; document.body.appendChild(l); l.click(); setTimeout(function () { URL.revokeObjectURL(l.href); l.parentNode.removeChild(l); }, 1500); }, 'image/png');
  }
  $('dnP').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var a = b.getAttribute('data-a'), k = b.getAttribute('data-k');
    if (a === 'cam') { if (S.src === 'kamera') { stopCam(); S.src = ''; pose = null; apply(); panel(); say('Başlamak için kamerayı açın ya da bir yüz fotoğrafı yükleyin'); } else startCam(); }
    else if (a === 'up') $('dnF').click(); else if (a === 'snap') snap();
    else if (k) { S[k] = b.getAttribute('data-v'); panel(); if (three) apply(); }
  });
  $('dnP').addEventListener('input', function (e) { var k = e.target.getAttribute('data-k'); if (k === 'A') { S.A = +e.target.value; $('dnA').textContent = S.A + ' mm'; if (three) apply(); } });
  $('dnF').addEventListener('change', function (e) { var f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return; var im = new Image(); im.onload = function () { usePhoto(im); }; im.src = URL.createObjectURL(f); });
  window.addEventListener('resize', function () { if (S.src === 'foto' && img && lm) { var r = lm.detect(img), f = r && r.faceLandmarks && r.faceLandmarks[0]; if (f) place(f, img.naturalWidth, img.naturalHeight, r.facialTransformationMatrixes && r.facialTransformationMatrixes[0]); } });
  window.CGDENEME = { state: function () { return { src: S.src, pose: !!pose, s: pose && pose.s, msg: msg }; } };
  panel(); say(msg);
})();
