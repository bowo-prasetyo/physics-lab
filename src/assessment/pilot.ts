export type AssessmentPhase = 'immediate' | 'delayed'
export type PilotExperimentId = 'force-lab' | 'length-contraction'
export type PilotLocale = 'en' | 'id' | 'ja'

export interface PilotOption { value: string; label: string }
export interface PilotQuestion { id: string; prompt: string; options: PilotOption[]; correct: string }
export interface PilotExperiment {
  id: PilotExperimentId
  title: string
  module: string
  route: string
  outcome: string
  pre: PilotQuestion[]
  post: PilotQuestion[]
  transfer: PilotQuestion
  explanationPrompt: string
}
export interface ParticipantResult {
  experimentId: PilotExperimentId
  phase: AssessmentPhase
  preCorrect: number
  postCorrect: number
  transferCorrect: number
  explanationScore: number
}
export interface ExperimentAggregate {
  immediateCount: number
  delayedCount: number
  preTotal: number
  postTotal: number
  delayedPostTotal: number
  transferTotal: number
  delayedTransferTotal: number
  immediateRubricCounts: [number, number, number, number]
  delayedRubricCounts: [number, number, number, number]
}
export type PilotCohort = Record<PilotExperimentId, ExperimentAggregate>

const makeQuestion = (id: string, prompt: string, labels: [string, string, string, string], correct: string): PilotQuestion => ({
  id, prompt, options: labels.map((label, index) => ({ value: String(index), label })), correct,
})

const english: PilotExperiment[] = [
  {
    id: 'force-lab', title: 'Force Lab: free-body diagrams', module: 'Module 3 · Classical mechanics',
    route: '/mechanics/force-lab',
    outcome: 'Relate the vector sum of forces to an object’s acceleration, and distinguish static from kinetic friction.',
    pre: [
      makeQuestion('force-pre-1', 'A box rests on a level floor. You push it gently, but it does not move. Which statement best describes the horizontal forces on the box?', [
        'The push is balanced by static friction.', 'There is no horizontal force on the box.',
        'Kinetic friction is larger than the push.', 'The box accelerates, but the floor holds it still.',
      ], '0'),
      makeQuestion('force-pre-2', 'Two identical carts experience the same non-zero net force. Cart B has twice the mass of cart A. How do their acceleration magnitudes compare?', [
        'Cart B accelerates at half the rate of cart A.', 'Both carts have the same acceleration.',
        'Cart B accelerates twice as fast.', 'Cart B has zero acceleration.',
      ], '0'),
    ],
    post: [
      makeQuestion('force-post-1', 'A box remains at rest while a horizontal push is increased gradually. What happens to static friction before the box starts sliding?', [
        'It adjusts to balance the push, up to its maximum value.', 'It stays at its maximum value from the first moment.',
        'It is always equal to the kinetic friction force.', 'It points in the same direction as the push.',
      ], '0'),
      makeQuestion('force-post-2', 'A constant net force acts on a cart. Its mass is doubled while the net force is unchanged. What happens to its acceleration?', [
        'It becomes half as large.', 'It doubles.', 'It remains unchanged.', 'It becomes four times as large.',
      ], '0'),
    ],
    transfer: makeQuestion('force-transfer', 'A loaded trolley and an empty trolley are pushed with the same constant net force on a smooth, level track. Which prediction follows from Newton’s second law?', [
      'The loaded trolley has the smaller acceleration.', 'The loaded trolley has the larger acceleration.',
      'Both have the same acceleration because the force is equal.', 'Neither trolley accelerates unless its speed is already changing.',
    ], '0'),
    explanationPrompt: 'Explain why the loaded trolley accelerates differently. Refer to the net force, mass, and the physical relationship connecting them.',
  },
  {
    id: 'length-contraction', title: 'Length Contraction Lab', module: 'Module 4 · Special relativity',
    route: '/relativity/length-contraction',
    outcome: 'Explain how a moving object’s measured length depends on the observer’s frame and on simultaneous endpoint measurements.',
    pre: [
      makeQuestion('length-pre-1', 'An ideal rod is at rest in its own frame. An observer measures it while it moves past at a constant speed. What length does that observer measure along the direction of motion?', [
        'A shorter length than the rod’s rest length.', 'The same length as the rod’s rest length.',
        'A longer length than the rod’s rest length.', 'A length that depends only on the rod’s mass.',
      ], '0'),
      makeQuestion('length-pre-2', 'To measure the length of a moving rod in one inertial frame, what must the observer do?', [
        'Record both endpoint positions at the same time in that frame.',
        'Measure the front first and the rear one second later.',
        'Use the rod’s rest-frame endpoint positions without transforming them.',
        'Photograph the rod and measure the image pixels.',
      ], '0'),
    ],
    post: [
      makeQuestion('length-post-1', 'A rod has proper length 10 m and moves at 0.6c relative to an observer. What length does that observer measure along the motion direction?', [
        '8 m', '6 m', '10 m', '12.5 m',
      ], '0'),
      makeQuestion('length-post-2', 'Two endpoint events are simultaneous in the Earth frame. How are those same events related in the rod’s rest frame when the rod moves relative to Earth?', [
        'They are generally not simultaneous.', 'They are simultaneous in every inertial frame.',
        'They occur at the same position in both frames.', 'Their time order is undefined in every frame.',
      ], '0'),
    ],
    transfer: makeQuestion('length-transfer', 'A second ideal spacecraft has a proper length of 20 m and passes Earth at 0.8c. What length does an Earth observer measure along its motion?', [
      '12 m', '16 m', '20 m', '25 m',
    ], '0'),
    explanationPrompt: 'Explain why the measured length differs from the proper length. Include the role of the observer’s frame and simultaneous endpoint measurements.',
  },
]

