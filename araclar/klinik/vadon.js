/* Görme keskinliği dönüştürücü · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-vadon'); if (!K || !root || root.querySelector('.cgk-tbl')) return;
  var S = { tip: 'ond', v: '0,5' };
  var TP = { ond: ['Ondalık', '0,5'], s6: ['Snellen 6/x', '6/12'], s20: ['Snellen 20/x', '20/40'], log: ['logMAR', '0,3'], etd: ['ETDRS harf', '70'] };
  root.innerHTML = '<p class="cgt-lead">Görme keskinliğini ondalık, Snellen (6/x ve 20/x), logMAR ve ETDRS harf sayısı arasında çevirin; standart satırların tam karşılık tablosu altta.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="vdP"></div><div class="cgt-col"><div class="cgt-info" id="vdI" style="margin-top:0"></div><div class="cgt-panel" style="margin-top:14px"><div style="overflow:auto"><table class="cgk-tbl"><thead><tr><th>Ondalık</th><th>6/x</th><th>20/x</th><th>logMAR</th><th>ETDRS harf</th></tr></thead><tbody id="vdT"></tbody></table></div></div></div></div>' +
    '<p class="cgt-note">Dönüşümler: logMAR = −log₁₀(ondalık); Snellen paydası = 6 (ya da 20) ÷ ondalık; ETDRS harf sayısı ≈ 85 − 50 × logMAR (4 metrede, 1,0 = 85 harf). Ortalama alırken ondalık değerlerin değil logMAR değerlerinin ortalaması alınmalıdır. Parmak sayma, el hareketi ve ışık hissi için kullanılan logMAR karşılıkları yaklaşık ve tartışmalıdır; bu sayfada çevrilmez.</p>' + K.dr;
  function num(x) { x = parseFloat(String(x).replace(',', '.')); return isNaN(x) ? null : x; }
  function ond() {
    var s = String(S.v).trim(), n; if (S.tip === 's6' || S.tip === 's20') { var p = s.split('/'), a = num(p[0]), b = num(p[1] == null ? '' : p[1]); if (p.length === 1) { b = a; a = S.tip === 's6' ? 6 : 20; } return a && b ? a / b : null; }
    n = num(s); if (n == null) return null; if (S.tip === 'ond') return n > 0 ? n : null; if (S.tip === 'log') return Math.pow(10, -n); return Math.pow(10, -(85 - n) / 50);
  }
  function fmt(d) { var l = -Math.log(d) / Math.LN10; function t(x, n) { return K.tr(x, n).replace('-', '−'); } return [t(d, d < .1 ? 3 : 2), '6/' + t(6 / d, 6 / d < 10 ? 1 : 0).replace(',0', ''), '20/' + t(20 / d, 0), t(Math.abs(l) < .005 ? 0 : l, 2), String(Math.round(85 - 50 * l))]; }
  var LN = [.05, .063, .08, .1, .125, .16, .2, .25, .32, .4, .5, .63, .8, 1, 1.25, 1.6, 2];
  function panel() { K.$('vdP').innerHTML = '<div><p class="cgt-h">Elinizdeki değer</p>' + K.chips('t', Object.keys(TP).map(function (k) { return [k, TP[k][0]]; }), S.tip) + '</div><div><p class="cgt-h">Değer</p><input type="text" id="vdV" inputmode="decimal" value="' + S.v + '" aria-label="Görme keskinliği değeri" style="font-size:18px;padding:11px 12px"><div style="font-size:12.5px;color:#5b6b82;margin-top:6px">Örnek: ' + TP[S.tip][1] + '</div></div>'; }
  function out() {
    var d = ond(), el = K.$('vdI'), near = -1;
    if (d == null || !isFinite(d) || d <= 0 || d > 4) el.innerHTML = '<b>Geçerli bir değer yazın.</b> Örnek: ' + TP[S.tip][1] + '.';
    else { var f = fmt(d), bd = 9; LN.forEach(function (x, i) { var e = Math.abs(Math.log(x / d)); if (e < bd) { bd = e; near = i; } }); el.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px">' + ['Ondalık', 'Snellen 6/x', 'Snellen 20/x', 'logMAR', 'ETDRS harf'].map(function (a, i) { return '<div><div style="font-size:11.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#5b6b82">' + a + '</div><div style="font-size:24px;font-weight:800;color:#004aad">' + f[i] + '</div></div>'; }).join('') + '</div>'; }
    K.$('vdT').innerHTML = LN.map(function (x, i) { var f = fmt(x); return '<tr' + (i === near ? ' style="background:#fff6cc"' : '') + '>' + f.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('');
  }
  panel(); out();
  K.$('vdP').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b || !b.getAttribute('data-t')) return; S.tip = b.getAttribute('data-t'); S.v = TP[S.tip][1]; panel(); out(); });
  K.$('vdP').addEventListener('input', function (e) { if (e.target.id === 'vdV') { S.v = e.target.value; out(); } });
})();
