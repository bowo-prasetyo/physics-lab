import type { Locale } from '@/i18n/locales'
import type { PracticeQuestion } from './learning-content'

export interface CrossExperimentChallenge {
  readonly id: string
  readonly module: number
  readonly anchorPath: string
  readonly title: string
  readonly intro: string
  readonly prerequisiteLabel: string
  readonly prerequisites: readonly { readonly path: string; readonly title: string }[]
  readonly question: PracticeQuestion
}

interface ChallengeCopy {
  readonly title: string
  readonly intro: string
  readonly prerequisiteLabel: string
  readonly prerequisiteTitles: readonly string[]
  readonly prompt: string
  readonly options: Readonly<Record<string, string>>
  readonly hint: string
  readonly explanation: string
}

interface ChallengeSource {
  readonly id: string
  readonly module: number
  readonly paths: readonly string[]
  readonly questionId: string
  readonly answer: string
  readonly minLevel: 'beginner' | 'intermediate' | 'advanced'
}

const SOURCES: readonly ChallengeSource[] = [
  {
    id: 'force-projectile',
    module: 3,
    paths: ['/mechanics/force-lab', '/mechanics/projectile'],
    questionId: 'force-projectile-synthesis',
    answer: 'b',
    minLevel: 'intermediate',
  },
  {
    id: 'momentum-force',
    module: 3,
    paths: ['/mechanics/newtonian', '/mechanics/momentum-collisions'],
    questionId: 'momentum-force-synthesis',
    answer: 'c',
    minLevel: 'intermediate',
  },
  {
    id: 'moving-gravity-clocks',
    module: 5,
    paths: ['/relativity/moving-clocks', '/gravity/clock-rates'],
    questionId: 'moving-gravity-clocks-synthesis',
    answer: 'a',
    minLevel: 'advanced',
  },
]

