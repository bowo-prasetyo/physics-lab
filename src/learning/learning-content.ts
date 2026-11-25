import type { Locale } from '@/i18n/locales'
import type { Level } from '@/levels'
import { getLocalizedModules } from '@/i18n/home-catalog'
import type { RunRecord, TrackBounds } from '@/physics'
import { problemsFor, type PhysicsProblem } from './problem-bank'

/**
 * The learning path: one route through space, time and motion.
 *
 * Its chapters are Physica's modules and its steps are their experiments, in
 * catalogue order. Titles, numbering and order always come from src/modules.ts
 * (through the localized catalogue); this file holds only the teaching text,
 * keyed by module number and experiment route. learning-content.test.ts checks
 * that every experiment and module has that text in every language, and that
 * no stale entries remain.
 *
 * Practice questions belong to one experiment each and unlock only after the
 * learner has tested a prediction in that experiment (see session-progress.ts),
 * so understanding is checked against evidence the learner has seen. The same
 * unlock opens the step's numerical problems (problem-bank.ts), where the
 * learner applies the model they have just tested.
 *
 * Practice comes in three types, all unlocked together: concept questions,
 * graph questions (practice questions with a `graph`: the learner reads the
 * answer from a plot drawn with the experiments' own graph component) and
 * numerical problems.
 */

export interface StepCopy { readonly focus: string; readonly idea: string; readonly prerequisite: string }

export interface PracticeOption { readonly id: string; readonly label: string }
export interface PracticeQuestion {
  readonly id: string
  /** Route of the experiment whose evidence the question draws on. */
  readonly experiment: string
  readonly minLevel: Level
  /** Set for a graph question: the GRAPHS entry the answer is read from. */
  readonly graph?: string
  readonly prompt: string
  readonly options: readonly PracticeOption[]
  readonly answer: string
  readonly hint: string
  readonly explanation: string
}

export interface LearningUi {
  readonly eyebrow: string; readonly title: string; readonly intro: string
  readonly chaptersLabel: string; readonly moduleLabel: string; readonly progressLabel: string
  readonly prerequisitesLabel: string; readonly stepsLabel: string
  readonly exploredLabel: string; readonly notExploredLabel: string; readonly openLabel: string
  readonly practiceLabel: string; readonly lockedLabel: string; readonly moreAtHigherLevels: string
  readonly hintLabel: string; readonly checkLabel: string; readonly tryAgainLabel: string
  readonly correctLabel: string; readonly incorrectLabel: string; readonly explanationLabel: string
  readonly chooseLabel: string; readonly privacyNote: string
}

interface PracticeSource { readonly id: string; readonly experiment: string; readonly graph?: string; readonly minLevel: Level; readonly options: readonly string[]; readonly answer: string }
interface PracticeCopy { readonly prompt: string; readonly options: Readonly<Record<string, string>>; readonly hint: string; readonly explanation: string }

const UI: Record<Locale, LearningUi> = {
  "en": {
    "eyebrow": "One path through space, time and motion",
    "title": "Follow the thread, one experiment at a time.",
    "intro": "The path follows Physica’s six modules in order: from where things are and how clocks keep time, through motion and forces, to relativity, gravity and the expanding universe. Each step links to an experiment. Once you have tested a prediction in a step’s experiment, its questions unlock, followed by numerical problems that apply the same model, so you check your understanding against evidence you have seen.",
    "chaptersLabel": "Chapters",
    "moduleLabel": "Module",
    "progressLabel": "{done} of {total} explored",
    "stepsLabel": "Steps in this chapter",
    "exploredLabel": "Explored",
    "notExploredLabel": "Not explored yet",
    "openLabel": "Open the experiment",
    "lockedLabel": "Questions and problems unlock once you have tested a prediction in this experiment.",
    "moreAtHigherLevels": "More questions and problems appear at Intermediate and Advanced.",
    "tryAgainLabel": "Try again",
    "incorrectLabel": "Not quite. Read the explanation, then look again at what you saw in the experiment.",
    "privacyNote": "Progress and answers last for this browser session only. They are not saved or sent anywhere.",
    "hintLabel": "Show a hint",
    "checkLabel": "Check answer",
    "correctLabel": "That is correct.",
    "explanationLabel": "Why?",
    "chooseLabel": "Choose an answer to continue.",
    "prerequisitesLabel": "Before you begin",
    "practiceLabel": "Check your understanding"
  },
  "id": {
    "eyebrow": "Satu jalur melalui ruang, waktu, dan gerak",
    "title": "Ikuti alurnya, satu eksperimen setiap kali.",
    "intro": "Jalur ini mengikuti enam modul Physica secara berurutan: dari letak benda dan cara jam menjaga waktu, melalui gerak dan gaya, hingga relativitas, gravitasi, dan alam semesta yang mengembang. Setiap langkah tertaut ke sebuah eksperimen. Setelah Anda menguji sebuah prediksi dalam eksperimen suatu langkah, soal-soalnya terbuka, diikuti soal hitungan yang menerapkan model yang sama, sehingga Anda memeriksa pemahaman berdasarkan bukti yang telah Anda lihat.",
    "chaptersLabel": "Bab",
    "moduleLabel": "Modul",
    "progressLabel": "{done} dari {total} dijelajahi",
    "stepsLabel": "Langkah dalam bab ini",
    "exploredLabel": "Sudah dijelajahi",
    "notExploredLabel": "Belum dijelajahi",
    "openLabel": "Buka eksperimen",
    "lockedLabel": "Soal latihan dan soal hitungan terbuka setelah Anda menguji sebuah prediksi dalam eksperimen ini.",
    "moreAtHigherLevels": "Soal latihan dan soal hitungan lainnya muncul pada tingkat Menengah dan Lanjutan.",
    "tryAgainLabel": "Coba lagi",
    "incorrectLabel": "Belum tepat. Baca penjelasannya, lalu lihat kembali apa yang Anda amati dalam eksperimen.",
    "privacyNote": "Kemajuan dan jawaban hanya bertahan selama sesi peramban ini. Data tidak disimpan atau dikirim ke mana pun.",
    "hintLabel": "Tampilkan petunjuk",
    "checkLabel": "Periksa jawaban",
    "correctLabel": "Jawaban Anda benar.",
    "explanationLabel": "Mengapa?",
    "chooseLabel": "Pilih jawaban untuk melanjutkan.",
    "prerequisitesLabel": "Sebelum memulai",
    "practiceLabel": "Periksa pemahaman Anda"
  },
  "ja": {
    "eyebrow": "空間・時間・運動をたどる一本の道",
    "title": "一つずつ実験しながら、流れをたどる。",
    "intro": "この道はPhysicaの6つのモジュールを順にたどります。物がどこにあるか、時計がどう時を刻むかから始まり、運動と力を経て、相対性理論、重力、膨張する宇宙へと進みます。各ステップは実験につながっています。ステップの実験で予測を確かめると、練習問題と、同じモデルを使う計算問題が解けるようになるので、自分が見た証拠に基づいて理解を確認できます。",
    "chaptersLabel": "章",
    "moduleLabel": "モジュール",
    "progressLabel": "{total}件中{done}件を探究済み",
    "stepsLabel": "この章のステップ",
    "exploredLabel": "探究済み",
    "notExploredLabel": "未探究",
    "openLabel": "実験を開く",
    "lockedLabel": "この実験で予測を確かめると、練習問題と計算問題が解けるようになります。",
    "moreAtHigherLevels": "中級と上級では、さらに練習問題と計算問題が表示されます。",
    "tryAgainLabel": "もう一度",
    "incorrectLabel": "もう少しです。解説を読み、実験で見たことをもう一度振り返りましょう。",
    "privacyNote": "進み具合と回答はこのブラウザーセッションの間だけ保持されます。保存や送信はされません。",
    "hintLabel": "ヒントを表示",
    "checkLabel": "回答を確認",
    "correctLabel": "正解です。",
    "explanationLabel": "解説",
    "chooseLabel": "続けるには回答を選択してください。",
    "prerequisitesLabel": "始める前に",
    "practiceLabel": "理解度を確認"
  }
}

