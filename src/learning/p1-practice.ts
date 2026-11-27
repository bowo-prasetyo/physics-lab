import type { PracticeGraph } from './learning-content'
import { apparentWeightPerMass } from '@/physics/equivalence'
import { hubbleVelocity } from '@/physics/observationalCosmology'
import { relativisticMomentum, relativisticVelocityAddition } from '@/physics/relativisticDynamics'
import { SPEED_OF_LIGHT } from '@/physics/relativity'

/** P1 additions extend the existing experiment steps; no new route or unlock rule is introduced. */
export const P1_GRAPHS: Readonly<Record<string, PracticeGraph>> = {
  // A frame moving at 0.5c sees the second frame's speed combine relativistically.
  'velocity-addition': {
    kind: 'function', x: { max: 0.9, step: 0.1 }, y: { max: 1, step: 0.2 },
    f: (beta) => relativisticVelocityAddition(0.5 * SPEED_OF_LIGHT, beta * SPEED_OF_LIGHT) / SPEED_OF_LIGHT,
    table: [0, 0.25, 0.5, 0.75, 0.9],
  },
  // Relativistic momentum per mc, plotted against speed as a fraction of c.
  'relativistic-momentum': {
    kind: 'function', x: { max: 0.9, step: 0.1 }, y: { max: 2.1, step: 0.3 },
    f: (beta) => relativisticMomentum(1, beta * SPEED_OF_LIGHT) / SPEED_OF_LIGHT,
    table: [0, 0.3, 0.6, 0.8, 0.9],
  },
  // A downward-accelerating lift: the scale reads zero in free fall.
  'equivalence-lift': {
    kind: 'function', x: { max: 9.8, step: 2.45 }, y: { max: 9.8, step: 2.45 },
    f: (a) => apparentWeightPerMass(9.8, a),
    table: [0, 2.45, 4.9, 7.35, 9.8],
  },
  // Nearby-galaxy Hubble diagram: the slope is H₀ in this low-redshift approximation.
  'hubble-diagram': {
    kind: 'function', x: { max: 100, step: 20 }, y: { max: 7000, step: 1000 },
    f: (distance) => hubbleVelocity(70, distance),
    table: [0, 20, 40, 60, 80, 100],
  },
}

export const P1_GRAPH_COPY = {
  en: {
    'velocity-addition': { title: 'Read a relativistic velocity-addition graph', intro: 'One frame already moves at 0.5c. The curve shows the combined speed when a second collinear speed is added; the classical sum would keep climbing past c.', xLabel: 'Second speed (fraction of c)', yLabel: 'Combined speed (fraction of c)' },
    'relativistic-momentum': { title: 'Read a relativistic momentum graph', intro: 'Momentum grows faster than the Newtonian straight-line prediction as speed approaches the speed of light.', xLabel: 'Speed (fraction of c)', yLabel: 'Momentum (units of mc)' },
    'equivalence-lift': { title: 'Read an accelerating-lift graph', intro: 'A lift accelerates downwards in a uniform gravitational field. The graph shows the scale reading per kilogram; in free fall the scale reads zero.', xLabel: 'Downward acceleration (m/s²)', yLabel: 'Scale reading per kg (m/s²)' },
    'hubble-diagram': { title: 'Read a nearby-galaxy Hubble diagram', intro: 'Astronomers compare galaxy distance with recession speed inferred from redshift. At low redshift, this idealised Hubble diagram is approximately a straight line.', xLabel: 'Distance (Mpc)', yLabel: 'Recession speed (km/s)' },
  },
  id: {
    'velocity-addition': { title: 'Membaca grafik penjumlahan kecepatan relativistik', intro: 'Satu kerangka sudah bergerak dengan kecepatan 0,5c. Kurva menunjukkan kecepatan gabungan ketika kecepatan segaris kedua ditambahkan; penjumlahan klasik akan terus meningkat melewati c.', xLabel: 'Kecepatan kedua (fraksi c)', yLabel: 'Kecepatan gabungan (fraksi c)' },
    'relativistic-momentum': { title: 'Membaca grafik momentum relativistik', intro: 'Momentum meningkat lebih cepat daripada prediksi garis lurus Newton ketika kelajuan mendekati kecepatan cahaya.', xLabel: 'Kelajuan (fraksi c)', yLabel: 'Momentum (satuan mc)' },
    'equivalence-lift': { title: 'Membaca grafik lift yang dipercepat', intro: 'Lift dipercepat ke bawah dalam medan gravitasi seragam. Grafik menunjukkan bacaan timbangan per kilogram; saat jatuh bebas, timbangan menunjukkan nol.', xLabel: 'Percepatan ke bawah (m/s²)', yLabel: 'Bacaan timbangan per kg (m/s²)' },
    'hubble-diagram': { title: 'Membaca diagram Hubble galaksi dekat', intro: 'Astronom membandingkan jarak galaksi dengan kecepatan menjauhnya yang disimpulkan dari pergeseran merah. Pada pergeseran merah rendah, diagram Hubble ideal ini kira-kira berupa garis lurus.', xLabel: 'Jarak (Mpc)', yLabel: 'Kecepatan menjauh (km/s)' },
  },
  ja: {
    'velocity-addition': { title: '相対論的速度合成グラフを読む', intro: '一方の慣性系はすでに0.5cで動いています。曲線は、同一直線上の2つ目の速度を加えたときの合成速度を示します。古典的な和はcを超えて増え続けます。', xLabel: '2つ目の速度（cの割合）', yLabel: '合成速度（cの割合）' },
    'relativistic-momentum': { title: '相対論的運動量グラフを読む', intro: '速度が光速に近づくと、運動量はニュートン力学の直線的な予測より速く増加します。', xLabel: '速度（cの割合）', yLabel: '運動量（mc単位）' },
    'equivalence-lift': { title: '加速するエレベーターのグラフを読む', intro: '一様な重力場でエレベーターが下向きに加速します。グラフは1 kgあたりの体重計の値を示し、自由落下ではゼロになります。', xLabel: '下向き加速度 (m/s²)', yLabel: '1 kgあたりの値 (m/s²)' },
    'hubble-diagram': { title: '近傍銀河のハッブル図を読む', intro: '天文学者は銀河までの距離と、赤方偏移から推定した後退速度を比較します。低赤方偏移では、この理想化したハッブル図はほぼ直線になります。', xLabel: '距離 (Mpc)', yLabel: '後退速度 (km/s)' },
  },
} as const

