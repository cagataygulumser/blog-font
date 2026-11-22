/* Işın Laboratuvarı — mercek, prizma ve göz modeli · cagataygulumser.com */
(function () {
  'use strict';
  var root = document.getElementById('cgt-isin'); if (!root || root.querySelector('canvas')) return;
  var W = 1000, H = 470, AX = H / 2, KD = 3400;
  var M = [['yak', 'Yakınsak mercek'], ['ira', 'Iraksak mercek'], ['nes', 'Nesne ve görüntü'], ['goz', 'Göz ve gözlük camı'], ['pri', 'Prizma']];
  var S = { m: 'yak', p: 5, lx: 420, u: 30, k: -4, sp: 0, pr: 6, base: 'asagi', n: 7 };
  function $(i) { return document.getElementById(i); }
  function f1(v, d) { return v.toFixed(d == null ? 1 : d).replace('.', ',').replace('-', '−'); }
  function sg(v) { return (v > 0 ? '+' : '') + f1(v, 2); }
  root.innerHTML = '<p class="cgt-lead">Işığın mercekten ve prizmadan geçerken nasıl kırıldığını izleyin. Odak uzaklığını, nesnenin yerini ve göz kusurunu değiştirin; ışınlar anında yeniden çizilir.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="isP"></div><div class="cgt-col"><div class="cgt-stage"><canvas id="isC" width="' + W + '" height="' + H + '" style="touch-action:pan-y;background:#0b1730"></canvas></div><div class="cgt-info" id="isI"></div></div></div>' +
    '<p class="cgt-note">Çizimler ince mercek yaklaşımıyla yapılır ve şematiktir; göz modeli ölçekli değildir, kırılma kusurları görünür olsun diye büyütülmüştür.</p>';
  var cv = $('isC'), g = cv.getContext('2d');
  function line(x1, y1, x2, y2, col, w, dash) { g.strokeStyle = col; g.lineWidth = w || 2; g.setLineDash(dash || []); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.setLineDash([]); }
  function lens(x, P, h, lab) {
    var b = Math.max(-16, Math.min(16, P * 3)); g.fillStyle = 'rgba(120,190,255,.28)'; g.strokeStyle = '#9fd0ff'; g.lineWidth = 2; g.beginPath();
    if (b >= 0) { g.moveTo(x, AX - h); g.quadraticCurveTo(x + 6 + b, AX, x, AX + h); g.quadraticCurveTo(x - 6 - b, AX, x, AX - h); }
    else { g.moveTo(x - 7, AX - h); g.lineTo(x + 7, AX - h); g.quadraticCurveTo(x + 7 + b, AX, x + 7, AX + h); g.lineTo(x - 7, AX + h); g.quadraticCurveTo(x - 7 - b, AX, x - 7, AX - h); }
    g.closePath(); g.fill(); g.stroke(); if (lab) { g.fillStyle = '#cfe3ff'; g.font = '700 14px Arial'; g.textAlign = 'center'; g.fillText(lab, x, AX - h - 10); }
  }
  function dot(x, y, col, lab, dy) { g.fillStyle = col; g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill(); if (lab) { g.font = '700 14px Arial'; g.textAlign = 'center'; g.fillText(lab, x, y + (dy || 24)); } }
  /* elemanlar: {x, P (1/px), d (eğim sapması)} */
  function trace(x0, y0, sl, els, xe, col, virt) {
    var x = x0, y = y0, i; els = els.filter(function (e) { return e.x > x0; }).sort(function (a, b) { return a.x - b.x; });
    for (i = 0; i < els.length; i++) { var e = els[i], ny = y + sl * (e.x - x); if (Math.abs(ny - AX) > (e.h || 1e9)) { line(x, y, e.x, ny, col, 2); return; } line(x, y, e.x, ny, col, 2); x = e.x; y = ny; var s0 = sl; sl = sl - y1(y) * (e.P || 0) + (e.d || 0); if (virt && e.P < 0 && Math.abs(y - AX) > 1) line(x, y, x - 420, y - sl * 420, 'rgba(255,212,0,.45)', 1.5, [6, 6]); }
    line(x, y, xe, y + sl * (xe - x), col, 2); return { y: y, sl: sl, x: x };
  }
  function y1(y) { return y - AX; }
  function render() {
    g.fillStyle = '#0b1730'; g.fillRect(0, 0, W, H); line(0, AX, W, AX, 'rgba(255,255,255,.28)', 1, [8, 8]);
    var m = S.m, info = '', i, n = S.n, col = '#ffd400', ys = [];
    for (i = 0; i < n; i++) ys.push(AX + (i - (n - 1) / 2) * (150 / ((n - 1) / 2 || 1)) * .9);
    if (m === 'yak' || m === 'ira') {
      var P = (m === 'yak' ? 1 : -1) * Math.abs(S.p), f = 100 / P * 4, els = [{ x: S.lx, P: 1 / f }];
      ys.forEach(function (y) { trace(0, y, 0, els, W, col, true); }); lens(S.lx, P, 170, sg(P) + ' D');
      dot(S.lx + f, AX, '#ff7a59', 'F', 24); dot(S.lx - f, AX, 'rgba(255,122,89,.6)', "F′", 24);
      info = m === 'yak' ? '<b>Yakınsak (artı) mercek:</b> Paralel gelen ışınları merceğin arkasındaki odak noktasında (F) toplar. Güç arttıkça odak merceğe yaklaşır: odak uzaklığı = 1 / güç. ' + sg(P) + ' D için odak uzaklığı <b>' + f1(100 / Math.abs(P)) + ' cm</b>. Hipermetropi ve presbiyopide kullanılır.' : '<b>Iraksak (eksi) mercek:</b> Paralel gelen ışınları dağıtır; ışınlar merceğin önündeki sanal odaktan (F) geliyormuş gibi uzaklaşır (kesikli çizgiler). ' + sg(P) + ' D için odak uzaklığı <b>' + f1(100 / Math.abs(P)) + ' cm</b>. Miyopide kullanılır.';
    } else if (m === 'nes') {
      var P2 = S.p, f2 = 100 / P2 * 4, lx = 520, ox = lx - S.u * 4, oy = AX - 70, els2 = [{ x: lx, P: 1 / f2 }], u = -S.u, v = 1 / (P2 / 100 + 1 / u), mg = v / u;
      line(ox, AX, ox, oy, '#7dffb0', 4); dot(ox, oy, '#7dffb0', 'nesne', -14);
      [-0.32, -0.12, 0.08, 0.28, 0.48].forEach(function (s) { trace(ox, oy, s * (70 / Math.max(40, S.u * 4)) * 2.2, els2, W, col); });
      lens(lx, P2, 190, sg(P2) + ' D'); dot(lx + f2, AX, '#ff7a59', 'F'); dot(lx - f2, AX, 'rgba(255,122,89,.6)', "F′");
      var ix = lx + v * 4, iy = AX - 70 * mg; if (v > 0 && ix < W + 400) { line(ix, AX, ix, iy, '#ff9ecf', 4); dot(ix, iy, '#ff9ecf', 'görüntü', iy > AX ? 24 : -14); } else if (v < 0) { line(ix, AX, ix, iy, 'rgba(255,158,207,.7)', 4, [6, 5]); dot(ix, iy, 'rgba(255,158,207,.8)', 'sanal görüntü', -14); [-0.12, 0.28].forEach(function (s) { var sl = s * (70 / Math.max(40, S.u * 4)) * 2.2, yl = oy + sl * (lx - ox), s2 = sl - (yl - AX) / f2; line(lx, yl, ix, yl - s2 * (lx - ix), 'rgba(255,212,0,.4)', 1.5, [6, 6]); }); }
      info = '<b>Nesne ve görüntü:</b> Nesne mercekten <b>' + S.u + ' cm</b> uzakta, merceğin gücü ' + sg(P2) + ' D (odak ' + f1(100 / Math.abs(P2)) + ' cm). ' + (Math.abs(1 / (P2 / 100 + 1 / u)) > 1e5 ? 'Nesne tam odakta: ışınlar paralel çıkar, görüntü sonsuzda oluşur.' : v > 0 ? 'Görüntü merceğin arkasında <b>' + f1(v) + ' cm</b> uzakta oluşur; <b>gerçek ve ters</b>tir, büyütme <b>' + f1(Math.abs(mg), 2) + '×</b>.' : 'Görüntü nesneyle aynı tarafta, <b>' + f1(Math.abs(v)) + ' cm</b> uzakta oluşur; <b>sanal ve düz</b>dür, büyütme <b>' + f1(Math.abs(mg), 2) + '×</b>.' + (P2 > 0 ? ' Büyüteç böyle çalışır: nesne odak uzaklığından yakındadır.' : '')) + ' Formül: 1/v − 1/u = 1/f.';
    } else if (m === 'goz') {
      var ex = 640, f0 = 170, s1 = -S.k / KD, yq = 1 + s1 * 130, L = -yq / (s1 - yq / f0), rx = ex + L, sx = ex - 130, els3 = [{ x: ex, P: 1 / f0 }]; if (Math.abs(S.sp) > .01) els3.unshift({ x: sx, P: S.sp / KD });
      g.strokeStyle = '#e9d9cf'; g.lineWidth = 4; g.beginPath(); g.ellipse(ex + L / 2 - 6, AX, L / 2 + 22, 150, 0, 0, 7); g.stroke(); g.strokeStyle = '#ff9ecf'; g.lineWidth = 6; g.beginPath(); g.ellipse(ex + L / 2 - 6, AX, L / 2 + 19, 147, 0, -0.5, 0.5); g.stroke();
      var last = null; ys.forEach(function (y) { var yy = AX + (y - AX) * .62, r = trace(0, yy, 0, els3, rx + 16, col); if (yy !== AX) last = r; });
      lens(ex, 9, 92, 'göz'); if (Math.abs(S.sp) > .01) lens(sx, S.sp * 1.5, 120, 'cam ' + sg(S.sp) + ' D');
      var fx = last ? last.x - (last.y - AX) / last.sl : rx, df = fx - rx; dot(fx, AX, '#ff7a59', 'odak', 26); g.fillStyle = '#ff9ecf'; g.font = '700 14px Arial'; g.textAlign = 'center'; g.fillText('retina', rx + 6, AX - 162);
      var st = Math.abs(df) < 4 ? 'Odak <b>tam retinada</b>: görüntü net.' : df < 0 ? 'Odak retinanın <b>önünde</b> kalıyor: uzak bulanık görülür (miyop gibi).' : 'Odak retinanın <b>arkasına</b> düşüyor: görüntü bulanık (hipermetrop gibi).';
      info = '<b>Göz ve gözlük camı:</b> Göz ' + (S.k === 0 ? 'kusursuz (emetrop)' : S.k < 0 ? sg(S.k) + ' D miyop: göz uzun, ışık retinanın önünde odaklanır' : sg(S.k) + ' D hipermetrop: göz kısa, ışık retinanın arkasında odaklanır') + '. Gözün önünde ' + (Math.abs(S.sp) < .01 ? 'cam yok' : sg(S.sp) + ' D cam var') + '. ' + st + ' Miyopta eksi, hipermetropta artı cam odağı retinaya taşır. Camın gücünü değiştirerek odağı retinaya getirmeyi deneyin.';
    } else {
      var px = 380, d = S.pr / 100 * (S.base === 'asagi' ? 1 : -1), sxs = 880;
      [AX - 40, AX, AX + 40].forEach(function (y) { trace(0, y, 0, [{ x: px, d: d * 4 }], sxs, col); });
      g.fillStyle = 'rgba(120,190,255,.28)'; g.strokeStyle = '#9fd0ff'; g.lineWidth = 2; g.beginPath(); var t = 14 + S.pr * 3; if (S.base === 'asagi') { g.moveTo(px, AX - 130); g.lineTo(px + t, AX + 130); g.lineTo(px - t, AX + 130); } else { g.moveTo(px, AX + 130); g.lineTo(px + t, AX - 130); g.lineTo(px - t, AX - 130); } g.closePath(); g.fill(); g.stroke();
      g.fillStyle = '#cfe3ff'; g.font = '700 14px Arial'; g.textAlign = 'center'; g.fillText('taban', px, S.base === 'asagi' ? AX + 150 : AX - 140); g.fillText('tepe', px, S.base === 'asagi' ? AX - 140 : AX + 150);
      line(sxs, 40, sxs, H - 40, '#e9d9cf', 4); var hy = AX + d * 4 * (sxs - px); dot(sxs, hy, '#ff7a59'); dot(sxs, AX, 'rgba(255,255,255,.5)'); g.fillStyle = '#cfe3ff'; g.fillText('ekran', sxs, 30);
      info = '<b>Prizma:</b> Işık prizmanın <b>tabanına doğru</b> kırılır; prizmanın arkasından bakan göz ise cismi <b>tepeye doğru</b> kaymış görür. ' + f1(S.pr, 1) + ' prizma dioptri, ışını 1 metrede <b>' + f1(S.pr, 1) + ' cm</b> saptırır. Gözlük camı optik merkezinden kaydırıldığında da aynı etki oluşur: prizma (Δ) = kayma (cm) × camın gücü (D).';
    }
    $('isI').innerHTML = info;
  }
  function row(k, lab, mn, mx, st, val, txt) { return '<div><div class="cgt-row"><span>' + lab + '</span><b id="isV_' + k + '">' + txt + '</b></div><input type="range" data-k="' + k + '" min="' + mn + '" max="' + mx + '" step="' + st + '" value="' + val + '"></div>'; }
  function txt(k) { var v = S[k]; return k === 'p' ? (S.m === 'ira' ? '−' : S.m === 'yak' ? '+' : '') + (S.m === 'nes' ? sg(v) : f1(Math.abs(v), 2)) + ' D' : k === 'u' ? v + ' cm' : k === 'k' ? (v === 0 ? 'kusursuz' : sg(v) + ' D') : k === 'sp' ? (Math.abs(v) < .01 ? 'cam yok' : sg(v) + ' D') : k === 'pr' ? f1(v, 1) + ' Δ' : k === 'n' ? v + ' ışın' : v; }
  function panel() {
    var h = '<div><p class="cgt-h">Deney</p><div class="cgt-chips">' + M.map(function (x) { return '<button type="button" class="cgt-chip' + (S.m === x[0] ? ' on' : '') + '" data-m="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div></div><div><p class="cgt-h">Ayarlar</p>';
    if (S.m === 'yak' || S.m === 'ira') h += row('p', 'Mercek gücü', 1.5, 12, 0.25, Math.abs(S.p), txt('p')) + '<div style="height:10px"></div>' + row('lx', 'Mercek konumu', 200, 640, 5, S.lx, '') + '<div style="height:10px"></div>' + row('n', 'Işın sayısı', 3, 11, 2, S.n, txt('n'));
    else if (S.m === 'nes') h += row('p', 'Mercek gücü', -10, 12, 0.25, S.p, txt('p')) + '<div style="height:10px"></div>' + row('u', 'Nesne uzaklığı', 6, 110, 1, S.u, txt('u'));
    else if (S.m === 'goz') h += row('k', 'Göz kusuru', -8, 8, 0.25, S.k, txt('k')) + '<div style="height:10px"></div>' + row('sp', 'Gözlük camı', -10, 10, 0.25, S.sp, txt('sp')) + '<div style="height:10px"></div><div class="cgt-chips"><button type="button" class="cgt-btn y" data-a="fix">Camı uygun güce getir</button><button type="button" class="cgt-btn" data-a="off">Camı çıkar</button></div>';
    else h += row('pr', 'Prizma gücü', 1, 12, 0.5, S.pr, txt('pr')) + '<div style="height:10px"></div><div class="cgt-chips"><button type="button" class="cgt-chip' + (S.base === 'asagi' ? ' on' : '') + '" data-b="asagi">Taban aşağı</button><button type="button" class="cgt-chip' + (S.base === 'yukari' ? ' on' : '') + '" data-b="yukari">Taban yukarı</button></div>';
    $('isP').innerHTML = h + '</div>';
  }
  $('isP').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var m = b.getAttribute('data-m'), a = b.getAttribute('data-a'), bs = b.getAttribute('data-b');
    if (m) { S.m = m; if (m === 'nes') { S.p = 5; S.u = 30; } else if (m === 'yak' || m === 'ira') S.p = 5; }
    else if (a === 'fix') S.sp = S.k; else if (a === 'off') S.sp = 0; else if (bs) S.base = bs;
    panel(); render();
  });
  $('isP').addEventListener('input', function (e) { var el = e.target, k = el.getAttribute('data-k'); if (!k) return; S[k] = +el.value; if (k === 'p' && S.m === 'nes' && Math.abs(S.p) < .25) S.p = .25; var o = $('isV_' + k); if (o) o.textContent = txt(k); render(); });
  panel(); render();
})();