/** Teaching text for each experiment step, keyed by route. */
export const STEP_COPY: Record<Locale, Readonly<Record<string, StepCopy>>> = {
  "en": {
    "/space/space-vs-time": {
      "focus": "Position is not the same as time",
      "idea": "Describe where an object is and whether its position changes.",
      "prerequisite": "Position is measured relative to a chosen origin. Time tells when an event happens; it is a different quantity."
    },
    "/space/displacement-3d": {
      "focus": "Measure a change in position",
      "idea": "Compare the path travelled with the straight-line displacement from start to finish.",
      "prerequisite": "Be comfortable reading coordinates and subtracting an initial position from a final position."
    },
    "/time/pendulum": {
      "focus": "A clock is a physical system",
      "idea": "Use repeated motion to measure time intervals and investigate what changes a clock’s period.",
      "prerequisite": "A period is the time for one complete cycle; frequency counts cycles per second."
    },
    "/mechanics/newtonian": {
      "focus": "Acceleration responds to net force",
      "idea": "Change force and mass separately to test Newton’s second law.",
      "prerequisite": "Know how to calculate a change in velocity over time and recognise that forces have direction."
    },
    "/mechanics/force-lab": {
      "focus": "Add forces with a free-body diagram",
      "idea": "Resolve forces into components and identify the net force along the direction of motion.",
      "prerequisite": "Review vector components and the difference between static and kinetic friction."
    },
    "/mechanics/momentum-collisions": {
      "focus": "Momentum describes motion in a collision",
      "idea": "Compare momentum before and after a collision, and distinguish it from kinetic energy.",
      "prerequisite": "Momentum is mass multiplied by velocity, including its direction."
    },
    "/mechanics/projectile": {
      "focus": "Combine horizontal and vertical motion",
      "idea": "Investigate how horizontal motion and vertical acceleration shape a projectile path.",
      "prerequisite": "Be familiar with velocity components and constant gravitational acceleration in the ideal model."
    },
    "/mechanics/circular-orbits": {
      "focus": "A circle needs a force towards the centre",
      "idea": "Launch a satellite sideways and find when gravity bends its path into a circle, an ellipse or not at all.",
      "prerequisite": "Know Newton’s second law, and that velocity has a direction as well as a size. The projectile launcher is a good warm-up: a faster sideways throw lands farther away."
    },
    "/relativity/moving-clocks": {
      "focus": "Observers can measure different elapsed times",
      "idea": "Compare clock readings for observers following different paths through spacetime.",
      "prerequisite": "Understand inertial reference frames and that a clock measures time along its own path."
    },
    "/relativity/two-perspectives": {
      "focus": "Simultaneity depends on the reference frame",
      "idea": "Compare which events are simultaneous for observers in relative motion.",
      "prerequisite": "Review how positions and times transform between observers; distant clocks require synchronisation."
    },
    "/relativity/length-contraction": {
      "focus": "Measure a moving object consistently",
      "idea": "Record both endpoints at the same time in one frame before comparing lengths.",
      "prerequisite": "A length measurement requires simultaneous endpoint positions in the measuring frame."
    },
    "/gravity/geodesic-motion": {
      "focus": "Gravity changes the geometry of motion",
      "idea": "Compare Newtonian orbits with free-fall paths in a curved-spacetime model.",
      "prerequisite": "Start with Circular motion and orbits in Module 3: this lab compares curved-spacetime paths with the Newtonian ellipses you launched there. Know that a model is not the system it represents."
    },
    "/gravity/clock-rates": {
      "focus": "Gravity changes how fast clocks run",
      "idea": "Compare clocks at different heights, from the Earth to a black hole, and see why GPS needs both relativity corrections.",
      "prerequisite": "Treat clock rates as ratios, and recall that moving clocks run slow (“Different clocks”)."
    },
    "/cosmology/evolving-space": {
      "focus": "Space itself can evolve",
      "idea": "Run model universes forwards and backwards, and relate the scale factor to redshift and the Hubble rate.",
      "prerequisite": "Understand that distances in a model can change because space expands, not only because objects move through it."
    }
  },
  "id": {
    "/space/space-vs-time": {
      "focus": "Posisi berbeda dari waktu",
      "idea": "Jelaskan letak benda dan apakah posisinya berubah.",
      "prerequisite": "Posisi diukur relatif terhadap titik asal yang dipilih. Waktu menyatakan kapan peristiwa terjadi; besaran ini berbeda."
    },
    "/space/displacement-3d": {
      "focus": "Ukur perubahan posisi",
      "idea": "Bandingkan panjang lintasan dengan perpindahan garis lurus dari awal hingga akhir.",
      "prerequisite": "Anda sebaiknya dapat membaca koordinat dan mengurangkan posisi awal dari posisi akhir."
    },
    "/time/pendulum": {
      "focus": "Jam adalah sistem fisik",
      "idea": "Gunakan gerak berulang untuk mengukur selang waktu dan selidiki hal yang mengubah periode jam.",
      "prerequisite": "Periode adalah waktu untuk satu siklus lengkap; frekuensi menghitung siklus per detik."
    },
    "/mechanics/newtonian": {
      "focus": "Percepatan dipengaruhi gaya resultan",
      "idea": "Ubah gaya dan massa secara terpisah untuk menguji hukum kedua Newton.",
      "prerequisite": "Anda sebaiknya dapat menghitung perubahan kecepatan dalam selang waktu dan memahami bahwa gaya memiliki arah."
    },
    "/mechanics/force-lab": {
      "focus": "Jumlahkan gaya dengan diagram benda bebas",
      "idea": "Uraikan gaya menjadi komponen dan tentukan gaya resultan sepanjang arah gerak.",
      "prerequisite": "Pelajari kembali komponen vektor serta perbedaan gesekan statis dan kinetis."
    },
    "/mechanics/momentum-collisions": {
      "focus": "Momentum menjelaskan gerak saat tumbukan",
      "idea": "Bandingkan momentum sebelum dan sesudah tumbukan, lalu bedakan dari energi kinetik.",
      "prerequisite": "Momentum adalah massa dikalikan kecepatan, termasuk arahnya."
    },
    "/mechanics/projectile": {
      "focus": "Gabungkan gerak horizontal dan vertikal",
      "idea": "Selidiki bagaimana gerak horizontal dan percepatan vertikal membentuk lintasan proyektil.",
      "prerequisite": "Kenali komponen kecepatan dan percepatan gravitasi konstan dalam model ideal."
    },
    "/mechanics/circular-orbits": {
      "focus": "Lingkaran memerlukan gaya menuju pusat",
      "idea": "Luncurkan satelit ke samping dan temukan kapan gravitasi membelokkan lintasannya menjadi lingkaran, elips, atau tidak sama sekali.",
      "prerequisite": "Pahami hukum kedua Newton, dan bahwa kecepatan memiliki arah selain besar. Peluncur proyektil adalah pemanasan yang baik: lemparan ke samping yang lebih cepat mendarat lebih jauh."
    },
    "/relativity/moving-clocks": {
      "focus": "Pengamat dapat mengukur waktu berlalu yang berbeda",
      "idea": "Bandingkan pembacaan jam bagi pengamat yang menempuh lintasan berbeda dalam ruang-waktu.",
      "prerequisite": "Pahami kerangka acuan inersial dan bahwa jam mengukur waktu sepanjang lintasannya sendiri."
    },
    "/relativity/two-perspectives": {
      "focus": "Keserentakan bergantung pada kerangka acuan",
      "idea": "Bandingkan peristiwa mana yang serentak bagi pengamat yang bergerak relatif.",
      "prerequisite": "Pelajari kembali transformasi posisi dan waktu antar-pengamat; jam berjauhan memerlukan sinkronisasi."
    },
    "/relativity/length-contraction": {
      "focus": "Ukur benda bergerak secara konsisten",
      "idea": "Catat kedua ujung secara bersamaan dalam satu kerangka sebelum membandingkan panjang.",
      "prerequisite": "Pengukuran panjang memerlukan posisi kedua ujung yang serentak dalam kerangka pengukur."
    },
    "/gravity/geodesic-motion": {
      "focus": "Gravitasi mengubah geometri gerak",
      "idea": "Bandingkan orbit Newton dengan lintasan jatuh bebas dalam model ruang-waktu melengkung.",
      "prerequisite": "Mulailah dengan Gerak melingkar dan orbit di Modul 3: laboratorium ini membandingkan lintasan dalam ruang-waktu melengkung dengan elips Newton yang Anda luncurkan di sana. Pahami bahwa model bukanlah sistem yang diwakilinya."
    },
    "/gravity/clock-rates": {
      "focus": "Gravitasi mengubah laju jam",
      "idea": "Bandingkan jam pada ketinggian berbeda, dari Bumi hingga lubang hitam, dan lihat mengapa GPS memerlukan kedua koreksi relativitas.",
      "prerequisite": "Pahami laju jam sebagai rasio, dan ingat bahwa jam yang bergerak berjalan lambat (eksperimen “Jam berbeda”)."
    },
    "/cosmology/evolving-space": {
      "focus": "Ruang itu sendiri dapat berevolusi",
      "idea": "Jalankan model alam semesta maju dan mundur, lalu hubungkan faktor skala dengan pergeseran merah dan laju Hubble.",
      "prerequisite": "Pahami bahwa jarak dalam model dapat berubah karena ruang mengembang, bukan hanya karena benda bergerak melewatinya."
    }
  },
  "ja": {
    "/space/space-vs-time": {
      "focus": "位置と時間は同じではない",
      "idea": "物体がどこにあり、その位置が変化するかを表します。",
      "prerequisite": "位置は選んだ原点を基準に測ります。時間は事象がいつ起きるかを表す別の量です。"
    },
    "/space/displacement-3d": {
      "focus": "位置の変化を測る",
      "idea": "移動した経路と、始点から終点への直線的な変位を比べます。",
      "prerequisite": "座標を読み、終点の位置から始点の位置を引けるようにしましょう。"
    },
    "/time/pendulum": {
      "focus": "時計は物理系である",
      "idea": "繰り返す運動で時間間隔を測り、時計の周期を変える要因を調べます。",
      "prerequisite": "周期は1回の完全なサイクルにかかる時間、振動数は1秒あたりのサイクル数です。"
    },
    "/mechanics/newtonian": {
      "focus": "加速度は合力に応答する",
      "idea": "力と質量を別々に変え、ニュートンの第2法則を確かめます。",
      "prerequisite": "時間間隔における速度の変化を計算でき、力には向きがあることを理解しましょう。"
    },
    "/mechanics/force-lab": {
      "focus": "自由物体図で力を合成する",
      "idea": "力を成分に分解し、運動方向の合力を求めます。",
      "prerequisite": "ベクトル成分と静止摩擦・動摩擦の違いを復習しましょう。"
    },
    "/mechanics/momentum-collisions": {
      "focus": "衝突時の運動を運動量で表す",
      "idea": "衝突の前後で運動量を比較し、運動エネルギーと区別します。",
      "prerequisite": "運動量は質量と速度の積であり、向きも含みます。"
    },
    "/mechanics/projectile": {
      "focus": "水平運動と鉛直運動を組み合わせる",
      "idea": "水平運動と鉛直加速度が放物運動の軌道をどう形作るか調べます。",
      "prerequisite": "理想モデルにおける速度成分と一定の重力加速度に慣れておきましょう。"
    },
    "/mechanics/circular-orbits": {
      "focus": "円運動には中心向きの力が必要",
      "idea": "衛星を横向きに打ち出し、重力が経路を円や楕円に曲げるのはいつか、曲げきれないのはいつかを調べます。",
      "prerequisite": "ニュートンの第2法則と、速度には大きさだけでなく向きもあることを理解しておきましょう。投射装置がよい準備になります。横向きに速く投げるほど遠くに落ちます。"
    },
    "/relativity/moving-clocks": {
      "focus": "観測者によって経過時間の測定が異なる",
      "idea": "時空内で異なる経路をたどる観測者の時計を比較します。",
      "prerequisite": "慣性系と、時計が自身の経路に沿って時間を測ることを理解しましょう。"
    },
    "/relativity/two-perspectives": {
      "focus": "同時性は基準系に依存する",
      "idea": "相対運動する観測者にとって、どの事象が同時かを比較します。",
      "prerequisite": "観測者間の位置と時間の変換を復習しましょう。離れた時計には同期の手順が必要です。"
    },
    "/relativity/length-contraction": {
      "focus": "運動する物体を一貫して測る",
      "idea": "測定する基準系で両端を同時に記録してから、測定長を比較します。",
      "prerequisite": "長さの測定には、測定する基準系で両端の位置を同時に記録する必要があります。"
    },
    "/gravity/geodesic-motion": {
      "focus": "重力は運動の幾何を変える",
      "idea": "ニュートン力学の軌道と、曲がった時空モデルでの自由落下経路を比較します。",
      "prerequisite": "まずモジュール3の「円運動と軌道」に取り組みましょう。この実験室では、そこで打ち上げたニュートン力学の楕円と、曲がった時空での経路を比べます。モデルと、それが表す物理系とは別物であることも理解しておきましょう。"
    },
    "/gravity/clock-rates": {
      "focus": "重力は時計の進み方を変える",
      "idea": "地球からブラックホールまで、高さの異なる時計を比べ、GPSに相対論の二つの補正が必要な理由を確かめます。",
      "prerequisite": "時計の進み方を比として扱えるようにし、動く時計が遅れること（「異なる時計」の実験）を思い出しましょう。"
    },
    "/cosmology/evolving-space": {
      "focus": "空間そのものが変化しうる",
      "idea": "モデル宇宙を未来と過去へ進め、スケール因子を赤方偏移やハッブル率と結び付けます。",
      "prerequisite": "モデルの中の距離は、物体が空間を移動するからだけでなく、空間が膨張するからも変わりうることを理解しておきましょう。"
    }
  }
}