const translations: Record<Exclude<PilotLocale, 'en'>, Record<string, { prompt: string; options: [string, string, string, string] }>> = {
  id: {
    'force-pre-1': { prompt: 'Sebuah kotak diam di lantai datar. Anda mendorongnya perlahan, tetapi kotak tidak bergerak. Pernyataan mana yang paling tepat tentang gaya horizontal pada kotak?', options: ['Dorongan diimbangi oleh gaya gesek statis.', 'Tidak ada gaya horizontal pada kotak.', 'Gaya gesek kinetis lebih besar daripada dorongan.', 'Kotak mengalami percepatan, tetapi lantai menahannya.'] },
    'force-pre-2': { prompt: 'Dua kereta identik mengalami gaya netto tak nol yang sama. Massa kereta B dua kali massa kereta A. Bagaimana perbandingan besar percepatannya?', options: ['Percepatan B setengah percepatan A.', 'Kedua kereta memiliki percepatan yang sama.', 'Percepatan B dua kali lebih besar.', 'Kereta B tidak mengalami percepatan.'] },
    'force-post-1': { prompt: 'Sebuah kotak tetap diam saat dorongan horizontal ditingkatkan perlahan. Apa yang terjadi pada gaya gesek statis sebelum kotak mulai meluncur?', options: ['Gaya gesek menyesuaikan untuk mengimbangi dorongan hingga nilai maksimumnya.', 'Sejak awal gaya gesek selalu bernilai maksimum.', 'Gaya gesek selalu sama dengan gaya gesek kinetis.', 'Arahnya sama dengan arah dorongan.'] },
    'force-post-2': { prompt: 'Gaya netto konstan bekerja pada kereta. Massanya digandakan sementara gaya netto tetap. Apa yang terjadi pada percepatannya?', options: ['Menjadi setengahnya.', 'Menjadi dua kali lipat.', 'Tetap sama.', 'Menjadi empat kali lipat.'] },
    'force-transfer': { prompt: 'Troli bermuatan dan troli kosong didorong dengan gaya netto konstan yang sama di lintasan datar dan licin. Prediksi mana yang mengikuti hukum II Newton?', options: ['Troli bermuatan memiliki percepatan lebih kecil.', 'Troli bermuatan memiliki percepatan lebih besar.', 'Keduanya memiliki percepatan sama karena gayanya sama.', 'Keduanya tidak mengalami percepatan kecuali kecepatannya sudah berubah.'] },
    'length-pre-1': { prompt: 'Sebuah batang ideal diam dalam kerangkanya sendiri. Pengamat mengukurnya saat batang bergerak dengan kelajuan konstan. Berapa panjang yang diukur sepanjang arah gerak?', options: ['Lebih pendek daripada panjang diam batang.', 'Sama dengan panjang diam batang.', 'Lebih panjang daripada panjang diam batang.', 'Panjang yang hanya bergantung pada massa batang.'] },
    'length-pre-2': { prompt: 'Untuk mengukur panjang batang yang bergerak dalam satu kerangka inersial, apa yang harus dilakukan pengamat?', options: ['Mencatat posisi kedua ujung pada waktu yang sama dalam kerangka tersebut.', 'Mengukur ujung depan dahulu lalu ujung belakang satu detik kemudian.', 'Menggunakan posisi ujung dalam kerangka diam tanpa transformasi.', 'Memotret batang lalu mengukur piksel gambar.'] },
    'length-post-1': { prompt: 'Sebuah batang memiliki panjang proper 10 m dan bergerak dengan kelajuan 0,6c relatif terhadap pengamat. Berapa panjang yang diukur pengamat sepanjang arah gerak?', options: ['8 m', '6 m', '10 m', '12,5 m'] },
    'length-post-2': { prompt: 'Dua peristiwa pada ujung batang simultan dalam kerangka Bumi. Bagaimana hubungan waktu kedua peristiwa itu dalam kerangka diam batang saat batang bergerak relatif terhadap Bumi?', options: ['Secara umum, keduanya tidak simultan.', 'Keduanya simultan dalam setiap kerangka inersial.', 'Keduanya terjadi pada posisi yang sama dalam kedua kerangka.', 'Urutan waktunya tidak terdefinisi dalam semua kerangka.'] },
    'length-transfer': { prompt: 'Pesawat ruang angkasa ideal lain memiliki panjang proper 20 m dan melintas Bumi dengan kelajuan 0,8c. Berapa panjang yang diukur pengamat di Bumi sepanjang arah gerak?', options: ['12 m', '16 m', '20 m', '25 m'] },
  },
  ja: {
    'force-pre-1': { prompt: '箱が水平な床の上で静止しています。そっと押しても動きません。箱に働く水平方向の力について、最も適切な説明はどれですか？', options: ['押す力は静止摩擦力とつり合っている。', '箱には水平方向の力が働いていない。', '動摩擦力は押す力より大きい。', '箱は加速しているが、床が動きを止めている。'] },
    'force-pre-2': { prompt: '同じ正味の力（ゼロではない）が、同じ台車2台に働きます。台車Bの質量は台車Aの2倍です。加速度の大きさはどうなりますか？', options: ['Bの加速度はAの半分になる。', '両方の加速度は等しい。', 'Bの加速度は2倍になる。', 'Bの加速度はゼロになる。'] },
    'force-post-1': { prompt: '箱は静止したまま、水平に押す力を徐々に大きくします。箱が滑り始める前、静止摩擦力はどうなりますか？', options: ['最大値に達するまでは、押す力とつり合うように変化する。', '最初から常に最大値である。', '常に動摩擦力と等しい。', '押す力と同じ向きに働く。'] },
    'force-post-2': { prompt: '台車に一定の正味の力が働きます。正味の力を変えずに質量を2倍にすると、加速度はどうなりますか？', options: ['半分になる。', '2倍になる。', '変わらない。', '4倍になる。'] },
    'force-transfer': { prompt: '荷物を載せた台車と空の台車を、滑らかな水平面上で同じ一定の正味の力で押します。ニュートンの第2法則から導かれる予測はどれですか？', options: ['荷物を載せた台車の加速度は小さい。', '荷物を載せた台車の加速度は大きい。', '力が同じなので両方の加速度は等しい。', '速度がすでに変化していない限り、どちらも加速しない。'] },
    'length-pre-1': { prompt: '理想的な棒は自身の静止系で静止しています。一定速度で通過する棒を観測者が測定します。運動方向に沿って測る長さはどうなりますか？', options: ['棒の固有長より短い。', '棒の固有長と同じ。', '棒の固有長より長い。', '棒の質量だけで決まる長さ。'] },
    'length-pre-2': { prompt: 'ある慣性系で運動する棒の長さを測るには、観測者は何をする必要がありますか？', options: ['その慣性系で同時刻に両端の位置を記録する。', '先端を測り、1秒後に後端を測る。', '変換せずに棒の静止系の端点位置を使う。', '写真を撮って画像のピクセル数を測る。'] },
    'length-post-1': { prompt: '固有長10 mの棒が、観測者に対して0.6cで動いています。観測者が運動方向に測る長さはいくらですか？', options: ['8 m', '6 m', '10 m', '12.5 m'] },
    'length-post-2': { prompt: '地球系で同時に起きた棒の両端の事象は、地球に対して棒が動いているとき、棒の静止系ではどのようになりますか？', options: ['一般に同時ではない。', 'すべての慣性系で同時である。', '両方の系で同じ位置に起きる。', 'すべての系で時間順序が定義できない。'] },
    'length-transfer': { prompt: '別の理想的な宇宙船の固有長は20 mで、地球に対して0.8cで通過します。地球の観測者が運動方向に測る長さはいくらですか？', options: ['12 m', '16 m', '20 m', '25 m'] },
  },
}

