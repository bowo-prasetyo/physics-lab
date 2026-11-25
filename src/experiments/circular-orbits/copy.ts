import type { Locale } from '@/i18n/locales'

/** Indonesian and Japanese text for the Circular motion and orbits page, keyed by the English. */
const copy: Record<string, readonly [string, string]> = {
  'Circular motion and orbits: Newton’s cannonball': ['Gerak melingkar dan orbit: meriam Newton', '円運動と軌道：ニュートンの大砲'],
  'Launch a satellite sideways from above the Earth. Too slow and it falls back; fast enough and it keeps falling round the planet. Find the speed for a circle, and see what gravity has to do to keep it there.': ['Luncurkan satelit ke samping dari atas Bumi. Terlalu lambat, satelit jatuh kembali; cukup cepat, satelit terus jatuh mengitari planet. Temukan kelajuan untuk orbit lingkaran, dan lihat apa yang harus dilakukan gravitasi agar satelit tetap di sana.', '地球の上空から人工衛星を横向きに打ち出します。遅すぎると落ちてきますが、十分に速ければ地球の周りを落ち続けます。円軌道になる速さを見つけ、衛星をそこにとどめるために重力が何をしなければならないかを確かめましょう。'],
  'Commit to an answer first. Each explanation unlocks only after you have made the launch that tests it.': ['Tentukan jawaban terlebih dahulu. Setiap penjelasan baru terbuka setelah Anda melakukan peluncuran yang mengujinya.', 'まず答えを決めましょう。各説明は、それを確かめる打ち上げを行った後にだけ表示されます。'],
  'Orbit around the Earth': ['Orbit mengelilingi Bumi', '地球を回る軌道'],
  'Launch the satellite to see its path.': ['Luncurkan satelit untuk melihat lintasannya.', '衛星を打ち上げると経路が表示されます。'],
  'Path': ['Lintasan', '経路'],
  'Velocity at launch': ['Kecepatan saat peluncuran', '打ち上げ時の速度'],
  'Net force: gravity, towards the centre': ['Gaya resultan: gravitasi, menuju pusat', '合力：重力（中心向き）'],
  'Outcome': ['Hasil', '結果'],
  'Circular orbit': ['Orbit lingkaran', '円軌道'],
  'Elliptical orbit': ['Orbit elips', '楕円軌道'],
  'Escapes: it never comes back': ['Lepas: tidak pernah kembali', '脱出：二度と戻らない'],
  'Crashes: the path meets the Earth’s surface': ['Jatuh: lintasan mengenai permukaan Bumi', '墜落：経路が地表にぶつかる'],
  'Acceleration a circle needs, v²/r': ['Percepatan yang diperlukan lingkaran, v²/r', '円運動に必要な加速度 v²/r'],
  'Gravity’s acceleration here, GM/r²': ['Percepatan gravitasi di sini, GM/r²', 'ここでの重力加速度 GM/r²'],
  'Launch speed': ['Kelajuan peluncuran', '打ち上げの速さ'],
  'Period': ['Periode', '周期'],
  'Circular speed here': ['Kelajuan orbit lingkaran di sini', 'ここでの円軌道の速さ'],
  'Closest distance': ['Jarak terdekat', '最も近い距離'],
  'Farthest distance': ['Jarak terjauh', '最も遠い距離'],
  'Escape speed here': ['Kelajuan lepas di sini', 'ここでの脱出速度'],
  'Energy per kilogram, v²/2 − GM/r': ['Energi per kilogram, v²/2 − GM/r', '1 kgあたりのエネルギー v²/2 − GM/r'],
  'Eccentricity': ['Eksentrisitas', '離心率'],
  'Launch the satellite to see its path, the accelerations and the period.': ['Luncurkan satelit untuk melihat lintasannya, percepatannya, dan periodenya.', '衛星を打ち上げると、経路、加速度、周期が表示されます。'],
  'Arrows show directions at the launch point; they are not to scale. The Earth and the orbit are drawn to scale.': ['Panah menunjukkan arah di titik peluncuran; panjangnya tidak berskala. Bumi dan orbit digambar sesuai skala.', '矢印は打ち上げ地点での向きを示し、長さは縮尺どおりではありません。地球と軌道は縮尺どおりに描かれています。'],
  'Launch distance from the Earth’s centre': ['Jarak peluncuran dari pusat Bumi', '地球の中心からの打ち上げ距離'],
  '× circular speed': ['× kelajuan orbit lingkaran', '× 円軌道の速さ'],
  'Launch': ['Luncurkan', '打ち上げる'],
  'R⊕ is the Earth’s radius, 6371 km. The launch is always horizontal: at right angles to the line to the Earth’s centre.': ['R⊕ adalah jari-jari Bumi, 6371 km. Peluncuran selalu horizontal: tegak lurus terhadap garis menuju pusat Bumi.', 'R⊕ は地球の半径（6371 km）です。打ち上げは常に水平、つまり地球の中心へ向かう線に対して直角です。'],
  'Recorded launches': ['Peluncuran yang tercatat', '記録した打ち上げ'],
  'Clear launches': ['Hapus peluncuran', '打ち上げを消去'],
  'Why a circle needs a force': ['Mengapa lingkaran memerlukan gaya', '円運動にはなぜ力が必要か'],
  'Moving in a circle at constant speed, the direction of the velocity keeps changing, so the object accelerates towards the centre. A net force towards the centre must cause that acceleration:': ['Saat bergerak melingkar dengan kelajuan tetap, arah kecepatan terus berubah, sehingga benda mengalami percepatan menuju pusat. Gaya resultan menuju pusat harus menyebabkan percepatan itu:', '一定の速さで円運動をすると、速度の向きが変わり続けるので、物体は中心に向かって加速します。その加速度は中心向きの合力によって生じます。'],
  'A string, a road or gravity can supply this force. Nothing pushes outwards: the outward pull you feel in a turning car is your body carrying on in a straight line.': ['Tali, jalan, atau gravitasi dapat memberikan gaya ini. Tidak ada yang mendorong ke luar: tarikan ke luar yang Anda rasakan di mobil yang berbelok adalah tubuh Anda yang terus bergerak lurus.', 'この力は、ひも、道路、あるいは重力が与えます。外向きに押すものはありません。曲がる車の中で感じる外向きの引っぱりは、体がまっすぐ進み続けようとしているだけです。'],
  'Gravity as the centripetal force': ['Gravitasi sebagai gaya sentripetal', '向心力としての重力'],
  'Setting gravity equal to the force a circle needs gives the circular speed and, with T = 2πr/v, the period:': ['Menyamakan gravitasi dengan gaya yang diperlukan lingkaran menghasilkan kelajuan orbit lingkaran dan, dengan T = 2πr/v, periodenya:', '重力を円運動に必要な力と等しいとおくと、円軌道の速さが求まり、T = 2πr/v から周期が求まります。'],
  'So T² ∝ r³: Kepler’s third law. A geostationary orbit, with a period of one sidereal day (23.93 h), sits at about 6.6 Earth radii.': ['Jadi T² ∝ r³: hukum ketiga Kepler. Orbit geostasioner, dengan periode satu hari sideris (23,93 jam), berada sekitar 6,6 jari-jari Bumi.', 'したがって T² ∝ r³ で、これはケプラーの第3法則です。周期が1恒星日（23.93時間）の静止軌道は、地球半径の約6.6倍の距離にあります。'],
  'Energy, ellipses and escape': ['Energi, elips, dan kelajuan lepas', 'エネルギー、楕円、脱出'],
  'The energy per kilogram, E = v²/2 − GM/r, decides the shape: negative for an ellipse, zero for a parabola, positive for a hyperbola. A horizontal launch at f times the circular speed follows the conic': ['Energi per kilogram, E = v²/2 − GM/r, menentukan bentuknya: negatif untuk elips, nol untuk parabola, positif untuk hiperbola. Peluncuran horizontal dengan f kali kelajuan orbit lingkaran mengikuti irisan kerucut', '1 kgあたりのエネルギー E = v²/2 − GM/r が形を決めます。負なら楕円、ゼロなら放物線、正なら双曲線です。円軌道の速さの f 倍で水平に打ち出すと、次の円錐曲線をたどります。'],
  'This closed ellipse is the Newtonian reference in the Geodesic Motion Lab. In curved spacetime the same orbit does not close: its closest point advances each turn.': ['Elips tertutup ini adalah acuan Newton dalam Laboratorium Gerak Geodesik. Dalam ruang-waktu melengkung, orbit yang sama tidak menutup: titik terdekatnya bergeser maju setiap putaran.', 'この閉じた楕円が、測地線運動実験室でのニュートン力学の基準です。曲がった時空では同じ軌道は閉じず、最も近い点が1周ごとに進みます。'],
  'Newton’s gravity together with circular motion explains the orbits of the Moon, the planets and artificial satellites very precisely, and gives Kepler’s three laws.': ['Gravitasi Newton bersama gerak melingkar menjelaskan orbit Bulan, planet-planet, dan satelit buatan dengan sangat tepat, serta menghasilkan tiga hukum Kepler.', 'ニュートンの重力と円運動を組み合わせると、月、惑星、人工衛星の軌道を非常に精密に説明でき、ケプラーの3法則も導かれます。'],
  'Satellites in low orbit travel at about 7.7 km/s and go round in about 90 minutes; geostationary satellites orbit once per sidereal day, about 42 000 km from the Earth’s centre.': ['Satelit di orbit rendah melaju sekitar 7,7 km/s dan mengelilingi Bumi dalam sekitar 90 menit; satelit geostasioner mengorbit sekali per hari sideris, sekitar 42 000 km dari pusat Bumi.', '低軌道の衛星は約7.7 km/sで進み、約90分で1周します。静止衛星は1恒星日に1周し、地球の中心から約42 000 kmの所を回っています。'],
  'Is an orbiting satellite falling?': ['Apakah satelit yang mengorbit sedang jatuh?', '軌道を回る衛星は落ちているのか'],
  'In Newton’s picture it falls towards the Earth all the time, but moves sideways fast enough to keep missing it. General relativity describes the same orbit as free fall along a geodesic, with no force at all. Here the two agree very closely; they differ measurably in strong gravity or over many orbits, as the Geodesic Motion Lab shows.': ['Dalam gambaran Newton, satelit terus-menerus jatuh ke arah Bumi, tetapi bergerak ke samping cukup cepat sehingga selalu meleset. Relativitas umum menggambarkan orbit yang sama sebagai jatuh bebas sepanjang geodesik, tanpa gaya sama sekali. Di sini keduanya sangat sesuai; perbedaannya terukur pada gravitasi kuat atau setelah banyak orbit, seperti yang ditunjukkan Laboratorium Gerak Geodesik.', 'ニュートンの描像では、衛星は常に地球に向かって落ちていますが、横向きに十分速く動いているので地球に当たり続けません。一般相対性理論は同じ軌道を、力がまったく働かない測地線に沿った自由落下として記述します。ここでは両者はよく一致しますが、強い重力の中や多数回の周回では、測地線運動実験室が示すように測定できる差が生じます。'],
  'What this model assumes': ['Asumsi model ini', 'このモデルの前提'],
  'The satellite is a point and the Earth a fixed, uniform sphere. The model ignores air, the Moon and the Sun, the Earth’s rotation and flattening, and relativistic effects. The launch is always horizontal.': ['Satelit dianggap sebagai titik dan Bumi sebagai bola seragam yang diam. Model ini mengabaikan udara, Bulan dan Matahari, rotasi dan kepepatan Bumi, serta efek relativistik. Peluncuran selalu horizontal.', '衛星は点、地球は動かない一様な球とみなします。空気、月と太陽、地球の自転と扁平さ、相対論的効果は無視しています。打ち上げは常に水平です。'],
  'The path is calculated exactly from Newton’s laws (it is a conic section), not by stepping through time.': ['Lintasan dihitung secara eksak dari hukum Newton (berupa irisan kerucut), bukan dengan melangkah sedikit demi sedikit dalam waktu.', '経路は時間を少しずつ進めて求めるのではなく、ニュートンの法則から厳密に計算しています（円錐曲線になります）。'],
  'Next: Module 4, “Different clocks”, asks what happens to clocks near the speed of light. Later, the Geodesic Motion Lab revisits these orbits in curved spacetime.': ['Berikutnya: Modul 4, “Jam berbeda”, menanyakan apa yang terjadi pada jam yang bergerak mendekati kecepatan cahaya. Kemudian, Laboratorium Gerak Geodesik meninjau kembali orbit ini dalam ruang-waktu melengkung.', '次へ：モジュール4の「異なる時計」では、光速に近い時計に何が起こるかを調べます。その後、測地線運動実験室で、これらの軌道を曲がった時空の中で見直します。'],
  'Different clocks': ['Jam berbeda', '異なる時計'],
  'Geodesic Motion Lab': ['Laboratorium Gerak Geodesik', '測地線運動実験室'],
  'All modules': ['Semua modul', 'すべてのモジュール'],
  'Set the launch speed to exactly 1.00 × circular speed and launch again.': ['Atur kelajuan peluncuran tepat 1,00 × kelajuan orbit lingkaran, lalu luncurkan lagi.', '打ち上げの速さをちょうど 1.00 × 円軌道の速さにして、もう一度打ち上げましょう。'],
  'That launch was fast enough to escape. Try between 1.05 and 1.35 × circular speed.': ['Peluncuran itu cukup cepat untuk lepas. Coba antara 1,05 dan 1,35 × kelajuan orbit lingkaran.', 'その打ち上げは脱出できるほど速すぎました。1.05～1.35 × 円軌道の速さで試しましょう。'],
  'Launch faster than circular speed, between 1.05 and 1.35 ×.': ['Luncurkan lebih cepat daripada kelajuan orbit lingkaran, antara 1,05 dan 1,35 ×.', '円軌道の速さより速く、1.05～1.35 倍で打ち上げましょう。'],
  'Keep 1.00 × circular speed and change the radius by a factor of at least 1.5.': ['Pertahankan 1,00 × kelajuan orbit lingkaran dan ubah jari-jarinya setidaknya 1,5 kali.', '1.00 × 円軌道の速さのまま、半径を1.5倍以上変えましょう。'],
  'Now find a launch at 1.2 × circular speed or more that still comes back.': ['Sekarang temukan peluncuran pada 1,2 × kelajuan orbit lingkaran atau lebih yang tetap kembali.', '次は、1.2 × 円軌道の速さ以上でも戻ってくる打ち上げを見つけましょう。'],
  'Keep increasing the launch speed until the satellite escapes.': ['Terus naikkan kelajuan peluncuran sampai satelit lepas.', '衛星が脱出するまで、打ち上げの速さを上げ続けましょう。'],
}

export function localizeCircularOrbitsText(value: string, locale: Locale): string {
  if (locale === 'en') return value
  const translated = copy[value]
  return translated ? translated[locale === 'id' ? 0 : 1] : value
}

/** Every English string the page translates, for the completeness test. */
export const CIRCULAR_ORBITS_STRINGS: readonly string[] = Object.keys(copy)
