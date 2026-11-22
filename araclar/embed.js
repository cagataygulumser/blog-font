/* cagataygulumser.com araçlarını başka sitelere gömme betiği
   Kullanım: <script src=".../araclar/embed.js" data-arac="deneme"></script> */
(function () {
  'use strict';
  var s = document.currentScript; if (!s) return;
  var M = { deneme: ['araclar/deneme.js', 'cgt-deneme', 'sanal-gozluk-deneme', 'Sanal Gözlük Deneme'], gorus: ['araclar/gorus.js', 'cgt-gorus', 'boyle-goruyor', 'Böyle Görüyor'], mesafe: ['araclar/mesafe.js', 'cgt-mesafe', 'ekran-mesafesi-olcer', 'Ekran Mesafesi Ölçer'], foko: ['araclar/foko.js', 'cgt-foko', 'fokometre-simulatoru', 'Fokometre Simülatörü'], isin: ['araclar/isin.js', 'cgt-isin', 'isin-laboratuvari', 'Işın Laboratuvarı'], studyo: ['cam-gosterim/cgs.js', 'cgs', 'cam-gosterim-studyosu', 'Cam Gösterim Stüdyosu'] };
  var a = s.getAttribute('data-arac'), m = M[a]; if (!m || document.getElementById(m[1])) return;
  var R = s.src.replace(/araclar\/[^\/]*$/, ''), w = document.createElement('div'), d = document.createElement('div'), l = document.createElement('link'), j = document.createElement('script'), c = document.createElement('p');
  l.rel = 'stylesheet'; l.href = R + (a === 'studyo' ? 'cam-gosterim/cgs.css' : 'araclar/arac.css'); document.head.appendChild(l);
  w.style.cssText = 'max-width:1240px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;text-align:left'; d.id = m[1]; if (a !== 'studyo') d.className = 'cgt'; d.setAttribute('data-embed', '1');
  c.style.cssText = 'font:12.5px/1.4 Arial,sans-serif;color:#5b6b82;margin:10px 2px 0;text-align:right';
  c.innerHTML = 'Bu araç <a href="https://www.cagataygulumser.com/p/' + m[2] + '.html" target="_blank" rel="noopener" style="color:#004aad;font-weight:700;text-decoration:none">' + m[3] + ' · Optisyen Çağatay Gülümser</a> tarafından ücretsiz sunulur.';
  w.appendChild(d); w.appendChild(c); s.parentNode.insertBefore(w, s.nextSibling);
  j.src = R + m[0]; j.charset = 'utf-8'; w.appendChild(j);
})();
