/* Biyomikroskop (slit lamba) fotoğraf yardımcısı · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-kamera'); if (!K || !root || root.querySelector('video')) return;
  var S = { goz: 'OD', not: '', zoom: 1, halka: true, yuz: 'environment', fener: false }, stream = null, track = null, caps = {}, shots = [];
  root.innerHTML = '<p class="cgt-lead">Telefonu biyomikroskop okülerine tutarak ön segment fotoğrafı çekin: hizalama halkası, yakınlaştırma, fener ve göz/tarih etiketli kayıt. Görüntüler yalnızca cihazınızda kalır.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="kmP"></div><div class="cgt-col"><div class="cgt-stage cgk-stage" id="kmS" style="height:min(70vh,560px);background:#000"><video id="kmV" playsinline muted autoplay style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain"></video><canvas id="kmO" style="pointer-events:none"></canvas><button type="button" class="cgk-fs" data-fs="kmS">Tam ekran</button></div><div class="cgt-info" id="kmI"></div><div id="kmG" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:14px"></div></div></div>' +
    '<p class="cgt-note">Fotoğraflar tarayıcı belleğinde tutulur, hiçbir sunucuya gönderilmez ve sayfa kapanınca silinir; saklamak için indirin. Nota hasta adı ya da kimlik bilgisi yazmayın, protokol numarası kullanın; hasta görüntülerinin saklanması ve paylaşılması KVKK ve kurum kurallarına tabidir. Yakınlaştırma ve fener yalnızca cihaz ve tarayıcı destekliyorsa görünür.</p>' + K.dr;
  var vd = K.$('kmV');
  function panel() {
    K.$('kmP').innerHTML = '<div class="cgt-chips"><button type="button" class="cgt-btn b" data-a="ac">' + (stream ? 'Kamerayı kapat' : 'Kamerayı aç') + '</button>' + (stream ? '<button type="button" class="cgt-btn" data-a="cevir">Kamera değiştir</button>' : '') + '</div>' +
      '<div><p class="cgt-h">Göz</p>' + K.chips('g', [['OD', 'Sağ (OD)'], ['OS', 'Sol (OS)']], S.goz) + '</div>' +
      '<div><p class="cgt-h">Not (isteğe bağlı)</p><input type="text" id="kmN" maxlength="60" placeholder="Örn. protokol no, bulgu" value="' + S.not.replace(/"/g, '&quot;') + '"></div>' +
      K.range('zoom', 'Yakınlaştırma', S.zoom, 1, caps.zoom ? Math.min(caps.zoom.max, 10) : 4, .1, '×', K.tr(S.zoom)) +
      '<label class="cgt-tog"><input type="checkbox" id="kmH"' + (S.halka ? ' checked' : '') + '> Hizalama halkası</label>' +
      (caps.torch ? '<label class="cgt-tog"><input type="checkbox" id="kmF"' + (S.fener ? ' checked' : '') + '> Fener</label>' : '') +
      '<div class="cgt-chips"><button type="button" class="cgt-btn y" data-a="cek"' + (stream ? '' : ' disabled') + '>Fotoğraf çek</button></div>';
  }
  function info(m) { K.$('kmI').innerHTML = m || (stream ? '<b>İpucu:</b> Biyomikroskopta odağı önce kendi gözünüzle yapın, sonra telefon kamerasını okülerin tam ortasına, göz rahatlığı mesafesine (yaklaşık 1–2 cm) getirin. Görüntü halkayı doldurduğunda çekin.' : '<b>Başlamak için</b> kamerayı açın; tarayıcı kamera izni isteyecektir. Arka kamera varsayılan olarak seçilir.'); }
  function overlay() { redraw(); }
  var redraw = K.fit(K.$('kmO'), function (g, w, h) {
    g.clearRect(0, 0, w, h); if (!stream) { g.fillStyle = 'rgba(255,255,255,.7)'; g.font = '700 15px Arial'; g.textAlign = 'center'; g.fillText('Kamera kapalı', w / 2, h / 2); return; }
    if (S.halka) { var r = Math.min(w, h) * .4; g.strokeStyle = 'rgba(255,212,0,.9)'; g.lineWidth = 2; g.beginPath(); g.arc(w / 2, h / 2, r, 0, 7); g.stroke(); g.beginPath(); g.moveTo(w / 2 - 12, h / 2); g.lineTo(w / 2 + 12, h / 2); g.moveTo(w / 2, h / 2 - 12); g.lineTo(w / 2, h / 2 + 12); g.stroke(); }
    g.fillStyle = 'rgba(8,20,45,.8)'; g.fillRect(10, 10, 54, 30); g.fillStyle = '#ffd400'; g.font = '800 18px Arial'; g.textAlign = 'center'; g.fillText(S.goz, 37, 31);
  });
  function zoomUygula() { if (track && caps.zoom) { try { track.applyConstraints({ advanced: [{ zoom: K.cl(S.zoom, caps.zoom.min, caps.zoom.max) }] }); } catch (e) { } vd.style.transform = ''; } else vd.style.transform = 'scale(' + S.zoom + ')'; }
  function kapat() { if (stream) stream.getTracks().forEach(function (t) { t.stop(); }); stream = null; track = null; caps = {}; vd.srcObject = null; S.fener = false; }
  function ac() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { info('<b style="color:#b3261e">Bu tarayıcı kamera erişimini desteklemiyor.</b> Sayfayı güncel Safari ya da Chrome ile, güvenli (https) bağlantıda açın.'); return; }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: S.yuz }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false }).then(function (s) {
      kapat(); stream = s; track = s.getVideoTracks()[0]; try { caps = track.getCapabilities ? track.getCapabilities() : {}; } catch (e) { caps = {}; } vd.srcObject = s; var p = vd.play(); if (p && p.catch) p.catch(function () { }); S.zoom = 1; zoomUygula(); panel(); info(); overlay();
    }).catch(function (e) { info('<b style="color:#b3261e">Kamera açılamadı.</b> ' + (e && e.name === 'NotAllowedError' ? 'Kamera izni verilmedi; tarayıcı ayarlarından bu site için kameraya izin verin.' : 'Kamera bulunamadı ya da başka bir uygulama kullanıyor.')); });
  }
  function cek() {
    if (!stream || !vd.videoWidth) return; var vw = vd.videoWidth, vh = vd.videoHeight, z = track && caps.zoom ? 1 : S.zoom, sw = vw / z, sh = vh / z, c = document.createElement('canvas'), bar = Math.round(vh / z * .07) + 24, d = new Date();
    function p2(n) { return (n < 10 ? '0' : '') + n; }
    c.width = Math.round(sw); c.height = Math.round(sh) + bar; var g = c.getContext('2d'); g.drawImage(vd, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, c.width, Math.round(sh));
    g.fillStyle = '#0b1730'; g.fillRect(0, Math.round(sh), c.width, bar); g.fillStyle = '#fff'; g.font = '700 ' + Math.round(bar * .5) + 'px Arial'; g.textBaseline = 'middle';
    var ts = p2(d.getDate()) + '.' + p2(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + p2(d.getHours()) + ':' + p2(d.getMinutes());
    g.fillText(S.goz + ' · ' + ts + (S.not ? ' · ' + S.not : ''), bar * .4, Math.round(sh) + bar / 2, c.width - bar * .8);
    var url = c.toDataURL('image/jpeg', .92), ad = S.goz + '-' + d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()) + '-' + p2(d.getHours()) + p2(d.getMinutes()) + p2(d.getSeconds()) + '.jpg';
    shots.unshift({ url: url, ad: ad }); if (shots.length > 12) shots.pop(); galeri(); info('<b>Kaydedildi:</b> ' + ad + '. Aşağıdan indirebilirsiniz; en fazla son 12 fotoğraf tutulur.');
  }
  function galeri() { K.$('kmG').innerHTML = shots.map(function (s) { return '<a href="' + s.url + '" download="' + s.ad + '" style="display:block;border:1px solid #d7e0ee;border-radius:12px;overflow:hidden;text-decoration:none;color:#004aad;font:700 12.5px Arial;background:#fff"><img src="' + s.url + '" alt="' + s.ad + '" style="display:block;width:100%;height:auto"><span style="display:block;padding:7px 9px">İndir · ' + s.ad + '</span></a>'; }).join(''); }
  panel(); info();
  K.$('kmP').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var a = b.getAttribute('data-a'), gz = b.getAttribute('data-g');
    if (gz) { S.goz = gz; panel(); overlay(); } else if (a === 'ac') { if (stream) { kapat(); panel(); info(); overlay(); } else ac(); } else if (a === 'cevir') { S.yuz = S.yuz === 'environment' ? 'user' : 'environment'; ac(); } else if (a === 'cek') cek();
  });
  K.$('kmP').addEventListener('input', function (e) { if (e.target.id === 'kmN') S.not = e.target.value; else if (e.target.getAttribute('data-k') === 'zoom') { S.zoom = +e.target.value; K.$('kmP').querySelector('[data-v="zoom"]').textContent = K.tr(S.zoom) + '×'; zoomUygula(); } });
  K.$('kmP').addEventListener('change', function (e) { if (e.target.id === 'kmH') { S.halka = e.target.checked; overlay(); } else if (e.target.id === 'kmF' && track) { S.fener = e.target.checked; try { track.applyConstraints({ advanced: [{ torch: S.fener }] }); } catch (x) { } } });
  window.addEventListener('pagehide', kapat);
})();