/** "Before you begin" for each chapter, keyed by module number. */
export const CHAPTER_PREREQUISITES: Record<Locale, Readonly<Record<number, string>>> = {
  "en": {
    "1": "You only need everyday ideas of position, distance and time. A coordinate is a way to describe a position; it is not the position itself.",
    "2": "Start after Module 1, or with an everyday idea of time. A clock is anything that repeats at a steady rate; this chapter asks what sets that rate.",
    "3": "Distinguish position from displacement, and speed from velocity. Acceleration describes how velocity changes; net force is the vector sum of all forces.",
    "4": "Start after Module 3. Be comfortable with velocity, reference frames and the idea that a measurement needs a defined observer and procedure.",
    "5": "Start after Module 4. Know Newtonian gravity as a useful approximation, and that moving clocks run at different rates.",
    "6": "Start after Module 5. Comfort with ratios and graphs helps; the key idea is that a model can describe space itself changing over time."
  },
  "id": {
    "1": "Anda hanya memerlukan pemahaman sehari-hari tentang posisi, jarak, dan waktu. Koordinat adalah cara menyatakan posisi, bukan posisi itu sendiri.",
    "2": "Mulailah setelah Modul 1, atau dengan pemahaman sehari-hari tentang waktu. Jam adalah apa pun yang berulang dengan laju tetap; bab ini menanyakan apa yang menentukan laju itu.",
    "3": "Bedakan posisi dari perpindahan, serta kelajuan dari kecepatan. Percepatan menjelaskan perubahan kecepatan; gaya resultan adalah jumlah vektor semua gaya.",
    "4": "Mulailah setelah Modul 3. Pahami kecepatan, kerangka acuan, dan bahwa pengukuran memerlukan pengamat serta prosedur yang jelas.",
    "5": "Mulailah setelah Modul 4. Pahami gravitasi Newton sebagai pendekatan yang berguna, dan bahwa jam yang bergerak berjalan dengan laju berbeda.",
    "6": "Mulailah setelah Modul 5. Kemampuan membaca rasio dan grafik akan membantu; gagasan utamanya adalah bahwa model dapat menggambarkan ruang itu sendiri berubah seiring waktu."
  },
  "ja": {
    "1": "位置、距離、時間について日常的な理解があれば始められます。座標は位置を表す方法であり、位置そのものではありません。",
    "2": "モジュール1の後、または日常的な時間の理解から始めましょう。時計とは一定の速さで繰り返すもののことです。この章では、その速さを何が決めるのかを考えます。",
    "3": "位置と変位、速さと速度を区別しましょう。加速度は速度の変化を表し、合力はすべての力のベクトル和です。",
    "4": "モジュール3の後に始めましょう。速度、基準系、そして測定には観測者と手順の指定が必要であることを理解しておきます。",
    "5": "モジュール4の後に始めましょう。ニュートンの重力が有用な近似であること、そして動く時計の進み方が異なることを理解しておきましょう。",
    "6": "モジュール5の後に始めましょう。比やグラフに慣れていると役立ちます。鍵となる考えは、モデルが空間そのものの時間変化を表せるということです。"
  }
}

/** The practice bank: structure (experiment, level, option ids, answer) is shared by every language. */
/** A position–time graph for graph questions: one piecewise-uniform run. */
export interface MotionGraph {
  readonly record: RunRecord
  readonly duration: number
  readonly bounds: TrackBounds
}

/** Build a run from its starting position and a list of [velocity (m/s), duration (s)] pieces. */
function piecewiseRun(x0: number, pieces: readonly (readonly [number, number])[], bounds: TrackBounds): MotionGraph {
  let t = 0
  let x = x0
  let distance = 0
  const segments = pieces.map(([v, duration]) => {
    const segment = { tStart: t, xStart: x, v }
    t += duration
    x += v * duration
    distance += Math.abs(v) * duration
    return segment
  })
  return { record: { x0, segments, tEnd: t, distance }, duration: t, bounds }
}

/** Graphs that graph questions refer to, by id. */
export const GRAPHS: Readonly<Record<string, MotionGraph>> = {
  // Forwards at +2 m/s, still for 2 s while the clock runs, back to the start at −2 m/s.
  'walk-stop-return': piecewiseRun(0, [[2, 2], [0, 2], [-2, 2]], { min: 0, max: 6 }),
}

export interface GraphCopy { readonly title: string; readonly intro: string }

export const GRAPH_COPY: Record<Locale, Readonly<Record<string, GraphCopy>>> = {
  en: {
    'walk-stop-return': { title: 'Read a position–time graph', intro: 'One run of an object on the track. The questions below are all about this graph; its slope is the velocity.' },
  },
  id: {
    'walk-stop-return': { title: 'Membaca grafik posisi–waktu', intro: 'Satu percobaan sebuah benda di lintasan. Semua pertanyaan di bawah ini tentang grafik ini; kemiringannya adalah kecepatan.' },
  },
  ja: {
    'walk-stop-return': { title: '位置–時間グラフを読み取る', intro: 'レール上の物体の1回の試行です。下の質問はすべてこのグラフについてです。グラフの傾きが速度を表します。' },
  },
}

export const PRACTICE_BANK: readonly PracticeSource[] = [
  {
    "id": "walk",
    "experiment": "/space/displacement-3d",
    "minLevel": "beginner",
    "options": [
      "zero",
      "six",
      "three"
    ],
    "answer": "zero"
  },
  {
    "id": "period",
    "experiment": "/time/pendulum",
    "minLevel": "beginner",
    "options": [
      "two",
      "ten",
      "two-hundred"
    ],
    "answer": "two"
  },
  {
    "id": "net-force",
    "experiment": "/mechanics/newtonian",
    "minLevel": "beginner",
    "options": [
      "five",
      "twenty",
      "point-two"
    ],
    "answer": "five"
  },
  {
    "id": "momentum",
    "experiment": "/mechanics/momentum-collisions",
    "minLevel": "beginner",
    "options": [
      "momentum",
      "kinetic",
      "speed"
    ],
    "answer": "momentum"
  },
  {
    "id": "simultaneity",
    "experiment": "/relativity/two-perspectives",
    "minLevel": "beginner",
    "options": [
      "same-time",
      "frame-time",
      "absolute"
    ],
    "answer": "frame-time"
  },
  {
    "id": "gravity-clock",
    "experiment": "/gravity/clock-rates",
    "minLevel": "beginner",
    "options": [
      "deeper",
      "farther",
      "same"
    ],
    "answer": "deeper"
  },
  {
    "id": "graph-stop",
    "experiment": "/space/space-vs-time",
    "minLevel": "beginner",
    "options": [
      "flat",
      "gap",
      "vertical",
      "down"
    ],
    "answer": "flat"
  },
  {
    "id": "rotated",
    "experiment": "/space/displacement-3d",
    "minLevel": "intermediate",
    "options": [
      "five",
      "seven",
      "depends",
      "zero"
    ],
    "answer": "five"
  },
  {
    "id": "quarter-g",
    "experiment": "/time/pendulum",
    "minLevel": "intermediate",
    "options": [
      "four",
      "eight",
      "one",
      "two"
    ],
    "answer": "four"
  },
  {
    "id": "tilted-book",
    "experiment": "/mechanics/force-lab",
    "minLevel": "beginner",
    "options": [
      "static",
      "normal",
      "weight",
      "none"
    ],
    "answer": "static"
  },
  {
    "id": "drop-throw",
    "experiment": "/mechanics/projectile",
    "minLevel": "beginner",
    "options": [
      "same",
      "dropped",
      "thrown"
    ],
    "answer": "same"
  },
  {
    "id": "horizontal-range",
    "experiment": "/mechanics/projectile",
    "minLevel": "intermediate",
    "options": [
      "twenty",
      "ten",
      "forty",
      "two"
    ],
    "answer": "twenty"
  },
  {
    "id": "both-slow",
    "experiment": "/relativity/moving-clocks",
    "minLevel": "beginner",
    "options": [
      "both",
      "earth",
      "ship",
      "neither"
    ],
    "answer": "both"
  },
  {
    "id": "muon",
    "experiment": "/relativity/moving-clocks",
    "minLevel": "intermediate",
    "options": [
      "twentytwo",
      "two",
      "point-two",
      "forever"
    ],
    "answer": "twentytwo"
  },
  {
    "id": "fifty-metre",
    "experiment": "/relativity/length-contraction",
    "minLevel": "beginner",
    "options": [
      "thirty",
      "fifty",
      "eighty-three",
      "zero"
    ],
    "answer": "thirty"
  },
  {
    "id": "gps",
    "experiment": "/gravity/clock-rates",
    "minLevel": "advanced",
    "options": [
      "gain38",
      "lose38",
      "gain52",
      "none"
    ],
    "answer": "gain38"
  },
  {
    "id": "free-fall",
    "experiment": "/gravity/geodesic-motion",
    "minLevel": "beginner",
    "options": [
      "falling",
      "no-gravity",
      "too-far",
      "air"
    ],
    "answer": "falling"
  },
  {
    "id": "receding",
    "experiment": "/cosmology/evolving-space",
    "minLevel": "beginner",
    "options": [
      "expanding",
      "centre",
      "shrinking",
      "push"
    ],
    "answer": "expanding"
  },
  {
    "id": "redshift-one",
    "experiment": "/cosmology/evolving-space",
    "minLevel": "intermediate",
    "options": [
      "two",
      "one",
      "ten",
      "half"
    ],
    "answer": "two"
  },
  {
    "id": "graph-rest",
    "experiment": "/space/space-vs-time",
    "graph": "walk-stop-return",
    "minLevel": "beginner",
    "options": [
      "rest",
      "forward",
      "backward"
    ],
    "answer": "rest"
  },
  {
    "id": "graph-slope",
    "experiment": "/space/space-vs-time",
    "graph": "walk-stop-return",
    "minLevel": "beginner",
    "options": [
      "plus2",
      "plus4",
      "minus2"
    ],
    "answer": "plus2"
  },
  {
    "id": "graph-average",
    "experiment": "/space/space-vs-time",
    "graph": "walk-stop-return",
    "minLevel": "intermediate",
    "options": [
      "zero",
      "speed",
      "plus2"
    ],
    "answer": "zero"
  },
  {
    "id": "graph-corners",
    "experiment": "/space/space-vs-time",
    "graph": "walk-stop-return",
    "minLevel": "advanced",
    "options": [
      "instant",
      "clock",
      "normal"
    ],
    "answer": "instant"
  },
  {
    "id": "orbit-string",
    "experiment": "/mechanics/circular-orbits",
    "minLevel": "beginner",
    "options": [
      "tangent",
      "outward",
      "centre"
    ],
    "answer": "tangent"
  }
]

