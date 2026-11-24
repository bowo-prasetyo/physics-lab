import { MODULES, type ModuleEntry } from '@/modules'
import type { Locale } from './locales'

const translated: Record<Exclude<Locale, 'en'>, readonly ModuleEntry[]> = {
  id: [
    { number: 1, title: 'Memahami ruang', audience: 'Sekolah menengah atas', coverage: [], plannedTopics: ['Geometri koordinat 2D dan transformasi secara lebih mendalam', 'Pengukuran dan geometri ruang di luar contoh vektor saat ini'], experiments: [
      { title: 'A · Ruang versus waktu', summary: 'Gerakkan benda di sepanjang lintasan, lalu hentikan. Apakah waktu juga berhenti?', path: '/space/space-vs-time' },
      { title: 'Perpindahan dalam 3D', summary: 'Gerakkan benda dalam ruang 3D, ukur perpindahannya, dan amati dampak perubahan koordinat.', path: '/space/displacement-3d' },
    ] },
    { number: 2, title: 'Memahami waktu', audience: 'Sekolah menengah atas', coverage: [], plannedTopics: ['Mekanisme jam fisik lainnya dan perbandingannya', 'Pembahasan lebih luas tentang pengukuran waktu dan ketidakpastian'], experiments: [
      { title: 'Jam pendulum', summary: 'Ukur periode pendulum, bawa jam pendulum ke Bulan, dan tanyakan apa yang sebenarnya diukur oleh jam.', path: '/time/pendulum' },
    ] },
    { number: 3, title: 'Mekanika klasik', audience: 'Sekolah menengah atas / Sarjana', coverage: [], plannedTopics: ['Diagram benda bebas dengan beberapa gaya', 'Gerak melingkar', 'Momentum dan tumbukan', 'Usaha, energi, dan kekekalan di luar contoh proyektil', 'Gravitasi sebagai gaya dan gerak orbit'], experiments: [
      { title: 'Gaya, massa, dan percepatan', summary: 'Ubah gaya resultan dan massa kereta untuk menyelidiki hukum kedua Newton.', path: '/mechanics/newtonian' },
      { title: 'Peluncur proyektil', summary: 'Luncurkan bola di Bumi, Bulan, Mars, atau Jupiter, dengan atau tanpa hambatan udara, dan amati dari tanah atau kereta bergerak.', path: '/mechanics/projectile' },
    ] },
    { number: 4, title: 'Relativitas khusus', audience: 'Sarjana', coverage: [], plannedTopics: ['Penjumlahan kecepatan dan momentum relativistik', 'Hubungan yang lebih jelas antara pengukuran kerangka inersial dan bukti eksperimen'], experiments: [
      { title: 'B · Jam berbeda, waktu berlalu berbeda', summary: 'Pesawat ruang angkasa melintasi Bumi. Bandingkan jam mereka pada diagram ruang-waktu dari kedua sudut pandang.', path: '/relativity/moving-clocks' },
      { title: 'E · Ruang dan waktu versus ruang-waktu', summary: 'Bandingkan prediksi Galilea, ruang + waktu (Lorentz), dan ruang-waktu dengan hasil eksperimen.', path: '/relativity/two-perspectives' },
      { title: 'F · Kontraksi panjang', summary: 'Ukur panjang pesawat yang bergerak dengan mencatat kedua ujung pada waktu yang sama. Bandingkan panjang terukur dengan panjang wajarnya.', path: '/relativity/length-contraction' },
    ] },
    { number: 5, title: 'Relativitas umum', audience: 'Sarjana tingkat lanjut', coverage: [], plannedTopics: ['Gerak geodesik dan jatuh bebas', 'Persamaan medan Einstein dan peran energi-momentum', 'Penghubung yang cermat dari prinsip ekuivalensi menuju ruang-waktu melengkung', 'Di luar kondisi Schwarzschild yang statis dan simetris bola'], experiments: [
      { title: 'C · Gravitasi dan laju jam', summary: 'Dua jam pada ketinggian berbeda, dari Bumi hingga lubang hitam, dan alasan GPS memerlukan relativitas.', path: '/gravity/clock-rates' },
      { title: 'G · Laboratorium Gerak Geodesik', summary: 'Bandingkan orbit Newton dengan lintasan jatuh bebas dalam ruang-waktu Schwarzschild dan selidiki presesi periapsis.', path: '/gravity/geodesic-motion' },
    ] },
    { number: 6, title: 'Kosmologi', audience: 'Sarjana tingkat lanjut', coverage: [], plannedTopics: ['Bukti observasi dan inferensi parameter dalam kosmologi modern', 'Ukuran jarak kosmik dan horizon', 'Pembahasan lebih mendalam tentang alam semesta awal dan inflasi', 'Status dan batas ekstrapolasi kosmologi klasik menuju singularitas awal'], experiments: [
      { title: 'Ruang yang berevolusi', summary: 'Jalankan model alam semesta maju dan mundur: hukum Hubble, pergeseran merah, energi gelap, dan batas model.', path: '/cosmology/evolving-space' },
    ] },
  ],
  ja: [
    { number: 1, title: '空間を理解する', audience: '高校', coverage: [], plannedTopics: ['2次元座標幾何と変換のより詳しい学習', '現在のベクトル例を超えた空間測定と幾何'], experiments: [
      { title: 'A · 空間と時間', summary: '物体を軌道上で動かしてから停止させます。時間も止まるでしょうか？', path: '/space/space-vs-time' },
      { title: '3次元の変位', summary: '3次元空間で物体を動かし、変位を測定して、座標の変更が何をもたらすかを調べます。', path: '/space/displacement-3d' },
    ] },
    { number: 2, title: '時間を理解する', audience: '高校', coverage: [], plannedTopics: ['他の物理時計の仕組みと比較', '時間測定と不確かさのより広い考察'], experiments: [
      { title: '振り子時計', summary: '振り子の周期を測り、時計を月へ持っていき、時計が本当に測っているものを考えます。', path: '/time/pendulum' },
    ] },
    { number: 3, title: '古典力学', audience: '高校 / 学部', coverage: [], plannedTopics: ['複数の力を扱う力の図', '円運動', '運動量と衝突', '投射運動以外の仕事・エネルギー・保存則', '力としての重力と軌道運動'], experiments: [
      { title: '力・質量・加速度', summary: '合力と台車の質量を変えて、ニュートンの運動方程式を調べます。', path: '/mechanics/newtonian' },
      { title: '投射装置', summary: '地球、月、火星、木星で空気抵抗の有無を切り替えてボールを発射し、地上や移動する列車から観察します。', path: '/mechanics/projectile' },
    ] },
    { number: 4, title: '特殊相対性理論', audience: '学部', coverage: [], plannedTopics: ['速度の合成と相対論的運動量', '慣性系での測定と実験的証拠の明確な関連付け'], experiments: [
      { title: 'B · 異なる時計、異なる経過時間', summary: '宇宙船が地球のそばを通過します。時空図を使い、両方の視点から時計を比較します。', path: '/relativity/moving-clocks' },
      { title: 'E · 空間と時間、それとも時空', summary: 'ガリレイ変換、空間と時間（ローレンツ変換）、時空の予測を実験結果と比較します。', path: '/relativity/two-perspectives' },
      { title: 'F · 長さの収縮', summary: '両端を同じ時刻に記録して、運動する宇宙船の長さを測定します。測定された長さと固有長を比較します。', path: '/relativity/length-contraction' },
    ] },
    { number: 5, title: '一般相対性理論', audience: '学部上級', coverage: [], plannedTopics: ['測地線運動と自由落下', 'アインシュタイン方程式とエネルギー運動量の役割', '等価原理から曲がった時空への慎重な橋渡し', '静的・球対称なシュワルツシルト時空を超えて'], experiments: [
      { title: 'C · 重力と時計の進み方', summary: '地球からブラックホールまで、高さの異なる2つの時計とGPSに相対論が必要な理由を調べます。', path: '/gravity/clock-rates' },
      { title: 'G · 測地線運動実験室', summary: 'ニュートン力学の軌道とシュワルツシルト時空での自由落下経路を比較し、近日点移動を調べます。', path: '/gravity/geodesic-motion' },
    ] },
    { number: 6, title: '宇宙論', audience: '学部上級', coverage: [], plannedTopics: ['現代宇宙論における観測的証拠とパラメーター推定', '宇宙距離の尺度と地平線', '初期宇宙とインフレーションの詳しい考察', '初期特異点に向けた古典宇宙論の外挿の位置付けと限界'], experiments: [
      { title: '時間とともに変化する空間', summary: 'モデル宇宙を未来と過去へ進め、ハッブルの法則、赤方偏移、ダークエネルギー、モデルの限界を調べます。', path: '/cosmology/evolving-space' },
    ] },
  ],
}