const metadata: Record<PilotLocale, Record<PilotExperimentId, { title: string; module: string; outcome: string; explanationPrompt: string }>> = {
  en: {
    'force-lab': { title: english[0]!.title, module: english[0]!.module, outcome: english[0]!.outcome, explanationPrompt: english[0]!.explanationPrompt },
    'length-contraction': { title: english[1]!.title, module: english[1]!.module, outcome: english[1]!.outcome, explanationPrompt: english[1]!.explanationPrompt },
  },
  id: {
    'force-lab': { title: 'Laboratorium Gaya: diagram benda bebas', module: 'Modul 3 · Mekanika klasik', outcome: 'Menghubungkan jumlah vektor gaya dengan percepatan benda serta membedakan gesekan statis dan kinetis.', explanationPrompt: 'Jelaskan mengapa troli bermuatan memiliki percepatan berbeda. Hubungkan gaya netto, massa, dan hubungan fisika di antara keduanya.' },
    'length-contraction': { title: 'Laboratorium Kontraksi Panjang', module: 'Modul 4 · Relativitas khusus', outcome: 'Menjelaskan ketergantungan panjang terukur benda bergerak pada kerangka pengamat dan pengukuran simultan kedua ujung.', explanationPrompt: 'Jelaskan mengapa panjang terukur berbeda dari panjang proper. Sertakan peran kerangka pengamat dan pengukuran simultan kedua ujung.' },
  },
  ja: {
    'force-lab': { title: '力の実験室：自由物体図', module: 'モジュール3 · 古典力学', outcome: '力のベクトル和と物体の加速度を関連付け、静止摩擦と動摩擦を区別する。', explanationPrompt: '荷物を載せた台車の加速度が異なる理由を説明してください。正味の力、質量、および両者を結ぶ物理法則に触れてください。' },
    'length-contraction': { title: '長さの収縮ラボ', module: 'モジュール4 · 特殊相対性理論', outcome: '運動する物体の測定長が観測者の慣性系と両端の同時測定に依存することを説明する。', explanationPrompt: '測定される長さが固有長と異なる理由を説明してください。観測者の慣性系と両端の同時測定の役割を含めてください。' },
  },
}