export const PRACTICE_COPY: Record<Locale, Readonly<Record<string, PracticeCopy>>> = {
  "en": {
    "walk": {
      "prompt": "A student walks 3 m east, then 3 m west back to the starting point. What is the student’s displacement?",
      "options": {
        "zero": "0 m",
        "six": "6 m east",
        "three": "3 m west"
      },
      "hint": "Displacement depends on the change from the initial position to the final position, not the total path.",
      "explanation": "The student finishes where they started, so final position minus initial position is zero. Distance travelled is 6 m, but displacement is 0 m."
    },
    "period": {
      "prompt": "A pendulum completes 10 full swings in 20 seconds. What is its period?",
      "options": {
        "two": "2 seconds",
        "ten": "10 seconds",
        "two-hundred": "200 seconds"
      },
      "hint": "Divide the total elapsed time by the number of complete cycles.",
      "explanation": "The period is time per cycle: T = 20 s ÷ 10 = 2 s."
    },
    "net-force": {
      "prompt": "A 2 kg cart experiences a net force of 10 N. What is its acceleration?",
      "options": {
        "five": "5 m/s²",
        "twenty": "20 m/s²",
        "point-two": "0.2 m/s²"
      },
      "hint": "Use Newton’s second law: acceleration equals net force divided by mass.",
      "explanation": "a = Fnet / m = 10 N / 2 kg = 5 m/s². Acceleration points in the direction of the net force."
    },
    "momentum": {
      "prompt": "Two carts collide in an isolated system. Which quantity is conserved in every collision, whether elastic or inelastic?",
      "options": {
        "momentum": "Total momentum",
        "kinetic": "Total kinetic energy",
        "speed": "Each cart’s speed"
      },
      "hint": "Think about the total for the two-cart system, not either cart separately.",
      "explanation": "Total momentum is conserved when net external impulse is zero. Kinetic energy is conserved only in an elastic collision; individual cart speeds generally change."
    },
    "simultaneity": {
      "prompt": "Two observers move relative to one another. Which statement about their measurements is correct in special relativity?",
      "options": {
        "same-time": "They must agree whether two distant events are simultaneous.",
        "frame-time": "They can disagree about simultaneity while agreeing on the events themselves.",
        "absolute": "They always measure the same elapsed time between any two events."
      },
      "hint": "Separate whether an event happened from whether two separated events happened at the same time.",
      "explanation": "Observers agree on the events but can assign different time coordinates and disagree about simultaneity. Proper time is measured along a particular clock’s worldline."
    },
    "gravity-clock": {
      "prompt": "In a simple gravitational time-dilation comparison, which clock runs slower relative to a clock farther from an isolated spherical mass?",
      "options": {
        "deeper": "The clock lower in the gravitational field",
        "farther": "The clock farther from the mass",
        "same": "Both clocks always run at the same rate"
      },
      "hint": "Compare a clock deeper in the gravitational potential with one farther away, as measured by a distant reference.",
      "explanation": "In the static spherical model, a clock deeper in the gravitational field (at a smaller radius outside the mass) accumulates less proper time relative to a distant static clock. The comparison depends on the observers and model specified."
    },
    "graph-stop": {
      "prompt": "A cart moves along a track, stops for 5 seconds, then moves on. What does its position–time graph look like during the stop?",
      "options": {
        "flat": "A horizontal line: time goes on, position stays the same",
        "gap": "A gap: no time passes while it is stopped",
        "vertical": "A vertical line",
        "down": "A line sloping down to zero"
      },
      "hint": "Time is on the horizontal axis. Does the clock stop when the cart stops?",
      "explanation": "While the cart is at rest its position does not change, but time keeps passing, so the graph runs horizontally. A flat line means zero velocity, not stopped time."
    },
    "rotated": {
      "prompt": "A drone’s displacement is (3, 4, 0) m in one coordinate system. A second system has its axes turned by 90° about z. What is the size of the displacement in the second system?",
      "options": {
        "five": "5 m",
        "seven": "7 m",
        "depends": "It depends on which way the axes are turned",
        "zero": "0 m"
      },
      "hint": "Turning the axes changes the components. Does it change the arrow itself?",
      "explanation": "|Δr| = √(3² + 4²) = 5 m in every coordinate system. Rotating the axes changes the components, here to (4, −3, 0) m or (−4, 3, 0) m depending on the direction of the turn, but not the length."
    },
    "quarter-g": {
      "prompt": "A pendulum clock has a period of 2.0 s on Earth. It is taken to a world where g is one quarter of Earth’s. What is its period there?",
      "options": {
        "four": "4.0 s",
        "eight": "8.0 s",
        "one": "1.0 s",
        "two": "2.0 s"
      },
      "hint": "T = 2π√(L/g). What happens to √(1/g) when g is divided by 4?",
      "explanation": "T is proportional to 1/√g. Dividing g by 4 multiplies T by √4 = 2, so the period becomes 4.0 s and the clock runs at half speed."
    },
    "tilted-book": {
      "prompt": "A book rests on a slightly tilted table without sliding. Which force stops it sliding down?",
      "options": {
        "static": "Static friction from the table, pointing up the slope",
        "normal": "The normal force from the table",
        "weight": "Its weight",
        "none": "No force is needed: it is at rest"
      },
      "hint": "Draw the free-body diagram. Which force can point along the table’s surface?",
      "explanation": "The weight has a component down the slope. The normal force is perpendicular to the surface, so it cannot cancel that component; static friction along the surface does, as long as the slope is not steeper than tan θ = μs."
    },
    "drop-throw": {
      "prompt": "From the same height, one ball is thrown horizontally and another is dropped at the same moment. Ignoring air resistance, which lands first?",
      "options": {
        "same": "They land at the same time",
        "dropped": "The dropped ball",
        "thrown": "The thrown ball"
      },
      "hint": "The horizontal and vertical motions are independent. What is each ball’s vertical velocity at the start?",
      "explanation": "Both start with zero vertical velocity and have the same vertical acceleration g, so they fall the same height in the same time. The thrown ball also moves sideways, but that does not change its fall."
    },
    "horizontal-range": {
      "prompt": "A ball is thrown horizontally at 10 m/s from a height of 20 m (take g = 10 m/s², no air). How far from the base does it land?",
      "options": {
        "twenty": "20 m",
        "ten": "10 m",
        "forty": "40 m",
        "two": "2 m"
      },
      "hint": "First find the fall time from h = ½gt², then multiply by the horizontal speed.",
      "explanation": "20 = ½ × 10 × t² gives t = 2 s. The horizontal speed stays 10 m/s, so the ball lands 10 × 2 = 20 m away."
    },
    "both-slow": {
      "prompt": "A spaceship passes Earth at 0.6c. Earth observers say the ship’s clock runs slow; the crew say Earth’s clock runs slow. Can both be right?",
      "options": {
        "both": "Yes: each compares the other’s clock with clocks in their own frame",
        "earth": "No: only Earth is right, because Earth is not moving",
        "ship": "No: only the crew are right",
        "neither": "No: moving clocks never really run slow"
      },
      "hint": "Each observer is at rest in their own frame. What does each use to judge the other’s clock?",
      "explanation": "Time dilation is reciprocal. Each observer compares one moving clock with two of their own synchronized clocks, and they disagree about simultaneity, so both statements hold without contradiction. A contradiction would need the two clocks to meet again, as in the twin paradox, where one of them turns around."
    },
    "muon": {
      "prompt": "A muon at rest lives about 2.2 μs. Created in the upper atmosphere, it moves at 0.995c (γ ≈ 10). How long does it live in the Earth frame?",
      "options": {
        "twentytwo": "About 22 μs",
        "two": "2.2 μs",
        "point-two": "About 0.22 μs",
        "forever": "Forever: it moves at almost the speed of light"
      },
      "hint": "Its own clock measures the proper time. Earth sees that clock run slow by γ.",
      "explanation": "Δt = γτ ≈ 10 × 2.2 μs = 22 μs. In that time it travels about 6.6 km, far enough to reach the ground, which is what is observed. In the muon’s frame the atmosphere is contracted instead."
    },
    "fifty-metre": {
      "prompt": "A 50 m spaceship passes Earth at 0.8c. What length do Earth observers measure, recording both ends at the same time?",
      "options": {
        "thirty": "30 m",
        "fifty": "50 m",
        "eighty-three": "About 83 m",
        "zero": "0 m"
      },
      "hint": "At 0.8c, γ = 5/3. Is the measured length longer or shorter than the proper length?",
      "explanation": "L = L₀/γ = 50 m × 3/5 = 30 m. The crew still measure 50 m: their ship is not squeezed. The two frames disagree about which endpoint events are simultaneous."
    },
    "gps": {
      "prompt": "Compared with clocks on the ground, GPS satellite clocks gain about 45 μs per day because gravity is weaker up there, and lose about 7 μs per day because they move. What is the net effect?",
      "options": {
        "gain38": "They gain about 38 μs per day",
        "lose38": "They lose about 38 μs per day",
        "gain52": "They gain about 52 μs per day",
        "none": "No net effect: the two cancel"
      },
      "hint": "The two effects have opposite signs. Add them.",
      "explanation": "+45 − 7 ≈ +38 μs per day. Light travels 300 m in a microsecond, so uncorrected the position error would grow by about 11 km per day. The satellites’ clocks are adjusted before launch, and receivers apply further corrections."
    },
    "free-fall": {
      "prompt": "Astronauts float inside a space station orbiting 400 km above the Earth, where gravity is still about 90 % as strong as on the ground. Why do they float?",
      "options": {
        "falling": "They and the station fall freely together",
        "no-gravity": "There is no gravity in orbit",
        "too-far": "They are too far from the Earth to be pulled",
        "air": "The air inside holds them up"
      },
      "hint": "What would happen to the station if gravity really vanished?",
      "explanation": "The station and everyone in it are in free fall, all following the same path around the Earth, so nothing presses them against the floor. In general relativity that free-fall path is a geodesic: no force is felt along it."
    },
    "receding": {
      "prompt": "Distant galaxies are moving away from us, and the farther away a galaxy is, the faster it recedes. What does this suggest?",
      "options": {
        "expanding": "Space is expanding everywhere, with no centre",
        "centre": "We are at the centre of an explosion",
        "shrinking": "The galaxies are shrinking",
        "push": "The Milky Way is pushing the other galaxies away"
      },
      "hint": "Imagine dots on a balloon being blown up. What does every dot see?",
      "explanation": "In a uniformly expanding universe every observer sees the same pattern: recession speed proportional to distance (Hubble’s law). So the pattern does not single out a centre, and our galaxy is not special."
    },
    "redshift-one": {
      "prompt": "Light from a galaxy arrives with redshift z = 1. By what factor has the universe expanded since the light left?",
      "options": {
        "two": "It has doubled in size",
        "one": "It has not expanded",
        "ten": "Ten times",
        "half": "It has halved"
      },
      "hint": "In an expanding universe, 1 + z equals the ratio of the scale factor now to the scale factor when the light was emitted.",
      "explanation": "1 + z = a_now / a_then = 2, so distances between comoving galaxies have doubled since the light set out. The light’s wavelength has been stretched by the same factor."
    },
    "graph-rest": {
      "prompt": "What is the object doing between 2 s and 4 s?",
      "options": {
        "rest": "It is at rest.",
        "forward": "It moves forwards at a constant velocity.",
        "backward": "It moves backwards."
      },
      "hint": "Read the position at 2 s and at 4 s. Did it change?",
      "explanation": "The line is horizontal: the position stays at 4 m while 2 s pass, so the velocity is zero. Time keeps running while the object is still."
    },
    "graph-slope": {
      "prompt": "What is the object’s velocity from 0 s to 2 s?",
      "options": {
        "plus2": "+2 m/s",
        "plus4": "+4 m/s",
        "minus2": "−2 m/s"
      },
      "hint": "Velocity is the slope: the change in position divided by the change in time.",
      "explanation": "The position goes from 0 m to 4 m in 2 s, so the slope is (4 − 0) m / (2 − 0) s = +2 m/s. The final position, 4 m, is not the velocity."
    },
    "graph-average": {
      "prompt": "What is the object’s average velocity over the whole 6 s?",
      "options": {
        "zero": "0 m/s",
        "speed": "+1.3 m/s (8 m of path in 6 s)",
        "plus2": "+2 m/s"
      },
      "hint": "Average velocity is displacement divided by time. Where does the object finish?",
      "explanation": "The object finishes at 0 m, where it started, so its displacement is zero and its average velocity is 0 m/s. Its average speed is different: 8 m of path in 6 s, about 1.3 m/s."
    },
    "graph-corners": {
      "prompt": "The graph has sharp corners at 2 s and 4 s. What would a sharp corner mean for a real object?",
      "options": {
        "instant": "The velocity would change in no time, which needs an infinitely large acceleration; a real graph has rounded corners.",
        "clock": "Time stops for an instant at each corner.",
        "normal": "Nothing special: real motion often has sharp corners."
      },
      "hint": "The slope is the velocity. How long does the slope take to change at a corner?",
      "explanation": "At a corner the slope jumps from one value to another instantly, so a = Δv/Δt would be infinite. Changing velocity takes a force acting over some time, so a real x–t graph bends smoothly between its straight parts. Sharp corners are an idealisation of the model, which the experiment uses too."
    },
    "orbit-string": {
      "prompt": "You whirl a ball on a string in a horizontal circle, and the string snaps. Which way does the ball fly off?",
      "options": {
        "tangent": "Straight on, along the direction it was moving at that moment",
        "outward": "Straight outwards, away from the centre",
        "centre": "Towards the centre"
      },
      "hint": "Once the string breaks, no force acts sideways. What does an object do when no net force acts on it?",
      "explanation": "The string supplied the force towards the centre that kept bending the path. Without it, the ball carries on in a straight line along its velocity at that moment, tangent to the circle. Nothing was pulling it outwards; the satellite in the experiment would do the same if gravity were switched off."
    }
  },
  "id": {
    "walk": {
      "prompt": "Seorang siswa berjalan 3 m ke timur, lalu 3 m ke barat hingga kembali ke titik awal. Berapa perpindahannya?",
      "options": {
        "zero": "0 m",
        "six": "6 m ke timur",
        "three": "3 m ke barat"
      },
      "hint": "Perpindahan bergantung pada perubahan posisi awal ke posisi akhir, bukan total lintasan.",
      "explanation": "Siswa berakhir di tempat semula, sehingga posisi akhir dikurangi posisi awal sama dengan nol. Jarak tempuhnya 6 m, tetapi perpindahannya 0 m."
    },
    "period": {
      "prompt": "Sebuah pendulum menyelesaikan 10 ayunan penuh dalam 20 detik. Berapa periodenya?",
      "options": {
        "two": "2 detik",
        "ten": "10 detik",
        "two-hundred": "200 detik"
      },
      "hint": "Bagi total waktu dengan jumlah siklus lengkap.",
      "explanation": "Periode adalah waktu per siklus: T = 20 s ÷ 10 = 2 s."
    },
    "net-force": {
      "prompt": "Sebuah kereta bermassa 2 kg mengalami gaya resultan 10 N. Berapa percepatannya?",
      "options": {
        "five": "5 m/s²",
        "twenty": "20 m/s²",
        "point-two": "0,2 m/s²"
      },
      "hint": "Gunakan hukum kedua Newton: percepatan sama dengan gaya resultan dibagi massa.",
      "explanation": "a = Fnet / m = 10 N / 2 kg = 5 m/s². Percepatan searah dengan gaya resultan."
    },
    "momentum": {
      "prompt": "Dua kereta bertumbukan dalam sistem terisolasi. Besaran apa yang kekal pada setiap tumbukan?",
      "options": {
        "momentum": "Momentum total",
        "kinetic": "Energi kinetik total",
        "speed": "Kelajuan setiap kereta"
      },
      "hint": "Pikirkan besaran total untuk sistem dua kereta, bukan gerak masing-masing kereta.",
      "explanation": "Momentum total kekal jika impuls eksternal resultan pada sistem sama dengan nol. Energi kinetik hanya kekal pada tumbukan lenting; kelajuan tiap kereta umumnya berubah."
    },
    "simultaneity": {
      "prompt": "Dua pengamat bergerak relatif satu sama lain. Pernyataan mana yang benar dalam relativitas khusus?",
      "options": {
        "same-time": "Mereka harus sepakat apakah dua peristiwa berjauhan terjadi serentak.",
        "frame-time": "Mereka dapat berbeda pendapat tentang keserentakan, tetapi sepakat tentang peristiwanya.",
        "absolute": "Mereka selalu mengukur waktu berlalu yang sama antara dua peristiwa."
      },
      "hint": "Bedakan apakah suatu peristiwa terjadi dengan apakah dua peristiwa terpisah terjadi pada waktu yang sama.",
      "explanation": "Pengamat sepakat tentang peristiwanya, tetapi dapat menetapkan koordinat waktu berbeda dan tidak sepakat tentang keserentakan. Waktu wajar diukur sepanjang garis dunia jam tertentu."
    },
    "gravity-clock": {
      "prompt": "Dalam perbandingan dilatasi waktu gravitasi sederhana, jam mana yang berjalan lebih lambat dibandingkan jam yang lebih jauh dari massa bola terisolasi?",
      "options": {
        "deeper": "Jam yang lebih dekat ke massa, lebih dalam di medan gravitasi",
        "farther": "Jam yang lebih jauh dari massa",
        "same": "Kedua jam selalu berjalan dengan laju yang sama"
      },
      "hint": "Bandingkan jam yang lebih dalam pada potensial gravitasi dengan jam yang lebih jauh, menurut pengamat jauh.",
      "explanation": "Dalam model bola statis, jam yang lebih dalam di medan gravitasi (radius lebih kecil di luar massa) mengakumulasi waktu wajar lebih sedikit dibandingkan jam statis yang jauh. Perbandingan bergantung pada pengamat dan model ruang-waktu."
    },
    "graph-stop": {
      "prompt": "Sebuah kereta bergerak di lintasan, berhenti selama 5 detik, lalu bergerak lagi. Seperti apa grafik posisi–waktunya selama berhenti?",
      "options": {
        "flat": "Garis horizontal: waktu berjalan, posisi tetap",
        "gap": "Celah: tidak ada waktu yang berlalu saat berhenti",
        "vertical": "Garis vertikal",
        "down": "Garis yang turun ke nol"
      },
      "hint": "Waktu berada pada sumbu horizontal. Apakah jam berhenti ketika kereta berhenti?",
      "explanation": "Selama kereta diam, posisinya tidak berubah, tetapi waktu terus berjalan, sehingga grafiknya mendatar. Garis datar berarti kecepatan nol, bukan waktu yang berhenti."
    },
    "rotated": {
      "prompt": "Perpindahan sebuah drone adalah (3, 4, 0) m dalam satu sistem koordinat. Sistem kedua memiliki sumbu yang diputar 90° terhadap z. Berapa besar perpindahan dalam sistem kedua?",
      "options": {
        "five": "5 m",
        "seven": "7 m",
        "depends": "Bergantung pada arah putaran sumbu",
        "zero": "0 m"
      },
      "hint": "Memutar sumbu mengubah komponen. Apakah panahnya sendiri berubah?",
      "explanation": "|Δr| = √(3² + 4²) = 5 m dalam setiap sistem koordinat. Memutar sumbu mengubah komponennya, di sini menjadi (4, −3, 0) m atau (−4, 3, 0) m bergantung pada arah putaran, tetapi tidak mengubah panjangnya."
    },
    "quarter-g": {
      "prompt": "Sebuah jam pendulum memiliki periode 2,0 s di Bumi. Jam itu dibawa ke dunia dengan g seperempat g Bumi. Berapa periodenya di sana?",
      "options": {
        "four": "4,0 s",
        "eight": "8,0 s",
        "one": "1,0 s",
        "two": "2,0 s"
      },
      "hint": "T = 2π√(L/g). Apa yang terjadi pada √(1/g) jika g dibagi 4?",
      "explanation": "T sebanding dengan 1/√g. Membagi g dengan 4 mengalikan T dengan √4 = 2, sehingga periodenya menjadi 4,0 s dan jam berjalan setengah kecepatan."
    },
    "tilted-book": {
      "prompt": "Sebuah buku diam di atas meja yang sedikit miring tanpa meluncur. Gaya apa yang mencegahnya meluncur ke bawah?",
      "options": {
        "static": "Gaya gesek statis dari meja, mengarah ke atas bidang",
        "normal": "Gaya normal dari meja",
        "weight": "Beratnya",
        "none": "Tidak perlu gaya: buku sedang diam"
      },
      "hint": "Gambarkan diagram benda bebas. Gaya mana yang dapat mengarah sepanjang permukaan meja?",
      "explanation": "Berat memiliki komponen ke bawah bidang. Gaya normal tegak lurus permukaan, sehingga tidak dapat meniadakan komponen itu; gaya gesek statis sepanjang permukaanlah yang meniadakannya, selama kemiringan tidak lebih curam daripada tan θ = μs."
    },
    "drop-throw": {
      "prompt": "Dari ketinggian yang sama, satu bola dilempar mendatar dan bola lain dijatuhkan pada saat yang sama. Tanpa hambatan udara, bola mana yang mendarat lebih dulu?",
      "options": {
        "same": "Keduanya mendarat bersamaan",
        "dropped": "Bola yang dijatuhkan",
        "thrown": "Bola yang dilempar"
      },
      "hint": "Gerak horizontal dan vertikal saling bebas. Berapa kecepatan vertikal awal setiap bola?",
      "explanation": "Keduanya mulai dengan kecepatan vertikal nol dan memiliki percepatan vertikal g yang sama, sehingga keduanya jatuh setinggi yang sama dalam waktu yang sama. Bola yang dilempar juga bergerak ke samping, tetapi itu tidak mengubah jatuhnya."
    },
    "horizontal-range": {
      "prompt": "Sebuah bola dilempar mendatar dengan 10 m/s dari ketinggian 20 m (ambil g = 10 m/s², tanpa udara). Seberapa jauh dari kaki menara bola mendarat?",
      "options": {
        "twenty": "20 m",
        "ten": "10 m",
        "forty": "40 m",
        "two": "2 m"
      },
      "hint": "Cari dulu waktu jatuh dari h = ½gt², lalu kalikan dengan kelajuan horizontal.",
      "explanation": "20 = ½ × 10 × t² memberi t = 2 s. Kelajuan horizontal tetap 10 m/s, sehingga bola mendarat 10 × 2 = 20 m jauhnya."
    },
    "both-slow": {
      "prompt": "Sebuah pesawat melintasi Bumi dengan 0,6c. Pengamat Bumi mengatakan jam pesawat berjalan lambat; awak pesawat mengatakan jam Bumi yang berjalan lambat. Dapatkah keduanya benar?",
      "options": {
        "both": "Ya: masing-masing membandingkan jam pihak lain dengan jam di kerangkanya sendiri",
        "earth": "Tidak: hanya Bumi yang benar karena Bumi tidak bergerak",
        "ship": "Tidak: hanya awak yang benar",
        "neither": "Tidak: jam yang bergerak tidak benar-benar melambat"
      },
      "hint": "Setiap pengamat diam dalam kerangkanya sendiri. Apa yang dipakai masing-masing untuk menilai jam pihak lain?",
      "explanation": "Dilatasi waktu bersifat timbal balik. Setiap pengamat membandingkan satu jam yang bergerak dengan dua jam miliknya yang tersinkronisasi, dan keduanya tidak sepakat tentang keserempakan, sehingga kedua pernyataan berlaku tanpa kontradiksi. Kontradiksi baru mungkin muncul jika kedua jam bertemu lagi, seperti pada paradoks kembar, ketika salah satunya berbalik arah."
    },
    "muon": {
      "prompt": "Muon yang diam hidup sekitar 2,2 μs. Muon yang tercipta di atmosfer atas bergerak dengan 0,995c (γ ≈ 10). Berapa lama ia hidup dalam kerangka Bumi?",
      "options": {
        "twentytwo": "Sekitar 22 μs",
        "two": "2,2 μs",
        "point-two": "Sekitar 0,22 μs",
        "forever": "Selamanya: ia bergerak hampir secepat cahaya"
      },
      "hint": "Jamnya sendiri mengukur waktu wajar. Bumi melihat jam itu berjalan lambat dengan faktor γ.",
      "explanation": "Δt = γτ ≈ 10 × 2,2 μs = 22 μs. Dalam waktu itu muon menempuh sekitar 6,6 km, cukup jauh untuk mencapai tanah, dan itulah yang teramati. Dalam kerangka muon, justru atmosferlah yang mengalami kontraksi."
    },
    "fifty-metre": {
      "prompt": "Pesawat sepanjang 50 m melintasi Bumi dengan 0,8c. Berapa panjang yang diukur pengamat Bumi jika kedua ujung dicatat pada saat yang sama?",
      "options": {
        "thirty": "30 m",
        "fifty": "50 m",
        "eighty-three": "Sekitar 83 m",
        "zero": "0 m"
      },
      "hint": "Pada 0,8c, γ = 5/3. Apakah panjang terukur lebih panjang atau lebih pendek daripada panjang wajar?",
      "explanation": "L = L₀/γ = 50 m × 3/5 = 30 m. Awak tetap mengukur 50 m: pesawatnya tidak tertekan. Kedua kerangka tidak sepakat tentang peristiwa ujung mana yang serempak."
    },
    "gps": {
      "prompt": "Dibandingkan jam di permukaan Bumi, jam satelit GPS bertambah cepat sekitar 45 μs per hari karena gravitasi lebih lemah di sana, dan melambat sekitar 7 μs per hari karena bergerak. Apa efek bersihnya?",
      "options": {
        "gain38": "Lebih cepat sekitar 38 μs per hari",
        "lose38": "Lebih lambat sekitar 38 μs per hari",
        "gain52": "Lebih cepat sekitar 52 μs per hari",
        "none": "Tidak ada efek: keduanya saling meniadakan"
      },
      "hint": "Kedua efek bertanda berlawanan. Jumlahkan.",
      "explanation": "+45 − 7 ≈ +38 μs per hari. Cahaya menempuh 300 m dalam satu mikrodetik, sehingga tanpa koreksi galat posisi akan bertambah sekitar 11 km per hari. Jam satelit disesuaikan sebelum peluncuran, dan penerima menerapkan koreksi lanjutan."
    },
    "free-fall": {
      "prompt": "Astronaut melayang di dalam stasiun luar angkasa yang mengorbit 400 km di atas Bumi, tempat gravitasi masih sekitar 90 % sekuat di permukaan. Mengapa mereka melayang?",
      "options": {
        "falling": "Mereka dan stasiun jatuh bebas bersama-sama",
        "no-gravity": "Tidak ada gravitasi di orbit",
        "too-far": "Mereka terlalu jauh untuk ditarik Bumi",
        "air": "Udara di dalam stasiun menahan mereka"
      },
      "hint": "Apa yang akan terjadi pada stasiun jika gravitasi benar-benar hilang?",
      "explanation": "Stasiun dan semua orang di dalamnya jatuh bebas, mengikuti lintasan yang sama mengelilingi Bumi, sehingga tidak ada yang menekan mereka ke lantai. Dalam relativitas umum, lintasan jatuh bebas itu adalah geodesik: tidak ada gaya yang dirasakan di sepanjangnya."
    },
    "receding": {
      "prompt": "Galaksi-galaksi jauh bergerak menjauhi kita, dan makin jauh sebuah galaksi, makin cepat ia menjauh. Apa yang ditunjukkan hal ini?",
      "options": {
        "expanding": "Ruang mengembang di mana-mana, tanpa pusat",
        "centre": "Kita berada di pusat sebuah ledakan",
        "shrinking": "Galaksi-galaksi itu menyusut",
        "push": "Bimasakti mendorong galaksi lain menjauh"
      },
      "hint": "Bayangkan titik-titik pada balon yang ditiup. Apa yang dilihat setiap titik?",
      "explanation": "Dalam alam semesta yang mengembang secara seragam, setiap pengamat melihat pola yang sama: laju menjauh sebanding dengan jarak (hukum Hubble). Jadi pola ini tidak menunjuk satu pusat, dan galaksi kita tidak istimewa."
    },
    "redshift-one": {
      "prompt": "Cahaya dari sebuah galaksi tiba dengan pergeseran merah z = 1. Dengan faktor berapa alam semesta telah mengembang sejak cahaya itu dipancarkan?",
      "options": {
        "two": "Ukurannya menjadi dua kali lipat",
        "one": "Tidak mengembang",
        "ten": "Sepuluh kali",
        "half": "Menjadi setengahnya"
      },
      "hint": "Dalam alam semesta yang mengembang, 1 + z sama dengan rasio faktor skala sekarang terhadap faktor skala saat cahaya dipancarkan.",
      "explanation": "1 + z = a_sekarang / a_dulu = 2, sehingga jarak antargalaksi yang bergerak bersama ruang telah menjadi dua kali lipat sejak cahaya berangkat. Panjang gelombang cahaya teregang dengan faktor yang sama."
    },
    "graph-rest": {
      "prompt": "Apa yang dilakukan benda antara 2 s dan 4 s?",
      "options": {
        "rest": "Benda diam.",
        "forward": "Benda bergerak maju dengan kecepatan tetap.",
        "backward": "Benda bergerak mundur."
      },
      "hint": "Baca posisi pada 2 s dan pada 4 s. Apakah berubah?",
      "explanation": "Garisnya mendatar: posisi tetap 4 m selama 2 s berlalu, sehingga kecepatannya nol. Waktu terus berjalan meskipun benda diam."
    },
    "graph-slope": {
      "prompt": "Berapa kecepatan benda dari 0 s hingga 2 s?",
      "options": {
        "plus2": "+2 m/s",
        "plus4": "+4 m/s",
        "minus2": "−2 m/s"
      },
      "hint": "Kecepatan adalah kemiringan: perubahan posisi dibagi perubahan waktu.",
      "explanation": "Posisi berubah dari 0 m menjadi 4 m dalam 2 s, jadi kemiringannya (4 − 0) m / (2 − 0) s = +2 m/s. Posisi akhir, 4 m, bukanlah kecepatan."
    },
    "graph-average": {
      "prompt": "Berapa kecepatan rata-rata benda selama seluruh 6 s?",
      "options": {
        "zero": "0 m/s",
        "speed": "+1,3 m/s (lintasan 8 m dalam 6 s)",
        "plus2": "+2 m/s"
      },
      "hint": "Kecepatan rata-rata adalah perpindahan dibagi waktu. Di mana benda berakhir?",
      "explanation": "Benda berakhir di 0 m, tempat ia memulai, sehingga perpindahannya nol dan kecepatan rata-ratanya 0 m/s. Kelajuan rata-ratanya berbeda: lintasan 8 m dalam 6 s, sekitar 1,3 m/s."
    },
    "graph-corners": {
      "prompt": "Grafik memiliki sudut tajam pada 2 s dan 4 s. Apa arti sudut tajam bagi benda nyata?",
      "options": {
        "instant": "Kecepatan akan berubah tanpa selang waktu, yang memerlukan percepatan tak hingga; grafik nyata memiliki sudut yang membulat.",
        "clock": "Waktu berhenti sesaat di setiap sudut.",
        "normal": "Tidak ada yang istimewa: gerak nyata sering memiliki sudut tajam."
      },
      "hint": "Kemiringan adalah kecepatan. Berapa lama kemiringan berubah di sebuah sudut?",
      "explanation": "Di sebuah sudut, kemiringan melompat dari satu nilai ke nilai lain seketika, sehingga a = Δv/Δt akan tak hingga. Mengubah kecepatan memerlukan gaya yang bekerja selama selang waktu tertentu, jadi grafik x–t nyata melengkung mulus di antara bagian lurusnya. Sudut tajam adalah idealisasi model, yang juga digunakan dalam eksperimen."
    },
    "orbit-string": {
      "prompt": "Anda memutar bola bertali dalam lingkaran horizontal, lalu talinya putus. Ke mana bola terlempar?",
      "options": {
        "tangent": "Lurus ke depan, searah geraknya pada saat itu",
        "outward": "Lurus ke luar, menjauhi pusat",
        "centre": "Menuju pusat"
      },
      "hint": "Setelah tali putus, tidak ada gaya ke samping. Apa yang dilakukan benda jika tidak ada gaya resultan padanya?",
      "explanation": "Tali memberikan gaya menuju pusat yang terus membelokkan lintasan. Tanpa tali, bola terus bergerak lurus searah kecepatannya saat itu, menyinggung lingkaran. Tidak ada yang menariknya ke luar; satelit dalam eksperimen akan melakukan hal yang sama jika gravitasi dimatikan."
    }
  },
  "ja": {
    "walk": {
      "prompt": "生徒が東へ3 m歩き、その後西へ3 m戻って出発点に着きました。変位はいくらですか？",
      "options": {
        "zero": "0 m",
        "six": "東へ6 m",
        "three": "西へ3 m"
      },
      "hint": "変位は移動距離の合計ではなく、初期位置から最終位置への変化です。",
      "explanation": "出発点に戻るため、最終位置から初期位置を引くと0です。移動距離は6 mですが、変位は0 mです。"
    },
    "period": {
      "prompt": "振り子が20秒間に10往復しました。周期はいくらですか？",
      "options": {
        "two": "2秒",
        "ten": "10秒",
        "two-hundred": "200秒"
      },
      "hint": "経過時間の合計を完全なサイクル数で割ります。",
      "explanation": "周期は1サイクルあたりの時間です。T = 20 s ÷ 10 = 2 s です。"
    },
    "net-force": {
      "prompt": "質量2 kgの台車に合力10 Nが働きます。加速度はいくらですか？",
      "options": {
        "five": "5 m/s²",
        "twenty": "20 m/s²",
        "point-two": "0.2 m/s²"
      },
      "hint": "ニュートンの第2法則を使います。加速度は合力を質量で割った値です。",
      "explanation": "a = Fnet / m = 10 N / 2 kg = 5 m/s² です。加速度の向きは合力と同じです。"
    },
    "momentum": {
      "prompt": "孤立系で2台の台車が衝突します。弾性衝突でも非弾性衝突でも保存される量はどれですか？",
      "options": {
        "momentum": "全運動量",
        "kinetic": "全運動エネルギー",
        "speed": "各台車の速さ"
      },
      "hint": "各台車の運動ではなく、2台を合わせた系全体について考えます。",
      "explanation": "外部からの合力積がゼロなら全運動量は保存されます。運動エネルギーが保存されるのは弾性衝突の場合だけです。"
    },
    "simultaneity": {
      "prompt": "互いに相対運動する2人の観測者について、特殊相対性理論で正しい説明はどれですか？",
      "options": {
        "same-time": "離れた2つの事象が同時かどうか必ず一致する。",
        "frame-time": "事象そのものには同意しながら、同時性について異なる判断をすることがある。",
        "absolute": "どの2事象間でも常に同じ経過時間を測る。"
      },
      "hint": "事象が起きたことと、離れた2つの事象が同時に起きたかどうかを分けて考えましょう。",
      "explanation": "観測者は事象そのものには同意しますが、時間座標が異なり、同時性について異なる判断をすることがあります。固有時は特定の時計の世界線に沿って測る経過時間です。"
    },
    "gravity-clock": {
      "prompt": "単純な重力による時間の遅れの比較で、遠方の時計に比べて遅く進むのはどちらですか？",
      "options": {
        "deeper": "質量に近く、重力場のより深い場所にある時計",
        "farther": "質量から遠い時計",
        "same": "どちらの時計も常に同じ速さで進む"
      },
      "hint": "遠方の基準時計から見て、重力ポテンシャルの深い時計と遠い時計を比較しましょう。",
      "explanation": "静的な球対称モデルでは、重力場のより深い場所（質量の外側で半径が小さい場所）の時計は、遠方の静止時計に比べて蓄積する固有時が少なくなります。"
    },
    "graph-stop": {
      "prompt": "台車が軌道上を動き、5秒間止まってから再び動きます。止まっている間の位置–時間グラフはどうなりますか。",
      "options": {
        "flat": "水平な線：時間は進み、位置は変わらない",
        "gap": "途切れる：止まっている間は時間が経たない",
        "vertical": "垂直な線",
        "down": "ゼロまで下がる線"
      },
      "hint": "時間は横軸です。台車が止まると時計も止まるでしょうか。",
      "explanation": "台車が静止している間、位置は変わりませんが時間は進み続けるので、グラフは水平になります。平らな線は速度ゼロを意味し、時間が止まったことを意味しません。"
    },
    "rotated": {
      "prompt": "あるドローンの変位は、ある座標系で (3, 4, 0) m です。z軸の周りに軸を90°回転させた第2の座標系では、変位の大きさはいくらですか。",
      "options": {
        "five": "5 m",
        "seven": "7 m",
        "depends": "軸の回し方によって変わる",
        "zero": "0 m"
      },
      "hint": "軸を回すと成分は変わります。矢印そのものは変わるでしょうか。",
      "explanation": "どの座標系でも |Δr| = √(3² + 4²) = 5 m です。軸を回転させると成分は（回転の向きに応じて (4, −3, 0) m または (−4, 3, 0) m に）変わりますが、長さは変わりません。"
    },
    "quarter-g": {
      "prompt": "地球上で周期2.0 sの振り子時計を、重力加速度gが地球の4分の1の世界へ持っていきます。そこでの周期はいくらですか。",
      "options": {
        "four": "4.0 s",
        "eight": "8.0 s",
        "one": "1.0 s",
        "two": "2.0 s"
      },
      "hint": "T = 2π√(L/g) です。gを4で割ると√(1/g)はどうなるでしょうか。",
      "explanation": "Tは1/√gに比例します。gを4で割るとTは√4 = 2倍になるので、周期は4.0 sとなり、時計は半分の速さで進みます。"
    },
    "tilted-book": {
      "prompt": "少し傾いた机の上で本が滑らずに静止しています。本が滑り落ちるのを止めている力はどれですか。",
      "options": {
        "static": "机からの静止摩擦力（斜面に沿って上向き）",
        "normal": "机からの垂直抗力",
        "weight": "本の重さ",
        "none": "静止しているので力は必要ない"
      },
      "hint": "自由物体図を描きましょう。机の面に沿った向きを向ける力はどれでしょうか。",
      "explanation": "重さには斜面に沿って下向きの成分があります。垂直抗力は面に垂直なのでこの成分を打ち消せません。打ち消すのは面に沿った静止摩擦力で、傾きが tan θ = μs より急でない限り本は止まっています。"
    },
    "drop-throw": {
      "prompt": "同じ高さから、一方のボールを水平に投げ、もう一方を同時に落とします。空気抵抗を無視すると、先に着地するのはどちらですか。",
      "options": {
        "same": "同時に着地する",
        "dropped": "落としたボール",
        "thrown": "投げたボール"
      },
      "hint": "水平方向と鉛直方向の運動は独立です。それぞれのボールの最初の鉛直速度はいくらでしょうか。",
      "explanation": "どちらも鉛直速度ゼロから始まり、同じ鉛直加速度gを受けるので、同じ高さを同じ時間で落ちます。投げたボールは横にも動きますが、落下には影響しません。"
    },
    "horizontal-range": {
      "prompt": "高さ20 mから、ボールを水平に10 m/sで投げます（g = 10 m/s²、空気なしとします）。真下から何m離れた所に着地しますか。",
      "options": {
        "twenty": "20 m",
        "ten": "10 m",
        "forty": "40 m",
        "two": "2 m"
      },
      "hint": "まず h = ½gt² から落下時間を求め、水平方向の速さを掛けましょう。",
      "explanation": "20 = ½ × 10 × t² より t = 2 s です。水平方向の速さは10 m/sのままなので、10 × 2 = 20 m離れた所に着地します。"
    },
    "both-slow": {
      "prompt": "宇宙船が0.6cで地球のそばを通過します。地球の観測者は宇宙船の時計が遅れると言い、乗組員は地球の時計が遅れると言います。両方とも正しいことはありえますか。",
      "options": {
        "both": "はい：それぞれが相手の時計を自分の基準系の時計と比べている",
        "earth": "いいえ：地球は動いていないので、地球だけが正しい",
        "ship": "いいえ：乗組員だけが正しい",
        "neither": "いいえ：動く時計が本当に遅れることはない"
      },
      "hint": "各観測者は自分の基準系で静止しています。それぞれは何を使って相手の時計を判断しているでしょうか。",
      "explanation": "時間の遅れは相互的です。各観測者は1つの動く時計を、自分の同期した2つの時計と比べます。そして二人は同時性について一致しないので、矛盾なく両方の主張が成り立ちます。矛盾が生じうるのは、双子のパラドックスのように一方が向きを変えて2つの時計が再会する場合だけです。"
    },
    "muon": {
      "prompt": "静止したミューオンの寿命は約2.2 μsです。大気上層で生まれたミューオンが0.995c（γ ≈ 10）で動くとき、地球の基準系での寿命はどれくらいですか。",
      "options": {
        "twentytwo": "約22 μs",
        "two": "2.2 μs",
        "point-two": "約0.22 μs",
        "forever": "永遠：ほぼ光速で動くから"
      },
      "hint": "ミューオン自身の時計は固有時を測ります。地球からはその時計がγ倍遅れて見えます。",
      "explanation": "Δt = γτ ≈ 10 × 2.2 μsで、約22 μsです。その間に約6.6 km進むので地表まで届き、実際にそれが観測されています。ミューオンの基準系では、代わりに大気の方が縮んでいます。"
    },
    "fifty-metre": {
      "prompt": "長さ50 mの宇宙船が0.8cで地球のそばを通過します。両端を同時に記録すると、地球の観測者が測る長さはいくらですか。",
      "options": {
        "thirty": "30 m",
        "fifty": "50 m",
        "eighty-three": "約83 m",
        "zero": "0 m"
      },
      "hint": "0.8cではγ = 5/3です。測定される長さは固有長より長いでしょうか、短いでしょうか。",
      "explanation": "L = L₀/γ = 50 m × 3/5 = 30 mです。乗組員は今も50 mと測ります。宇宙船が押し縮められているわけではありません。二つの基準系は、どの両端の事象が同時かについて一致しないのです。"
    },
    "gps": {
      "prompt": "地上の時計と比べると、GPS衛星の時計は上空の重力が弱いために1日あたり約45 μs進み、運動のために1日あたり約7 μs遅れます。正味の効果はどうなりますか。",
      "options": {
        "gain38": "1日あたり約38 μs進む",
        "lose38": "1日あたり約38 μs遅れる",
        "gain52": "1日あたり約52 μs進む",
        "none": "二つが打ち消し合い、効果はない"
      },
      "hint": "二つの効果は符号が逆です。足し合わせましょう。",
      "explanation": "+45 − 7 ≈ +38 μs/日です。光は1マイクロ秒で300 m進むので、補正しなければ位置の誤差は1日あたり約11 kmずつ増えていきます。衛星の時計は打ち上げ前に調整され、受信機でもさらに補正が行われます。"
    },
    "free-fall": {
      "prompt": "地上400 kmを周回する宇宙ステーションの中で、宇宙飛行士が浮かんでいます。そこでも重力は地表の約90 %あります。なぜ浮かぶのでしょうか。",
      "options": {
        "falling": "宇宙飛行士とステーションが一緒に自由落下しているから",
        "no-gravity": "軌道上には重力がないから",
        "too-far": "地球から遠すぎて引かれないから",
        "air": "中の空気が支えているから"
      },
      "hint": "もし重力が本当になくなったら、ステーションはどうなるでしょうか。",
      "explanation": "ステーションと中の人はみな自由落下し、地球の周りの同じ経路をたどっているので、床に押し付けられることがありません。一般相対性理論では、この自由落下の経路が測地線であり、その上では力を感じません。"
    },
    "receding": {
      "prompt": "遠くの銀河は私たちから遠ざかっており、遠い銀河ほど速く遠ざかっています。これは何を示しているでしょうか。",
      "options": {
        "expanding": "中心のない形で、空間がどこでも膨張している",
        "centre": "私たちは爆発の中心にいる",
        "shrinking": "銀河が縮んでいる",
        "push": "天の川銀河がほかの銀河を押しのけている"
      },
      "hint": "膨らんでいく風船の上の点を想像しましょう。どの点からはどう見えるでしょうか。",
      "explanation": "一様に膨張する宇宙では、どの観測者にも同じパターン、つまり距離に比例した後退速度（ハッブルの法則）が見えます。このパターンは特定の中心を示さず、私たちの銀河は特別ではありません。"
    },
    "redshift-one": {
      "prompt": "ある銀河からの光が赤方偏移 z = 1 で届きました。光が出発してから、宇宙は何倍に膨張したでしょうか。",
      "options": {
        "two": "2倍の大きさになった",
        "one": "膨張していない",
        "ten": "10倍",
        "half": "半分になった"
      },
      "hint": "膨張する宇宙では、1 + z は現在のスケール因子と光が出たときのスケール因子の比に等しくなります。",
      "explanation": "1 + z = a現在 / a当時 = 2 なので、共動する銀河どうしの距離は光が出発してから2倍になりました。光の波長も同じ倍率で引き伸ばされています。"
    },
    "graph-rest": {
      "prompt": "2秒から4秒の間、物体はどうしていますか。",
      "options": {
        "rest": "静止している。",
        "forward": "一定の速度で前に進んでいる。",
        "backward": "後ろ向きに動いている。"
      },
      "hint": "2秒と4秒での位置を読み取りましょう。変わっていますか。",
      "explanation": "線は水平です。2秒が経過する間、位置は4 mのままなので、速度はゼロです。物体が止まっていても時間は進み続けます。"
    },
    "graph-slope": {
      "prompt": "0秒から2秒までの物体の速度はいくらですか。",
      "options": {
        "plus2": "+2 m/s",
        "plus4": "+4 m/s",
        "minus2": "−2 m/s"
      },
      "hint": "速度は傾きです。位置の変化を時間の変化で割ります。",
      "explanation": "2秒間で位置が0 mから4 mになるので、傾きは (4 − 0) m / (2 − 0) s = +2 m/s です。最後の位置4 mは速度ではありません。"
    },
    "graph-average": {
      "prompt": "6秒間全体での物体の平均速度はいくらですか。",
      "options": {
        "zero": "0 m/s",
        "speed": "+1.3 m/s（6秒で8 mの道のり）",
        "plus2": "+2 m/s"
      },
      "hint": "平均速度は変位を時間で割ったものです。物体はどこで終わりますか。",
      "explanation": "物体は出発点の0 mで終わるので、変位はゼロで、平均速度は0 m/sです。平均の速さは別で、6秒で8 mの道のり、約1.3 m/sです。"
    },
    "graph-corners": {
      "prompt": "グラフには2秒と4秒に鋭い角があります。実際の物体にとって、鋭い角は何を意味しますか。",
      "options": {
        "instant": "速度が一瞬で変わることになり、無限大の加速度が必要です。実際のグラフの角は丸くなります。",
        "clock": "角のところで時間が一瞬止まる。",
        "normal": "特に意味はない。実際の運動にも鋭い角はよくある。"
      },
      "hint": "傾きは速度です。角のところで、傾きが変わるのにどれだけ時間がかかりますか。",
      "explanation": "角では傾きが一瞬で別の値に跳ぶので、a = Δv/Δt は無限大になります。速度を変えるには力がある時間働く必要があるので、実際の x–t グラフは直線部分の間でなめらかに曲がります。鋭い角はモデルの理想化で、実験でも同じ理想化を使っています。"
    },
    "orbit-string": {
      "prompt": "ひもにつけたボールを水平な円を描くように回していると、ひもが切れました。ボールはどちらへ飛んでいきますか。",
      "options": {
        "tangent": "その瞬間に動いていた向きにまっすぐ",
        "outward": "中心から離れる向きにまっすぐ外へ",
        "centre": "中心に向かって"
      },
      "hint": "ひもが切れると、横向きの力は働きません。合力が働かない物体はどう動きますか。",
      "explanation": "ひもは、経路を曲げ続ける中心向きの力を与えていました。それがなくなると、ボールはその瞬間の速度の向き、つまり円の接線方向にまっすぐ進みます。外向きに引くものはありません。実験の衛星も、重力がなくなれば同じように動きます。"
    }
  }
}

