/* Reçete Yazma Alıştırması — rastgele durum, hata türünü yakalayan kontrol · cagataygulumser.com */
(function () {
  'use strict';
  var root = document.getElementById('cgt-recete'); if (!root || root.firstChild) return;
  var T = { hep: 'Karışık', tra: 'Transpozisyon', mer: 'Meridyenden reçeteye', yak: 'Yakın reçetesi', se: 'Sferik eşdeğer' };
  var mode = 'hep', Q = null, res = null, ok = 0, tot = 0, seri = 0;
  try { var sv = JSON.parse(localStorage.getItem('cgRecete') || '{}'); ok = sv.ok || 0; tot = sv.tot || 0; } catch (e) { }
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function q4(a, b) { return ri(a * 4, b * 4) / 4; }
  function fm(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(2).replace('.', ','); }
  function rx(s, c, a) { return fm(s) + ' ' + fm(c) + ' × ' + a; }
  function ax() { return ri(1, 36) * 5; }
  function flip(a) { return a > 90 ? a - 90 : a + 90; }
  function tr(r) { return { s: r.s + r.c, c: -r.c, a: flip(r.a) }; }
  function make() {
    var t = mode === 'hep' ? ['tra', 'tra', 'mer', 'yak', 'se'][ri(0, 4)] : mode, q = { t: t }, s, c, a;
    if (t === 'tra') {
      s = q4(-6, 4); c = q4(0.5, 3) * (Math.random() < 0.5 ? -1 : 1); a = ax(); q.src = { s: s, c: c, a: a }; q.ans = tr(q.src); q.f = 3;
      q.txt = 'Şu reçeteyi <b>' + (c < 0 ? 'artı' : 'eksi') + ' silindirli</b> biçimde yeniden yazın:<div class="rcx">' + rx(s, c, a) + '</div>';
      q.sol = ['Küre ile silindiri toplayın: ' + fm(s) + ' + (' + fm(c) + ') = <b>' + fm(s + c) + '</b>', 'Silindirin işaretini değiştirin: <b>' + fm(-c) + '</b>', 'Aksı 90° çevirin: ' + a + (a > 90 ? ' − 90' : ' + 90') + ' = <b>' + flip(a) + '</b>'];
    } else if (t === 'mer') {
      var a1 = ax(), a2 = flip(a1), p1 = q4(-6, 4), d = q4(0.5, 3), p2 = p1 - d, sw = Math.random() < 0.5, pl = Math.random() < 0.3;
      q.ans = pl ? { s: p2, c: d, a: a2 } : { s: p1, c: -d, a: a1 }; q.f = 3; q.src = null;
      var m1 = '<b>' + a1 + '°</b> meridyeninde <b>' + fm(p1) + ' D</b>', m2 = '<b>' + a2 + '°</b> meridyeninde <b>' + fm(p2) + ' D</b>';
      q.txt = 'Bir camın iki ana meridyenindeki güçler ölçüldü: ' + (sw ? m2 + ', ' + m1 : m1 + ', ' + m2) + '. Reçeteyi <b>' + (pl ? 'artı' : 'eksi') + ' silindirli</b> yazın.';
      q.sol = pl ? ['Artı silindirde küre, iki güçten daha eksi olanıdır: <b>' + fm(p2) + '</b>', 'Silindir, iki güç arasındaki farktır: ' + fm(p1) + ' − (' + fm(p2) + ') = <b>' + fm(d) + '</b>', 'Aks, küre gücünün okunduğu meridyendir: <b>' + a2 + '</b>'] : ['Eksi silindirde küre, iki güçten daha artı olanıdır: <b>' + fm(p1) + '</b>', 'Silindir, iki güç arasındaki farktır: ' + fm(p2) + ' − (' + fm(p1) + ') = <b>' + fm(-d) + '</b>', 'Aks, küre gücünün okunduğu meridyendir: <b>' + a1 + '</b>'];
    } else if (t === 'yak') {
      s = q4(-5, 3); c = Math.random() < 0.3 ? 0 : -q4(0.5, 2); a = c ? ax() : 0; var add = q4(1, 3); q.add = add; q.src = { s: s, c: c, a: a }; q.ans = { s: s + add, c: c, a: a }; q.f = c ? 3 : 1;
      q.txt = 'Uzak reçetesi <span class="rcx" style="display:inline-block;margin:4px 6px;padding:4px 12px">' + (c ? rx(s, c, a) : fm(s)) + '</span> ve adisyonu <b>' + fm(add) + '</b> olan bir kişinin <b>yakın gözlüğü</b> reçetesini yazın.';
      q.sol = ['Adisyon yalnızca küreye eklenir: ' + fm(s) + ' + (' + fm(add) + ') = <b>' + fm(s + add) + '</b>'].concat(c ? ['Silindir ve aks değişmez: <b>' + fm(c) + ' × ' + a + '</b>'] : []);
    } else {
      s = q4(-6, 4); c = -ri(1, 6) / 2; a = ax(); q.src = { s: s, c: c, a: a }; q.ans = { s: s + c / 2, c: 0, a: 0 }; q.f = 1;
      q.txt = 'Şu reçetenin <b>sferik eşdeğerini</b> bulun:<div class="rcx">' + rx(s, c, a) + '</div>';
      q.sol = ['Silindirin yarısını küreye ekleyin: ' + fm(s) + ' + (' + fm(c / 2) + ') = <b>' + fm(s + c / 2) + '</b>'];
    }
    return q;
  }
  function num(v) { v = String(v).replace(/\s/g, '').replace('−', '-').replace(',', '.'); if (v === '' || isNaN(+v)) return null; return +v; }
  function eq(a, b) { return Math.abs(a - b) < 0.001; }
  function sameA(a, b) { return (a % 180) === (b % 180); }
  function check() {
    var g = function (id) { var e = document.getElementById(id); return e ? e.value : ''; }, A = Q.ans, s = num(g('rcS')), c = Q.f === 3 ? num(g('rcC')) : 0, a = Q.f === 3 ? num(g('rcA')) : 0, raw = [g('rcS'), g('rcC')];
    if (s == null || c == null || a == null) return { k: 'bos', m: 'Tüm alanları doldurun.' };
    if (Q.f === 3 && (a < 0 || a > 180 || a % 1)) return { k: 'bicim', m: 'Aks 1 ile 180 arasında bir tam sayı olmalıdır.' };
    if (!eq(s * 4, Math.round(s * 4)) || !eq(c * 4, Math.round(c * 4))) return { k: 'bicim', m: 'Güçler 0,25 dioptrilik adımlarla yazılır (ör. −2,25).' };
    var nosign = raw.some(function (r) { r = r.trim(); return r && num(r) > 0 && r.charAt(0) !== '+'; });
    if (eq(s, A.s) && eq(c, A.c) && (Q.f !== 3 || sameA(a, A.a))) return { k: 'ok', m: 'Doğru.' + (nosign ? ' Küçük bir not: artı değerlerde de işareti yazmak (ör. +1,25) karışıklığı önler.' : '') };
    if (Q.f === 3) {
      var alt = tr(A);
      if (eq(s, alt.s) && eq(c, alt.c) && sameA(a, alt.a)) return { k: 'yar', m: 'Yazdığınız reçete aynı camı anlatıyor, ama istenen biçim bu değil. Silindirin işaretine bakın: soruda ' + (A.c < 0 ? 'eksi' : 'artı') + ' silindirli yazım isteniyor.' };
      if (eq(Math.abs(s), Math.abs(A.s)) && eq(Math.abs(c), Math.abs(A.c)) && sameA(a, A.a)) return { k: 'isaret', m: 'İşaret hatası: sayılar doğru, ama ' + (!eq(s, A.s) && !eq(c, A.c) ? 'küre ve silindirin' : !eq(s, A.s) ? 'kürenin' : 'silindirin') + ' işareti yanlış.' };
      if (eq(s, A.s) && eq(c, A.c)) return { k: 'aks', m: Q.t === 'tra' && Q.src && sameA(a, Q.src.a) ? 'Aks hatası: küre ve silindir doğru, ama aksı 90° çevirmeyi unuttunuz.' : 'Aks hatası: küre ve silindir doğru, aks yanlış.' };
      if (Q.t === 'tra') {
        if (eq(s, Q.src.s) && eq(c, A.c)) return { k: 'kure', m: 'Küre hatası: silindirin işaretini değiştirdiniz ama küreyi yeniden hesaplamadınız. Yeni küre, eski küre ile silindirin toplamıdır.' };
        if (eq(c, Q.src.c)) return { k: 'isaret', m: 'İşaret hatası: silindirin işareti değişmemiş. Transpozisyonda silindir aynı büyüklükte kalır, işareti tersine döner.' };
        if (eq(s, Q.src.s - Q.src.c)) return { k: 'kure', m: 'Küre hatası: silindiri küreden çıkarmışsınız. İşaretleriyle birlikte toplamanız gerekir.' };
      }
      if (Q.t === 'yak' && eq(s, Q.src.s) ) return { k: 'kure', m: 'Adisyonu küreye eklemeyi unuttunuz.' };
      if (Q.t === 'yak' && eq(c, Q.src.c + Q.add)) return { k: 'kure', m: 'Adisyon silindire eklenmez; yalnızca küreye eklenir.' };
      if (Q.t === 'mer' && eq(Math.abs(c), Math.abs(A.c)) && !eq(s, A.s)) return { k: 'kure', m: 'Küre hatası: silindir farkı doğru, ama küre olarak yanlış meridyenin gücünü aldınız.' };
    } else {
      if (eq(Math.abs(s), Math.abs(A.s)) && A.s !== 0) return { k: 'isaret', m: 'İşaret hatası: sayı doğru, işaret yanlış.' };
      if (Q.t === 'se' && eq(s, Q.src.s + Q.src.c)) return { k: 'kure', m: 'Silindirin tamamını eklediniz; sferik eşdeğerde yarısı eklenir.' };
      if (Q.t === 'se' && eq(s, Q.src.s - Q.src.c / 2)) return { k: 'isaret', m: 'İşaret hatası: silindirin yarısını işaretiyle birlikte eklemelisiniz.' };
      if (Q.t === 'yak' && eq(s, Q.src.s - Q.add)) return { k: 'isaret', m: 'İşaret hatası: adisyon her zaman artıdır ve küreye eklenir.' };
    }
    return { k: 'yan', m: 'Yanlış. Adımları aşağıda görebilirsiniz.' };
  }
  function inp(id, lab, ph, w) { return '<label style="display:flex;flex-direction:column;gap:4px;flex:1 1 ' + w + 'px;min-width:0"><span class="cgt-h" style="margin:0">' + lab + '</span><input type="text" inputmode="text" autocomplete="off" id="' + id + '" placeholder="' + ph + '" style="font-size:20px;font-weight:700;padding:11px 12px;text-align:center"' + (res && res.k === 'ok' ? ' disabled' : '') + '></label>'; }
  function render(keep) {
    var old = keep ? ['rcS', 'rcC', 'rcA'].map(function (i) { var e = document.getElementById(i); return e ? e.value : ''; }) : null;
    var done = res && (res.k === 'ok' || res.show), col = !res ? '' : res.k === 'ok' ? '#0a7a3d' : res.k === 'yar' ? '#b26a00' : '#b3261e';
    var h = '<p class="cgt-lead">Rastgele bir durum gelir, reçeteyi siz yazarsınız. Yanlış yazdığınızda yalnızca “yanlış” demez; işaret, aks ya da küre hatası mı olduğunu söyler.</p>' +
      '<style>.rcx{font-size:26px;font-weight:800;letter-spacing:.02em;background:#f3f7fd;border:1px solid #d7e0ee;border-radius:12px;padding:12px 16px;margin-top:10px;text-align:center;color:#004aad;font-variant-numeric:tabular-nums}</style>' +
      '<div class="cgt-panel" style="margin-bottom:12px"><div class="cgt-chips">' + Object.keys(T).map(function (k) { return '<button type="button" class="cgt-chip' + (mode === k ? ' on' : '') + '" data-m="' + k + '">' + T[k] + '</button>'; }).join('') + '</div></div>' +
      '<div class="cgt-panel"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:baseline"><p class="cgt-h" style="margin:0">' + T[Q.t] + '</p><span style="font-size:13.5px;font-weight:700;color:#5b6b82">Doğru <b style="color:#0a7a3d">' + ok + '</b> / ' + tot + (seri > 1 ? ' · seri ' + seri : '') + '</span></div>' +
      '<div style="font-size:17px;line-height:1.6">' + Q.txt + '</div>' +
      '<form id="rcF" style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin:0">' + inp('rcS', Q.f === 3 ? 'Küre (SPH)' : 'Güç (D)', '−1,25', 120) + (Q.f === 3 ? inp('rcC', 'Silindir (CYL)', '−0,75', 120) + inp('rcA', 'Aks', '90', 80) : '') +
      (done ? '' : '<button type="submit" class="cgt-btn b" style="padding:13px 22px;font-size:15px">Kontrol et</button>') + '</form>' +
      (res ? '<div class="cgt-info" style="margin-top:0;border-left-color:' + col + '"><b style="color:' + col + '">' + (res.k === 'ok' ? 'Doğru' : res.k === 'yar' ? 'Yarı doğru' : res.k === 'bos' || res.k === 'bicim' ? 'Biçim' : 'Yanlış') + '.</b> ' + res.m.replace(/^(Doğru|Yanlış)\.\s?/, '') + '</div>' : '') +
      (done ? '<div style="background:#f3f7fd;border-radius:12px;padding:12px 16px"><p class="cgt-h">Çözüm</p><ol style="margin:0;padding-left:20px;line-height:1.75">' + Q.sol.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol><div class="rcx" style="margin-top:10px">' + (Q.f === 3 ? rx(Q.ans.s, Q.ans.c, Q.ans.a) : fm(Q.ans.s)) + '</div></div>' : '') +
      '<div class="cgt-chips">' + (done ? '<button type="button" class="cgt-btn y" data-a="next" style="padding:11px 20px;font-size:15px">Sonraki soru</button>' : (res && res.k !== 'bos' && res.k !== 'bicim' ? '<button type="button" class="cgt-btn" data-a="show">Çözümü göster</button>' : '') + '<button type="button" class="cgt-btn" data-a="next">Bu soruyu geç</button>') + '</div></div>' +
      '<div class="cgt-info"><b>Yazım kuralları:</b> Güçler 0,25 adımla ve işaretiyle yazılır (+1,25 / −0,75). Virgül ya da nokta kullanabilirsiniz. Aks 1–180 arasındadır; 0 yerine 180 yazılır. Silindir sıfırsa aks yazılmaz.</div>' +
      '<p class="cgt-note">Bu alıştırma eğitim amaçlıdır. Reçeteyi yalnızca göz hekimi düzenler; optisyen reçeteyi değiştiremez. Konu anlatımı için <a href="/p/optisyen-akademi.html">Optisyen Akademi</a>, hazır hesaplar için <a href="/p/formuller.html">Hesaplama Araçları</a>.</p>';
    root.innerHTML = h;
    if (old) ['rcS', 'rcC', 'rcA'].forEach(function (i, n) { var e = document.getElementById(i); if (e) e.value = old[n]; });
    else { var f = document.getElementById('rcS'); if (f && window.matchMedia('(min-width:861px)').matches) try { f.focus({ preventScroll: true }); } catch (e) { } }
  }
  function next() { Q = make(); res = null; render(false); }
  root.addEventListener('submit', function (e) {
    e.preventDefault(); var first = !res || res.k === 'bos' || res.k === 'bicim'; res = check();
    if (res.k !== 'bos' && res.k !== 'bicim' && first) { tot++; if (res.k === 'ok') { ok++; seri++; } else seri = 0; try { localStorage.setItem('cgRecete', JSON.stringify({ ok: ok, tot: tot })); } catch (x) { } }
    render(true);
  });
  root.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-m')) { mode = b.getAttribute('data-m'); next(); }
    else if (b.getAttribute('data-a') === 'next') next();
    else if (b.getAttribute('data-a') === 'show') { res.show = 1; render(true); }
  });
  window.CGRECETE = { q: function () { return Q; } };
  next();
})();