export const pilotExperiments = english

export function getPilotExperiments(locale: PilotLocale): PilotExperiment[] {
  if (locale === 'en') return english
  return english.map(item => {
    const localized = metadata[locale][item.id]
    const localize = (entry: PilotQuestion): PilotQuestion => {
      const translated = translations[locale][entry.id]
      return translated ? { ...entry, prompt: translated.prompt, options: translated.options.map((label, index) => ({ value: String(index), label })) } : entry
    }
    return {
      ...item,
      ...localized,
      pre: item.pre.map(localize),
      post: item.post.map(localize),
      transfer: localize(item.transfer),
    }
  })
}

export function scoreQuestions(questions: PilotQuestion[], answers: Record<string, string>): number {
  return questions.reduce((score, item) => score + (answers[item.id] === item.correct ? 1 : 0), 0)
}

export function createEmptyCohort(): PilotCohort {
  const empty = (): ExperimentAggregate => ({
    immediateCount: 0, delayedCount: 0, preTotal: 0, postTotal: 0, delayedPostTotal: 0,
    transferTotal: 0, delayedTransferTotal: 0,
    immediateRubricCounts: [0, 0, 0, 0], delayedRubricCounts: [0, 0, 0, 0],
  })
  return { 'force-lab': empty(), 'length-contraction': empty() }
}