export interface LearningStep extends StepCopy {
  readonly path: string
  readonly title: string
  readonly summary: string
  /** Concept questions (no graph). */
  readonly questions: readonly PracticeQuestion[]
  /** Graph exercises: one graph each, with the questions read from it. */
  readonly graphs: readonly LearningGraph[]
  /** Numerical problems for the "Apply it" step, easiest first. */
  readonly problems: readonly PhysicsProblem[]
}
export interface LearningGraph extends GraphCopy {
  readonly id: string
  readonly graph: MotionGraph
  readonly questions: readonly PracticeQuestion[]
}
export interface LearningChapter {
  readonly number: number
  readonly title: string
  readonly role: string
  readonly prerequisites: string
  readonly steps: readonly LearningStep[]
}

const LEVEL_ORDER: Record<Level, number> = { beginner: 0, intermediate: 1, advanced: 2 }

function practiceFor(experiment: string, locale: Locale): PracticeQuestion[] {
  return PRACTICE_BANK
    .filter((q) => q.experiment === experiment)
    .sort((a, b) => LEVEL_ORDER[a.minLevel] - LEVEL_ORDER[b.minLevel])
    .map((q) => {
      const text = PRACTICE_COPY[locale][q.id] ?? PRACTICE_COPY.en[q.id]
      if (!text) throw new Error(`Missing practice copy for ${q.id}`)
      return {
        id: q.id, experiment: q.experiment, minLevel: q.minLevel, answer: q.answer, ...(q.graph ? { graph: q.graph } : {}),
        prompt: text.prompt, hint: text.hint, explanation: text.explanation,
        options: q.options.map((id) => ({ id, label: text.options[id] ?? id })),
      }
    })
}

