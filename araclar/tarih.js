/* Optik ve Göz Sağlığı Tarihi — kapsamlı zaman çizelgesi · cagataygulumser.com */
(function () {
  'use strict';
  var root = document.getElementById('cgt-tarih'); if (!root || root.firstChild) return;
  var K = { hep: 'Tümü', opt: 'Optik bilimi', goz: 'Göz sağlığı', gzl: 'Gözlük ve cam', len: 'Kontakt lens', ref: 'Refraktif cerrahi' };
  var C = { opt: '#7a4fd0', goz: '#0a7a3d', gzl: '#004aad', len: '#0c8a9a', ref: '#c2410c' };
  var ERA = [[-9999, 'Antik çağ ve Orta Çağ'], [1500, '1500–1800: Bilimsel devrim'], [1800, '19. yüzyıl: Modern göz hekimliğinin doğuşu'], [1900, '1900–1950'], [1950, '1950–2000'], [2000, '2000 sonrası']];
  var E = [
    [-1550, 'MÖ 1550 dolayı', 'Ebers Papirüsü', 'goz', 'Eski Mısır’dan kalan tıp papirüsünde göz hastalıkları ve tedavileri için ayrı bir bölüm yer alır; bilinen en eski göz hekimliği kayıtlarındandır.'],
    [-600, 'MÖ 1. binyıl', 'Kataraktın iğneyle itilmesi', 'goz', 'Hindistan’da Sushruta’ya atfedilen metinlerde bulanıklaşmış merceğin iğneyle göz içine itilmesi (couching) anlatılır. Yöntem yüzyıllarca dünyada uygulandı.'],
    [-300, 'MÖ 300 dolayı', 'Öklid’in Optika’sı', 'opt', 'Öklid, ışığın doğrusal yayıldığını ve yansıma kurallarını geometriyle açıkladı. Görmenin gözden çıkan ışınlarla olduğu düşünülüyordu.'],
    [60, 'MS 1. yüzyıl', 'Su dolu küreyle büyütme', 'gzl', 'Romalı düşünür Seneca, su dolu cam kürenin arkasındaki yazıların büyük göründüğünü yazdı; büyütme etkisinin bilinen en eski anlatımlarındandır.'],
    [150, '150 dolayı', 'Batlamyus kırılmayı ölçüyor', 'opt', 'Batlamyus, ışığın havadan suya ve cama geçerken ne kadar kırıldığını ölçerek tablolar hazırladı.'],
    [860, '9. yüzyıl', 'Göz Üzerine On Makale', 'goz', 'Huneyn ibn İshak, göz anatomisi ve hastalıklarını sistemli biçimde anlatan ilk kapsamlı kitaplardan birini yazdı.'],
    [984, '984 dolayı', 'Kırılma yasasının ilk hali', 'opt', 'Bağdatlı matematikçi İbn Sehl, mercek ve aynalar üzerine yazdığı eserde bugün Snell yasası olarak bilinen kırılma bağıntısını kullandı.'],
    [1000, '1000 dolayı', 'Kataraktın emilerek alınması', 'goz', 'Musullu Ammar ibn Ali, içi boş bir iğneyle yumuşak kataraktı emerek çıkardığını anlattı.'],
    [1001, '1000 dolayı', 'Okuma taşı', 'gzl', 'Yarım küre biçiminde cilalanmış cam ya da kristal, yazının üzerine konarak harfleri büyütmek için kullanıldı. Gözlüğün atası sayılır.'],
    [1021, '1011–1021', 'İbnü’l-Heysem: Kitâbü’l-Menâzır', 'opt', 'İbnü’l-Heysem, görmenin gözden çıkan değil cisimlerden göze gelen ışıkla gerçekleştiğini deneylerle gösterdi; karanlık odayı inceledi. Modern optiğin kurucusu kabul edilir.'],
    [1267, '1267', 'Roger Bacon ve büyüteç', 'opt', 'Bacon, Opus Majus’ta dışbükey camların yaşlıların okumasına yardım edebileceğini yazdı.'],
    [1286, '1280’ler', 'İlk gözlükler', 'gzl', 'Kuzey İtalya’da iki büyütecin perçinle birleştirilmesiyle ilk okuma gözlükleri yapıldı. Burna sıkıştırılarak kullanılıyor, yalnızca yakını düzeltiyordu.'],
    [1352, '1352', 'Gözlüklü ilk resim', 'gzl', 'Tommaso da Modena’nın Treviso’daki freskinde gözlükle okuyan bir din adamı görülür; gözlüğün bilinen en eski tasviridir.'],
    [1451, '1450’ler', 'Miyoplar için içbükey cam', 'gzl', 'Matbaayla birlikte okuma yaygınlaştı, gözlüğe talep arttı. Aynı dönemde uzağı göremeyenler için içbükey camlardan söz edilmeye başlandı.'],
    [1508, '1508', 'Leonardo’nun eskizleri', 'len', 'Leonardo da Vinci, gözü suya temas ettirerek görmenin nasıl değiştiğini çizdi. Kontakt lens fikrinin ilk habercisi sayılır.'],
    [1583, '1583', 'İlk kapsamlı göz kitabı', 'goz', 'Alman hekim Georg Bartisch, göz hastalıkları ve ameliyatlarını resimlerle anlatan Ophthalmodouleia’yı yayımladı.'],
    [1604, '1604', 'Görüntü retinada oluşur', 'opt', 'Johannes Kepler, göz merceğinin görüntüyü retinaya ters düşürdüğünü ve camların miyopi ile hipermetropiyi neden düzelttiğini açıkladı.'],
    [1608, '1608', 'Teleskop', 'opt', 'Hollanda’da gözlükçü Hans Lippershey teleskop için patent başvurusu yaptı. Ertesi yıl Galileo kendi teleskobuyla gökyüzünü inceledi.'],
    [1621, '1621', 'Snell kırılma yasası', 'opt', 'Willebrord Snell, ışığın iki ortam arasında kırılma açılarını bağlayan yasayı buldu; Descartes 1637’de yayımladı. Mercek hesabının temelidir.'],
    [1623, '1623', 'Gözlük üzerine ilk kitap', 'gzl', 'İspanyol Benito Daza de Valdés, gözlük camlarının seçimi ve numaralandırılması üzerine bilinen ilk kitabı yazdı.'],
    [1636, '1636', 'Descartes’ın su tüpü', 'len', 'René Descartes, kornea üzerine konan su dolu bir cam tüple görmenin düzeltilebileceğini önerdi.'],
    [1704, '1666–1704', 'Newton ve renkler', 'opt', 'Isaac Newton, beyaz ışığın prizmada renklere ayrıldığını gösterdi ve çalışmalarını Opticks’te topladı. Camlardaki renk saçılmasının açıklaması buradan gelir.'],
    [1690, '1690', 'Işığın dalga kuramı', 'opt', 'Christiaan Huygens, ışığın dalga olarak yayıldığını savunan kuramını yayımladı.'],
    [1727, '1720’ler', 'Saplı gözlük', 'gzl', 'Londralı gözlükçü Edward Scarlett’e atfedilen saplı çerçeveler yayıldı; gözlük artık kulaktan destek alıyordu.'],
    [1747, '1747', 'Modern katarakt ameliyatı', 'goz', 'Fransız cerrah Jacques Daviel, bulanık merceği göz içine itmek yerine gözden çıkardı. Katarakt cerrahisinde yeni bir dönem başladı.'],
    [1752, '1752', 'Menteşeli sap ve renkli cam', 'gzl', 'İngiliz James Ayscough, çift menteşeli saplar ve mavi-yeşil renkli camlar önerdi; güneş gözlüğünün öncülerindendir.'],
    [1784, '1784', 'Bifokal cam', 'gzl', 'Benjamin Franklin, uzak ve yakın camlarını ikiye bölüp tek çerçevede birleştirdiğini yazdı.'],
    [1801, '1801', 'Astigmatın tanımı ve girişim', 'opt', 'Thomas Young, kendi gözündeki astigmatı ölçüp tanımladı; çift yarık deneyiyle ışığın dalga gibi davrandığını gösterdi ve üç renk algılayıcı kuramını önerdi.'],
    [1825, '1825', 'Astigmat için silindirik cam', 'gzl', 'George Airy kendi astigmatını düzeltmek için silindirik cam yaptırdı. Aks kavramı gözlükçülüğe böyle girdi.'],
    [1827, '1827', 'Trifokal cam', 'gzl', 'John Isaac Hawkins üç odaklı camı tanıttı ve “bifokal” sözcüğünü de ilk kullananlardan oldu.'],
    [1845, '1845', 'Kornea kalıbı fikri', 'len', 'John Herschel, korneanın kalıbı alınarak yüzeye tam oturan bir cam yapılabileceğini önerdi.'],
    [1851, '1851', 'Oftalmoskop', 'goz', 'Hermann von Helmholtz’un oftalmoskopu sayesinde canlı gözün dibi ilk kez görülebildi. Retina ve optik sinir hastalıkları tanınır hale geldi.'],
    [1856, '1856', 'Glokomda ilk etkili ameliyat', 'goz', 'Albrecht von Graefe, akut glokomda iridektominin göz içi basıncını düşürdüğünü gösterdi.'],
    [1862, '1862', 'Snellen harf tablosu', 'goz', 'Herman Snellen, görme keskinliğini ölçen standart harf tablosunu yayımladı. “10/10” ifadesinin kökeni budur.'],
    [1864, '1864', 'Kırma kusurlarının bilimi', 'goz', 'Franciscus Donders, miyopi, hipermetropi, astigmat ve presbiyopiyi sistemli biçimde tanımlayan eserini yayımladı; gözlük reçetesinin bilimsel temeli atıldı.'],
    [1865, '1865', 'Işık elektromanyetik dalgadır', 'opt', 'James Clerk Maxwell, ışığın elektromanyetik bir dalga olduğunu kuramsal olarak gösterdi.'],
    [1873, '1873', 'Retinoskopi', 'goz', 'Fransız hekim Ferdinand Cuignet, gözden yansıyan ışığın hareketiyle kırma kusurunu nesnel olarak ölçme yöntemini tanıttı.'],
    [1884, '1884', 'Göz cerrahisinde lokal anestezi', 'goz', 'Carl Koller, kokain damlasının gözü uyuşturduğunu gösterdi. Göz ameliyatları hasta uyanıkken ağrısız yapılabilir oldu.'],
    [1888, '1887–1888', 'İlk kontakt lensler', 'len', 'Adolf Fick ve Eugène Kalt, camdan yapılmış ilk kontakt lensleri denedi. Gözün tamamını örtüyor ve ancak birkaç saat takılabiliyordu.'],
    [1898, '1898', 'Korneayı kesiyle düzleştirme', 'ref', 'Hollandalı Leendert Lans, korneaya yapılan kesilerin eğriliği değiştirdiğini deneylerle gösterdi; refraktif cerrahinin ilk ilkeleridir.'],
    [1905, '1905', 'İlk başarılı kornea nakli', 'goz', 'Eduard Zirm, bir işçinin gözüne yaptığı kornea naklinde kalıcı saydamlık elde etti.'],
    [1906, '1905', 'Göz tansiyonu ölçümü', 'goz', 'Hjalmar Schiøtz’ün tonometresi göz içi basıncını muayenehanede ölçülebilir kıldı.'],
    [1907, '1905', 'Işığın tanecik yapısı', 'opt', 'Albert Einstein, ışığın foton adı verilen enerji paketleri halinde davrandığını açıkladı.'],
    [1911, '1911', 'Yarık lamba', 'goz', 'Allvar Gullstrand, gözün ön bölümünü büyüterek inceleyen yarık lambayı geliştirdi; aynı yıl gözün optiği üzerine çalışmalarıyla Nobel Ödülü aldı.'],
    [1912, '1912', 'Nokta odaklı camlar', 'gzl', 'Moritz von Rohr’un hesaplarıyla üretilen camlar, kenardan bakıldığında da net görüş sağlayacak biçimde tasarlandı. Cam tasarımı hesaba dayalı hale geldi.'],
    [1917, '1917', 'Ishihara renk testi', 'goz', 'Shinobu Ishihara, renkli noktalardan oluşan kartlarla renk körlüğünü tarayan testi yayımladı.'],
    [1929, '1929', 'Seri üretim güneş gözlüğü', 'gzl', 'Sam Foster uygun fiyatlı güneş gözlüklerini seri üretime soktu; güneş gözlüğü gündelik bir eşya oldu.'],
    [1935, '1935', 'Antirefle kaplama', 'gzl', 'Alexander Smakula, cam yüzeyindeki yansımayı azaltan ince film kaplamayı geliştirdi.'],
    [1936, '1936', 'Polarize cam ve plastik lens', 'gzl', 'Edwin Land’in polarize filtresi güneş gözlüklerine girdi. Aynı yıl William Feinbloom cam ve plastiği birleştiren kontakt lensler yaptı.'],
    [1939, '1930’lar–1950’ler', 'Sato’nun kornea kesileri', 'ref', 'Japon hekim Tsutomu Sato, miyopiyi düzeltmek için korneaya kesiler uyguladı. Arka yüzeye yapılan kesiler yıllar sonra kornea hasarına yol açtı ve yöntem bırakıldı.'],
    [1947, '1947', 'Organik (plastik) cam', 'gzl', 'CR-39 reçinesinden ilk gözlük camları üretildi; mineral cama göre yaklaşık yarı ağırlıkta ve daha dayanıklıydı.'],
    [1948, '1948', 'Korneal sert lens', 'len', 'Kevin Tuohy, yalnızca korneayı örten küçük plastik lensi geliştirdi. Kontakt lens gün boyu takılabilir hale geldi.'],
    [1949, '1949', 'İlk göz içi mercek', 'goz', 'Harold Ridley, katarakt ameliyatında çıkarılan merceğin yerine yapay mercek yerleştirdi. Bugün katarakt cerrahisinin standardıdır.'],
    [1950, '1949', 'Keratomileusis fikri', 'ref', 'José Barraquer, korneadan doku alıp yeniden biçimlendirerek kırma kusurunu düzeltme düşüncesini geliştirdi; LASIK’in temelidir.'],
    [1951, '1949', 'Retinada ışıkla tedavi', 'goz', 'Gerhard Meyer-Schwickerath, yoğun ışıkla retinada koagülasyon yapılabileceğini gösterdi; lazer tedavilerinin öncüsüdür.'],
    [1957, '1950’ler', 'Goldmann tonometresi', 'goz', 'Hans Goldmann’ın aplanasyon tonometresi göz tansiyonu ölçümünde altın standart oldu.'],
    [1959, '1959', 'Progresif cam', 'gzl', 'Bernard Maitenaz’ın geliştirdiği ilk progresif cam piyasaya çıktı; uzak, ara ve yakın çizgisiz tek camda birleşti.'],
    [1960, '1960', 'Lazer', 'opt', 'Theodore Maiman ilk çalışan lazeri yaptı. Birkaç yıl içinde göz hekimliğinde kullanılmaya başlandı.'],
    [1961, '1961', 'Yumuşak lensin icadı ve göz anjiyografisi', 'len', 'Otto Wichterle, hidrojel malzemeden ilk yumuşak kontakt lensleri üretti. Aynı yıl flöresein anjiyografi ile retina damarları görüntülenebildi.'],
    [1964, '1964', 'Renk değiştiren cam', 'gzl', 'Güneş ışığında koyulaşan fotokromik mineral camlar piyasaya çıktı.'],
    [1967, '1967', 'Fakoemülsifikasyon', 'goz', 'Charles Kelman, kataraktı ultrasonla parçalayıp küçük kesiden emerek alma yöntemini tanıttı. Ameliyat dikişsiz ve kısa süreli hale geldi.'],
    [1971, '1971', 'Yumuşak lens piyasada, vitrektomi', 'len', 'Yumuşak kontakt lensler geniş kullanıma sunuldu. Aynı yıllarda Robert Machemer vitrektomi cihazını geliştirerek göz içi cerrahisinin önünü açtı.'],
    [1974, '1974', 'Radyal keratotomi', 'ref', 'Svyatoslav Fyodorov, korneanın ön yüzüne ışınsal kesilerle miyopiyi düzelten ameliyatı yaygınlaştırdı.'],
    [1978, '1978', 'Torik yumuşak lens', 'len', 'Astigmatı düzelten ilk yumuşak torik lensler onay aldı. Aynı yıllarda oksijen geçiren sert lensler de çıktı.'],
    [1981, '1981', 'Uzun süreli kullanım lensi', 'len', 'Gece çıkarılmadan takılabilen yumuşak lensler onaylandı; ilerleyen yıllarda enfeksiyon riski nedeniyle kullanım süreleri sınırlandı.'],
    [1983, '1983', 'Excimer lazer ve kornea', 'ref', 'Stephen Trokel, excimer lazerin korneayı ısıtmadan mikron hassasiyetinde şekillendirebildiğini gösterdi.'],
    [1985, '1980’ler', 'Polikarbonat ve yüksek indeks', 'gzl', 'Darbeye dayanıklı polikarbonat ve daha ince camlar sağlayan yüksek indeksli malzemeler yaygınlaştı.'],
    [1987, '1987', 'PRK ve tek kullanımlık lens', 'ref', 'Excimer lazerle ilk yüzey tedavileri (PRK) insanlarda uygulandı. Aynı yıl düzenli değiştirilen tek kullanımlık yumuşak lensler piyasaya girdi.'],
    [1990, '1990', 'LASIK', 'ref', 'Ioannis Pallikaris, korneada flep kaldırıp altına lazer uygulayan LASIK yöntemini tanımladı.'],
    [1991, '1991', 'OCT ve plastik fotokromik cam', 'goz', 'Optik koherens tomografi (OCT) tanıtıldı; retina katmanları kesit halinde, dokunmadan görüntülenebildi. Aynı dönemde organik fotokromik camlar çıktı.'],
    [1995, '1995', 'Günlük lens ve lazer onayları', 'len', 'Günlük tek kullanımlık lensler piyasaya çıktı. Aynı yıl ABD’de excimer lazerle PRK onaylandı; LASIK onayı birkaç yıl sonra geldi.'],
    [1999, '1998–1999', 'Silikon hidrojel ve dalga cephesi', 'len', 'Çok daha fazla oksijen geçiren silikon hidrojel lensler çıktı. Lazer cerrahisinde gözün ince kusurlarını ölçen dalga cephesi rehberli tedaviler başladı.'],
    [2000, '2000’ler', 'Serbest form cam üretimi', 'gzl', 'Bilgisayar kontrollü yüzey işleme ile camın arka yüzeyi kişinin reçetesine ve ölçülerine göre nokta nokta işlenebilir oldu.'],
    [2001, '2001', 'Femtosaniye lazerle flep', 'ref', 'LASIK’te flep bıçak yerine femtosaniye lazerle oluşturulmaya başlandı.'],
    [2002, '2002', 'Gece ortokeratolojisi', 'len', 'Uykuda takılan ve korneayı geçici olarak düzleştiren sert lensler onay aldı.'],
    [2003, '2003', 'Korneal çapraz bağlama', 'goz', 'Wollensak, Spoerl ve Seiler, riboflavin ve ultraviyole ışıkla korneanın sertleştirilerek keratokonusun ilerlemesinin durdurulabildiğini bildirdi.'],
    [2004, '2004', 'Türkiye: Optisyenlik Hakkında Kanun', 'gzl', '5193 sayılı Kanun kabul edildi; optisyenlik mesleğinin kimler tarafından ve hangi koşullarla yapılacağı düzenlendi.'],
    [2005, '2005', 'Fakik göz içi lens', 'ref', 'Gözün kendi merceği çıkarılmadan önüne yerleştirilen lensler ABD’de onaylandı; lazere uygun olmayan yüksek numaralarda bir seçenek oldu.'],
    [2006, '2006', 'Anti-VEGF iğneleri', 'goz', 'Yaş tip sarı nokta hastalığında göz içine uygulanan ilaçlar onaylandı. İlk kez görme kaybı durdurulabiliyor, kimi hastada geri kazanılabiliyordu.'],
    [2009, '2008–2009', 'Lazerle katarakt cerrahisi', 'goz', 'Femtosaniye lazer katarakt ameliyatının bazı adımlarında kullanılmaya başlandı.'],
    [2011, '2011', 'SMILE', 'ref', 'Flep kaldırmadan, küçük bir kesiden mercek biçimli doku çıkarılarak yapılan lazer yönteminin sonuçları yayımlandı.'],
    [2013, '2013', 'Akıllı gözlük', 'gzl', 'Ekranlı ve kameralı ilk akıllı gözlükler tanıtıldı.'],
    [2017, '2017', 'Gözde ilk gen tedavisi', 'goz', 'Kalıtsal bir retina hastalığı için geliştirilen gen tedavisi onaylandı.'],
    [2018, '2018', 'Yapay zekâ ile tarama ve miyopi kontrol camı', 'goz', 'Diyabetik retinopatiyi hekim olmadan tarayabilen ilk yapay zekâ sistemi onay aldı. Aynı yıl çocuklarda miyopinin ilerlemesini yavaşlatmayı hedefleyen gözlük camları tanıtıldı.'],
    [2019, '2019', 'Miyopi kontrolü için kontakt lens', 'len', 'Çocuklarda miyopinin ilerlemesini yavaşlatmak üzere tasarlanan yumuşak lens ABD’de onaylandı.']
  ];
  E.sort(function (a, b) { return a[0] - b[0]; });
  var f = 'hep', q = '';
  function norm(t) { return t.toLocaleLowerCase('tr'); }
  function list() {
    var h = '', last = -1, n = 0, qq = norm(q);
    E.forEach(function (e) { if (f !== 'hep' && e[3] !== f) return; if (qq && norm(e[1] + ' ' + e[2] + ' ' + e[4]).indexOf(qq) < 0) return; var er = 0; for (var i = 0; i < ERA.length; i++) if (e[0] >= ERA[i][0]) er = i; if (er !== last) { last = er; h += '<h2 style="font-size:19px;color:#14233b;margin:26px 0 12px -26px;padding-left:26px">' + ERA[er][1] + '</h2>'; } n++;
      h += '<div style="position:relative;margin:0 0 12px"><span style="position:absolute;left:-36px;top:15px;width:16px;height:16px;border-radius:50%;background:' + C[e[3]] + ';border:3px solid #fff;box-shadow:0 0 0 2px #c9dcff"></span><div class="cgt-panel" style="gap:5px;padding:12px 14px"><div style="display:flex;flex-wrap:wrap;gap:4px 10px;align-items:baseline"><b style="font-size:17px;color:' + C[e[3]] + ';white-space:nowrap">' + e[1] + '</b><b style="font-size:16.5px">' + e[2] + '</b><span style="font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#5b6b82">' + K[e[3]] + '</span></div><div style="font-size:14.5px;color:#243247">' + e[4] + '</div></div></div>'; });
    document.getElementById('thL').innerHTML = n ? h : '<div class="cgt-info">Bu aramayla eşleşen kayıt bulunamadı.</div>'; document.getElementById('thN').textContent = n + ' kayıt';
  }
  root.innerHTML = '<p class="cgt-lead">Eski Mısır papirüslerinden gen tedavisine: optik biliminin, göz hekimliğinin, gözlüğün, kontakt lensin ve refraktif cerrahinin ' + E.length + ' dönüm noktası tek zaman çizelgesinde. Konuya göre süzün ya da arayın.</p>' +
    '<div class="cgt-panel" style="position:sticky;top:8px;z-index:2;margin-bottom:6px"><div class="cgt-chips" id="thF"></div><div style="display:flex;gap:10px;align-items:center"><input type="text" id="thQ" placeholder="Ara: katarakt, lazer, Helmholtz, progresif…" aria-label="Zaman çizelgesinde ara"><b id="thN" style="white-space:nowrap;color:#004aad;font-size:14px"></b></div></div>' +
    '<div id="thL" style="position:relative;padding-left:26px;border-left:3px solid #c9dcff;margin-left:8px"></div>' +
    '<p class="cgt-note">Tarihler yaklaşıktır; bazı buluşların kime ait olduğu ve kesin yılı kaynaklar arasında farklılık gösterir. Yaygın kabul gören anlatım esas alınmıştır. Onay tarihleri aksi belirtilmedikçe ABD’deki ilk onayı ifade eder. Bu sayfa genel kültür ve eğitim amaçlıdır; tıbbi öneri içermez.</p>';
  function chips() { document.getElementById('thF').innerHTML = Object.keys(K).map(function (k) { var n = k === 'hep' ? E.length : E.filter(function (e) { return e[3] === k; }).length; return '<button type="button" class="cgt-chip' + (f === k ? ' on' : '') + '" data-f="' + k + '"' + (f === k || k === 'hep' ? '' : ' style="border-color:' + C[k] + ';color:' + C[k] + '"') + '>' + K[k] + ' · ' + n + '</button>'; }).join(''); }
  root.addEventListener('click', function (e) { var b = e.target.closest('button[data-f]'); if (b) { f = b.getAttribute('data-f'); chips(); list(); } });
  document.getElementById('thQ').addEventListener('input', function (e) { q = e.target.value.trim(); list(); });
  chips(); list();
})();
