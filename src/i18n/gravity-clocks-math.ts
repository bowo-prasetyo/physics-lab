import type { Locale } from './locales'

/** Explanatory copy used by the Gravity Clocks mathematics panel. */
const translations: Record<string, readonly [string, string]> = {
  'What this model assumes': ['Asumsi model ini', 'このモデルの前提'],
  'This is the Schwarzschild model: the mass is spherical and non-rotating, and the region outside it is treated as vacuum. Earth’s rotation, its slight flattening and other small corrections are omitted. The two clocks in the main comparison are held stationary relative to this idealized body, outside its surface (and, for a black hole, outside the horizon).': ['Ini adalah model Schwarzschild: massanya berbentuk bola dan tidak berotasi, sedangkan wilayah di luarnya dianggap vakum. Rotasi Bumi, bentuknya yang sedikit pepat, dan koreksi kecil lainnya diabaikan. Kedua jam dalam perbandingan utama diam relatif terhadap benda ideal ini, di luar permukaannya (dan, untuk lubang hitam, di luar horizon).', 'これはシュワルツシルト・モデルです。質量は球対称で回転せず、その外部領域は真空とみなします。地球の自転、わずかな扁平さ、その他の小さな補正は無視します。主な比較に用いる2つの時計は、この理想化された天体に対して静止しており、その表面の外側（ブラックホールの場合は事象の地平面の外側）にあります。'],
  'A circular-orbit clock is a different case: it is freely falling, not held stationary. Its rate includes both gravity and orbital motion; the circular-orbit formula applies outside the photon sphere.': ['Jam pada orbit melingkar merupakan kasus berbeda: jam tersebut jatuh bebas, bukan diam. Lajunya dipengaruhi gravitasi dan gerak orbit; rumus orbit melingkar berlaku di luar lingkaran foton.', '円軌道上の時計は別のケースです。静止しているのではなく、自由落下しています。その進み方には重力と軌道運動の両方が影響し、円軌道の公式は光子球の外側で適用されます。'],
  'A clock held at rest at distance': ['Jam yang diam pada jarak', '距離'],
  'from the centre of a mass': ['dari pusat massa', 'だけ質量'],
  'runs slower than a clock far away:': ['berjalan lebih lambat daripada jam yang sangat jauh:', 'の中心から静止した時計は、遠方の時計よりも遅く進みます：'],
  'is the Schwarzschild radius: the size the mass would need to be squeezed into to become a black hole. The smaller': ['adalah jari-jari Schwarzschild: radius tempat massa harus dipadatkan agar menjadi lubang hitam. Semakin kecil', 'はシュワルツシルト半径です。質量をブラックホールにするには、この半径まで押し縮める必要があります。'],
  'is compared with': ['dibandingkan dengan', 'に対して'],
  ', the slower the clock.': [', semakin lambat jam tersebut.', 'が小さいほど、時計は遅く進みます。'],
  'Your clocks': ['Jam Anda', 'あなたの時計'],
  'Object': ['Objek', '天体'],
  'Radius': ['Jari-jari', '半径'],
  'Schwarzschild radius': ['Jari-jari Schwarzschild', 'シュワルツシルト半径'],
  'Key idea': ['Gagasan utama', '重要な考え方'],
  'Lower clocks run slower. Every process slows by the same factor (atoms, chemistry, heartbeats), so a person next to the lower clock notices nothing. The difference only shows when clocks are compared.': ['Jam yang berada lebih rendah berjalan lebih lambat. Semua proses melambat dengan faktor yang sama (atom, reaksi kimia, detak jantung), sehingga orang di dekat jam tersebut tidak merasakan apa pun. Perbedaannya hanya terlihat saat kedua jam dibandingkan.', '低い位置にある時計ほど遅く進みます。原子、化学反応、心拍など、あらゆる過程が同じ割合で遅くなるため、その時計のそばにいる人は何も気づきません。違いが現れるのは時計を比較したときだけです。'],
  'Near a surface: the weak-field rule': ['Dekat permukaan: aturan medan lemah', '表面付近：弱重力場の近似則'],
  'near a surface where gravity is': ['di dekat permukaan dengan gravitasi sebesar', 'が小さく、重力加速度'],
  'Put both clocks close to the surface of a body (a height difference under 1% of its radius) to compare this approximation with the exact result.': ['Tempatkan kedua jam dekat permukaan suatu benda (perbedaan ketinggian kurang dari 1% jari-jarinya) untuk membandingkan pendekatan ini dengan hasil eksak.', 'この近似と厳密解を比較するには、両方の時計を天体の表面近く（高さの差が半径の1%未満）に配置してください。'],
  'Pound and Rebka measured exactly this in 1959, with gamma rays sent up a 22.5 m tower:': ['Pound dan Rebka mengukur efek ini pada tahun 1959 dengan mengirimkan sinar gamma ke atas menara setinggi 22,5 m:', '1959年、パウンドとレブカは高さ22.5 mの塔にガンマ線を送る実験で、まさにこの効果を測定しました：'],
  'GPS: two effects with opposite signs': ['GPS: dua efek dengan tanda berlawanan', 'GPS：符号が反対の2つの効果'],
  'net': ['neto', '正味の効果は'],
  'The Schwarzschild metric': ['Metrik Schwarzschild', 'シュワルツシルト計量'],
  'In the (−, +, +, +) convention:': ['Dengan konvensi tanda (−, +, +, +):', '符号規約（−, +, +, +）では：'],
  ', so': [', sehingga', 'となるため、'],
  '. For a circular orbit, the orbital motion adds to this:': ['. Untuk orbit melingkar, gerak orbit turut memengaruhi lajunya:', '。円軌道では、軌道運動の効果も加わります：'],
  'The lapse is the clock rate': ['Lapse adalah laju jam', 'ラプス関数は時計の進み方を表す'],
  '. Here the lapse is': ['. Di sini lapse-nya adalah', '。ここでラプス関数は'],
  'Space is curved too': ['Ruang juga melengkung', '空間も曲がっている'],
  'Rulers laid out radially between the two clocks measure': ['Penggaris yang disusun secara radial di antara kedua jam mengukur', '2つの時計の間に半径方向に並べた物差しで測る距離は'],
  'For your clocks:': ['Untuk jam Anda:', 'あなたの時計では：'],
  'but the rulers measure': ['tetapi penggaris mengukur', 'ですが、物差しで測る距離は'],
  'an extra': ['lebih panjang sebesar', 'だけ長くなります。追加分は'],
  'Why the observers agree': ['Mengapa para pengamat sepakat', 'なぜ観測者の見解が一致するのか'],
  'Light sent from a static emitter to a static receiver arrives with frequency ratio': ['Cahaya yang dikirim dari pemancar diam ke penerima diam tiba dengan rasio frekuensi', '静止した放射源から静止した受信機へ送られた光の周波数比は'],
  'which is a property of the two clocks’ positions in a static spacetime, not of anyone’s frame. The upward and downward ratios are exact inverses, so both observers agree that the lower clock is slow. This is unlike “Different clocks”, where the clocks were in symmetric relative motion.': ['yang merupakan sifat posisi kedua jam dalam ruang-waktu statis, bukan kerangka acuan siapa pun. Rasio untuk arah ke atas dan ke bawah saling merupakan kebalikan eksak, sehingga kedua pengamat sepakat bahwa jam yang lebih rendah berjalan lambat. Ini berbeda dari eksperimen “Jam berbeda”, ketika kedua jam bergerak relatif secara simetris.', 'これは誰かの座標系によるものではなく、静的時空における2つの時計の位置に由来する性質です。上向きと下向きの周波数比は互いに正確な逆数なので、どちらの観測者も低い位置の時計が遅いことに同意します。時計が対称的な相対運動をしていた「異なる時計」とは異なります。'],
  'exact:': ['eksak:', '厳密解：'],
  'gravity: faster up high': ['gravitasi: lebih cepat di tempat tinggi', '重力：高い場所ほど速い'],
  'speed: slower': ['kecepatan: lebih lambat', '速度：遅くなる'],
  'faster': ['lebih cepat', '速く'],
  'slower': ['lebih lambat', '遅く'],
  "When": ["Ketika", "〜の場合、"],
  "the square root can be expanded. For a small height difference": ["akar kuadrat dapat diekspansi. Untuk selisih ketinggian yang kecil", "平方根を展開できます。高さの差が小さい場合"],
  "near a": ["di dekat", "〜の近くでは"],
  "surface where gravity is": ["permukaan dengan gravitasi sebesar", "重力加速度が〜である地表付近では"],
  "With": ["Dengan", "〜を用いると"],
  "for a circular orbit: gravity": ["untuk orbit melingkar: gravitasi", "円軌道の場合：重力による効果は"],
  "per day, speed": ["per hari, kecepatan", "1 日あたり、速度による効果は"],
  "per day, net": ["per hari, total", "1 日あたり、合計では"],
  "A clock at rest has": ["Jam yang diam memiliki", "静止した時計では"],
  "so": ["sehingga", "したがって"],
  "For a circular orbit, the orbital motion adds to this:": ["Untuk orbit melingkar, gerak orbit menambahkan kontribusi berikut:", "円軌道では、軌道運動による効果が加わります："],
  "In the ADM 3 + 1 split from “Space and time versus spacetime”,": ["Dalam pemisahan ADM 3 + 1 pada eksperimen “Ruang dan waktu versus ruang-waktu”,", "「空間と時間と時空」 の ADM 3 + 1 分解では、"],
  "Here the lapse is": ["Di sini fungsi lapse adalah", "ここでラプス関数は"],
  ": the rate of a static clock. It falls to zero at the horizon. the formula from “Space and time versus spacetime” is now something you can measure.": [": laju jam yang diam. Nilainya turun hingga nol di horizon. Rumus dari eksperimen “Ruang dan waktu versus ruang-waktu” kini dapat Anda ukur.", "：静止時計の進み方を表します。事象の地平面でゼロになります。「空間と時間と時空」 の式を実際に測定できるようになりました。"],
  "For your clocks (at radii": ["Untuk kedua jam Anda (pada jari-jari", "今回の 2 つの時計では（半径"],
  "), clock B runs": ["), jam B berjalan", "）、時計 B は"],
  "and both observers agree.": ["dan kedua pengamat sepakat.", "そして両方の観測者が同じ結論になります。"],
  "Black hole (10 solar masses)": ["Lubang hitam (10 massa Matahari)","ブラックホール（太陽質量の 10 倍）"],
  "Earth": ["Bumi","地球"],
  "Everest (8.8 km)": ["Everest (8,8 km)","エベレスト（8.8 km）"],
  "GPS height": ["Ketinggian GPS","GPS 衛星高度"],
  "Moon distance": ["Jarak Bulan","月までの距離"],
  "Neutron star": ["Bintang neutron","中性子星"],
  "Sea level": ["Permukaan laut","海面"],
  "Tower (22.5 m)": ["Menara (22,5 m)","塔（22.5 m）"],
  "White dwarf (Sirius B)": ["Katai putih (Sirius B)","白色矮星（シリウス B）"],
  "on the surface": ["di permukaan","表面上"],
  "Surface": ["Permukaan","表面"],
  "One radius up": ["Satu jari-jari di atas permukaan","表面から半径 1 個分上"],
  "Ten radii up": ["Sepuluh jari-jari di atas permukaan","表面から半径 10 個分上"],
  "per day.": ["per hari.", "1 日あたりです。"],
}

export function localizeGravityClocksMathText(value: string, locale: Locale): string {
  if (locale === 'en') return value
  const translation = translations[value]
  return translation ? translation[locale === 'id' ? 0 : 1] : value
}

export const GRAVITY_CLOCKS_MATH_TRANSLATION_KEYS = Object.keys(translations)
/** Complete, locale-aware sentence for the live comparison between clocks A and B. */
export function localizeGravityClockComparison(amount: string, faster: boolean, locale: Locale): string {
  if (locale === 'id') return `Jam B berjalan ${amount} ${faster ? 'lebih cepat' : 'lebih lambat'} daripada jam A, dan kedua pengamat sepakat.`
  if (locale === 'ja') return `時計 B は時計 A より ${amount}${faster ? '速く' : '遅く'}進み、両方の観測者が同じ結論になります。`
  return `Clock B runs ${amount} ${faster ? 'faster' : 'slower'} than clock A, and both observers agree.`
}