/** Group a step's graph questions by graph, in the order their graphs first appear. */
function graphsFor(practice: readonly PracticeQuestion[], locale: Locale): LearningGraph[] {
  const ids = [...new Set(practice.flatMap((q) => (q.graph ? [q.graph] : [])))]
  return ids.map((id) => {
    const graph = GRAPHS[id]
    const copy = GRAPH_COPY[locale][id] ?? GRAPH_COPY.en[id]
    if (!graph || !copy) throw new Error(`Missing graph ${id}`)
    return { id, graph, ...copy, questions: practice.filter((q) => q.graph === id) }
  })
}

/** The whole path in one language: chapters and steps in catalogue order. */
export function getLearningPath(locale: Locale): { ui: LearningUi; chapters: LearningChapter[] } {
  const chapters = getLocalizedModules(locale).map((module) => ({
    number: module.number,
    title: module.title,
    role: module.role,
    prerequisites: CHAPTER_PREREQUISITES[locale][module.number] ?? CHAPTER_PREREQUISITES.en[module.number] ?? '',
    steps: module.experiments.flatMap((experiment) => {
      if (!experiment.path) return []
      const copy = STEP_COPY[locale][experiment.path] ?? STEP_COPY.en[experiment.path]
      if (!copy) return []
      const practice = practiceFor(experiment.path, locale)
      return [{
        ...copy, path: experiment.path, title: experiment.title, summary: experiment.summary,
        questions: practice.filter((q) => !q.graph),
        graphs: graphsFor(practice, locale),
        problems: problemsFor(experiment.path, locale),
      }]
    }),
  }))
  return { ui: UI[locale], chapters }
}