export function getLocalizedModules(locale: Locale): readonly ModuleEntry[] {
  const modules = locale === 'en' ? MODULES : translated[locale]
  return modules.map((module) => {
    if (module.number !== 3) return module
    const forceLab = locale === 'id'
      ? { title: 'Laboratorium Gaya: diagram benda bebas', summary: 'Susun diagram benda bebas, uraikan gaya pada bidang datar atau miring, dan uji bagaimana gaya resultan menentukan percepatan.', path: '/mechanics/force-lab' }
      : locale === 'ja'
        ? { title: '力の実験室：自由物体図と複数の力', summary: '自由物体図を作成し、水平面や斜面に働く力を分解して、合力が加速度をどう決めるかを調べます。', path: '/mechanics/force-lab' }
        : { title: 'Force Lab: free-body diagrams and multiple forces', summary: 'Build a free-body diagram, resolve forces on a level surface or incline, and test how the net force determines acceleration.', path: '/mechanics/force-lab' }
    const momentum = locale === 'id'
      ? { title: 'Momentum dan tumbukan', summary: 'Prediksikan gerak dua kereta setelah bertumbukan; bandingkan tumbukan lenting dan tidak lenting, kekekalan momentum, serta perubahan energi kinetik.', path: '/mechanics/momentum-collisions' }
      : locale === 'ja'
        ? { title: '運動量と衝突', summary: '衝突後の2台の台車の運動を予測し、弾性衝突と非弾性衝突、運動量保存、運動エネルギーの変化を比較します。', path: '/mechanics/momentum-collisions' }
        : { title: 'Momentum and collisions', summary: 'Predict how two carts move after colliding; compare elastic and inelastic outcomes, momentum conservation and kinetic-energy changes.', path: '/mechanics/momentum-collisions' }
    const experiments = module.experiments.some((experiment) => experiment.path === '/mechanics/momentum-collisions')
      ? module.experiments
      : module.experiments.some((experiment) => experiment.path === '/mechanics/force-lab')
        ? module.experiments.flatMap((experiment) => experiment.path === '/mechanics/force-lab' ? [experiment, momentum] : [experiment])
        : module.experiments.flatMap((experiment) => experiment.path === '/mechanics/newtonian' ? [experiment, forceLab, momentum] : [experiment])
    return {
      ...module,
      plannedTopics: module.plannedTopics.filter((topic) => topic !== 'Diagram benda bebas dengan beberapa gaya' && topic !== '複数の力を扱う力の図' && topic !== 'Momentum dan tumbukan' && topic !== '運動量と衝突'),
      experiments,
    }
  })
}
