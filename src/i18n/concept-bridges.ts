import type { Locale } from './locales'

export interface ConceptBridgeCopy {
  summary: string
  intuitionTitle: string
  intuition: string
  equationTitle: string
  equation: string
  equationMeaning: string
  misconceptionTitle: string
  misconception: string
  checkTitle: string
  check: string
}

type LocalizedBridge = Record<Locale, ConceptBridgeCopy>

const bridges: Record<string, LocalizedBridge> = {
  'force-lab': {
    en: {
      summary: 'A push is only one part of the story. Motion changes according to the combined effect of every force.',
      intuitionTitle: 'Start with the idea',
      intuition: 'Imagine tugging a box while friction pushes back. The box responds to the leftover force after all pushes and pulls are combined—not to your pull alone. While the box stays still, static friction adjusts to match the needed amount, up to its maximum.',
      equationTitle: 'Build the equation',
      equation: 'ΣF = ma',
      equationMeaning: 'Add forces as arrows, including their directions. The resulting net force ΣF divided by the mass m gives the acceleration a. If the net force is zero, acceleration is zero; the object may still keep moving at constant velocity.',
      misconceptionTitle: 'A common trap',
      misconception: '“A moving object must have a forward net force.” Not so. A net force changes velocity; it is not required to maintain constant velocity. Also, static friction is not always at its maximum.',
      checkTitle: 'Check your understanding',
      check: 'A box is pushed harder, but it still does not move. What changes, and what has not yet changed?'
    },
    id: {
      summary: 'Dorongan hanya satu bagian dari cerita. Gerak berubah karena gabungan semua gaya yang bekerja.',
      intuitionTitle: 'Mulai dari gagasannya',
      intuition: 'Bayangkan kamu mendorong kotak sementara gesekan melawannya. Kotak merespons gaya sisa setelah semua dorongan dan tarikan digabungkan—bukan hanya gaya dorongmu. Selama kotak tetap diam, gesekan statis menyesuaikan besar gaya yang diperlukan, sampai mencapai batas maksimumnya.',
      equationTitle: 'Bangun persamaannya',
      equation: 'ΣF = ma',
      equationMeaning: 'Jumlahkan gaya sebagai panah yang memperhatikan arah. Gaya resultan ΣF dibagi massa m menghasilkan percepatan a. Jika gaya resultan nol, percepatan nol; benda tetap dapat bergerak dengan kecepatan konstan.',
      misconceptionTitle: 'Kesalahan yang sering terjadi',
      misconception: '“Benda yang bergerak harus selalu mendapat gaya resultan ke depan.” Tidak benar. Gaya resultan mengubah kecepatan, bukan diperlukan untuk mempertahankan kecepatan konstan. Gesekan statis juga tidak selalu bernilai maksimum.',
      checkTitle: 'Periksa pemahamanmu',
      check: 'Sebuah kotak didorong semakin kuat, tetapi belum bergerak. Apa yang berubah, dan apa yang belum berubah?'
    },
    ja: {
      summary: '押す力だけがすべてではありません。運動の変化を決めるのは、働くすべての力の合計です。',
      intuitionTitle: 'まず考え方から',
      intuition: '箱を押し、摩擦が反対向きに働く場面を想像してください。箱に効くのは、押す力と引く力をすべて合わせた後に残る力です。箱が静止している間、静止摩擦力は必要な大きさに調整され、最大値までは増加できます。',
      equationTitle: '式を組み立てる',
      equation: 'ΣF = ma',
      equationMeaning: '向きを考えながら、力を矢印として合計します。合力 ΣF を質量 m で割ると加速度 a になります。合力がゼロなら加速度もゼロですが、物体は一定の速度で動き続けることがあります。',
      misconceptionTitle: 'よくある誤解',
      misconception: '「動いている物体には、前向きの合力が必要だ」という考えは誤りです。合力は速度を変えるためのもので、一定速度を保つために必要なのではありません。静止摩擦力も常に最大とは限りません。',
      checkTitle: '理解を確かめる',
      check: '箱をより強く押しても、まだ動きません。何が変化し、何はまだ変化していないでしょうか。'
    }
  },
  'momentum-collisions': {
    en: {
      summary: 'A collision can change how energy is shared without changing the total momentum of an isolated pair.',
      intuitionTitle: 'Start with the idea',
      intuition: 'Think of momentum as the “motion budget” of the two-cart system. During a short collision, the carts can exchange momentum, but if outside forces are negligible, the system total stays the same. Kinetic energy can be transformed into sound, heat or deformation.',
      equationTitle: 'Build the equation',
      equation: 'p = mv;  Σp_before = Σp_after',
      equationMeaning: 'Momentum p depends on both mass m and velocity v, including direction. Conservation compares the vector total before and after the collision. Kinetic energy, ½mv², is conserved only in an ideal elastic collision.',
      misconceptionTitle: 'A common trap',
      misconception: '“If momentum is conserved, kinetic energy must also be conserved.” Momentum is conserved for an isolated system; kinetic energy is not conserved in every collision.',
      checkTitle: 'Check your understanding',
      check: 'After two carts collide, the total momentum is unchanged but their total kinetic energy is smaller. Where did the missing kinetic energy go?'
    },
    id: {
      summary: 'Tumbukan dapat mengubah pembagian energi tanpa mengubah momentum total dua benda yang terisolasi.',
      intuitionTitle: 'Mulai dari gagasannya',
      intuition: 'Bayangkan momentum sebagai “anggaran gerak” untuk dua kereta. Saat tumbukan singkat, keduanya dapat saling bertukar momentum. Namun, jika gaya luar dapat diabaikan, jumlah momentum sistem tetap. Energi kinetik dapat berubah menjadi bunyi, panas, atau perubahan bentuk.',
      equationTitle: 'Bangun persamaannya',
      equation: 'p = mv;  Σp_sebelum = Σp_sesudah',
      equationMeaning: 'Momentum p bergantung pada massa m dan kecepatan v, termasuk arahnya. Kekekalan momentum membandingkan jumlah vektor sebelum dan sesudah tumbukan. Energi kinetik ½mv² hanya kekal pada tumbukan lenting ideal.',
      misconceptionTitle: 'Kesalahan yang sering terjadi',
      misconception: '“Jika momentum kekal, energi kinetik juga pasti kekal.” Momentum kekal untuk sistem terisolasi; energi kinetik tidak selalu kekal pada setiap tumbukan.',
      checkTitle: 'Periksa pemahamanmu',
      check: 'Setelah dua kereta bertumbukan, momentum total tetap tetapi energi kinetik total berkurang. Ke mana energi kinetik yang berkurang itu berpindah?'
    },
    ja: {
      summary: '衝突では、孤立した二つの物体の全運動量を保ったまま、エネルギーの分配が変わることがあります。',
      intuitionTitle: 'まず考え方から',
      intuition: '運動量を二台の台車が持つ「運動の予算」と考えてみましょう。短い衝突の間に台車同士は運動量を交換しますが、外力を無視できれば系全体の合計は変わりません。運動エネルギーは音、熱、変形などに変わることがあります。',
      equationTitle: '式を組み立てる',
      equation: 'p = mv;  衝突前の Σp = 衝突後の Σp',
      equationMeaning: '運動量 p は質量 m と速度 v の両方に依存し、速度の向きも含みます。衝突前後のベクトルの合計を比べます。運動エネルギー ½mv² が保存されるのは、理想的な弾性衝突の場合だけです。',
      misconceptionTitle: 'よくある誤解',
      misconception: '「運動量が保存されるなら、運動エネルギーも保存される」という考えは誤りです。孤立系では運動量が保存されますが、運動エネルギーはすべての衝突で保存されるわけではありません。',
      checkTitle: '理解を確かめる',
      check: '二台の台車の衝突後、全運動量は同じなのに全運動エネルギーは小さくなりました。減った運動エネルギーはどこへ移ったのでしょうか。'
    }
  },
  'circular-orbits': {
    en: {
      summary: 'An orbiting satellite is not escaping gravity. It is falling continuously while moving sideways fast enough to keep missing the ground.',
      intuitionTitle: 'Start with the idea',
      intuition: 'Imagine throwing a ball faster and faster from a very high mountain. The ground curves away beneath it. At the right sideways speed, the ball keeps falling around Earth instead of hitting it. Gravity supplies the inward acceleration that bends its path.',
      equationTitle: 'Build the equation',
      equation: 'F_gravity = F_centripetal;  v = √(GM/r)',
      equationMeaning: 'For a circular orbit, gravity provides the required inward (centripetal) force. G is the gravitational constant, M the central mass and r the orbital radius measured from its centre. The formula assumes a circular orbit and a much smaller satellite mass.',
      misconceptionTitle: 'A common trap',
      misconception: '“There is no gravity in orbit.” Gravity is still acting. Astronauts and satellites feel weightless because they and their surroundings are in continuous free fall together.',
      checkTitle: 'Check your understanding',
      check: 'If a satellite suddenly lost its sideways speed but gravity remained, would it keep circling, move in a straight line, or fall inward?'
    },
    id: {
      summary: 'Satelit yang mengorbit tidak lepas dari gravitasi. Satelit terus jatuh sambil bergerak menyamping cukup cepat sehingga selalu meleset dari permukaan.',
      intuitionTitle: 'Mulai dari gagasannya',
      intuition: 'Bayangkan kamu melempar bola semakin cepat dari gunung yang sangat tinggi. Permukaan Bumi melengkung menjauh di bawah bola. Pada kecepatan menyamping yang tepat, bola terus jatuh mengelilingi Bumi dan tidak menabraknya. Gravitasi menyediakan percepatan ke dalam yang membelokkan lintasannya.',
      equationTitle: 'Bangun persamaannya',
      equation: 'F_gravitasi = F_sentripetal;  v = √(GM/r)',
      equationMeaning: 'Pada orbit lingkaran, gravitasi menyediakan gaya ke dalam (sentripetal) yang diperlukan. G adalah konstanta gravitasi, M massa pusat, dan r jari-jari orbit yang diukur dari pusatnya. Rumus ini mengasumsikan orbit lingkaran dan massa satelit jauh lebih kecil.',
      misconceptionTitle: 'Kesalahan yang sering terjadi',
      misconception: '“Tidak ada gravitasi di orbit.” Gravitasi tetap bekerja. Astronaut dan satelit terasa tanpa bobot karena keduanya dan lingkungan sekitarnya mengalami jatuh bebas bersama.',
      checkTitle: 'Periksa pemahamanmu',
      check: 'Jika satelit tiba-tiba kehilangan kecepatan menyamping sementara gravitasi tetap bekerja, apakah satelit terus mengorbit, bergerak lurus, atau jatuh ke arah pusat?'
    },
    ja: {
      summary: '衛星は重力から逃れているのではありません。地面にぶつからないほど横向きに速く進みながら、落下し続けています。',
      intuitionTitle: 'まず考え方から',
      intuition: 'とても高い山からボールをどんどん速く投げる場面を想像してください。ボールの下では地面も曲がって遠ざかります。適切な横向きの速さなら、ボールは地面に当たらず地球の周りへ落ち続けます。重力が内向きの加速度を与え、軌道を曲げます。',
      equationTitle: '式を組み立てる',
      equation: 'F_重力 = F_向心力;  v = √(GM/r)',
      equationMeaning: '円軌道では、重力が必要な内向き（向心）力を与えます。G は万有引力定数、M は中心天体の質量、r は中心から測った軌道半径です。この式は円軌道で、衛星の質量が十分小さい場合を仮定します。',
      misconceptionTitle: 'よくある誤解',
      misconception: '「軌道上には重力がない」という考えは誤りです。重力は働いています。宇宙飛行士や衛星が無重量に感じるのは、周囲と一緒に自由落下しているからです。',
      checkTitle: '理解を確かめる',
      check: '衛星が横向きの速度を突然失い、重力だけが働き続けたら、周回し続けるでしょうか、直進するでしょうか、それとも中心へ落ちるでしょうか。'
    }
  },
  'moving-clocks': {
    en: {
      summary: 'A clock measures the time along its own journey. Different journeys between shared events can contain different amounts of elapsed time.',
      intuitionTitle: 'Start with the idea',
      intuition: 'Picture two people leaving the same station and meeting again later. Each carries a clock. Their clocks record the time along their own paths through spacetime—not a universal stopwatch sitting outside the universe.',
      equationTitle: 'Build the equation',
      equation: 'Δτ = Δt / γ;  γ = 1 / √(1 − v²/c²)',
      equationMeaning: 'For constant-speed motion in the stated inertial frame, Δt is the frame time and Δτ is the moving clock’s proper time. The Lorentz factor γ grows as speed v approaches the speed of light c. Always specify the frame and the events being compared.',
      misconceptionTitle: 'A common trap',
      misconception: '“The moving clock is broken or feels itself running slowly.” Locally, the clock works normally. The difference appears when readings along different paths are compared at appropriately shared events.',
      checkTitle: 'Check your understanding',
      check: 'If the ship moves faster while the comparison events stay fixed, what happens to γ and to the elapsed proper time on the ship?'
    },
    id: {
      summary: 'Jam mengukur waktu sepanjang perjalanannya sendiri. Perjalanan berbeda di antara peristiwa yang sama dapat menghasilkan selang waktu berbeda.',
      intuitionTitle: 'Mulai dari gagasannya',
      intuition: 'Bayangkan dua orang berangkat dari stasiun yang sama lalu bertemu kembali. Masing-masing membawa jam. Jam mereka mencatat waktu sepanjang lintasannya sendiri di ruang-waktu—bukan waktu dari satu stopwatch universal di luar alam semesta.',
      equationTitle: 'Bangun persamaannya',
      equation: 'Δτ = Δt / γ;  γ = 1 / √(1 − v²/c²)',
      equationMeaning: 'Untuk gerak berkecepatan konstan dalam kerangka inersial yang dinyatakan, Δt adalah waktu kerangka dan Δτ adalah waktu wajar jam yang bergerak. Faktor Lorentz γ membesar ketika kecepatan v mendekati kecepatan cahaya c. Selalu nyatakan kerangka dan peristiwa yang dibandingkan.',
      misconceptionTitle: 'Kesalahan yang sering terjadi',
      misconception: '“Jam yang bergerak rusak atau merasa dirinya berjalan lambat.” Secara lokal, jam bekerja normal. Perbedaan terlihat ketika pembacaan pada lintasan berbeda dibandingkan pada peristiwa yang sama secara tepat.',
      checkTitle: 'Periksa pemahamanmu',
      check: 'Jika pesawat bergerak lebih cepat sementara peristiwa pembanding tetap, apa yang terjadi pada γ dan waktu wajar yang tercatat di pesawat?'
    },
    ja: {
      summary: '時計は自分自身の経路に沿った時間を測ります。同じ事象の間でも、異なる経路では経過時間が異なることがあります。',
      intuitionTitle: 'まず考え方から',
      intuition: '同じ駅を出発し、後で再会する二人を想像してください。それぞれが時計を持っています。時計が記録するのは時空を通る自分自身の経路に沿った時間であり、宇宙の外にある一つの万能ストップウォッチの時間ではありません。',
      equationTitle: '式を組み立てる',
      equation: 'Δτ = Δt / γ;  γ = 1 / √(1 − v²/c²)',
      equationMeaning: '指定した慣性系で一定速度の運動をする場合、Δt はその基準系の時間、Δτ は運動する時計の固有時です。速度 v が光速 c に近づくほどローレンツ因子 γ は大きくなります。比較する基準系と事象を必ず明確にしてください。',
      misconceptionTitle: 'よくある誤解',
      misconception: '「動く時計は壊れている、または自分でも遅く感じる」という考えは誤りです。時計は局所的には正常に動きます。適切に対応づけた同じ事象で異なる経路の時計を比べると差が現れます。',
      checkTitle: '理解を確かめる',
      check: '比較する事象を固定したまま宇宙船の速度を上げると、γ と宇宙船に記録される固有時はどう変わるでしょうか。'
    }
  },
  'length-contraction': {
    en: {
      summary: 'To measure a moving object’s length, record both ends at the same time in your frame. “Same time” is the crucial part.',
      intuitionTitle: 'Start with the idea',
      intuition: 'A moving train has a front and a back. To measure its length on a platform, you must record where both ends are at one platform time. Another observer moving with the train uses a different definition of “at the same time,” so the pair of endpoint events is different.',
      equationTitle: 'Build the equation',
      equation: 'L = L₀ / γ;  γ = 1 / √(1 − v²/c²)',
      equationMeaning: 'L₀ is the proper length measured in the object’s rest frame. L is the length measured along the direction of relative motion by an observer who sees it moving at speed v. The effect applies along the motion direction, not across it.',
      misconceptionTitle: 'A common trap',
      misconception: '“The object is physically squeezed in its own frame” or “a photograph directly measures contracted length.” Neither is right. Length is a measurement of simultaneous endpoint positions in a specified frame; optical appearance is a different question.',
      checkTitle: 'Check your understanding',
      check: 'Why must the two endpoint positions be recorded at the same time, and why can another inertial observer choose a different pair of events?'
    },
    id: {
      summary: 'Untuk mengukur panjang benda yang bergerak, catat kedua ujungnya pada waktu yang sama dalam kerangkamu. Bagian “waktu yang sama” sangat penting.',
      intuitionTitle: 'Mulai dari gagasannya',
      intuition: 'Sebuah kereta memiliki ujung depan dan belakang. Untuk mengukur panjangnya dari peron, catat posisi kedua ujung pada satu waktu peron yang sama. Pengamat lain yang bergerak bersama kereta memiliki definisi “waktu yang sama” yang berbeda, sehingga pasangan peristiwa ujung yang dipilih juga berbeda.',
      equationTitle: 'Bangun persamaannya',
      equation: 'L = L₀ / γ;  γ = 1 / √(1 − v²/c²)',
      equationMeaning: 'L₀ adalah panjang wajar yang diukur dalam kerangka diam benda. L adalah panjang sepanjang arah gerak relatif yang diukur pengamat ketika benda bergerak dengan kecepatan v. Efek ini berlaku sepanjang arah gerak, bukan arah melintangnya.',
      misconceptionTitle: 'Kesalahan yang sering terjadi',
      misconception: '“Benda tertekan secara fisik dalam kerangkanya sendiri” atau “foto langsung mengukur panjang yang terkontraksi.” Keduanya tidak tepat. Panjang adalah pengukuran posisi kedua ujung yang serentak dalam kerangka tertentu; tampilan optik adalah persoalan berbeda.',
      checkTitle: 'Periksa pemahamanmu',
      check: 'Mengapa posisi kedua ujung harus dicatat pada waktu yang sama, dan mengapa pengamat inersial lain dapat memilih pasangan peristiwa yang berbeda?'
    },
    ja: {
      summary: '運動する物体の長さを測るには、自分の基準系で両端を同時刻に記録します。「同時刻」が重要です。',
      intuitionTitle: 'まず考え方から',
      intuition: '走る列車には前端と後端があります。ホームから長さを測るには、ホームの同じ時刻に両端の位置を記録します。列車と一緒に動く別の観測者は「同時刻」の定義が異なるため、選ぶ両端の事象も異なります。',
      equationTitle: '式を組み立てる',
      equation: 'L = L₀ / γ;  γ = 1 / √(1 − v²/c²)',
      equationMeaning: 'L₀ は物体の静止基準系で測る固有長です。L は速度 v で動く物体を観測者が相対運動の方向に沿って測った長さです。この効果は運動方向に沿って現れ、垂直方向には現れません。',
      misconceptionTitle: 'よくある誤解',
      misconception: '「物体自身の基準系で物理的に押し縮められる」または「写真で収縮した長さを直接測れる」という考えは誤りです。長さは指定した基準系で同時刻に測った両端の位置であり、光学的な見え方とは別の問題です。',
      checkTitle: '理解を確かめる',
      check: 'なぜ両端の位置を同時刻に記録する必要があるのでしょうか。また、別の慣性観測者が異なる事象の組を選べるのはなぜでしょうか。'
    }
  },
  'gravity-clock-rates': {
    en: {
      summary: 'Gravity affects how clocks at different heights compare. The comparison must state where the clocks are and how they are held.',
      intuitionTitle: 'Start with the idea',
      intuition: 'Imagine two identical clocks: one on the ground and one higher up. In the stated static gravitational setup, the higher clock accumulates more time than the lower one. This is not a mechanical defect; it is a difference predicted for clock rates in curved spacetime.',
      equationTitle: 'Build the equation',
      equation: 'dτ/dt = √(1 − 2GM/(rc²))',
      equationMeaning: 'For a clock held at fixed radius r outside a non-rotating spherical mass M, this Schwarzschild expression compares its proper-time rate with the coordinate time used for a distant reference. G is the gravitational constant and c is the speed of light.',
      misconceptionTitle: 'A common trap',
      misconception: '“The clock deeper in gravity is simply broken” or “this formula describes every moving satellite clock by itself.” The expression assumes a static clock in a specific spacetime. Orbiting clocks also need motion-related corrections.',
      checkTitle: 'Check your understanding',
      check: 'In this static model, which clock accumulates more time: one closer to the mass or one farther away? What extra effect matters for an orbiting GPS satellite?'
    },
    id: {
      summary: 'Gravitasi memengaruhi perbandingan jam pada ketinggian berbeda. Perbandingan harus menyebutkan lokasi dan kondisi jam.',
      intuitionTitle: 'Mulai dari gagasannya',
      intuition: 'Bayangkan dua jam identik: satu di permukaan dan satu di tempat lebih tinggi. Dalam pengaturan gravitasi statis yang dinyatakan, jam yang lebih tinggi mengakumulasi waktu lebih banyak daripada jam yang lebih rendah. Ini bukan kerusakan mekanis, melainkan perbedaan laju jam yang diprediksi dalam ruang-waktu melengkung.',
      equationTitle: 'Bangun persamaannya',
      equation: 'dτ/dt = √(1 − 2GM/(rc²))',
      equationMeaning: 'Untuk jam yang ditahan pada radius tetap r di luar massa bola tak berotasi M, persamaan Schwarzschild ini membandingkan laju waktu wajarnya dengan waktu koordinat yang digunakan sebagai acuan jauh. G adalah konstanta gravitasi dan c adalah kecepatan cahaya.',
      misconceptionTitle: 'Kesalahan yang sering terjadi',
      misconception: '“Jam yang lebih dalam di medan gravitasi pasti rusak” atau “rumus ini langsung menggambarkan semua jam satelit yang bergerak.” Persamaan ini mengasumsikan jam statis dalam ruang-waktu tertentu. Jam yang mengorbit juga memerlukan koreksi akibat gerak.',
      checkTitle: 'Periksa pemahamanmu',
      check: 'Dalam model statis ini, jam mana yang mengakumulasi waktu lebih banyak: yang lebih dekat ke massa atau yang lebih jauh? Efek tambahan apa yang penting untuk satelit GPS yang mengorbit?'
    },
    ja: {
      summary: '重力は異なる高さにある時計の比較に影響します。時計の場所と保持条件を明確にする必要があります。',
      intuitionTitle: 'まず考え方から',
      intuition: '同じ時計を二つ用意し、一つを地上、もう一つを高い場所に置くと想像してください。ここで述べる静的な重力条件では、高い時計のほうが低い時計より多くの時間を刻みます。機械の故障ではなく、曲がった時空で予測される時計の進み方の違いです。',
      equationTitle: '式を組み立てる',
      equation: 'dτ/dt = √(1 − 2GM/(rc²))',
      equationMeaning: '回転しない球対称質量 M の外側で、半径 r に固定した時計について、シュワルツシルトの式は固有時の進み方を遠方の基準に用いる座標時と比較します。G は万有引力定数、c は光速です。',
      misconceptionTitle: 'よくある誤解',
      misconception: '「重力の深い場所の時計は故障している」または「この式だけですべての運動する衛星時計を表せる」という考えは誤りです。この式は特定の時空に静止させた時計を仮定します。軌道上の時計には運動による補正も必要です。',
      checkTitle: '理解を確かめる',
      check: 'この静的モデルでは、質量に近い時計と遠い時計のどちらが多くの時間を刻むでしょうか。軌道上の GPS 衛星には、ほかにどの効果が重要でしょうか。'
    }
  },
  'geodesic-motion': {
    en: {
      summary: 'In general relativity, an object in free fall is not being pushed along a curved path by a gravitational force in the Newtonian sense. It follows a natural path through curved spacetime.',
      intuitionTitle: 'Start with the idea',
      intuition: 'A passenger in a freely falling lift feels weightless because the lift and passenger accelerate together. In general relativity, an ideal freely falling object follows a geodesic—the closest spacetime has to a straight line. The path can look curved when described using space alone.',
      equationTitle: 'Build the equation',
      equation: 'd²xᵘ/dτ² + Γᵘₐᵦ (dxᵃ/dτ)(dxᵝ/dτ) = 0',
      equationMeaning: 'This is the geodesic equation. xᵘ describes spacetime coordinates, τ is the object’s proper time, and Γᵘₐᵦ encode how coordinates and spacetime geometry vary. The equation says the four-velocity is parallel-transported along the path; it is not an ordinary “force equals mass times acceleration” equation.',
      misconceptionTitle: 'A common trap',
      misconception: '“A freely falling object has no acceleration in every sense.” It has zero proper (felt) acceleration in ideal free fall, but its spatial coordinates can accelerate and nearby free-fall paths can converge or separate.',
      checkTitle: 'Check your understanding',
      check: 'Why can an astronaut feel weightless while an observer on Earth describes the astronaut as accelerating around the planet?'
    },
    id: {
      summary: 'Dalam relativitas umum, benda jatuh bebas tidak didorong mengikuti lintasan melengkung oleh gaya gravitasi seperti dalam gambaran Newton. Benda mengikuti lintasan alami dalam ruang-waktu melengkung.',
      intuitionTitle: 'Mulai dari gagasannya',
      intuition: 'Penumpang dalam lift yang jatuh bebas merasa tanpa bobot karena lift dan penumpang dipercepat bersama. Dalam relativitas umum, benda ideal yang jatuh bebas mengikuti geodesik—hal yang paling mendekati garis lurus dalam ruang-waktu. Lintasannya dapat tampak melengkung jika hanya dilihat dalam ruang.',
      equationTitle: 'Bangun persamaannya',
      equation: 'd²xᵘ/dτ² + Γᵘₐᵦ (dxᵃ/dτ)(dxᵝ/dτ) = 0',
      equationMeaning: 'Ini adalah persamaan geodesik. xᵘ menyatakan koordinat ruang-waktu, τ adalah waktu wajar benda, dan Γᵘₐᵦ menggambarkan perubahan koordinat serta geometri ruang-waktu. Persamaan ini menyatakan bahwa empat-kecepatan diparalelkan sepanjang lintasan; ini bukan persamaan gaya Newton biasa.',
      misconceptionTitle: 'Kesalahan yang sering terjadi',
      misconception: '“Benda yang jatuh bebas tidak mengalami percepatan dalam arti apa pun.” Dalam jatuh bebas ideal, percepatan wajar yang dirasakan bernilai nol, tetapi koordinat ruangnya dapat mengalami percepatan dan lintasan jatuh bebas yang berdekatan dapat saling mendekat atau menjauh.',
      checkTitle: 'Periksa pemahamanmu',
      check: 'Mengapa astronaut dapat merasa tanpa bobot sementara pengamat di Bumi menggambarkan astronaut sedang dipercepat mengelilingi planet?'
    },
    ja: {
      summary: '一般相対論では、自由落下する物体はニュートン力学の意味で重力に押されて曲線を進むのではありません。曲がった時空の自然な経路をたどります。',
      intuitionTitle: 'まず考え方から',
      intuition: '自由落下するエレベーターの乗客は、エレベーターと一緒に加速するため無重量に感じます。一般相対論では、理想的な自由落下物体は測地線、つまり時空における最も「直線」に近い経路を進みます。空間だけで見ると、その経路は曲がって見えることがあります。',
      equationTitle: '式を組み立てる',
      equation: 'd²xᵘ/dτ² + Γᵘₐᵦ (dxᵃ/dτ)(dxᵝ/dτ) = 0',
      equationMeaning: 'これは測地線方程式です。xᵘ は時空座標、τ は物体の固有時、Γᵘₐᵦ は座標と時空幾何の変化を表します。この式は四元速度が経路に沿って平行移動することを示し、通常の「力＝質量×加速度」の式ではありません。',
      misconceptionTitle: 'よくある誤解',
      misconception: '「自由落下物体はいかなる意味でも加速していない」という考えは誤りです。理想的な自由落下では感じる固有加速度はゼロですが、空間座標は加速して見えることがあり、近くの自由落下経路は近づいたり離れたりします。',
      checkTitle: '理解を確かめる',
      check: '宇宙飛行士が無重量に感じる一方で、地球の観測者が惑星の周りを加速していると説明できるのはなぜでしょうか。'
    }
  },
  'evolving-space': {
    en: {
      summary: 'Cosmic expansion changes the distance between far-apart, unbound galaxies. It does not stretch every object or every local system.',
      intuitionTitle: 'Start with the idea',
      intuition: 'Imagine dots drawn on the surface of an inflating balloon. As the surface expands, the distance between dots grows even if the dots do not crawl across the rubber. The balloon is only a two-dimensional analogy: the universe does not need an outside centre or an edge.',
      equationTitle: 'Build the equation',
      equation: 'H(t) = ȧ(t) / a(t);  1 + z = a(now) / a(then)',
      equationMeaning: 'The scale factor a(t) tracks the relative expansion of cosmic distances between comoving locations. The Hubble parameter H is the fractional expansion rate. Redshift z connects the scale factor when light was emitted with its value when observed.',
      misconceptionTitle: 'A common trap',
      misconception: '“The expansion makes atoms, people, planets and bound galaxies grow.” Local forces hold bound systems together. Also, the Big Bang was not an explosion from one central point into empty space; the model describes expansion of space itself.',
      checkTitle: 'Check your understanding',
      check: 'Why can the distance between far-apart galaxies grow while the size of an atom or the Solar System stays essentially unchanged?'
    },
    id: {
      summary: 'Ekspansi kosmik mengubah jarak antargalaksi jauh yang tidak terikat. Ekspansi tidak meregangkan setiap benda atau sistem lokal.',
      intuitionTitle: 'Mulai dari gagasannya',
      intuition: 'Bayangkan titik-titik yang digambar pada permukaan balon yang ditiup. Ketika permukaan mengembang, jarak antartitik bertambah meskipun titik-titik tidak merayap di atas karet. Balon hanyalah analogi dua dimensi: alam semesta tidak memerlukan pusat atau tepi di bagian luar.',
      equationTitle: 'Bangun persamaannya',
      equation: 'H(t) = ȧ(t) / a(t);  1 + z = a(sekarang) / a(saat dipancarkan)',
      equationMeaning: 'Faktor skala a(t) melacak perubahan relatif jarak kosmik antara lokasi yang ikut mengembang. Parameter Hubble H adalah laju ekspansi fraksional. Pergeseran merah z menghubungkan faktor skala saat cahaya dipancarkan dan saat diamati.',
      misconceptionTitle: 'Kesalahan yang sering terjadi',
      misconception: '“Ekspansi membuat atom, manusia, planet, dan galaksi yang terikat ikut membesar.” Gaya lokal menjaga sistem terikat tetap utuh. Big Bang juga bukan ledakan dari satu titik pusat ke ruang kosong; model ini menggambarkan ekspansi ruang itu sendiri.',
      checkTitle: 'Periksa pemahamanmu',
      check: 'Mengapa jarak antargalaksi yang berjauhan dapat bertambah sementara ukuran atom atau Tata Surya pada dasarnya tetap?'
    },
    ja: {
      summary: '宇宙膨張は、重力などで束縛されていない遠方銀河間の距離を変化させます。あらゆる物体や局所系を引き伸ばすわけではありません。',
      intuitionTitle: 'まず考え方から',
      intuition: '膨らむ風船の表面に点を描いたと想像してください。表面が広がると、点自体がゴムの上を移動しなくても点同士の距離は増えます。風船は二次元のたとえにすぎません。宇宙の外側に中心や端が必要という意味ではありません。',
      equationTitle: '式を組み立てる',
      equation: 'H(t) = ȧ(t) / a(t);  1 + z = a(現在) / a(放出時)',
      equationMeaning: 'スケール因子 a(t) は、共動する場所の間の宇宙距離が相対的にどう変化するかを表します。ハッブル・パラメータ H は膨張の割合です。赤方偏移 z は、光が放出されたときと観測されたときのスケール因子を結び付けます。',
      misconceptionTitle: 'よくある誤解',
      misconception: '「膨張によって原子、人、惑星、束縛された銀河まで大きくなる」という考えは誤りです。局所的な力が束縛系を保ちます。また、ビッグバンは空っぽの空間の一点から起きた爆発ではなく、空間そのものの膨張を表すモデルです。',
      checkTitle: '理解を確かめる',
      check: '遠く離れた銀河間の距離が増える一方で、原子や太陽系の大きさがほぼ変わらないのはなぜでしょうか。'
    }
  }
}

export function getConceptBridge(experimentId: string, locale: Locale): ConceptBridgeCopy | null {
  return bridges[experimentId]?.[locale] ?? null
}

export const CONCEPT_BRIDGE_EXPERIMENTS = Object.freeze(Object.keys(bridges))