export function addParticipantResult(cohort: PilotCohort, result: ParticipantResult): PilotCohort {
  if (!Number.isInteger(result.explanationScore) || result.explanationScore < 0 || result.explanationScore > 3) {
    throw new RangeError('Explanation score must be an integer from 0 to 3.')
  }
  const aggregate = cohort[result.experimentId]
  if (result.phase === 'immediate') {
    aggregate.immediateCount += 1
    aggregate.preTotal += result.preCorrect
    aggregate.postTotal += result.postCorrect
    aggregate.transferTotal += result.transferCorrect
    aggregate.immediateRubricCounts[result.explanationScore] = (aggregate.immediateRubricCounts[result.explanationScore] ?? 0) + 1
  } else {
    aggregate.delayedCount += 1
    aggregate.delayedPostTotal += result.postCorrect
    aggregate.delayedTransferTotal += result.transferCorrect
    aggregate.delayedRubricCounts[result.explanationScore] = (aggregate.delayedRubricCounts[result.explanationScore] ?? 0) + 1
  }
  return cohort
}

export function cohortToCsv(cohort: PilotCohort): string {
  const rows: string[][] = [[
    'experiment', 'phase', 'participants', 'mean_pre_score_out_of_2', 'mean_post_score_out_of_2',
    'transfer_correct', 'mean_transfer_rate', 'rubric_0', 'rubric_1', 'rubric_2', 'rubric_3',
  ]]
  for (const experiment of english) {
    const item = cohort[experiment.id]
    if (item.immediateCount > 0) rows.push([
      experiment.id, 'immediate', String(item.immediateCount),
      (item.preTotal / item.immediateCount).toFixed(2), (item.postTotal / item.immediateCount).toFixed(2),
      String(item.transferTotal), (item.transferTotal / item.immediateCount).toFixed(3),
      ...item.immediateRubricCounts.map(String),
    ])
    if (item.delayedCount > 0) rows.push([
      experiment.id, 'delayed_unmatched', String(item.delayedCount), '',
      (item.delayedPostTotal / item.delayedCount).toFixed(2), String(item.delayedTransferTotal),
      (item.delayedTransferTotal / item.delayedCount).toFixed(3), ...item.delayedRubricCounts.map(String),
    ])
  }
  return rows.map(row => row.map(value => {
    const escaped = value.replaceAll('"', '""')
    return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped
  }).join(',')).join('\n')
}
