import type { Locale } from '@/i18n/locales'

const copy: Record<string, readonly [string, string]> = {
  'Length Contraction Lab: measuring moving space': ['Laboratorium Kontraksi Panjang: mengukur ruang yang bergerak', '長さの収縮実験室：動く空間を測る'],
  'A moving object is measured to be shorter along its direction of motion. The key is not how it looks, but how one observer measures both ends at the same time.': ['Benda yang bergerak terukur lebih pendek sepanjang arah geraknya. Kuncinya bukan bagaimana benda terlihat, melainkan bagaimana seorang pengamat mengukur kedua ujungnya pada saat yang sama.', '運動する物体は、運動方向に沿って短く測定されます。重要なのは見た目ではなく、一人の観測者が両端を同時刻に測定することです。'],
  'A spaceship passes Earth at a constant speed. Earth observers record the positions of its front and rear at the same Earth-frame time. What length do they measure?': ['Pesawat ruang angkasa melintasi Bumi dengan kecepatan konstan. Pengamat di Bumi mencatat posisi ujung depan dan belakang pada waktu yang sama dalam kerangka Bumi. Berapa panjang yang mereka ukur?', '宇宙船が一定速度で地球のそばを通過します。地球の観測者は、地球基準系で同じ時刻に船の前端と後端の位置を記録します。測定される長さはどれでしょうか。'],
  'The same as its rest length': ['Sama dengan panjang saat diam', '静止時の長さと同じ'],
  'Shorter than its rest length': ['Lebih pendek daripada panjang saat diam', '静止時の長さより短い'],
  'Longer than its rest length': ['Lebih panjang daripada panjang saat diam', '静止時の長さより長い'],
  'Run the experiment to test your prediction.': ['Jalankan eksperimen untuk menguji prediksi Anda.', '実験を実行して予測を確かめてください。'],
  'Your prediction matches the measured-frame result.': ['Prediksi Anda sesuai dengan hasil dalam kerangka pengukuran.', '予測は測定基準系での結果と一致しています。'],
  'The measured length is shorter. Compare the two endpoint events and their simultaneity.': ['Panjang terukur lebih pendek. Bandingkan kedua peristiwa pada ujung benda dan keserentakannya.', '測定された長さは短くなります。両端の事象とその同時性を比較してください。'],
  'Measuring frame': ['Kerangka pengukuran', '測定する基準系'],
  'Earth': ['Bumi', '地球'],
  'Moving object': ['Benda yang bergerak', '運動する物体'],
  'Spaceship': ['Pesawat ruang angkasa', '宇宙船'],
  'Relative speed': ['Kecepatan relatif', '相対速度'],
  'Proper length': ['Panjang wajar', '固有長'],
  'Measured length': ['Panjang terukur', '測定された長さ'],
  'Length difference': ['Selisih panjang', '長さの差'],
  'Lorentz factor': ['Faktor Lorentz', 'ローレンツ因子'],
  'Endpoint timing difference in the ship frame': ['Selisih waktu peristiwa ujung dalam kerangka pesawat', '宇宙船の基準系における両端事象の時刻差'],
  'The front-end event occurs earlier in the ship frame for this pair of Earth-simultaneous measurements.': ['Untuk pasangan pengukuran yang serentak di Bumi ini, peristiwa pada ujung depan terjadi lebih awal dalam kerangka pesawat.', '地球基準系で同時に測定したこの事象の組では、宇宙船の基準系では前端の事象がより早く起こります。'],
  'Spacetime diagram: endpoint worldlines and two simultaneity slices': ['Diagram ruang-waktu: garis dunia kedua ujung dan dua irisan keserentakan', '時空図：両端の世界線と二つの同時刻断面'],
  'Rear endpoint worldline': ['Garis dunia ujung belakang', '後端の世界線'],
  'Front endpoint worldline': ['Garis dunia ujung depan', '前端の世界線'],
  'Earth-frame simultaneity (t = 0)': ['Keserentakan kerangka Bumi (t = 0)', '地球基準系の同時刻面（t = 0）'],
  'Ship-frame simultaneity (t′ = 0)': ['Keserentakan kerangka pesawat (t′ = 0)', '宇宙船基準系の同時刻面（t′ = 0）'],
  'position x / proper length': ['posisi x / panjang wajar', '位置 x / 固有長'],
  'time ct / proper length': ['waktu ct / panjang wajar', '時刻 ct / 固有長'],
  'The horizontal Earth slice intersects both ends at the same Earth time, giving the contracted length. The tilted ship slice is simultaneous in the ship frame instead; it is a different pair of endpoint events.': ['Irisan horizontal Bumi memotong kedua ujung pada waktu Bumi yang sama sehingga menghasilkan panjang terkontraksi. Irisan miring pesawat justru serentak dalam kerangka pesawat; pasangan peristiwa pada kedua ujungnya berbeda.', '水平な地球基準系の断面は、地球時刻が同じ両端の事象を結び、収縮した長さを与えます。傾いた宇宙船基準系の断面は宇宙船の基準系で同時刻ですが、選ばれる両端の事象は異なります。'],
  'Beginner: the object is not squeezed in its own rest frame. A moving observer measures its length by recording both endpoint positions at one shared time in that observer’s frame.': ['Pemula: benda tidak tertekan dalam kerangka diamnya sendiri. Pengamat yang melihat benda bergerak mengukur panjang dengan mencatat posisi kedua ujung pada satu waktu yang sama dalam kerangkanya.', '初級：物体は自分自身の静止基準系では押し縮められていません。運動する物体の長さは、観測者自身の基準系で同じ時刻に両端の位置を記録して測定します。'],
  'Intermediate: the Lorentz factor is γ = 1/√(1 − v²/c²). The moving-frame length is L = L₀/γ, where L₀ is the proper length measured in the object’s rest frame.': ['Menengah: faktor Lorentz adalah γ = 1/√(1 − v²/c²). Panjang dalam kerangka pengamat yang melihat benda bergerak adalah L = L₀/γ, dengan L₀ merupakan panjang wajar yang diukur dalam kerangka diam benda.', '中級：ローレンツ因子は γ = 1/√(1 − v²/c²) です。運動する物体の長さは L = L₀/γ となり、L₀ は物体の静止基準系で測定した固有長です。'],
  'Advanced: the two endpoint events are simultaneous in the measuring frame (Δt = 0), but the inverse Lorentz transformation gives Δt′ = −vL₀/c². Length measurement is frame-dependent because simultaneity is frame-dependent.': ['Lanjutan: dua peristiwa pada ujung benda serentak dalam kerangka pengukuran (Δt = 0), tetapi transformasi Lorentz invers memberikan Δt′ = −vL₀/c². Pengukuran panjang bergantung pada kerangka karena keserentakan juga bergantung pada kerangka.', '上級：両端の事象は測定基準系では同時（Δt = 0）ですが、逆ローレンツ変換から Δt′ = −vL₀/c² が得られます。同時性が基準系に依存するため、長さの測定も基準系に依存します。'],
  'The object’s own rest frame measures its proper length L₀.': ['Kerangka diam benda mengukur panjang wajarnya L₀.', '物体自身の静止基準系では固有長 L₀ が測定されます。'],
  'In the Earth frame, the two endpoint positions must be recorded simultaneously using synchronized Earth clocks.': ['Dalam kerangka Bumi, posisi kedua ujung harus dicatat secara serentak menggunakan jam-jam Bumi yang tersinkronisasi.', '地球基準系では、同期した地球の時計を使い、両端の位置を同時に記録する必要があります。'],
  'The contraction is along the direction of relative motion; dimensions perpendicular to the motion are unchanged.': ['Kontraksi terjadi sepanjang arah gerak relatif; dimensi yang tegak lurus terhadap gerak tidak berubah.', '収縮するのは相対運動の方向に沿った長さであり、運動に垂直な方向の寸法は変化しません。'],
  'This is a measurement of endpoint positions, not a photograph. The visual appearance of a fast-moving object also depends on light-travel time and can involve a different optical effect.': ['Ini adalah pengukuran posisi kedua ujung, bukan foto. Penampilan visual benda yang bergerak cepat juga bergantung pada waktu tempuh cahaya dan dapat melibatkan efek optik yang berbeda.', 'これは両端の位置の測定であり、写真ではありません。高速で動く物体の見た目は光の伝播時間にも依存し、別の光学効果が関係することがあります。'],
  'Model assumptions and limits': ['Asumsi dan keterbatasan model', 'モデルの前提と限界'],
  'The rod is idealized as having a constant proper length and moving inertially at constant speed. The model treats one-dimensional endpoint positions, synchronized clocks in each inertial frame, and ignores acceleration, rotation, deformation, thickness effects and optical appearance. A perfectly rigid body cannot be accelerated as a whole in special relativity; this experiment considers uniform motion after any acceleration has ended.': ['Batang diidealkan memiliki panjang wajar yang konstan dan bergerak secara inersial dengan kecepatan tetap. Model membahas posisi kedua ujung dalam satu dimensi dan jam tersinkronisasi pada setiap kerangka inersial, serta mengabaikan percepatan, rotasi, deformasi, efek ketebalan, dan penampilan optik. Dalam relativitas khusus, benda tegar sempurna tidak dapat dipercepat sebagai satu kesatuan; eksperimen ini membahas gerak seragam setelah percepatan berakhir.', '棒は一定の固有長を持ち、一定速度で慣性運動すると理想化しています。モデルは一次元の両端位置と各慣性系で同期した時計を扱い、加速、回転、変形、厚さの効果、光学的な見え方は無視します。特殊相対論では完全な剛体を一体として加速することはできません。この実験では加速が終わった後の等速運動を扱います。'],
  'Predict how the measured length changes as the relative speed increases.': ['Prediksikan bagaimana panjang terukur berubah ketika kecepatan relatif meningkat.', '相対速度が増すと、測定される長さがどう変化するか予測してください。'],
  'The proper length is the same in every frame.': ['Panjang wajar sama dalam setiap kerangka.', '固有長はどの基準系でも同じです。'],
  'Length contraction is not an ordinary optical shrinking effect.': ['Kontraksi panjang bukan efek penyusutan optik biasa.', '長さの収縮は通常の光学的な縮小効果ではありません。'],
}

export function localizeLengthContractionText(value: string, locale: Locale): string {
  if (locale === 'en') return value
  return copy[value]?.[locale === 'id' ? 0 : 1] ?? value
}

export function getLengthContractionDocumentTitle(locale: Locale): string {
  if (locale === 'id') return 'Laboratorium Kontraksi Panjang · Physica'
  if (locale === 'ja') return '長さの収縮実験室 · Physica'
  return 'Length Contraction Lab · Physica'
}
