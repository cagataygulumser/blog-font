/* Gözlüğün Tarihi — zaman çizelgesi · cagataygulumser.com */
(function () {
  'use strict';
  var root = document.getElementById('cgt-tarih'); if (!root || root.firstChild) return;
  var E = [
    ['1280’ler', 'İlk gözlükler', 'cer', 'Kuzey İtalya’da iki büyütecin perçinle birleştirilmesiyle ilk okuma gözlükleri ortaya çıktı. Burna sıkıştırılarak ya da elde tutularak kullanılıyordu; yalnızca yakını görmekte zorlananlar içindi.'],
    ['1450’ler', 'Miyoplar için içbükey cam', 'cam', 'Matbaanın yayılmasıyla gözlüğe talep arttı. Aynı yüzyılda uzağı göremeyenler için içbükey (eksi) camlar da kullanılmaya başlandı.'],
    ['1604', 'Camın nasıl çalıştığı açıklanıyor', 'bil', 'Johannes Kepler, dışbükey ve içbükey camların hipermetropi ve miyopiyi neden düzelttiğini ışığın retinada odaklanmasıyla açıkladı.'],
    ['1720’ler', 'Saplı gözlük', 'cer', 'Londralı gözlükçü Edward Scarlett’e atfedilen saplı çerçeveler yayıldı. Gözlük artık burunda dengede tutulmak zorunda değildi; kulağın üzerinden destek alıyordu.'],
    ['1784', 'Bifokal cam', 'cam', 'Benjamin Franklin, uzak ve yakın camlarını ikiye bölüp tek çerçevede birleştirdiğini yazdı. Çift odaklı cam fikri genellikle ona atfedilir.'],
    ['1825', 'Astigmat için silindirik cam', 'cam', 'İngiliz gökbilimci George Airy kendi astigmatını düzeltmek için silindirik cam yaptırdı. Aks kavramı gözlükçülüğe böyle girdi.'],
    ['1862', 'Harf tablosu', 'bil', 'Hollandalı göz hekimi Herman Snellen, görme keskinliğini ölçmek için standart harf tablosunu yayımladı. Bugünkü “10/10” ifadesinin kökeni budur.'],
    ['1888', 'İlk kontakt lensler', 'len', 'Adolf Fick ve çağdaşları camdan yapılmış, gözün tamamını örten ilk kontakt lensleri denedi. Kısa süre takılabiliyordu ama fikir doğmuştu.'],
    ['1930’lar', 'Polarize filtre ve antirefle', 'kap', 'Edwin Land’in polarize filtresi güneş gözlüklerine girdi. Aynı yıllarda cam yüzeyindeki yansımayı azaltan ilk antirefle kaplamalar geliştirildi.'],
    ['1940’lar', 'Organik (plastik) cam', 'cam', 'CR-39 adlı reçine gözlük camında kullanılmaya başlandı. Mineral cama göre yaklaşık yarı ağırlıkta ve kırılmaya daha dayanıklıydı.'],
    ['1959', 'Progresif cam', 'cam', 'Fransız mühendis Bernard Maitenaz’ın geliştirdiği ilk progresif cam piyasaya çıktı. Uzak, ara ve yakın mesafe çizgisiz tek camda birleşti.'],
    ['1960’lar', 'Renk değiştiren cam', 'kap', 'Güneş ışığında koyulaşan fotokromik mineral camlar tanıtıldı. Aynı on yılda yumuşak kontakt lensin temeli olan hidrojel malzeme geliştirildi.'],
    ['1971', 'Yumuşak kontakt lens', 'len', 'Yumuşak kontakt lensler geniş kullanıma sunuldu. Konforu sayesinde kontakt lens kullanımı hızla yaygınlaştı.'],
    ['1980’ler', 'Polikarbonat ve yüksek indeks', 'cam', 'Darbeye dayanıklı polikarbonat ve daha ince camlar sağlayan yüksek indeksli malzemeler yaygınlaştı; çocuk ve spor gözlüklerinde standart hale geldi.'],
    ['2000’ler', 'Serbest form üretim', 'cam', 'Bilgisayar kontrollü yüzey işleme ile camın arka yüzeyi kişinin reçetesine ve ölçülerine göre nokta nokta işlenebilir oldu.'],
    ['2010’lar', 'Miyopi kontrol camları ve akıllı gözlük', 'bil', 'Çocuklarda miyopinin ilerlemesini yavaşlatmayı hedefleyen cam tasarımları ve ekranlı, kameralı akıllı gözlükler ortaya çıktı.']
  ];
  var K = { hep: 'Tümü', cer: 'Çerçeve', cam: 'Cam', len: 'Kontakt lens', kap: 'Kaplama ve filtre', bil: 'Bilim ve ölçüm' }, f = 'hep';
  function render() {
    var h = '<p class="cgt-lead">İki büyütecin perçinlenmesinden serbest form camlara: gözlüğün yedi yüzyıllık hikâyesi. Konuya göre süzün.</p><div class="cgt-chips" style="margin-bottom:16px">' + Object.keys(K).map(function (k) { return '<button type="button" class="cgt-chip' + (f === k ? ' on' : '') + '" data-f="' + k + '">' + K[k] + '</button>'; }).join('') + '</div><div style="position:relative;padding-left:26px;border-left:3px solid #c9dcff;margin-left:8px">';
    E.forEach(function (e) { if (f !== 'hep' && e[2] !== f) return; h += '<div style="position:relative;margin:0 0 16px"><span style="position:absolute;left:-37px;top:14px;width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#004aad,#2f86ff);border:3px solid #fff;box-shadow:0 0 0 2px #c9dcff"></span><div class="cgt-panel" style="gap:6px"><div style="display:flex;flex-wrap:wrap;gap:10px;align-items:baseline"><b style="font-size:22px;color:#004aad">' + e[0] + '</b><b style="font-size:17px">' + e[1] + '</b><span style="font-size:11.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#5b6b82">' + K[e[2]] + '</span></div><div style="font-size:15px;color:#243247">' + e[3] + '</div></div></div>'; });
    root.innerHTML = h + '</div><p class="cgt-note">Tarihler yaklaşıktır ve buluşların kime ait olduğu bazı maddelerde tartışmalıdır; yaygın kabul gören anlatım esas alınmıştır.</p>';
  }
  root.addEventListener('click', function (e) { var b = e.target.closest('button[data-f]'); if (b) { f = b.getAttribute('data-f'); render(); } });
  render();
})();
