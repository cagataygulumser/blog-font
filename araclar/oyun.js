/* Renk Avı — renk ayırt etme oyunu · cagataygulumser.com */
(function () {
  'use strict';
  var root = document.getElementById('cgt-oyun'); if (!root || root.firstChild) return;
  var st = { on: false, lvl: 1, sc: 0, t: 30, odd: 0, n: 2, best: 0 }, tm = null; try { st.best = +localStorage.getItem('cgRenkAvi') || 0; } catch (x) {}
  function grid() { var n = Math.min(8, 2 + Math.floor(st.lvl / 2)), h = Math.floor(Math.random() * 360), s = 55 + Math.random() * 25, l = 45 + Math.random() * 15, d = Math.max(2.2, 22 - st.lvl * 1.5); st.n = n; st.odd = Math.floor(Math.random() * n * n); var c = 'hsl(' + h + ',' + s + '%,' + l + '%)', o = 'hsl(' + h + ',' + s + '%,' + (l + (l > 52 ? -d : d)) + '%)', g = ''; for (var i = 0; i < n * n; i++) g += '<button type="button" data-i="' + i + '" aria-label="Kare ' + (i + 1) + '" style="aspect-ratio:1;border:0;border-radius:' + (n > 5 ? 8 : 14) + 'px;cursor:pointer;background:' + (i === st.odd ? o : c) + '"></button>'; return '<div style="display:grid;grid-template-columns:repeat(' + n + ',1fr);gap:' + (n > 5 ? 5 : 9) + 'px;max-width:560px;margin:0 auto">' + g + '</div>'; }
  function rank(s) { return s >= 28 ? 'Kartal gözü' : s >= 20 ? 'Keskin göz' : s >= 12 ? 'Dikkatli göz' : 'Isınma turu'; }
  function render(end) {
    var h = '<p class="cgt-lead">Karelerden biri diğerlerinden biraz farklı renkte. 30 saniyede kaç tanesini bulabilirsiniz? Her doğru cevapta fark küçülür, kareler çoğalır.</p><div class="cgt-panel" style="flex-direction:row;flex-wrap:wrap;gap:22px;align-items:center;justify-content:space-between;margin-bottom:14px"><div><p class="cgt-h">Skor</p><b style="font-size:30px;color:#004aad">' + st.sc + '</b></div><div><p class="cgt-h">Süre</p><b id="oyT" style="font-size:30px;color:' + (st.t <= 5 ? '#b3261e' : '#14233b') + '">' + st.t + '</b></div><div><p class="cgt-h">En iyi</p><b style="font-size:30px">' + st.best + '</b></div><button type="button" class="cgt-btn ' + (st.on ? '' : 'y') + '" data-a="go">' + (st.on ? 'Yeniden başla' : end ? 'Tekrar oyna' : 'Başla') + '</button></div>';
    if (st.on) h += grid(); else if (end) h += '<div class="cgt-info" style="text-align:center;font-size:17px"><b style="font-size:26px">' + st.sc + ' kare · ' + rank(st.sc) + '</b><br>Skorunuzu paylaşın, arkadaşlarınız geçebilecek mi?<div class="cgt-chips" style="justify-content:center;margin-top:12px"><button type="button" class="cgt-btn b" data-a="share">Skoru paylaş</button></div></div>'; else h += '<div class="cgt-info">Oyun, renk tonlarını ayırt etme becerinizi eğlenceli biçimde sınar. Ekran parlaklığı ve ortam ışığı sonucu etkiler. Renkleri ayırt etmekte belirgin zorlanıyorsanız <a href="/p/renk-korlugu-testi.html">Renk Körlüğü Testi</a>’ne bakabilirsiniz.</div>';
    root.innerHTML = h + '<p class="cgt-note">Bu bir oyundur; görme testi değildir ve tanı koymaz.</p>';
  }
  function stop() { st.on = false; clearInterval(tm); if (st.sc > st.best) { st.best = st.sc; try { localStorage.setItem('cgRenkAvi', String(st.best)); } catch (x) {} } render(true); }
  root.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var a = b.getAttribute('data-a');
    if (a === 'go') { clearInterval(tm); st.on = true; st.lvl = 1; st.sc = 0; st.t = 30; render(); tm = setInterval(function () { st.t--; var o = document.getElementById('oyT'); if (o) { o.textContent = st.t; if (st.t <= 5) o.style.color = '#b3261e'; } if (st.t <= 0) stop(); }, 1000); }
    else if (a === 'share') { var t = 'Renk Avı’nda ' + st.sc + ' kare buldum (' + rank(st.sc) + '). Sen kaç bulursun? https://www.cagataygulumser.com/p/renk-avi.html'; if (navigator.share) navigator.share({ text: t }).catch(function () {}); else if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { b.textContent = 'Kopyalandı'; }); }
    else if (b.hasAttribute('data-i') && st.on) { if (+b.getAttribute('data-i') === st.odd) { st.sc++; st.lvl++; } else st.t = Math.max(0, st.t - 3); if (st.t <= 0) stop(); else render(); }
  });
  window.CGOYUN = { odd: function () { return st.odd; } };
  render();
})();
