/* Araç sayfalarında video alanı · cagataygulumser.com
   Yeni video eklemek için V listesine bir satır ekleyin:
   'sayfa-adresi': ['YouTubeKimliği', 'Video başlığı', '/yazi-yolu.html', 1]
   Son değer 1 ise kart "Nasıl kullanılır?" başlığıyla, yoksa "Bu konunun videosu" başlığıyla çıkar. */
(function () {
  'use strict';
  var V = {
    'gozluk-receteni-oku': ['5lkraXMqr_E', 'Aks ne demek? Reçetede silindir ve aks nasıl okunur?', '/2026/10/gozluk-recetesi-nasl-okunur-aks-ve.html'],
    'recete-yazma-alistirmasi': ['5lkraXMqr_E', 'Aks ne demek? Reçetede silindir ve aks nasıl okunur?', '/2026/10/gozluk-recetesi-nasl-okunur-aks-ve.html'],
    'pd-ve-montaj-yuksekligi-olcer': ['aFd4bMKRnpg', 'Optik merkez nedir? PD ne demek, gözlükte neden önemli?', '/2026/10/optik-merkez-nedir-gozluk-camnda-optik.html'],
    'pd-ve-montaj-yuksekligi-simulatoru': ['aFd4bMKRnpg', 'Optik merkez nedir? PD ne demek, gözlükte neden önemli?', '/2026/10/optik-merkez-nedir-gozluk-camnda-optik.html'],
    'atolye-simulatoru': ['aFd4bMKRnpg', 'Optik merkez nedir? PD ne demek, gözlükte neden önemli?', '/2026/10/optik-merkez-nedir-gozluk-camnda-optik.html'],
    'cam-gosterim-studyosu': ['tDo6p470-Mg', 'Progresif cam nedir, nasıl çalışır?', '/2026/10/progresif-cam-nedir-progresif-gozluk.html'],
    'astigmat-testi': ['6QHStfWjgC0', 'Astigmat nasıl görür? Belirtileri nelerdir?', '/2026/10/astigmat-nasl-gorur-astigmat.html'],
    'fokometre-simulatoru': ['bWve99yi_Lk', 'Astigmat nedir, derecesi nasıl okunur?', '/2026/10/astigmat-neden-olur-astigmat-derecesi.html'],
    'torik-lens-rotasyonu': ['bWve99yi_Lk', 'Astigmat nedir, derecesi nasıl okunur?', '/2026/10/astigmat-neden-olur-astigmat-derecesi.html'],
    'polarize-gozluk-testi': ['BTkLe-jMpj0', 'Polarize gözlük ne işe yarar?', '/2026/10/polarize-gozluk-ne-ise-yarar-polarize.html'],
    'gunes-gozlugu-kategori-okuyucu': ['MznZKF9Etcw', 'Pahalı güneş gözlüğü daha mı iyi korur? UV400 ne demek?', '/2026/10/pahal-gunes-gozlugu-daha-m-iyi-korur.html'],
    'glokom-risk-testi': ['NfsyR2RzVC8', 'Glokom nedir, belirtileri nelerdir?', '/2026/10/glokom-belirtileri-nelerdir-glokoma.html'],
    'boyle-goruyor': ['7aQZH8FqkGs', 'Glokom hastası nasıl görür? Tünel görme', '/2026/10/glokom-hastas-nasl-gorur-tunel-gorme.html'],
    'miyopi-risk-testi': ['mDUnY_-3CK8', 'Dışarıda oynamak miyopiyi önler mi?', '/2026/10/dsarda-oynamak-miyopiyi-onler-mi.html'],
    'cocuk-miyopi-gunlugu': ['mDUnY_-3CK8', 'Dışarıda oynamak miyopiyi önler mi?', '/2026/10/dsarda-oynamak-miyopiyi-onler-mi.html'],
    'ekran-mesafesi-olcer': ['-WeDhRUVCxo', 'Miyopi neden artıyor?', '/2026/10/miyopi-neden-artyor-2050de-dunyann-yars.html'],
    'gorme-keskinligi-testi': ['24MCT3bsh-w', 'Miyop olduğumu nasıl anlarım?', '/2026/10/miyop-oldugumu-nasl-anlarm-miyopi.html'],
    'goz-numarasi-yuzde-kac-goruyor': ['R0OP5Ams3Zs', 'Gözlük takmak numarayı artırır mı?', '/2026/10/gozluk-takmak-gozu-bozar-m-gozluk.html'],
    'yakin-okuma-testi': ['ORqA63nC2C8', 'Presbiyopi belirtileri nelerdir?', '/2026/10/presbiyopi-belirtileri-nelerdir-40.html'],
    'yuz-sekline-gore-gozluk-testi': ['GY62L1La8kY', 'Yüzüme hangi gözlük yakışır?', '/2026/10/vitrindeki-gozluk-yuzde-neden-farkl.html'],
    'sanal-gozluk-deneme': ['GY62L1La8kY', 'Yüzüme hangi gözlük yakışır?', '/2026/10/vitrindeki-gozluk-yuzde-neden-farkl.html'],
    'kontakt-lens-degisim-takvimi': ['7ZA0ku0Nr9I', 'Lensle kestirmek zararlı mı?', '/2026/11/lensle-uyumak-zararl-m-lensle-ksa-sure.html'],
    'kontakt-lens-kutusu-okuyucu': ['6XsBjcAJOkU', 'Kontakt lens nasıl bulundu?', '/2026/11/kontakt-lens-nasl-bulundu-kontakt-lensi.html'],
    'gozlugun-tarihi': ['6XsBjcAJOkU', 'Kontakt lens nasıl bulundu?', '/2026/11/kontakt-lens-nasl-bulundu-kontakt-lensi.html'],
    'ardil-goruntu-testi': ['090rofhr_Mw', 'Troxler etkisi nedir? Noktaya bakınca renkler neden kaybolur?', '/2026/10/troxler-etkisi-nedir-noktaya-baknca.html'],
    'goz-anatomisi-bulmacasi': ['VOSVC6kgfS4', 'Göz merceği neden sertleşir?', '/2026/10/goz-mercegi-neden-sertlesir-yakn-gorme.html'],
    'canl-goz-atlas': ['VOSVC6kgfS4', 'Göz merceği neden sertleşir?', '/2026/10/goz-mercegi-neden-sertlesir-yakn-gorme.html'],
    'optisyen-akademi': ['uv7RmeTK4vM', 'Optisyen ne iş yapar? Optisyen ile göz doktoru arasındaki fark', '/2026/10/optisyen-ile-goz-doktoru-arasndaki-fark.html']
  };
  function go() {
    var m = location.pathname.match(/\/p\/([^/.]+)\.html/); if (!m || !V[m[1]] || document.getElementById('cgvid')) return;
    var v = V[m[1]], host = document.querySelector('.post-body'); if (!host) return;
    var d = document.createElement('div'); d.id = 'cgvid';
    d.innerHTML = '<style>#cgvid{max-width:1180px;margin:26px auto 0;font-family:inherit}#cgvid .cv{display:flex;flex-wrap:wrap;gap:16px 22px;align-items:center;background:#fff;border:1px solid #d7e0ee;border-radius:18px;padding:14px;text-align:left}#cgvid .cv-p{position:relative;flex:1 1 300px;max-width:440px;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#0b1730;border:0;padding:0;cursor:pointer;display:block}#cgvid .cv-p img,#cgvid .cv-p iframe{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;border:0;padding:0;margin:0;box-shadow:none;background:none}#cgvid .cv-p i{position:absolute;left:50%;top:50%;width:68px;height:48px;margin:-24px 0 0 -34px;border-radius:14px;background:#f00;box-shadow:0 6px 18px rgba(0,0,0,.35)}#cgvid .cv-p i:after{content:"";position:absolute;left:27px;top:14px;border-style:solid;border-width:10px 0 10px 17px;border-color:transparent transparent transparent #fff}#cgvid .cv-t{flex:1 1 260px;min-width:0;display:flex;flex-direction:column;gap:8px;color:#14233b}#cgvid .cv-k{font-size:11.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#004aad}#cgvid .cv-t b{font-size:20px;line-height:1.25}#cgvid .cv-t a{font-weight:700;color:#004aad;text-decoration:none;font-size:15px}html[data-cg-theme=dark] #cgvid .cv{background:#131f33;border-color:#2a3b58}html[data-cg-theme=dark] #cgvid .cv-t{color:#e6edf7}html[data-cg-theme=dark] #cgvid .cv-k,html[data-cg-theme=dark] #cgvid .cv-t a{color:#8fbcff}@media print{#cgvid{display:none}}</style>' +
      '<div class="cv"><button type="button" class="cv-p" aria-label="Videoyu oynat: ' + v[1].replace(/"/g, '') + '"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + v[0] + '/hqdefault.jpg"><i></i></button><div class="cv-t"><span class="cv-k">' + (v[3] ? 'Nasıl kullanılır?' : 'Bu konunun videosu') + '</span><b>' + v[1] + '</b><span style="font-size:14.5px;color:#5b6b82">' + (v[3] ? 'Aracı adım adım gösteren kısa video.' : 'Bu sayfadaki konuyu videoda anlattım.') + '</span>' + (v[2] ? '<a href="' + v[2] + '">Yazısını da okuyun →</a>' : '') + '</div></div>';
    host.appendChild(d);
    d.querySelector('.cv-p').addEventListener('click', function () { this.outerHTML = '<div class="cv-p" style="cursor:default"><iframe src="https://www.youtube-nocookie.com/embed/' + v[0] + '?autoplay=1&rel=0" title="' + v[1].replace(/"/g, '') + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>'; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