export const P1_PRACTICE_BANK = [
  { id: 'velocity-addition-reading', experiment: '/relativity/two-perspectives', graph: 'velocity-addition', minLevel: 'intermediate', options: ['point-eight', 'point-six-seven', 'one-point-zero', 'point-five'], answer: 'point-eight' },
  { id: 'relativistic-momentum-reading', experiment: '/relativity/two-perspectives', graph: 'relativistic-momentum', minLevel: 'advanced', options: ['point-seven-five', 'point-six', 'one-point-two-five', 'point-three'], answer: 'point-seven-five' },
  { id: 'relativistic-momentum-meaning', experiment: '/relativity/two-perspectives', minLevel: 'intermediate', options: ['rises-faster', 'falls-to-zero', 'stays-linear', 'becomes-negative'], answer: 'rises-faster' },
  { id: 'equivalence-principle', experiment: '/gravity/geodesic-motion', minLevel: 'intermediate', options: ['same-local-physics', 'gravity-is-turned-off', 'all-observers-agree-globally', 'mass-disappears'], answer: 'same-local-physics' },
  { id: 'equivalence-lift-reading', experiment: '/gravity/geodesic-motion', graph: 'equivalence-lift', minLevel: 'advanced', options: ['zero', 'half-g', 'g', 'twice-g'], answer: 'zero' },
  { id: 'hubble-slope-reading', experiment: '/cosmology/evolving-space', graph: 'hubble-diagram', minLevel: 'intermediate', options: ['70', '7', '700', '0.7'], answer: '70' },
  { id: 'hubble-distance-reading', experiment: '/cosmology/evolving-space', graph: 'hubble-diagram', minLevel: 'advanced', options: ['80', '40', '120', '5600'], answer: '80' },
] as const

