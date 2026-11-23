/* Sitede Ara — araçlar, testler, sözlük ve yazılar tek aramada · cagataygulumser.com */
(function () {
  'use strict';
  var root = document.getElementById('cgt-ara'); if (!root || root.firstChild) return;
  var BASE = root.getAttribute('data-base') || '';
  var TY = { arac: 'Araçlar', test: 'Göz testleri', egit: 'Eğitim ve sınav', soz: 'Sözlük', yazi: 'Yazılar ve videolar', il: 'İl rehberleri' }, COL = { arac: '#004aad', test: '#0a7a3d', egit: '#7a4fd0', soz: '#0c8a9a', yazi: '#c2410c', il: '#5b6b82' };
  /* [yol, başlık, açıklama, tür, ek anahtar sözcükler] */
  var S = [
    ['cam-gosterim-studyosu', 'Cam Gösterim Stüdyosu', 'Cam tasarımı, kalınlık, kaplama ve renk farkını danışana tek ekranda gösterin.', 'arac', 'progresif tek odak bifokal indeks antirefle fotokromik polarize 3b mağaza sunum'],
    ['pd-ve-montaj-yuksekligi-simulatoru', 'Gözlük Camı Simülatörü', 'Camı kaydırın; prizmatik etkiyi, kenar kalınlığını ve indeks farkını canlı görün.', 'arac', 'pd montaj yüksekliği desantrasyon prentice optik merkez 3b'],
    ['pd-ve-montaj-yuksekligi-olcer', 'PD ve Montaj Yüksekliği Ölçer', 'Kamerayla göz bebeği mesafesini ve montaj yüksekliğini ölçün.', 'arac', 'pupilla mesafesi göz bebekleri arası'],
    ['gozluk-receteni-oku', 'Reçeteni Oku', 'SPH, CYL, AKS, ADD: reçetenizdeki değerlerin anlamı.', 'arac', 'reçete okuyucu sferik silindir aks adisyon numara'],
    ['formuller', 'Hesaplama Araçları', 'Bir reçete yazın; transpozisyon, vertex, sferik eşdeğer ve daha fazlası aynı anda hesaplansın.', 'arac', 'formül hesap optik hesaplama kontakt lens dönüşümü'],
    ['sgk-gozluk-katki-payi-hesaplayici', 'SGK Gözlük Katkı Payı Hesaplayıcı', 'Gözlük alırken SGK ne kadar karşılıyor, cebinizden ne çıkıyor?', 'arac', 'sgk ödeme cam çerçeve bedeli'],
    ['sanal-gozluk-deneme', 'Sanal Gözlük Deneme', 'Kameranızla altı çerçeve biçimini yüzünüzde deneyin.', 'arac', 'çerçeve deneme ar yüz'],
    ['boyle-goruyor', 'Böyle Görüyor', 'Miyopi, astigmat, katarakt, glokom gibi durumlar görüşü nasıl etkiler? Kendi fotoğrafınızda görün.', 'arac', 'simülasyon görme kusuru nasıl görür sarı nokta renk körlüğü'],
    ['ekran-mesafesi-olcer', 'Ekran Mesafesi Ölçer', 'Ekrana ne kadar yakın oturduğunuzu kamerayla ölçün.', 'arac', 'ekran uzaklığı çocuk yakın mesafe uyarı'],
    ['cerceve-tarayici', 'Çerçeve Tarayıcı', 'Çerçeve fotoğrafından cam biçimini çıkarın, 3B önizleyin.', 'arac', 'cam şekli kutu ölçüsü ed'],
    ['atolye-simulatoru', 'Atölye Simülatörü', 'Desantrasyon ve en küçük ham cam çapını hesaplayın.', 'arac', 'montaj ham cam çapı blank atölye'],
    ['fokometre-simulatoru', 'Fokometre Simülatörü', 'Fokometrede cam okumayı ekranda çalışın.', 'arac', 'lensmetre cam ölçme tambur'],
    ['isin-laboratuvari', 'Işın Laboratuvarı', 'Merceklerde ve gözde ışınların nasıl kırıldığını deneyin.', 'arac', 'ışın çizimi yakınsak ıraksak prizma göz modeli'],
    ['torik-lens-rotasyonu', 'Torik Lens Rotasyonu', 'Torik kontakt lens dönmüşse aks nasıl düzeltilir? LARS kuralı.', 'arac', 'kontakt lens aks düzeltme lars'],
    ['goz-doktorlari-icin', 'Göz Doktorları İçin Klinik Araçlar', 'Muayene, şaşılık, nöro-oftalmoloji, katarakt ve retina için 23 ücretsiz klinik araç tek sayfada.', 'arac', 'çanta oftalmoloji asistan göz doktoru hekim klinik muayene'],
    ['okn-tamburu', 'OKN Tamburu', 'Ekranı optokinetik tambura çevirin: yön, hız ve çizgi genişliği ayarlı.', 'arac', 'optokinetik nistagmus bebek görme göz doktoru hekim klinik muayene'],
    ['worth-4-nokta-testi', 'Worth 4 Nokta Testi', 'Kırmızı-yeşil gözlükle füzyon, supresyon ve diplopi değerlendirmesi.', 'arac', 'worth four dot füzyon supresyon diplopi göz doktoru hekim klinik muayene'],
    ['fiksasyon-hedefi', 'Fiksasyon Hedefi', 'Çocuk muayenesi için hareketli ve sesli fiksasyon hedefi.', 'arac', 'takip sakkad pursuit çocuk göz doktoru hekim klinik muayene'],
    ['gorme-alani-taramasi', 'Görme Alanı Taraması', 'Kör nokta kontrollü, eşik üstü santral görme alanı taraması.', 'arac', 'perimetri kampimetri skotom glokom göz doktoru hekim klinik muayene'],
    ['pupilla-cetveli', 'Pupilla Cetveli ve Muayene Işığı', 'Gerçek ölçekli pupilla cetveli, renkli ışık ve anizokori yardımcısı.', 'arac', 'pupil gauge kalem ışığı kobalt mavisi anizokori horner göz doktoru hekim klinik muayene'],
    ['gorme-eseli', 'Görme Eşeli', 'Mesafeye göre ölçeklenen E, Landolt C, harf ve rakam eşeli; duokrom.', 'arac', 'snellen logmar görme keskinliği eşel eye chart göz doktoru hekim klinik muayene'],
    ['parks-uc-adim-testi', 'Parks-Bielschowsky Üç Adım Testi', 'Vertikal şaşılıkta paretik kası üç adımda bulun.', 'arac', 'üst oblik dördüncü sinir felci hipertropya baş eğme göz doktoru hekim klinik muayene'],
    ['ortme-testi-simulatoru', 'Şaşılık ve Örtme Testi Simülatörü', 'Tropya ve foryada örtme-açma hareketlerini ve Hirschberg reflesini izleyin.', 'arac', 'cover test ezotropya ekzotropya hirschberg prizma göz doktoru hekim klinik muayene'],
    ['goz-ici-mercek-simulatoru', 'Göz İçi Mercek (IOL) Simülatörü', 'Monofokal, EDOF ve trifokal merceklerde görüşü, haleleri ve defokus eğrisini karşılaştırın.', 'arac', 'iol katarakt akıllı mercek trifokal edof torik hale göz doktoru hekim klinik muayene'],
    ['kapsuloreksis-alistirmasi', 'Kapsüloreksis Alıştırması', 'Dairesel ve merkezde kapsüloreksis çizin, çap ve dairesellik puanı alın.', 'arac', 'katarakt cerrahisi cerrahi simülatör reksis göz doktoru hekim klinik muayene'],
    ['indirekt-oftalmoskopi-simulatoru', 'İndirekt Oftalmoskopi Simülatörü', 'Ters fundus görüntüsünde lezyonu bulun ve saat kadranını işaretleyin.', 'arac', 'fundus retina muayenesi 20d kondansasyon merceği periferik retina göz doktoru hekim klinik muayene'],
    ['biyomikroskop-kamera', 'Biyomikroskop Fotoğraf Yardımcısı', 'Telefonla slit lamba fotoğrafı: hizalama halkası, yakınlaştırma, etiketli kayıt.', 'arac', 'slit lamba kamera ön segment fotoğraf göz doktoru hekim klinik muayene'],
    ['icd-10-goz-kodlari', 'ICD-10 Göz Tanı Kodları', 'Göz hastalıklarının ICD-10 kodlarını Türkçe adıyla arayın, tek dokunuşla kopyalayın.', 'arac', 'icd tanı kodu medula h40 h52 h25 göz doktoru hekim klinik muayene'],
    ['optik-yol-simulatoru', 'Optik Yol ve Görme Alanı Defekti Simülatörü', 'Lezyonun yerini seçin, iki gözdeki görme alanı defektini görün; soru modu var.', 'arac', 'hemianopsi kadranopsi kiazma traktus görme yolu göz doktoru hekim klinik muayene'],
    ['pupilla-ve-rapd-simulatoru', 'Pupilla ve RAPD Simülatörü', 'Sallanan ışık testi, RAPD, Horner, üçüncü sinir felci ve tonik pupilla canlandırması.', 'arac', 'marcus gunn afferent pupilla defekti anizokori göz doktoru hekim klinik muayene'],
    ['dokuz-bakis-pozisyonu', 'Dokuz Bakış Pozisyonu Simülatörü', 'Sinir felçlerinde ve kısıtlayıcı sendromlarda gözlerin dokuz bakış yönündeki duruşu.', 'arac', 'altıncı sinir felci üçüncü sinir ino duane brown göz hareketleri göz doktoru hekim klinik muayene'],
    ['yakin-okuma-karti', 'Yakın Okuma Kartı', 'Gerçek ölçekli, M ve N birimli Türkçe yakın okuma kartı.', 'arac', 'jaeger yakın görme presbiyopi okuma eşeli göz doktoru hekim klinik muayene'],
    ['gorme-keskinligi-donusturucu', 'Görme Keskinliği Dönüştürücü', 'Ondalık, Snellen, logMAR ve ETDRS harf sayısı arasında çeviri.', 'arac', 'logmar snellen ondalık dönüşüm tablosu 20/20 6/6 göz doktoru hekim klinik muayene'],
    ['diyabetik-retinopati-evreleme', 'Diyabetik Retinopati Evreleme Yardımcısı', 'Bulguları işaretleyin; evreyi, makula ödemini ve önerilen izlem aralığını görün.', 'arac', 'npdr pdr 4-2-1 kuralı dme şeker hastalığı retina göz doktoru hekim klinik muayene'],
    ['kirmizi-refle-simulatoru', 'Kırmızı Refle Simülatörü', 'Brückner testinde normal ve anormal kırmızı refle görünümleri.', 'arac', 'brückner lökokori bebek göz taraması retinoblastom göz doktoru hekim klinik muayene'],
    ['kontrast-duyarlilik-karti', 'Kontrast Duyarlılık Kartı', 'Pelli-Robson düzeninde ekran kontrast duyarlılık taraması.', 'arac', 'pelli robson kontrast log kd göz doktoru hekim klinik muayene'],
    ['fundus-cizim-sablonu', 'Fundus Çizim Şablonu', 'Saat kadranlı retina şablonunda renk koduyla çizin, indirin ya da yazdırın.', 'arac', 'retina çizimi dekolman şeması periferik retina göz doktoru hekim klinik muayene'],
    ['oftalmoloji-soru-bankasi', 'Oftalmoloji Soru Bankası', 'Asistanlar ve öğrenciler için açıklamalı çoktan seçmeli göz hastalıkları soruları.', 'arac', 'tus göz soruları uzmanlık sınavı asistan test göz doktoru hekim klinik muayene'],
    ['goz-sagligi-karnesi', 'Göz Sağlığı Karnesi', 'Testlerinizi tek karnede toplayın, muayene tarihinizi takvime ekleyin.', 'arac', 'takip muayene hatırlatma'],
    ['cocuk-miyopi-gunlugu', 'Çocuk Miyopi Günlüğü', 'Çocuğunuzun dışarıda ve ekranda geçirdiği süreyi izleyin.', 'arac', 'miyopi takibi dış mekân ekran süresi'],
    ['renk-avi', 'Renk Avı', 'Farklı renkteki kareyi bulun: renk ayırt etme oyunu.', 'arac', 'oyun renk ayırt etme'],
    ['gozlugun-tarihi', 'Optik ve Göz Sağlığı Tarihi', 'Optik, göz hekimliği, gözlük, kontakt lens ve refraktif cerrahinin zaman çizelgesi.', 'egit', 'gözlüğün tarihi kim icat etti tarihçe'],
    ['araclar-uygulamasi', 'Araçlar Uygulaması', 'Tüm araçlar tek ekranda; telefonun ana ekranına ekleyin.', 'arac', 'uygulama ana ekran tüm araçlar'],
    ['sitenize-ekleyin', 'Araçları Sitenize Ekleyin', 'Araçları kendi sitenize tek satır kodla yerleştirin.', 'arac', 'embed gömme kodu'],
    ['surucu-cami-simulatoru', 'Sürücü Camı Simülatörü', 'Gece sürüşünde far parlamasını ve sürücü camının etkisini görün.', 'arac', 'gece sürüş drive cam far'],
    ['mavi-isik-filtreli-cam-simulatoru', 'Mavi Işık Filtreli Cam Simülatörü', 'Mavi ışık filtreli camın ekran görüntüsüne etkisini karşılaştırın.', 'arac', 'blue cut ekran camı'],
    ['20-20-20-ekran-molasi-zamanlayici', '20-20-20 Ekran Molası Zamanlayıcı', 'Her 20 dakikada 20 saniyelik molayı hatırlatan zamanlayıcı.', 'arac', 'göz yorgunluğu mola'],
    ['goz-numarasi-yuzde-kac-goruyor', 'Göz Numarası Yüzde Kaç Görüyor?', 'Göz numarası ile görme derecesi arasındaki fark.', 'arac', 'numara yüzde görme keskinliği'],
    ['bebek-goz-rengi-hesaplama', 'Bebek Göz Rengi Hesaplama', 'Anne ve babanın göz rengine göre olasılıklar.', 'arac', 'göz rengi kalıtım'],
    ['kontakt-lens-kutusu-okuyucu', 'Kontakt Lens Kutusu Okuyucu', 'BC, DIA, PWR, CYL, AX ne demek?', 'arac', 'lens kutusu kısaltmalar'],
    ['kontakt-lens-degisim-takvimi', 'Kontakt Lens Değişim Takvimi', 'Lensinizin son kullanım gününü hesaplayın.', 'arac', 'aylık lens günlük lens kaç gün'],
    ['gunes-gozlugu-kategori-okuyucu', 'Güneş Gözlüğü Kategori ve UV Okuyucu', 'Kategori 3 ne demek, UV400 nedir?', 'arac', 'güneş gözlüğü kategori uv'],
    ['gozluk-cerceve-olcusu-okuyucu', 'Gözlük Çerçeve Ölçüsü Okuyucu', 'Sapta yazan 52-18-140 ne demek?', 'arac', 'çerçeve ölçüsü köprü sap boyu'],
    ['gorme-engel-orani-hesaplama', 'Görme Engel Oranı Hesaplama', 'Görme değerlerinden yaklaşık engel oranı.', 'arac', 'engelli raporu oran'],
    ['meslek-icin-goz-sarti', 'Meslekler İçin Göz Şartı', 'Askerlik, polislik, pilotluk için göz şartları.', 'arac', 'meslek göz numarası şartı'],
    ['ehliyet-goz-sarti-ve-goz-kodlari', 'Ehliyet Göz Şartı ve Göz Kodları', 'Ehliyet için görme şartı ve ehliyetteki kodlar.', 'arac', 'ehliyet 01 kodu gözlük'],
    ['canl-goz-atlas', 'Canlı Göz Atlası', 'Göz anatomisini kendi gözünüzde canlı kamerada görün.', 'egit', 'anatomi kamera göz yapısı'],
    ['recete-yazma-alistirmasi', 'Reçete Yazma Alıştırması', 'Rastgele durumlarla transpozisyon ve reçete yazımı çalışın.', 'egit', 'transpozisyon alıştırma öğrenci'],
    ['goz-anatomisi-bulmacasi', 'Göz Anatomisi Bulmacası', 'Göz kesitinde parçaları sürükleyip yerine koyun.', 'egit', 'anatomi kornea retina mercek oyun'],
    ['formul-kartlari', 'Formül Kartları', 'Optik formüller çevrilebilir çalışma kartlarında.', 'egit', 'prentice vertex sagitta formül ezber'],
    ['mit-mi-gercek-mi', 'Mit mi, Gerçek mi?', 'Gözlük ve göz sağlığı hakkındaki yaygın inanışlar, kaydırmalı kartlarda.', 'egit', 'doğru bilinen yanlışlar efsane'],
    ['optisyen-akademi', 'Optisyen Akademi', 'Kısa dersler ve sorular.', 'egit', 'ders transpozisyon prentice'],
    ['snav-merkezi_0210972478', 'Sınav Merkezi', 'Optisyenlik deneme sınavları.', 'egit', 'deneme sınavı test optisyenlik dersleri'],
    ['optik-sozluk', 'Optik Sözlük', 'Optik ve göz sağlığı terimleri sade Türkçeyle.', 'egit', 'terim sözlük ne demek'],
    ['goz-sagligi-bilgi-yarismasi', 'Göz Sağlığı Bilgi Yarışması', 'Göz sağlığı bilginizi sınayın.', 'egit', 'yarışma quiz'],
    ['goz-testleri', 'Göz Testleri', 'Ücretsiz göz testlerinin tümü.', 'test', 'online göz testi'],
    ['gorme-keskinligi-testi', 'Görme Keskinliği Testi', 'Online göz testi: harf tablosuyla görme keskinliği.', 'test', 'snellen harf tablosu'],
    ['astigmat-testi', 'Astigmat Testi', 'Saat kadranı testiyle astigmat taraması.', 'test', ''],
    ['amsler-testi', 'Amsler Testi (Sarı Nokta Testi)', 'Kareli tabloyla merkezi görme taraması.', 'test', 'makula'],
    ['renk-korlugu-testi', 'Renk Körlüğü Testi', 'Renk görme taraması.', 'test', 'ishihara'],
    ['renk-siralama-testi', 'Renk Sıralama Testi', 'Renk tonlarını sıralayın.', 'test', ''],
    ['kirmizi-yesil-testi', 'Kırmızı-Yeşil Testi (Duokrom)', 'Gözlüğünüzün numarası az mı fazla mı geliyor?', 'test', 'duokrom'],
    ['kontrast-duyarliligi-testi', 'Kontrast Duyarlılığı Testi', 'Soluk harfleri ne kadar seçebiliyorsunuz?', 'test', ''],
    ['yakin-okuma-testi', 'Yakın Okuma Testi', 'Yakın görme taraması.', 'test', 'presbiyopi'],
    ['kuru-goz-testi', 'Kuru Göz Testi', 'Kuru göz belirtileri anketi.', 'test', 'göz kuruluğu'],
    ['goz-yorgunlugu-testi', 'Dijital Göz Yorgunluğu Testi', 'Ekran kaynaklı göz yorgunluğu taraması.', 'test', 'ekran'],
    ['miyopi-risk-testi', 'Çocuk Miyopi Risk Testi', 'Çocuğunuzun miyopi riskini değerlendirin.', 'test', ''],
    ['glokom-risk-testi', 'Göz Tansiyonu (Glokom) Risk Testi', 'Glokom risk etkenleri anketi.', 'test', ''],
    ['goz-muayenesi-ne-zaman', 'Ne Zaman Göz Muayenesi Olmalıyım?', 'Yaşınıza ve durumunuza göre muayene sıklığı.', 'test', ''],
    ['kor-nokta-testi', 'Kör Nokta Testi', 'Gözünüzdeki kör noktayı bulun.', 'test', ''],
    ['baskin-goz-testi', 'Baskın Göz Testi', 'Hangi gözünüz baskın?', 'test', 'dominant göz'],
    ['ardil-goruntu-testi', 'Ardıl Görüntü Testi', 'Ardıl görüntü yanılsaması.', 'test', ''],
    ['polarize-gozluk-testi', 'Polarize Gözlük Testi', 'Gözlüğünüz polarize mi?', 'test', ''],
    ['yuz-sekline-gore-gozluk-testi', 'Yüz Şekline Göre Gözlük Testi', 'Yüz şeklinizi bulun, hangi çerçeve biçimleri uyar?', 'test', 'yüzüme hangi gözlük yakışır']
  ];
  var IX = [], ready = { yazi: 0, soz: 0 }, q = '', ty = '', more = {};
  function nm(s) { return String(s || '').toLocaleLowerCase('tr').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u').replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function add(u, t, d, k, x) { IX.push({ u: u, t: t, d: d || '', k: k, nt: nm(t), nx: nm((d || '') + ' ' + (x || '')) }); }
  S.forEach(function (s) { add('/p/' + s[0] + '.html', s[1], s[2], s[3], s[4]); });
  var have = {}; S.forEach(function (s) { have[s[0]] = 1; });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function clean(s) { s = String(s || '').replace(/\s+/g, ' ').trim(); return /[{}]|<!--|@import|&larr;/.test(s.slice(0, 200)) ? '' : s.slice(0, 170); }
  function feed(kind, start, cb) {
    fetch(BASE + '/feeds/' + kind + '/summary?alt=json&max-results=150&start-index=' + start).then(function (r) { return r.json(); }).then(function (j) {
      var en = (j.feed && j.feed.entry) || [];
      en.forEach(function (e) {
        var l = (e.link || []).filter(function (x) { return x.rel === 'alternate'; })[0]; if (!l) return; var u = l.href.replace(/^https?:\/\/[^/]+/, ''), t = e.title.$t, d = clean(e.summary && e.summary.$t);
        if (kind === 'pages') { var sl = u.replace('/p/', '').replace('.html', ''); if (have[sl] || /^(ara|iletisim|sorumluluk-reddi)$/.test(sl)) return; add(u, t, d, /-snav$|^goz-anatomisi$|snav/.test(sl) ? 'egit' : /merkezleri|magazalar/.test(sl) ? 'il' : /testi$/.test(sl) ? 'test' : 'arac', ''); }
        else add(u, t, d, 'yazi', (e.category || []).map(function (c) { return c.term; }).join(' '));
      });
      if (en.length === 150) feed(kind, start + 150, cb); else cb();
    }).catch(function () { cb(); });
  }
  function sozluk(cb) {
    fetch(BASE + '/p/optik-sozluk.html').then(function (r) { return r.text(); }).then(function (h) {
      var re = /<details class="T" id="([^"]+)"[^>]*data-k="([^"]*)"[^>]*><summary><span class="n">([^<]*)<\/span><span class="c">[^<]*<\/span><span class="d">([^<]*)<\/span>/g, m, n = 0, ta = document.createElement('textarea');
      function dec(s) { ta.innerHTML = s; return ta.value; }
      while ((m = re.exec(h))) { add('/p/optik-sozluk.html#' + m[1], dec(m[3]), dec(m[4]), 'soz', m[2]); n++; }
      cb(n);
    }).catch(function () { cb(0); });
  }
  function search() {
    var tk = nm(q).split(' ').filter(Boolean), out = [];
    if (!tk.length) return out;
    IX.forEach(function (it) {
      var sc = 0;
      for (var i = 0; i < tk.length; i++) { var t = tk[i], a = it.nt.indexOf(t); if (a === 0) sc += 12; else if (a > 0) sc += it.nt.charAt(a - 1) === ' ' ? 9 : 6; else if (it.nx.indexOf(t) >= 0) sc += 2; else return; }
      if (it.nt === tk.join(' ')) sc += 20;
      sc += { arac: 4, test: 4, egit: 3, soz: 2, yazi: 1, il: 0 }[it.k]; out.push([sc, it]);
    });
    return out.sort(function (a, b) { return b[0] - a[0] || a[1].t.length - b[1].t.length; }).map(function (x) { return x[1]; });
  }
  function hi(t) { var tk = nm(q).split(' ').filter(function (x) { return x.length > 1; }); if (!tk.length) return esc(t); var n = nm2(t), marks = []; tk.forEach(function (k) { var i = n.indexOf(k); if (i >= 0) marks.push([i, i + k.length]); }); if (!marks.length) return esc(t); marks.sort(function (a, b) { return a[0] - b[0]; }); var o = '', p = 0; marks.forEach(function (m) { if (m[0] < p) return; o += esc(t.slice(p, m[0])) + '<mark style="background:#ffe98a;color:inherit;border-radius:3px;padding:0 1px">' + esc(t.slice(m[0], m[1])) + '</mark>'; p = m[1]; }); return o + esc(t.slice(p)); }
  /* harf sayısını koruyan sadeleştirme (vurgulama için) */
  function nm2(s) { return String(s).replace(/İ/g, 'i').replace(/I/g, 'i').toLowerCase().replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u').replace(/[âîû]/g, function (c) { return { 'â': 'a', 'î': 'i', 'û': 'u' }[c]; }); }
  function item(it) { return '<a href="' + it.u + '" style="display:block;text-decoration:none;background:#fff;border:1px solid #d7e0ee;border-left:5px solid ' + COL[it.k] + ';border-radius:12px;padding:11px 14px;color:#14233b"><span style="font-size:11px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:' + COL[it.k] + '">' + TY[it.k] + '</span><b style="display:block;font-size:16.5px;line-height:1.3">' + hi(it.t) + '</b>' + (it.d ? '<span style="display:block;font-size:14px;color:#4a5b78;margin-top:2px">' + esc(it.d) + '</span>' : '') + '</a>'; }
  function results() {
    var el = document.getElementById('arR'), ch = document.getElementById('arT'); if (!el) return;
    var load = !ready.yazi || !ready.soz ? '<div class="cgt-note" style="margin:0 2px 10px">Yazılar ve sözlük yükleniyor…</div>' : '';
    if (!nm(q)) {
      ch.innerHTML = ''; var pick = function (k, n) { return IX.filter(function (i) { return i.k === k; }).slice(0, n); };
      el.innerHTML = load + '<p class="cgt-h" style="margin:6px 2px 10px">Sık arananlar</p><div class="cgt-chips" style="margin-bottom:18px">' + ['astigmat', 'progresif', 'kuru göz', 'reçete', 'kontakt lens', 'glokom', 'miyopi', 'polarize', 'PD', 'transpozisyon'].map(function (s) { return '<button type="button" class="cgt-chip" data-s="' + s + '">' + s + '</button>'; }).join('') + '</div><p class="cgt-h" style="margin:6px 2px 10px">Öne çıkan araçlar</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:10px">' + pick('arac', 6).concat(pick('test', 3)).map(item).join('') + '</div>';
      return;
    }
    var r = search(), cnt = {}; r.forEach(function (i) { cnt[i.k] = (cnt[i.k] || 0) + 1; });
    if (ty && !cnt[ty]) ty = '';
    ch.innerHTML = '<button type="button" class="cgt-chip' + (ty ? '' : ' on') + '" data-t="">Tümü · ' + r.length + '</button>' + Object.keys(TY).filter(function (k) { return cnt[k]; }).map(function (k) { return '<button type="button" class="cgt-chip' + (ty === k ? ' on' : '') + '" data-t="' + k + '">' + TY[k] + ' · ' + cnt[k] + '</button>'; }).join('');
    if (!r.length) { el.innerHTML = load + '<div class="cgt-info" style="margin-top:0"><b>“' + esc(q) + '” için sonuç bulunamadı.</b> Daha kısa ya da farklı bir sözcük deneyin; örneğin “göz kuruluğu” yerine “kuru göz”.</div>'; return; }
    var h = load;
    Object.keys(TY).forEach(function (k) {
      if ((ty && ty !== k) || !cnt[k]) return; var l = r.filter(function (i) { return i.k === k; }), lim = ty || more[k] ? 200 : (k === 'yazi' ? 8 : 6);
      h += '<p class="cgt-h" style="margin:16px 2px 9px;color:' + COL[k] + '">' + TY[k] + ' · ' + l.length + '</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:10px">' + l.slice(0, lim).map(item).join('') + '</div>' + (l.length > lim ? '<button type="button" class="cgt-btn" data-more="' + k + '" style="margin-top:9px">' + (l.length - lim) + ' sonuç daha göster</button>' : '');
    });
    el.innerHTML = h;
  }
  root.innerHTML = '<p class="cgt-lead">Sitedeki araçlar, göz testleri, sözlük terimleri, yazılar ve videolar tek aramada.</p>' +
    '<div class="cgt-panel" style="position:sticky;top:8px;z-index:2;margin-bottom:12px"><div style="display:flex;gap:8px"><input type="text" id="arQ" inputmode="search" autocomplete="off" placeholder="Ne arıyorsunuz? astigmat, progresif cam, PD ölçer…" aria-label="Sitede ara" style="font-size:17px;padding:13px 14px;border:2px solid #004aad"><button type="button" class="cgt-btn" id="arX" aria-label="Aramayı temizle" style="flex:none" hidden>Temizle</button></div><div class="cgt-chips" id="arT"></div></div><div id="arR" aria-live="polite"></div>';
  var inp = document.getElementById('arQ'), tm;
  try { q = new URLSearchParams(location.search).get('q') || ''; } catch (e) { }
  inp.value = q; document.getElementById('arX').hidden = !q;
  inp.addEventListener('input', function () { q = inp.value; more = {}; document.getElementById('arX').hidden = !q; clearTimeout(tm); tm = setTimeout(function () { results(); try { history.replaceState(null, '', location.pathname + (q.trim() ? '?q=' + encodeURIComponent(q.trim()) : '')); } catch (e) { } }, 120); });
  root.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.id === 'arX') { inp.value = q = ''; b.hidden = true; inp.focus(); results(); }
    else if (b.hasAttribute('data-t')) { ty = b.getAttribute('data-t'); results(); }
    else if (b.hasAttribute('data-more')) { more[b.getAttribute('data-more')] = 1; results(); }
    else if (b.hasAttribute('data-s')) { inp.value = q = b.getAttribute('data-s'); document.getElementById('arX').hidden = false; results(); }
  });
  results();
  feed('pages', 1, function () { results(); });
  feed('posts', 1, function () { ready.yazi = 1; results(); });
  sozluk(function () { ready.soz = 1; results(); });
  window.CGARA = { ix: IX };
})();
