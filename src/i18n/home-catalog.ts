import { MODULES, type ModuleEntry } from '@/modules'
import type { Locale } from './locales'

/**
 * Translated catalogue copy. The structure (which modules, which experiments,
 * in which order) always comes from MODULES; translations are looked up by
 * module number and experiment path, so a new experiment cannot be silently
 * missing or out of date in another language. home-catalog.test.ts checks
 * that every module and experiment has a translation.
 */
interface ModuleCopy {
  readonly title: string
  readonly role: string
  /** Same order as the English planned topics. */
  readonly plannedTopics: readonly string[]
}
interface ExperimentCopy {
  readonly title: string
  readonly summary: string
}
interface CatalogueCopy {
  readonly modules: Record<number, ModuleCopy>
  readonly experiments: Record<string, ExperimentCopy>
}

const copy: Record<Exclude<Locale, 'en'>, CatalogueCopy> = {
  id: {
    modules: {
      1: { title: 'Memahami ruang', role: 'Di mana benda berada: posisi, jarak, dan perpindahan, serta mana yang bergantung pada pilihan koordinat Anda.', plannedTopics: ['Geometri koordinat 2D dan transformasi secara lebih mendalam', 'Pengukuran dan geometri ruang di luar contoh vektor saat ini'] },
      2: { title: 'Memahami waktu', role: 'Cara waktu diukur: setiap jam adalah proses fisika yang berulang, dan ketepatannya bergantung pada fisika di baliknya.', plannedTopics: ['Mekanisme jam fisik lainnya dan perbandingannya', 'Pembahasan lebih luas tentang pengukuran waktu dan ketidakpastian'] },
      3: { title: 'Memahami gerak', role: 'Bagaimana gerak dalam ruang berubah terhadap waktu, dan mengapa: gaya, momentum, dan kerangka acuan. Gambaran Newton inilah yang kelak direvisi oleh relativitas.', plannedTopics: [] },
      4: { title: 'Relativitas khusus', role: 'Mendekati kecepatan cahaya, pengukuran waktu dan panjang bergantung pada pengamat, dan ruang serta waktu menyatu menjadi ruang-waktu.', plannedTopics: ['Penjumlahan kecepatan dan momentum relativistik', 'Hubungan yang lebih jelas antara pengukuran kerangka inersial dan bukti eksperimen'] },
      5: { title: 'Relativitas umum', role: 'Gravitasi sebagai geometri ruang-waktu: jam pada ketinggian berbeda berjalan dengan laju berbeda, dan jatuh bebas mengikuti lintasan yang paling lurus.', plannedTopics: ['Persamaan medan Einstein dan peran energi-momentum', 'Penghubung yang cermat dari prinsip ekuivalensi menuju ruang-waktu melengkung', 'Di luar kondisi Schwarzschild yang statis dan simetris bola'] },
      6: { title: 'Kosmologi', role: 'Ruang dan waktu pada skala terbesar: bagaimana pengembangan alam semesta berevolusi, dan di mana model kita tidak lagi dapat diandalkan.', plannedTopics: ['Bukti observasi dan inferensi parameter dalam kosmologi modern', 'Ukuran jarak kosmik dan horizon', 'Pembahasan lebih mendalam tentang alam semesta awal dan inflasi', 'Status dan batas ekstrapolasi kosmologi klasik menuju singularitas awal'] },
    },
    experiments: {
      '/space/space-vs-time': { title: 'Ruang versus waktu', summary: 'Gerakkan benda di sepanjang lintasan, lalu hentikan. Apakah waktu juga berhenti?' },
      '/space/displacement-3d': { title: 'Perpindahan dalam 3D', summary: 'Gerakkan benda dalam ruang 3D, ukur perpindahannya, dan amati dampak perubahan koordinat.' },
      '/time/pendulum': { title: 'Jam pendulum', summary: 'Ukur periode pendulum, bawa jam pendulum ke Bulan, dan tanyakan apa yang sebenarnya diukur oleh jam.' },
      '/mechanics/newtonian': { title: 'Gaya, massa, dan percepatan', summary: 'Ubah gaya resultan dan massa kereta untuk menyelidiki hukum kedua Newton.' },
      '/mechanics/force-lab': { title: 'Laboratorium Gaya: diagram benda bebas dan beberapa gaya', summary: 'Susun diagram benda bebas, uraikan gaya pada bidang datar atau miring, dan uji bagaimana gaya resultan menentukan percepatan.' },
      '/mechanics/mass-spring': { title: 'Pegas–massa: hukum Hooke dan energi', summary: 'Regangkan pegas, lepaskan massa, dan uji apa yang memengaruhi periode; amati pertukaran energi potensial elastis dan kinetik.' },
      '/mechanics/inclined-plane': { title: 'Energi pada bidang miring', summary: 'Lepaskan balok pada bidang miring lurus; lihat bagaimana PE gravitasi menjadi KE, dan bagaimana gesekan menghilangkan energi mekanik.' },
      '/mechanics/momentum-collisions': { title: 'Momentum dan tumbukan', summary: 'Prediksikan gerak dua kereta setelah bertumbukan; bandingkan tumbukan lenting dan tidak lenting, kekekalan momentum, serta perubahan energi kinetik.' },
      '/mechanics/circular-orbits': { title: 'Gerak melingkar dan orbit', summary: 'Luncurkan satelit ke samping: temukan kelajuan untuk orbit lingkaran, lihat apa yang harus diberikan gravitasi, lalu dorong menjadi elips atau lepas sama sekali.' },
      '/mechanics/projectile': { title: 'Peluncur proyektil', summary: 'Luncurkan bola di Bumi, Bulan, Mars, atau Jupiter, dengan atau tanpa hambatan udara, dan amati dari tanah atau kereta bergerak.' },
      '/relativity/moving-clocks': { title: 'Jam berbeda, waktu berlalu berbeda', summary: 'Pesawat ruang angkasa melintasi Bumi. Bandingkan jam mereka pada diagram ruang-waktu dari kedua sudut pandang.' },
      '/relativity/two-perspectives': { title: 'Ruang dan waktu versus ruang-waktu', summary: 'Dua perspektif: bandingkan prediksi Galilea, ruang + waktu (Lorentz), dan ruang-waktu dengan hasil eksperimen.' },
      '/relativity/length-contraction': { title: 'Kontraksi panjang', summary: 'Ukur panjang pesawat yang bergerak dengan mencatat kedua ujung pada waktu yang sama. Bandingkan panjang terukur dengan panjang wajarnya.' },
      '/gravity/clock-rates': { title: 'Gravitasi dan laju jam', summary: 'Dua jam pada ketinggian berbeda, dari Bumi hingga lubang hitam, dan alasan GPS memerlukan relativitas.' },
      '/gravity/geodesic-motion': { title: 'Laboratorium Gerak Geodesik', summary: 'Bandingkan orbit Newton dengan lintasan jatuh bebas dalam ruang-waktu Schwarzschild dan selidiki presesi periapsis.' },
      '/cosmology/evolving-space': { title: 'Ruang yang berevolusi', summary: 'Jalankan model alam semesta maju dan mundur: hukum Hubble, pergeseran merah, energi gelap, dan batas model.' },
    },
  },
  ja: {
    modules: {
      1: { title: '空間を理解する', role: '物はどこにあるか：位置、距離、変位、そしてそのうちどれが座標の選び方に左右されるか。', plannedTopics: ['2次元座標幾何と変換のより詳しい学習', '現在のベクトル例を超えた空間測定と幾何'] },
      2: { title: '時間を理解する', role: '時間はどう測るのか：どの時計も繰り返す物理過程であり、その精度は背後にある物理で決まります。', plannedTopics: ['他の物理時計の仕組みと比較', '時間測定と不確かさのより広い考察'] },
      3: { title: '運動を理解する', role: '空間内の運動が時間とともにどう変わり、それはなぜか：力、運動量、基準系。このニュートン的な描像を、のちに相対性理論が修正します。', plannedTopics: [] },
      4: { title: '特殊相対性理論', role: '光速に近づくと、時間と長さの測定は観測者によって変わり、空間と時間は時空へと結び付きます。', plannedTopics: ['速度の合成と相対論的運動量', '慣性系での測定と実験的証拠の明確な関連付け'] },
      5: { title: '一般相対性理論', role: '時空の幾何としての重力：高さの異なる時計は異なる速さで進み、自由落下は最もまっすぐな経路をたどります。', plannedTopics: ['アインシュタイン方程式とエネルギー運動量の役割', '等価原理から曲がった時空への慎重な橋渡し', '静的・球対称なシュワルツシルト時空を超えて'] },
      6: { title: '宇宙論', role: '最大のスケールでの空間と時間：宇宙そのものの膨張がどう進むのか、そしてモデルがどこで信頼できなくなるのか。', plannedTopics: ['現代宇宙論における観測的証拠とパラメーター推定', '宇宙距離の尺度と地平線', '初期宇宙とインフレーションの詳しい考察', '初期特異点に向けた古典宇宙論の外挿の位置付けと限界'] },
    },
    experiments: {
      '/space/space-vs-time': { title: '空間と時間', summary: '物体を軌道上で動かしてから停止させます。時間も止まるでしょうか？' },
      '/space/displacement-3d': { title: '3次元の変位', summary: '3次元空間で物体を動かし、変位を測定して、座標の変更が何をもたらすかを調べます。' },
      '/time/pendulum': { title: '振り子時計', summary: '振り子の周期を測り、時計を月へ持っていき、時計が本当に測っているものを考えます。' },
      '/mechanics/newtonian': { title: '力・質量・加速度', summary: '合力と台車の質量を変えて、ニュートンの運動方程式を調べます。' },
      '/mechanics/force-lab': { title: '力の実験室：自由物体図と複数の力', summary: '自由物体図を作成し、水平面や斜面に働く力を分解して、合力が加速度をどう決めるかを調べます。' },
      '/mechanics/mass-spring': { title: 'ばね–質量：フックの法則とエネルギー', summary: 'ばねを伸ばして質量を離し、周期が何に依存するかを調べ、弾性位置エネルギーと運動エネルギーのやり取りを観察します。' },
      '/mechanics/inclined-plane': { title: '斜面でのエネルギー', summary: 'まっすぐな斜面で物体を離し、重力の位置エネルギーが運動エネルギーになる様子と、摩擦が力学的エネルギーを減らす様子を調べます。' },
      '/mechanics/momentum-collisions': { title: '運動量と衝突', summary: '衝突後の2台の台車の運動を予測し、弾性衝突と非弾性衝突、運動量保存、運動エネルギーの変化を比較します。' },
      '/mechanics/circular-orbits': { title: '円運動と軌道', summary: '人工衛星を横向きに打ち出し、円軌道になる速さを見つけ、重力が何を与える必要があるかを確かめ、楕円軌道や脱出軌道に変えてみます。' },
      '/mechanics/projectile': { title: '投射装置', summary: '地球、月、火星、木星で空気抵抗の有無を切り替えてボールを発射し、地上や移動する列車から観察します。' },
      '/relativity/moving-clocks': { title: '異なる時計、異なる経過時間', summary: '宇宙船が地球のそばを通過します。時空図を使い、両方の視点から時計を比較します。' },
      '/relativity/two-perspectives': { title: '空間と時間、それとも時空', summary: '二つの視点：ガリレイ変換、空間と時間（ローレンツ変換）、時空の予測を実験結果と比較します。' },
      '/relativity/length-contraction': { title: '長さの収縮', summary: '両端を同じ時刻に記録して、運動する宇宙船の長さを測定します。測定された長さと固有長を比較します。' },
      '/gravity/clock-rates': { title: '重力と時計の進み方', summary: '地球からブラックホールまで、高さの異なる2つの時計とGPSに相対論が必要な理由を調べます。' },
      '/gravity/geodesic-motion': { title: '測地線運動実験室', summary: 'ニュートン力学の軌道とシュワルツシルト時空での自由落下経路を比較し、近日点移動を調べます。' },
      '/cosmology/evolving-space': { title: '時間とともに変化する空間', summary: 'モデル宇宙を未来と過去へ進め、ハッブルの法則、赤方偏移、ダークエネルギー、モデルの限界を調べます。' },
    },
  },
}

/** The catalogue in the given language, always with the structure of MODULES. */
export function getLocalizedModules(locale: Locale): readonly ModuleEntry[] {
  if (locale === 'en') return MODULES
  const catalogue = copy[locale]
  return MODULES.map((module) => {
    const moduleCopy = catalogue.modules[module.number]
    return {
      ...module,
      title: moduleCopy?.title ?? module.title,
      role: moduleCopy?.role ?? module.role,
      // Coverage lists are English-only curriculum notes; they are not shown in the app.
      coverage: [],
      plannedTopics: moduleCopy && moduleCopy.plannedTopics.length === module.plannedTopics.length ? moduleCopy.plannedTopics : module.plannedTopics,
      experiments: module.experiments.map((experiment) => {
        const experimentCopy = experiment.path ? catalogue.experiments[experiment.path] : undefined
        return experimentCopy ? { ...experiment, ...experimentCopy } : experiment
      }),
    }
  })
}

/** For tests: the raw translation tables. */
export const CATALOGUE_TRANSLATIONS = copy