export const P1_PRACTICE_COPY = {
  en: {
    'velocity-addition-reading': { prompt: 'The first frame moves at 0.5c. If the second frame moves at 0.5c in the same direction, what combined speed does the graph predict?', options: { 'point-eight': '0.80c', 'point-six-seven': '0.67c', 'one-point-zero': '1.00c', 'point-five': '0.50c' }, hint: 'Read the curve at x = 0.5. Do not add the two speeds using ordinary arithmetic.', explanation: 'The relativistic result is (0.5 + 0.5) / (1 + 0.5 × 0.5) = 0.8c. The combined speed is below c, unlike the classical sum.' },
    'relativistic-momentum-reading': { prompt: 'For a particle moving at 0.6c, what momentum per mc is shown by the graph?', options: { 'point-seven-five': '0.75mc', 'point-six': '0.60mc', 'one-point-two-five': '1.25mc', 'point-three': '0.30mc' }, hint: 'Find x = 0.6 and read the vertical value. The plotted quantity is p/(mc).', explanation: 'At 0.6c, γ = 1.25, so p/(mc) = γv/c = 1.25 × 0.6 = 0.75. Momentum grows more rapidly than mv as speed approaches c.' },
    'relativistic-momentum-meaning': { prompt: 'What happens to relativistic momentum as speed approaches c?', options: { 'rises-faster': 'It rises increasingly steeply.', 'falls-to-zero': 'It falls towards zero.', 'stays-linear': 'It remains exactly proportional to speed.', 'becomes-negative': 'It becomes negative for positive speed.' }, hint: 'Look at how the graph bends upward near the right-hand edge.', explanation: 'The Lorentz factor grows without bound as speed approaches c, so momentum rises increasingly steeply. A massive particle cannot be accelerated to c by supplying a finite amount of energy.' },
    'equivalence-principle': { prompt: 'In a small laboratory, why can a freely falling lift and a gravity-free inertial laboratory give the same local results?', options: { 'same-local-physics': 'The effects of a uniform gravitational field can locally be transformed away by free fall.', 'gravity-is-turned-off': 'Earth’s gravitational field has physically disappeared.', 'all-observers-agree-globally': 'All observers everywhere measure identical gravity.', 'mass-disappears': 'The objects lose their mass while falling.' }, hint: 'The principle is local: compare what an observer measures inside a sufficiently small freely falling laboratory.', explanation: 'The equivalence principle says that, locally, a freely falling frame removes the effects of a uniform gravitational field. Tidal effects from variations in gravity remain over larger regions, so this is not a claim that gravity vanishes globally.' },
    'equivalence-lift-reading': { prompt: 'At what downward acceleration does the scale reading per kilogram reach zero?', options: { zero: '9.8 m/s² (free fall)', 'half-g': '4.9 m/s²', g: '0 m/s²', 'twice-g': '19.6 m/s²' }, hint: 'Find where the line meets the horizontal axis.', explanation: 'When the lift accelerates downwards at g, the support force is zero. The person and the lift fall together, so the scale reads zero: apparent weightlessness.' },
    'hubble-slope-reading': { prompt: 'What physical quantity is represented by the slope of this recession-speed versus distance graph?', options: { '70': 'The Hubble constant H₀ (70 km/s/Mpc)', '7': 'The age of the universe (7 Gyr)', '700': 'The speed of light (700 km/s)', '0.7': 'The matter density fraction' }, hint: 'A slope is rise divided by run: speed change divided by distance change.', explanation: 'The slope is H₀. In the low-redshift approximation, more distant galaxies have larger recession speeds, providing observational evidence that the universe expands.' },
    'hubble-distance-reading': { prompt: 'A nearby galaxy has a recession speed of 5,600 km/s. What distance does the graph suggest?', options: { '80': '80 Mpc', '40': '40 Mpc', '120': '120 Mpc', '5600': '5,600 Mpc' }, hint: 'Move from 5,600 km/s across to the line, then down to the distance axis.', explanation: 'The graph has slope 70 km/s/Mpc, so distance ≈ 5,600 / 70 = 80 Mpc. This linear Hubble law is a good approximation for nearby, low-redshift galaxies; precision cosmology uses fuller distance–redshift models.' },
  },
  id: {
    'velocity-addition-reading': { prompt: 'Kerangka pertama bergerak dengan kecepatan 0,5c. Jika kerangka kedua bergerak 0,5c searah, berapa kecepatan gabungan yang diprediksi grafik?', options: { 'point-eight': '0,80c', 'point-six-seven': '0,67c', 'one-point-zero': '1,00c', 'point-five': '0,50c' }, hint: 'Baca kurva pada x = 0,5. Jangan jumlahkan kedua kecepatan dengan aritmetika biasa.', explanation: 'Hasil relativistiknya adalah (0,5 + 0,5) / (1 + 0,5 × 0,5) = 0,8c. Kecepatan gabungan tetap di bawah c, berbeda dari jumlah klasik.' },
    'relativistic-momentum-reading': { prompt: 'Untuk partikel yang bergerak pada 0,6c, berapa momentum per mc yang ditunjukkan grafik?', options: { 'point-seven-five': '0,75mc', 'point-six': '0,60mc', 'one-point-two-five': '1,25mc', 'point-three': '0,30mc' }, hint: 'Temukan x = 0,6 dan baca nilai vertikalnya. Besaran pada grafik adalah p/(mc).', explanation: 'Pada 0,6c, γ = 1,25, sehingga p/(mc) = γv/c = 1,25 × 0,6 = 0,75. Momentum meningkat lebih cepat daripada mv saat kelajuan mendekati c.' },
    'relativistic-momentum-meaning': { prompt: 'Apa yang terjadi pada momentum relativistik ketika kelajuan mendekati c?', options: { 'rises-faster': 'Momentum meningkat semakin tajam.', 'falls-to-zero': 'Momentum turun menuju nol.', 'stays-linear': 'Momentum tetap tepat sebanding dengan kelajuan.', 'becomes-negative': 'Momentum menjadi negatif untuk kelajuan positif.' }, hint: 'Perhatikan bagaimana grafik melengkung ke atas di dekat sisi kanan.', explanation: 'Faktor Lorentz meningkat tanpa batas ketika kelajuan mendekati c, sehingga momentum meningkat semakin tajam. Partikel bermassa tidak dapat dipercepat hingga c dengan energi berhingga.' },
    'equivalence-principle': { prompt: 'Dalam laboratorium kecil, mengapa lift yang jatuh bebas dan laboratorium inersial tanpa gravitasi dapat memberikan hasil lokal yang sama?', options: { 'same-local-physics': 'Pengaruh medan gravitasi seragam dapat dihilangkan secara lokal dengan jatuh bebas.', 'gravity-is-turned-off': 'Medan gravitasi Bumi benar-benar menghilang.', 'all-observers-agree-globally': 'Semua pengamat di mana pun mengukur gravitasi yang sama.', 'mass-disappears': 'Benda kehilangan massanya saat jatuh.' }, hint: 'Prinsip ini bersifat lokal: bandingkan pengukuran di dalam laboratorium jatuh bebas yang cukup kecil.', explanation: 'Prinsip kesetaraan menyatakan bahwa kerangka jatuh bebas secara lokal menghilangkan pengaruh medan gravitasi seragam. Efek pasang surut akibat variasi gravitasi masih ada pada wilayah yang lebih luas; gravitasi tidak menghilang secara global.' },
    'equivalence-lift-reading': { prompt: 'Pada percepatan ke bawah berapa bacaan timbangan per kilogram mencapai nol?', options: { zero: '9,8 m/s² (jatuh bebas)', 'half-g': '4,9 m/s²', g: '0 m/s²', 'twice-g': '19,6 m/s²' }, hint: 'Cari titik ketika garis memotong sumbu horizontal.', explanation: 'Ketika lift dipercepat ke bawah sebesar g, gaya penopang bernilai nol. Orang dan lift jatuh bersama sehingga timbangan menunjukkan nol: keadaan tanpa berat.' },
    'hubble-slope-reading': { prompt: 'Besaran fisika apa yang diwakili oleh kemiringan grafik kecepatan menjauh terhadap jarak ini?', options: { '70': 'Konstanta Hubble H₀ (70 km/s/Mpc)', '7': 'Usia alam semesta (7 Gyr)', '700': 'Kecepatan cahaya (700 km/s)', '0.7': 'Fraksi kerapatan materi' }, hint: 'Kemiringan adalah kenaikan dibagi jarak mendatar: perubahan kecepatan dibagi perubahan jarak.', explanation: 'Kemiringannya adalah H₀. Dalam pendekatan pergeseran merah rendah, galaksi yang lebih jauh memiliki kecepatan menjauh lebih besar; ini merupakan bukti pengamatan bahwa alam semesta mengembang.' },
    'hubble-distance-reading': { prompt: 'Sebuah galaksi dekat memiliki kecepatan menjauh 5.600 km/s. Berapa jarak yang ditunjukkan grafik?', options: { '80': '80 Mpc', '40': '40 Mpc', '120': '120 Mpc', '5600': '5.600 Mpc' }, hint: 'Dari 5.600 km/s, bergerak mendatar ke garis lalu turun ke sumbu jarak.', explanation: 'Kemiringan grafik adalah 70 km/s/Mpc, sehingga jarak ≈ 5.600 / 70 = 80 Mpc. Hukum Hubble linear ini merupakan pendekatan yang baik untuk galaksi dekat dengan pergeseran merah rendah; kosmologi presisi memakai model jarak–pergeseran merah yang lebih lengkap.' },
  },
  ja: {
    'velocity-addition-reading': { prompt: '最初の慣性系は0.5cで動いています。2つ目の慣性系も同じ向きに0.5cで動くとき、グラフが示す合成速度はいくらですか？', options: { 'point-eight': '0.80c', 'point-six-seven': '0.67c', 'one-point-zero': '1.00c', 'point-five': '0.50c' }, hint: 'x = 0.5で曲線を読み取ります。通常の算術で2つの速度を足さないでください。', explanation: '相対論的な結果は(0.5 + 0.5) / (1 + 0.5 × 0.5) = 0.8cです。古典的な和とは異なり、合成速度はc未満です。' },
    'relativistic-momentum-reading': { prompt: '0.6cで動く粒子について、グラフが示すmcあたりの運動量はいくらですか？', options: { 'point-seven-five': '0.75mc', 'point-six': '0.60mc', 'one-point-two-five': '1.25mc', 'point-three': '0.30mc' }, hint: 'x = 0.6を見つけ、縦軸の値を読み取ります。プロットされている量はp/(mc)です。', explanation: '0.6cではγ = 1.25なので、p/(mc) = γv/c = 1.25 × 0.6 = 0.75です。速度がcに近づくと、運動量はmvより急速に増加します。' },
    'relativistic-momentum-meaning': { prompt: '速度がcに近づくと、相対論的運動量はどうなりますか？', options: { 'rises-faster': '増加がますます急になります。', 'falls-to-zero': 'ゼロに近づきます。', 'stays-linear': '速度に正確に比例し続けます。', 'becomes-negative': '正の速度で負になります。' }, hint: 'グラフの右端付近で上向きの曲がり方を見てください。', explanation: '速度がcに近づくとローレンツ因子は際限なく増加するため、運動量も急激に増加します。質量のある粒子を有限のエネルギーでcまで加速することはできません。' },
    'equivalence-principle': { prompt: '小さな実験室では、自由落下するエレベーターと重力のない慣性実験室が同じ局所的な結果を示しうるのはなぜですか？', options: { 'same-local-physics': '一様な重力場の効果は自由落下によって局所的に取り除けるためです。', 'gravity-is-turned-off': '地球の重力場が物理的に消えるためです。', 'all-observers-agree-globally': 'すべての観測者がどこでも同じ重力を測るためです。', 'mass-disappears': '物体が落下中に質量を失うためです。' }, hint: 'この原理は局所的です。十分に小さな自由落下実験室の内部で何を測るかを比べてください。', explanation: '等価原理によれば、自由落下系では一様な重力場の効果を局所的に取り除けます。広い領域では重力の変化による潮汐効果が残るため、重力が全体として消えるという意味ではありません。' },
    'equivalence-lift-reading': { prompt: '1 kgあたりの体重計の値がゼロになるのは、下向き加速度がいくらのときですか？', options: { zero: '9.8 m/s²（自由落下）', 'half-g': '4.9 m/s²', g: '0 m/s²', 'twice-g': '19.6 m/s²' }, hint: '線が横軸と交わる位置を探してください。', explanation: 'エレベーターがgで下向きに加速すると、支える力はゼロです。人とエレベーターが一緒に落下するため、体重計はゼロを示します。' },
    'hubble-slope-reading': { prompt: 'この後退速度と距離のグラフの傾きは、どの物理量を表していますか？', options: { '70': 'ハッブル定数H₀（70 km/s/Mpc）', '7': '宇宙の年齢（7 Gyr）', '700': '光速（700 km/s）', '0.7': '物質密度の割合' }, hint: '傾きは縦方向の増加を横方向の距離で割ったものです。', explanation: '傾きはH₀です。低赤方偏移近似では、遠い銀河ほど後退速度が大きくなり、宇宙膨張の観測的証拠になります。' },
    'hubble-distance-reading': { prompt: '近傍銀河の後退速度が5,600 km/sなら、グラフが示す距離はいくらですか？', options: { '80': '80 Mpc', '40': '40 Mpc', '120': '120 Mpc', '5600': '5,600 Mpc' }, hint: '5,600 km/sから横に線まで進み、距離軸へ下ります。', explanation: 'グラフの傾きは70 km/s/Mpcなので、距離は約5,600 / 70 = 80 Mpcです。この直線的なハッブル則は近傍・低赤方偏移の銀河に適した近似であり、精密宇宙論ではより完全な距離–赤方偏移モデルを使います。' },
  },
} as const
