import type { Locale } from '@/i18n/locales'

export interface LearningStep { title: string; idea: string; prerequisite: string; experiment: string; path: string }
export interface PracticeQuestion { prompt: string; options: readonly { id: string; label: string }[]; answer: string; hint: string; explanation: string }
export interface LearningPath { id: string; title: string; description: string; prerequisites: string; steps: readonly LearningStep[]; questions: readonly PracticeQuestion[] }
export interface LearningContent {
  eyebrow: string; title: string; intro: string; pathsLabel: string; prerequisitesLabel: string;
  sequenceLabel: string; practiceLabel: string; questionLabel: string; hintLabel: string;
  checkLabel: string; nextLabel: string; restartLabel: string; chooseLabel: string;
  correctLabel: string; incorrectLabel: string; explanationLabel: string; completeLabel: string; scoreLabel: string;
  paths: readonly LearningPath[]
}

const copy: Record<Locale, LearningContent> = {
  en: {
    eyebrow: 'A route through the experiments', title: 'Learn in a sequence. Practise as you go.',
    intro: 'Choose a learning path to see what to learn first, why each idea matters, and which experiment to try. Then check your understanding with short questions. Your answers stay in this session only.',
    pathsLabel: 'Choose a learning path', prerequisitesLabel: 'Before you begin', sequenceLabel: 'Your learning sequence',
    practiceLabel: 'Check your understanding', questionLabel: 'Question', hintLabel: 'Show a hint', checkLabel: 'Check answer',
    nextLabel: 'Next question', restartLabel: 'Try this path again', chooseLabel: 'Choose an answer to continue.',
    correctLabel: 'That is correct.', incorrectLabel: 'Not quite. Review the explanation, then try the idea in the experiment.',
    explanationLabel: 'Why?', completeLabel: 'Path practice complete', scoreLabel: 'Correct answers',
    paths: [
      {
        id: 'foundations', title: '1. Space, time and measurement',
        description: 'Build the basic language for describing where and when things happen.',
        prerequisites: 'You only need everyday ideas of position, distance and time. A coordinate is a way to describe a position; it is not the position itself.',
        steps: [
          { title: 'Position is not the same as time', idea: 'Describe where an object is and whether its position changes.', prerequisite: 'Position is measured relative to a chosen origin. Time tells when an event happens; it is a different quantity.', experiment: 'Space versus time', path: '/space/space-vs-time' },
          { title: 'Measure a change in position', idea: 'Compare the path travelled with the straight-line displacement from start to finish.', prerequisite: 'Be comfortable reading coordinates and subtracting an initial position from a final position.', experiment: 'Displacement in 3D', path: '/space/displacement-3d' },
          { title: 'A clock is a physical system', idea: 'Use repeated motion to measure time intervals and investigate what changes a clock’s period.', prerequisite: 'A period is the time for one complete cycle; frequency counts cycles per second.', experiment: 'Pendulum clocks', path: '/time/pendulum' }
        ],
        questions: [
          { prompt: 'A student walks 3 m east, then 3 m west back to the starting point. What is the student’s displacement?', options: [{ id: 'zero', label: '0 m' }, { id: 'six', label: '6 m east' }, { id: 'three', label: '3 m west' }], answer: 'zero', hint: 'Displacement depends on the change from the initial position to the final position, not the total path.', explanation: 'The student finishes where they started, so final position minus initial position is zero. Distance travelled is 6 m, but displacement is 0 m.' },
          { prompt: 'A pendulum completes 10 full swings in 20 seconds. What is its period?', options: [{ id: 'two', label: '2 seconds' }, { id: 'ten', label: '10 seconds' }, { id: 'two-hundred', label: '200 seconds' }], answer: 'two', hint: 'Divide the total elapsed time by the number of complete cycles.', explanation: 'The period is time per cycle: T = 20 s ÷ 10 = 2 s.' }
        ]
      },
      {
        id: 'motion', title: '2. Forces and motion',
        description: 'Connect velocity, acceleration, net force and momentum through experiments.',
        prerequisites: 'Distinguish position from displacement, and speed from velocity. Acceleration describes how velocity changes; net force is the vector sum of all forces.',
        steps: [
          { title: 'Acceleration responds to net force', idea: 'Change force and mass separately to test Newton’s second law.', prerequisite: 'Know how to calculate a change in velocity over time and recognise that forces have direction.', experiment: 'Force, mass and acceleration', path: '/mechanics/newtonian' },
          { title: 'Add forces with a free-body diagram', idea: 'Resolve forces into components and identify the net force along the direction of motion.', prerequisite: 'Review vector components and the difference between static and kinetic friction.', experiment: 'Force Lab', path: '/mechanics/force-lab' },
          { title: 'Momentum describes motion in a collision', idea: 'Compare momentum before and after a collision, and distinguish it from kinetic energy.', prerequisite: 'Momentum is mass multiplied by velocity, including its direction.', experiment: 'Momentum and collisions', path: '/mechanics/momentum-collisions' },
          { title: 'Combine horizontal and vertical motion', idea: 'Investigate how horizontal motion and vertical acceleration shape a projectile path.', prerequisite: 'Be familiar with velocity components and constant gravitational acceleration in the ideal model.', experiment: 'Projectile launcher', path: '/mechanics/projectile' }
        ],
        questions: [
          { prompt: 'A 2 kg cart experiences a net force of 10 N. What is its acceleration?', options: [{ id: 'five', label: '5 m/s²' }, { id: 'twenty', label: '20 m/s²' }, { id: 'point-two', label: '0.2 m/s²' }], answer: 'five', hint: 'Use Newton’s second law: acceleration equals net force divided by mass.', explanation: 'a = Fnet / m = 10 N / 2 kg = 5 m/s². Acceleration points in the direction of the net force.' },
          { prompt: 'Two carts collide in an isolated system. Which quantity is conserved in every collision, whether elastic or inelastic?', options: [{ id: 'momentum', label: 'Total momentum' }, { id: 'kinetic', label: 'Total kinetic energy' }, { id: 'speed', label: 'Each cart’s speed' }], answer: 'momentum', hint: 'Think about the total for the two-cart system, not either cart separately.', explanation: 'Total momentum is conserved when net external impulse is zero. Kinetic energy is conserved only in an elastic collision; individual cart speeds generally change.' }
        ]
      },
      {
        id: 'relativity', title: '3. Relativity and gravity',
        description: 'Carry ideas about measurement and motion into spacetime and gravitational models.',
        prerequisites: 'Start after the motion path. Be comfortable with velocity, reference frames and the idea that measurements need a defined observer and procedure.',
        steps: [
          { title: 'Observers can measure different elapsed times', idea: 'Compare clock readings for observers following different paths through spacetime.', prerequisite: 'Understand inertial reference frames and that a clock measures time along its own path.', experiment: 'Different clocks, different elapsed times', path: '/relativity/moving-clocks' },
          { title: 'Simultaneity depends on the reference frame', idea: 'Compare which events are simultaneous for observers in relative motion.', prerequisite: 'Review how positions and times transform between observers; distant clocks require synchronisation.', experiment: 'Space and time versus spacetime', path: '/relativity/two-perspectives' },
          { title: 'Measure a moving object consistently', idea: 'Record both endpoints at the same time in one frame before comparing lengths.', prerequisite: 'A length measurement requires simultaneous endpoint positions in the measuring frame.', experiment: 'Length Contraction', path: '/relativity/length-contraction' },
          { title: 'Gravity changes the geometry of motion', idea: 'Compare Newtonian orbits with free-fall paths in a curved-spacetime model.', prerequisite: 'Know Newtonian gravity as a useful approximation and distinguish a model from the system it represents.', experiment: 'Geodesic Motion Lab', path: '/gravity/geodesic-motion' }
        ],
        questions: [
          { prompt: 'Two observers move relative to one another. Which statement about their measurements is correct in special relativity?', options: [{ id: 'same-time', label: 'They must agree whether two distant events are simultaneous.' }, { id: 'frame-time', label: 'They can disagree about simultaneity while agreeing on the events themselves.' }, { id: 'absolute', label: 'They always measure the same elapsed time between any two events.' }], answer: 'frame-time', hint: 'Separate whether an event happened from whether two separated events happened at the same time.', explanation: 'Observers agree on the events but can assign different time coordinates and disagree about simultaneity. Proper time is measured along a particular clock’s worldline.' },
          { prompt: 'In a simple gravitational time-dilation comparison, which clock runs slower relative to a clock farther from an isolated spherical mass?', options: [{ id: 'deeper', label: 'The clock lower in the gravitational field' }, { id: 'farther', label: 'The clock farther from the mass' }, { id: 'same', label: 'Both clocks always run at the same rate' }], answer: 'deeper', hint: 'Compare a clock deeper in the gravitational potential with one farther away, as measured by a distant reference.', explanation: 'In the static spherical model, a clock deeper in the gravitational field (at a smaller radius outside the mass) accumulates less proper time relative to a distant static clock. The comparison depends on the observers and model specified.' }
        ]
      }
    ]
  },
  id: {
    eyebrow: 'Jalur belajar melalui eksperimen', title: 'Belajar secara bertahap. Berlatih di setiap langkah.',
    intro: 'Pilih jalur belajar untuk mengetahui apa yang perlu dipelajari terlebih dahulu, mengapa setiap gagasan penting, dan eksperimen mana yang dapat dicoba. Periksa pemahaman dengan soal singkat. Jawaban hanya tersimpan selama sesi ini.',
    pathsLabel: 'Pilih jalur belajar', prerequisitesLabel: 'Sebelum memulai', sequenceLabel: 'Urutan belajar',
    practiceLabel: 'Periksa pemahaman Anda', questionLabel: 'Soal', hintLabel: 'Tampilkan petunjuk', checkLabel: 'Periksa jawaban',
    nextLabel: 'Soal berikutnya', restartLabel: 'Ulangi jalur ini', chooseLabel: 'Pilih jawaban untuk melanjutkan.',
    correctLabel: 'Jawaban Anda benar.', incorrectLabel: 'Belum tepat. Pelajari penjelasannya, lalu coba gagasan ini dalam eksperimen.',
    explanationLabel: 'Mengapa?', completeLabel: 'Latihan jalur selesai', scoreLabel: 'Jawaban benar',
    paths: [
      {
        id: 'foundations', title: '1. Ruang, waktu, dan pengukuran', description: 'Bangun bahasa dasar untuk menjelaskan di mana dan kapan peristiwa terjadi.',
        prerequisites: 'Anda hanya memerlukan pemahaman sehari-hari tentang posisi, jarak, dan waktu. Koordinat adalah cara menyatakan posisi, bukan posisi itu sendiri.',
        steps: [
          { title: 'Posisi berbeda dari waktu', idea: 'Jelaskan letak benda dan apakah posisinya berubah.', prerequisite: 'Posisi diukur relatif terhadap titik asal yang dipilih. Waktu menyatakan kapan peristiwa terjadi; besaran ini berbeda.', experiment: 'Ruang versus waktu', path: '/space/space-vs-time' },
          { title: 'Ukur perubahan posisi', idea: 'Bandingkan panjang lintasan dengan perpindahan garis lurus dari awal hingga akhir.', prerequisite: 'Anda sebaiknya dapat membaca koordinat dan mengurangkan posisi awal dari posisi akhir.', experiment: 'Perpindahan dalam 3D', path: '/space/displacement-3d' },
          { title: 'Jam adalah sistem fisik', idea: 'Gunakan gerak berulang untuk mengukur selang waktu dan selidiki hal yang mengubah periode jam.', prerequisite: 'Periode adalah waktu untuk satu siklus lengkap; frekuensi menghitung siklus per detik.', experiment: 'Jam pendulum', path: '/time/pendulum' }
        ],
        questions: [
          { prompt: 'Seorang siswa berjalan 3 m ke timur, lalu 3 m ke barat hingga kembali ke titik awal. Berapa perpindahannya?', options: [{ id: 'zero', label: '0 m' }, { id: 'six', label: '6 m ke timur' }, { id: 'three', label: '3 m ke barat' }], answer: 'zero', hint: 'Perpindahan bergantung pada perubahan posisi awal ke posisi akhir, bukan total lintasan.', explanation: 'Siswa berakhir di tempat semula, sehingga posisi akhir dikurangi posisi awal sama dengan nol. Jarak tempuhnya 6 m, tetapi perpindahannya 0 m.' },
          { prompt: 'Sebuah pendulum menyelesaikan 10 ayunan penuh dalam 20 detik. Berapa periodenya?', options: [{ id: 'two', label: '2 detik' }, { id: 'ten', label: '10 detik' }, { id: 'two-hundred', label: '200 detik' }], answer: 'two', hint: 'Bagi total waktu dengan jumlah siklus lengkap.', explanation: 'Periode adalah waktu per siklus: T = 20 s ÷ 10 = 2 s.' }
        ]
      },
      {
        id: 'motion', title: '2. Gaya dan gerak', description: 'Hubungkan kecepatan, percepatan, gaya resultan, dan momentum melalui eksperimen.',
        prerequisites: 'Bedakan posisi dari perpindahan, serta kelajuan dari kecepatan. Percepatan menjelaskan perubahan kecepatan; gaya resultan adalah jumlah vektor semua gaya.',
        steps: [
          { title: 'Percepatan dipengaruhi gaya resultan', idea: 'Ubah gaya dan massa secara terpisah untuk menguji hukum kedua Newton.', prerequisite: 'Anda sebaiknya dapat menghitung perubahan kecepatan dalam selang waktu dan memahami bahwa gaya memiliki arah.', experiment: 'Gaya, massa, dan percepatan', path: '/mechanics/newtonian' },
          { title: 'Jumlahkan gaya dengan diagram benda bebas', idea: 'Uraikan gaya menjadi komponen dan tentukan gaya resultan sepanjang arah gerak.', prerequisite: 'Pelajari kembali komponen vektor serta perbedaan gesekan statis dan kinetis.', experiment: 'Laboratorium Gaya', path: '/mechanics/force-lab' },
          { title: 'Momentum menjelaskan gerak saat tumbukan', idea: 'Bandingkan momentum sebelum dan sesudah tumbukan, lalu bedakan dari energi kinetik.', prerequisite: 'Momentum adalah massa dikalikan kecepatan, termasuk arahnya.', experiment: 'Momentum dan tumbukan', path: '/mechanics/momentum-collisions' },
          { title: 'Gabungkan gerak horizontal dan vertikal', idea: 'Selidiki bagaimana gerak horizontal dan percepatan vertikal membentuk lintasan proyektil.', prerequisite: 'Kenali komponen kecepatan dan percepatan gravitasi konstan dalam model ideal.', experiment: 'Peluncur proyektil', path: '/mechanics/projectile' }
        ],
        questions: [
          { prompt: 'Sebuah kereta bermassa 2 kg mengalami gaya resultan 10 N. Berapa percepatannya?', options: [{ id: 'five', label: '5 m/s²' }, { id: 'twenty', label: '20 m/s²' }, { id: 'point-two', label: '0,2 m/s²' }], answer: 'five', hint: 'Gunakan hukum kedua Newton: percepatan sama dengan gaya resultan dibagi massa.', explanation: 'a = Fnet / m = 10 N / 2 kg = 5 m/s². Percepatan searah dengan gaya resultan.' },
          { prompt: 'Dua kereta bertumbukan dalam sistem terisolasi. Besaran apa yang kekal pada setiap tumbukan?', options: [{ id: 'momentum', label: 'Momentum total' }, { id: 'kinetic', label: 'Energi kinetik total' }, { id: 'speed', label: 'Kelajuan setiap kereta' }], answer: 'momentum', hint: 'Pikirkan besaran total untuk sistem dua kereta, bukan gerak masing-masing kereta.', explanation: 'Momentum total kekal jika impuls eksternal resultan pada sistem sama dengan nol. Energi kinetik hanya kekal pada tumbukan lenting; kelajuan tiap kereta umumnya berubah.' }
        ]
      },
      {
        id: 'relativity', title: '3. Relativitas dan gravitasi', description: 'Bawa gagasan pengukuran dan gerak ke dalam ruang-waktu dan model gravitasi.',
        prerequisites: 'Mulailah setelah jalur gerak. Pahami kecepatan, kerangka acuan, dan bahwa pengukuran memerlukan pengamat serta prosedur yang jelas.',
        steps: [
          { title: 'Pengamat dapat mengukur waktu berlalu yang berbeda', idea: 'Bandingkan pembacaan jam bagi pengamat yang menempuh lintasan berbeda dalam ruang-waktu.', prerequisite: 'Pahami kerangka acuan inersial dan bahwa jam mengukur waktu sepanjang lintasannya sendiri.', experiment: 'Jam berbeda, waktu berlalu berbeda', path: '/relativity/moving-clocks' },
          { title: 'Keserentakan bergantung pada kerangka acuan', idea: 'Bandingkan peristiwa mana yang serentak bagi pengamat yang bergerak relatif.', prerequisite: 'Pelajari kembali transformasi posisi dan waktu antar-pengamat; jam berjauhan memerlukan sinkronisasi.', experiment: 'Ruang dan waktu versus ruang-waktu', path: '/relativity/two-perspectives' },
          { title: 'Ukur benda bergerak secara konsisten', idea: 'Catat kedua ujung secara bersamaan dalam satu kerangka sebelum membandingkan panjang.', prerequisite: 'Pengukuran panjang memerlukan posisi kedua ujung yang serentak dalam kerangka pengukur.', experiment: 'Kontraksi panjang', path: '/relativity/length-contraction' },
          { title: 'Gravitasi mengubah geometri gerak', idea: 'Bandingkan orbit Newton dengan lintasan jatuh bebas dalam model ruang-waktu melengkung.', prerequisite: 'Pahami gravitasi Newton sebagai pendekatan yang berguna dan bedakan model dari sistem fisik yang diwakilinya.', experiment: 'Laboratorium Gerak Geodesik', path: '/gravity/geodesic-motion' }
        ],
        questions: [
          { prompt: 'Dua pengamat bergerak relatif satu sama lain. Pernyataan mana yang benar dalam relativitas khusus?', options: [{ id: 'same-time', label: 'Mereka harus sepakat apakah dua peristiwa berjauhan terjadi serentak.' }, { id: 'frame-time', label: 'Mereka dapat berbeda pendapat tentang keserentakan, tetapi sepakat tentang peristiwanya.' }, { id: 'absolute', label: 'Mereka selalu mengukur waktu berlalu yang sama antara dua peristiwa.' }], answer: 'frame-time', hint: 'Bedakan apakah suatu peristiwa terjadi dengan apakah dua peristiwa terpisah terjadi pada waktu yang sama.', explanation: 'Pengamat sepakat tentang peristiwanya, tetapi dapat menetapkan koordinat waktu berbeda dan tidak sepakat tentang keserentakan. Waktu wajar diukur sepanjang garis dunia jam tertentu.' },
          { prompt: 'Dalam perbandingan dilatasi waktu gravitasi sederhana, jam mana yang berjalan lebih lambat dibandingkan jam yang lebih jauh dari massa bola terisolasi?', options: [{ id: 'deeper', label: 'Jam yang lebih dekat ke massa, lebih dalam di medan gravitasi' }, { id: 'farther', label: 'Jam yang lebih jauh dari massa' }, { id: 'same', label: 'Kedua jam selalu berjalan dengan laju yang sama' }], answer: 'deeper', hint: 'Bandingkan jam yang lebih dalam pada potensial gravitasi dengan jam yang lebih jauh, menurut pengamat jauh.', explanation: 'Dalam model bola statis, jam yang lebih dalam di medan gravitasi (radius lebih kecil di luar massa) mengakumulasi waktu wajar lebih sedikit dibandingkan jam statis yang jauh. Perbandingan bergantung pada pengamat dan model ruang-waktu.' }
        ]
      }
    ]
  },
  ja: {
    eyebrow: '実験をたどる学習ルート', title: '順番に学び、各段階で練習する。',
    intro: '学習ルートを選ぶと、最初に学ぶこと、各概念が重要な理由、試すべき実験が分かります。短い問題で理解度も確認できます。回答はこのセッション中だけ保持されます。',
    pathsLabel: '学習ルートを選択', prerequisitesLabel: '始める前に', sequenceLabel: '学習の順序',
    practiceLabel: '理解度を確認', questionLabel: '問題', hintLabel: 'ヒントを表示', checkLabel: '回答を確認',
    nextLabel: '次の問題', restartLabel: 'このルートをもう一度', chooseLabel: '続けるには回答を選択してください。',
    correctLabel: '正解です。', incorrectLabel: 'もう少しです。解説を読み、実験でこの考え方を試してみましょう。',
    explanationLabel: '解説', completeLabel: 'このルートの練習は完了です', scoreLabel: '正解数',
    paths: [
      {
        id: 'foundations', title: '1. 空間・時間・測定', description: '物事がどこで、いつ起こるかを表す基本的な言葉を身に付けます。',
        prerequisites: '位置、距離、時間について日常的な理解があれば始められます。座標は位置を表す方法であり、位置そのものではありません。',
        steps: [
          { title: '位置と時間は同じではない', idea: '物体がどこにあり、その位置が変化するかを表します。', prerequisite: '位置は選んだ原点を基準に測ります。時間は事象がいつ起きるかを表す別の量です。', experiment: '空間と時間', path: '/space/space-vs-time' },
          { title: '位置の変化を測る', idea: '移動した経路と、始点から終点への直線的な変位を比べます。', prerequisite: '座標を読み、終点の位置から始点の位置を引けるようにしましょう。', experiment: '3次元の変位', path: '/space/displacement-3d' },
          { title: '時計は物理系である', idea: '繰り返す運動で時間間隔を測り、時計の周期を変える要因を調べます。', prerequisite: '周期は1回の完全なサイクルにかかる時間、振動数は1秒あたりのサイクル数です。', experiment: '振り子時計', path: '/time/pendulum' }
        ],
        questions: [
          { prompt: '生徒が東へ3 m歩き、その後西へ3 m戻って出発点に着きました。変位はいくらですか？', options: [{ id: 'zero', label: '0 m' }, { id: 'six', label: '東へ6 m' }, { id: 'three', label: '西へ3 m' }], answer: 'zero', hint: '変位は移動距離の合計ではなく、初期位置から最終位置への変化です。', explanation: '出発点に戻るため、最終位置から初期位置を引くと0です。移動距離は6 mですが、変位は0 mです。' },
          { prompt: '振り子が20秒間に10往復しました。周期はいくらですか？', options: [{ id: 'two', label: '2秒' }, { id: 'ten', label: '10秒' }, { id: 'two-hundred', label: '200秒' }], answer: 'two', hint: '経過時間の合計を完全なサイクル数で割ります。', explanation: '周期は1サイクルあたりの時間です。T = 20 s ÷ 10 = 2 s です。' }
        ]
      },
      {
        id: 'motion', title: '2. 力と運動', description: '実験を通して、速度、加速度、合力、運動量を結び付けます。',
        prerequisites: '位置と変位、速さと速度を区別しましょう。加速度は速度の変化を表し、合力はすべての力のベクトル和です。',
        steps: [
          { title: '加速度は合力に応答する', idea: '力と質量を別々に変え、ニュートンの第2法則を確かめます。', prerequisite: '時間間隔における速度の変化を計算でき、力には向きがあることを理解しましょう。', experiment: '力・質量・加速度', path: '/mechanics/newtonian' },
          { title: '自由物体図で力を合成する', idea: '力を成分に分解し、運動方向の合力を求めます。', prerequisite: 'ベクトル成分と静止摩擦・動摩擦の違いを復習しましょう。', experiment: '力の実験室', path: '/mechanics/force-lab' },
          { title: '衝突時の運動を運動量で表す', idea: '衝突の前後で運動量を比較し、運動エネルギーと区別します。', prerequisite: '運動量は質量と速度の積であり、向きも含みます。', experiment: '運動量と衝突', path: '/mechanics/momentum-collisions' },
          { title: '水平運動と鉛直運動を組み合わせる', idea: '水平運動と鉛直加速度が放物運動の軌道をどう形作るか調べます。', prerequisite: '理想モデルにおける速度成分と一定の重力加速度に慣れておきましょう。', experiment: '投射装置', path: '/mechanics/projectile' }
        ],
        questions: [
          { prompt: '質量2 kgの台車に合力10 Nが働きます。加速度はいくらですか？', options: [{ id: 'five', label: '5 m/s²' }, { id: 'twenty', label: '20 m/s²' }, { id: 'point-two', label: '0.2 m/s²' }], answer: 'five', hint: 'ニュートンの第2法則を使います。加速度は合力を質量で割った値です。', explanation: 'a = Fnet / m = 10 N / 2 kg = 5 m/s² です。加速度の向きは合力と同じです。' },
          { prompt: '孤立系で2台の台車が衝突します。弾性衝突でも非弾性衝突でも保存される量はどれですか？', options: [{ id: 'momentum', label: '全運動量' }, { id: 'kinetic', label: '全運動エネルギー' }, { id: 'speed', label: '各台車の速さ' }], answer: 'momentum', hint: '各台車の運動ではなく、2台を合わせた系全体について考えます。', explanation: '外部からの合力積がゼロなら全運動量は保存されます。運動エネルギーが保存されるのは弾性衝突の場合だけです。' }
        ]
      },
      {
        id: 'relativity', title: '3. 相対性理論と重力', description: '測定と運動の考え方を時空と重力のモデルへ広げます。',
        prerequisites: 'まず「力と運動」のルートを終えましょう。速度、基準系、そして測定には観測者と手順の指定が必要であることを理解しておきます。',
        steps: [
          { title: '観測者によって経過時間の測定が異なる', idea: '時空内で異なる経路をたどる観測者の時計を比較します。', prerequisite: '慣性系と、時計が自身の経路に沿って時間を測ることを理解しましょう。', experiment: '異なる時計、異なる経過時間', path: '/relativity/moving-clocks' },
          { title: '同時性は基準系に依存する', idea: '相対運動する観測者にとって、どの事象が同時かを比較します。', prerequisite: '観測者間の位置と時間の変換を復習しましょう。離れた時計には同期の手順が必要です。', experiment: '空間と時間、それとも時空', path: '/relativity/two-perspectives' },
          { title: '運動する物体を一貫して測る', idea: '測定する基準系で両端を同時に記録してから、測定長を比較します。', prerequisite: '長さの測定には、測定する基準系で両端の位置を同時に記録する必要があります。', experiment: '長さの収縮', path: '/relativity/length-contraction' },
          { title: '重力は運動の幾何を変える', idea: 'ニュートン力学の軌道と、曲がった時空モデルでの自由落下経路を比較します。', prerequisite: 'ニュートン重力が有用な近似であることを理解し、モデルと物理系を区別しましょう。', experiment: '測地線運動実験室', path: '/gravity/geodesic-motion' }
        ],
        questions: [
          { prompt: '互いに相対運動する2人の観測者について、特殊相対性理論で正しい説明はどれですか？', options: [{ id: 'same-time', label: '離れた2つの事象が同時かどうか必ず一致する。' }, { id: 'frame-time', label: '事象そのものには同意しながら、同時性について異なる判断をすることがある。' }, { id: 'absolute', label: 'どの2事象間でも常に同じ経過時間を測る。' }], answer: 'frame-time', hint: '事象が起きたことと、離れた2つの事象が同時に起きたかどうかを分けて考えましょう。', explanation: '観測者は事象そのものには同意しますが、時間座標が異なり、同時性について異なる判断をすることがあります。固有時は特定の時計の世界線に沿って測る経過時間です。' },
          { prompt: '単純な重力による時間の遅れの比較で、遠方の時計に比べて遅く進むのはどちらですか？', options: [{ id: 'deeper', label: '質量に近く、重力場のより深い場所にある時計' }, { id: 'farther', label: '質量から遠い時計' }, { id: 'same', label: 'どちらの時計も常に同じ速さで進む' }], answer: 'deeper', hint: '遠方の基準時計から見て、重力ポテンシャルの深い時計と遠い時計を比較しましょう。', explanation: '静的な球対称モデルでは、重力場のより深い場所（質量の外側で半径が小さい場所）の時計は、遠方の静止時計に比べて蓄積する固有時が少なくなります。' }
        ]
      }
    ]
  }
}

export function getLearningContent(locale: Locale): LearningContent { return copy[locale] }

export function validateLearningContent(): string[] {
  const errors: string[] = []
  for (const locale of ['en', 'id', 'ja'] as const) {
    const ids = new Set<string>()
    for (const path of copy[locale].paths) {
      if (ids.has(path.id)) errors.push(locale + ': duplicate path id ' + path.id)
      ids.add(path.id)
      if (!path.steps.length || !path.questions.length) errors.push(locale + '/' + path.id + ': missing steps or questions')
      for (const question of path.questions) {
        if (!question.options.some((option) => option.id === question.answer)) errors.push(locale + '/' + path.id + ': answer is not an available option')
        if (new Set(question.options.map((option) => option.id)).size !== question.options.length) errors.push(locale + '/' + path.id + ': duplicate option id')
      }
    }
  }
  return errors
}