const COPY: Record<Locale, Readonly<Record<string, ChallengeCopy>>> = {
  en: {
    'force-projectile': {
      title: 'A force changes a flight',
      intro: 'Connect the force-component model with the projectile experiment. Think about what happens when the usual idealisation no longer holds.',
      prerequisiteLabel: 'Explore both experiments first',
      prerequisiteTitles: ['Force Lab', 'Projectile launcher'],
      prompt: 'A ball is already in flight. A steady horizontal net force now acts on it, while gravity remains the only vertical force. Compared with an ideal projectile, what changes?',
      options: {
        a: 'Its vertical acceleration becomes zero.',
        b: 'Its horizontal velocity is no longer constant, so the path is not the usual ideal parabola.',
        c: 'Its mass increases because an extra force acts.',
        d: 'Its flight time must become zero.',
      },
      hint: 'Resolve the net force into horizontal and vertical components. Which component changes the horizontal acceleration?',
      explanation: 'The horizontal net force produces horizontal acceleration, so horizontal velocity changes. Gravity still gives the same downward acceleration in this idealised setup. The standard projectile parabola assumes zero horizontal net force.',
    },
    'momentum-force': {
      title: 'The same impulse, different carts',
      intro: 'Bring Newton’s second law together with momentum and collisions. Compare the change in momentum with the change in velocity.',
      prerequisiteLabel: 'Explore both experiments first',
      prerequisiteTitles: ['Force, mass and acceleration', 'Momentum and collisions'],
      prompt: 'Two carts start at rest. The same net impulse is delivered to each cart, but cart B has twice the mass of cart A. Which statement is correct?',
      options: {
        a: 'Both carts gain the same speed because the impulse is the same.',
        b: 'Cart B gains twice the speed because it has twice the mass.',
        c: 'Both gain the same momentum change, but cart A gains twice the speed change.',
        d: 'Neither cart changes momentum unless the collision is elastic.',
      },
      hint: 'Use impulse = change in momentum, then compare velocity change using momentum = mass × velocity.',
      explanation: 'Equal impulse gives equal change in momentum. Since the carts start at rest, the same final momentum change means the cart with half the mass has twice the speed. Elasticity is not required for the impulse–momentum relation.',
    },
    'moving-gravity-clocks': {
      title: 'Two effects on one satellite clock',
      intro: 'Combine the moving-clock result from special relativity with gravitational clock rates. A real satellite experiences both effects at once.',
      prerequisiteLabel: 'Explore both experiments first',
      prerequisiteTitles: ['Different clocks, different elapsed times', 'Gravity and clock rates'],
      prompt: 'A satellite clock is both moving relative to an Earth clock and higher in Earth’s gravitational field. How should you predict their net rate difference?',
      options: {
        a: 'Calculate both contributions with their signs and add them; one effect can speed the clock while the other slows it.',
        b: 'Use only the motion effect because gravity does not affect clocks.',
        c: 'Use only the gravitational effect because motion cannot affect a clock.',
        d: 'The two effects always cancel exactly, whatever the orbit.',
      },
      hint: 'Recall which way each effect shifts the satellite clock, then ask whether their sizes must be equal.',
      explanation: 'Motion produces a kinematic time-dilation contribution that makes the moving clock run slower, while weaker gravity at higher altitude makes it run faster. The net result is the signed sum of both contributions; neither can be ignored and they do not always cancel.',
    },
  },
  id: {
    'force-projectile': {
      title: 'Gaya mengubah lintasan',
      intro: 'Hubungkan model komponen gaya dengan eksperimen gerak peluru. Pikirkan apa yang terjadi ketika asumsi ideal yang biasa digunakan tidak lagi berlaku.',
      prerequisiteLabel: 'Jelajahi kedua eksperimen terlebih dahulu',
      prerequisiteTitles: ['Laboratorium Gaya', 'Peluncur Gerak Peluru'],
      prompt: 'Sebuah bola sedang melayang. Kini ada gaya resultan horizontal yang tetap bekerja padanya, sedangkan gravitasi tetap menjadi satu-satunya gaya vertikal. Apa yang berubah dibandingkan gerak peluru ideal?',
      options: {
        a: 'Percepatan vertikalnya menjadi nol.',
        b: 'Kecepatan horizontalnya tidak lagi konstan, sehingga lintasannya bukan parabola ideal seperti biasa.',
        c: 'Massanya bertambah karena ada gaya tambahan.',
        d: 'Waktu terbangnya pasti menjadi nol.',
      },
      hint: 'Uraikan gaya resultan menjadi komponen horizontal dan vertikal. Komponen mana yang mengubah percepatan horizontal?',
      explanation: 'Gaya resultan horizontal menghasilkan percepatan horizontal, sehingga kecepatan horizontal berubah. Dalam model ideal ini, gravitasi tetap menghasilkan percepatan ke bawah yang sama. Parabola gerak peluru standar mengasumsikan tidak ada gaya resultan horizontal.',
    },
    'momentum-force': {
      title: 'Impuls sama, kereta berbeda',
      intro: 'Gabungkan hukum II Newton dengan momentum dan tumbukan. Bandingkan perubahan momentum dengan perubahan kecepatan.',
      prerequisiteLabel: 'Jelajahi kedua eksperimen terlebih dahulu',
      prerequisiteTitles: ['Gaya, massa, dan percepatan', 'Momentum dan tumbukan'],
      prompt: 'Dua kereta mula-mula diam. Impuls resultan yang sama diberikan kepada masing-masing kereta, tetapi massa kereta B dua kali massa kereta A. Pernyataan mana yang benar?',
      options: {
        a: 'Kedua kereta memperoleh kelajuan yang sama karena impulsnya sama.',
        b: 'Kereta B memperoleh perubahan kelajuan dua kali lebih besar karena massanya dua kali lipat.',
        c: 'Keduanya mengalami perubahan momentum yang sama, tetapi perubahan kelajuan kereta A dua kali lebih besar.',
        d: 'Momentum kedua kereta tidak berubah kecuali tumbukannya lenting.',
      },
      hint: 'Gunakan impuls = perubahan momentum, lalu bandingkan perubahan kecepatan dengan momentum = massa × kecepatan.',
      explanation: 'Impuls yang sama menghasilkan perubahan momentum yang sama. Karena kedua kereta mula-mula diam, momentum akhir yang sama berarti kereta dengan massa setengahnya memiliki kelajuan dua kali lebih besar. Hubungan impuls–momentum tidak mensyaratkan tumbukan lenting.',
    },
    'moving-gravity-clocks': {
      title: 'Dua pengaruh pada satu jam satelit',
      intro: 'Gabungkan hasil jam bergerak dari relativitas khusus dengan laju jam gravitasi. Satelit sungguhan mengalami kedua pengaruh sekaligus.',
      prerequisiteLabel: 'Jelajahi kedua eksperimen terlebih dahulu',
      prerequisiteTitles: ['Jam berbeda, waktu berlalu berbeda', 'Gravitasi dan laju jam'],
      prompt: 'Jam pada satelit bergerak relatif terhadap jam di Bumi dan berada lebih tinggi dalam medan gravitasi Bumi. Bagaimana cara memprediksi perbedaan laju totalnya?',
      options: {
        a: 'Hitung kedua kontribusi beserta tandanya, lalu jumlahkan; satu pengaruh dapat mempercepat jam sementara yang lain memperlambatnya.',
        b: 'Gunakan hanya pengaruh gerak karena gravitasi tidak memengaruhi jam.',
        c: 'Gunakan hanya pengaruh gravitasi karena gerak tidak dapat memengaruhi jam.',
        d: 'Kedua pengaruh selalu saling meniadakan secara tepat, apa pun orbitnya.',
      },
      hint: 'Ingat arah perubahan laju jam akibat masing-masing pengaruh, lalu tanyakan apakah besar keduanya harus sama.',
      explanation: 'Gerak menghasilkan kontribusi dilatasi waktu kinematik yang memperlambat jam bergerak, sedangkan gravitasi yang lebih lemah pada ketinggian lebih besar membuat jam berjalan lebih cepat. Hasil total adalah jumlah kedua kontribusi beserta tandanya; keduanya tidak boleh diabaikan dan tidak selalu saling meniadakan.',
    },
  },
  ja: {
    'force-projectile': {
      title: '力が飛行経路を変える',
      intro: '力の成分のモデルと projectile（放物運動）の実験を結び付けます。通常の理想化が成り立たなくなったときに何が起こるか考えましょう。',
      prerequisiteLabel: '先に両方の実験を探究してください',
      prerequisiteTitles: ['力の実験室', '放物運動ランチャー'],
      prompt: 'ボールがすでに飛行中です。重力が鉛直方向に働く唯一の力である一方、新たに一定の水平方向の合力が働きます。理想的な放物運動と比べて何が変わりますか。',
      options: {
        a: '鉛直加速度がゼロになる。',
        b: '水平方向の速度が一定でなくなり、通常の理想的な放物線軌道ではなくなる。',
        c: '追加の力が働くため質量が増える。',
        d: '飛行時間が必ずゼロになる。',
      },
      hint: '合力を水平方向と鉛直方向の成分に分けます。どちらの成分が水平方向の加速度を変えますか。',
      explanation: '水平方向の合力は水平方向の加速度を生み、速度を変化させます。この理想化では、重力による下向き加速度は変わりません。標準的な放物運動の放物線は、水平方向の合力がゼロであることを前提としています。',
    },
    'momentum-force': {
      title: '同じ力積、異なる台車',
      intro: 'ニュートンの第2法則を運動量と衝突に結び付けます。運動量の変化と速度の変化を比べましょう。',
      prerequisiteLabel: '先に両方の実験を探究してください',
      prerequisiteTitles: ['力・質量・加速度', '運動量と衝突'],
      prompt: '2台の台車は静止しています。それぞれに同じ合力積を与えますが、台車Bの質量は台車Aの2倍です。正しい説明はどれですか。',
      options: {
        a: '力積が同じなので、両方の台車は同じ速さを得る。',
        b: '台車Bは質量が2倍なので、速度変化も2倍になる。',
        c: '運動量の変化は同じだが、台車Aの速度変化は2倍になる。',
        d: '衝突が弾性衝突でなければ、どちらの台車の運動量も変化しない。',
      },
      hint: '力積 = 運動量の変化を使い、その後、運動量 = 質量 × 速度から速度変化を比べます。',
      explanation: '同じ力積は同じ運動量変化を与えます。両方とも静止から始まるので、同じ最終運動量なら質量が半分の台車は速度が2倍になります。力積と運動量の関係に弾性衝突は必要ありません。',
    },
    'moving-gravity-clocks': {
      title: '衛星時計に働く2つの効果',
      intro: '特殊相対論の動く時計の結果と、重力による時計の進み方を組み合わせます。実際の衛星は両方の効果を同時に受けます。',
      prerequisiteLabel: '先に両方の実験を探究してください',
      prerequisiteTitles: ['異なる時計、異なる経過時間', '重力と時計の進み方'],
      prompt: '衛星の時計は地上の時計に対して運動し、地球の重力場ではより高い位置にあります。両者の正味の進み方の差をどう予測しますか。',
      options: {
        a: '両方の寄与を符号付きで計算して足します。一方は時計を速め、もう一方は遅らせることがあります。',
        b: '重力は時計に影響しないので、運動の効果だけを使う。',
        c: '運動は時計に影響しないので、重力の効果だけを使う。',
        d: '軌道が何であっても、2つの効果は必ず完全に打ち消し合う。',
      },
      hint: 'それぞれの効果が時計を速めるか遅らせるかを思い出し、その大きさが必ず等しいか考えましょう。',
      explanation: '運動による運動学的な時間の遅れは衛星時計を遅くし、高度が高く重力が弱いことは時計を速くします。正味の差は符号を含めた2つの寄与の和です。どちらも無視できず、常に打ち消し合うわけではありません。',
    },
  },
}


