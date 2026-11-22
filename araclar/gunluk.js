/* Çocuk Miyopi Günlüğü · cagataygulumser.com */
(function () {
  'use strict';
  var root = document.getElementById('cgt-gunluk'); if (!root || root.firstChild) return;
  var K = 'cgGunluk', D = {}; try { D = JSON.parse(localStorage.getItem(K) || '{}') || {}; } catch (x) { D = {}; }
  function save() { try { localStorage.setItem(K, JSON.stringify(D)); } catch (x) {} }
  function key(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  var today = key(new Date()), sel = today, GN = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  function days() { var a = [], d = new Date(); for (var i = 6; i >= 0; i--) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i); a.push([key(x), GN[x.getDay()], x.getDate()]); } return a; }
  function hm(m) { return m >= 60 ? Math.floor(m / 60) + ' sa ' + (m % 60 ? m % 60 + ' dk' : '') : m + ' dk'; }
  function render() {
    var e = D[sel] || { o: 0, s: 0, r: 0 }, ds = days(), so = 0, ss = 0, sr = 0, n = 0, mx = 180;
    ds.forEach(function (d) { var v = D[d[0]]; if (v) { n++; so += v.o; ss += v.s; sr += v.r; mx = Math.max(mx, v.o, v.s + v.r); } });
    function row(k, lab, max, val, hint) { return '<div><div class="cgt-row"><span>' + lab + '</span><b id="gnV_' + k + '">' + hm(val) + '</b></div><input type="range" data-k="' + k + '" min="0" max="' + max + '" step="5" value="' + val + '"><div style="font-size:12.5px;color:#5b6b82;margin-top:3px">' + hint + '</div></div>'; }
    var h = '<p class="cgt-lead">Çocuğunuzun gün ışığında geçirdiği süreyi ve yakın mesafe alışkanlıklarını günlük kaydedin; haftalık özeti görün. Kayıtlar yalnızca bu cihazda saklanır.</p><div class="cgt-main"><div class="cgt-panel"><div><p class="cgt-h">Gün</p><div class="cgt-chips">' + ds.map(function (d) { return '<button type="button" class="cgt-chip' + (d[0] === sel ? ' on' : '') + '" data-d="' + d[0] + '">' + d[1] + ' ' + d[2] + (D[d[0]] ? ' ✓' : '') + '</button>'; }).join('') + '</div></div>' +
      row('o', 'Dışarıda, gün ışığında', 360, e.o, 'Hedef: günde en az 2 saat') + row('s', 'Telefon, tablet, bilgisayar', 480, e.s, 'Ders dışı ekran süresi') + row('r', 'Kitap, ödev, yakın iş', 480, e.r, '20 dakikada bir 20 saniye uzağa bakmak önerilir') +
      '<div class="cgt-chips"><button type="button" class="cgt-btn y" data-a="save">Günü kaydet</button><button type="button" class="cgt-btn" data-a="del">Günü sil</button></div></div><div class="cgt-col"><div class="cgt-panel"><p class="cgt-h">Son 7 gün</p><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;align-items:end;height:210px">';
    ds.forEach(function (d) { var v = D[d[0]]; h += '<div style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:4px"><div style="display:flex;gap:3px;align-items:flex-end;height:170px">' + (v ? '<div title="Dışarıda" style="width:14px;border-radius:5px 5px 0 0;background:#3ddc84;height:' + Math.round(v.o / mx * 170) + 'px"></div><div title="Yakın" style="width:14px;border-radius:5px 5px 0 0;background:#2f86ff;height:' + Math.round((v.s + v.r) / mx * 170) + 'px"></div>' : '<div style="width:31px;height:3px;background:#dfe6f1"></div>') + '</div><span style="font-size:12px;font-weight:700;color:#5b6b82">' + d[1] + '</span></div>'; });
    h += '</div><div style="font-size:13px;color:#5b6b82;display:flex;gap:16px;flex-wrap:wrap"><span><i style="display:inline-block;width:11px;height:11px;border-radius:3px;background:#3ddc84;margin-right:5px"></i>Dışarıda</span><span><i style="display:inline-block;width:11px;height:11px;border-radius:3px;background:#2f86ff;margin-right:5px"></i>Ekran + yakın iş</span></div></div>' +
      '<div class="cgt-info">' + (n ? '<b>Haftalık özet (' + n + ' gün kayıtlı):</b> Günlük ortalama dışarıda <b>' + hm(Math.round(so / n)) + '</b>, ekranda <b>' + hm(Math.round(ss / n)) + '</b>, yakın işte <b>' + hm(Math.round(sr / n)) + '</b>. ' + (so / n >= 120 ? 'Gün ışığı hedefi tutuyor.' : 'Gün ışığında geçen süre 2 saatlik hedefin altında; okul çıkışı ve hafta sonu açık hava vakti eklemek fark yaratır.') : '<b>Henüz kayıt yok.</b> Bugünü işaretleyip “Günü kaydet”e basın.') + ' Araştırmalar, gün ışığında geçen sürenin çocuklarda miyopinin başlama riskini azalttığını, uzun süreli yakın çalışmanın ise riski artırdığını gösteriyor.</div></div></div><p class="cgt-note">Bu günlük bir takip aracıdır; tanı ya da tedavi önerisi içermez. Çocuğunuzun görmesiyle ilgili kaygınız varsa göz hekimine başvurun. Ekran mesafesini ölçmek için <a href="/p/ekran-mesafesi-olcer.html">Ekran Mesafesi Ölçer</a>’i kullanabilirsiniz.</p>';
    root.innerHTML = h;
  }
  var cur = null;
  root.addEventListener('input', function (e) { var k = e.target.getAttribute('data-k'); if (!k) return; cur = cur || Object.assign({ o: 0, s: 0, r: 0 }, D[sel] || {}); cur[k] = +e.target.value; document.getElementById('gnV_' + k).textContent = hm(cur[k]); });
  root.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var d = b.getAttribute('data-d'), a = b.getAttribute('data-a'); if (d) { sel = d; cur = null; } else if (a === 'save') { D[sel] = cur || D[sel] || { o: 0, s: 0, r: 0 }; cur = null; save(); } else if (a === 'del') { delete D[sel]; cur = null; save(); } render(); });
  render();
})();