export interface CrossExperimentHeading {
  readonly title: string
  readonly intro: string
  readonly locked: string
}

const HEADING: Record<Locale, CrossExperimentHeading> = {
  en: {
    title: 'Connect ideas across experiments',
    intro: 'These challenges ask you to use evidence and models from more than one experiment. They become available after you have explored every linked experiment.',
    locked: 'Complete both linked experiments to unlock this synthesis question.',
  },
  id: {
    title: 'Hubungkan gagasan antar-eksperimen',
    intro: 'Tantangan ini mengajak Anda menggunakan bukti dan model dari lebih dari satu eksperimen. Tantangan terbuka setelah Anda menjelajahi semua eksperimen yang terkait.',
    locked: 'Selesaikan kedua eksperimen yang terhubung untuk membuka soal sintesis ini.',
  },
  ja: {
    title: '複数の実験をつなげて考える',
    intro: '複数の実験で得た証拠とモデルを組み合わせる課題です。関連するすべての実験を探究すると解けるようになります。',
    locked: '関連する2つの実験を完了すると、この統合問題が解けるようになります。',
  },
}

export function getCrossExperimentHeading(locale: Locale): CrossExperimentHeading {
  return HEADING[locale]
}

export function getCrossExperimentChallenges(locale: Locale): CrossExperimentChallenge[] {
  return SOURCES.map((source) => {
    const copy = COPY[locale][source.id]
    if (!copy) throw new Error(`Missing ${locale} cross-experiment copy for ${source.id}`)
    const question: PracticeQuestion = {
      id: source.questionId,
      experiment: source.paths[0]!,
      minLevel: source.minLevel,
      prompt: copy.prompt,
      options: Object.entries(copy.options).map(([id, label]) => ({ id, label })),
      answer: source.answer,
      hint: copy.hint,
      explanation: copy.explanation,
    }
    return {
      id: source.id,
      module: source.module,
      anchorPath: source.paths[source.paths.length - 1]!,
      title: copy.title,
      intro: copy.intro,
      prerequisiteLabel: copy.prerequisiteLabel,
      prerequisites: source.paths.map((path, index) => ({ path, title: copy.prerequisiteTitles[index]! })),
      question,
    }
  })
}
