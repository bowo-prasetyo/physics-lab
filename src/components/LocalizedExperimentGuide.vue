<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'

type ExperimentId =
  | 'space-vs-time'
  | 'displacement3d'
  | 'pendulum'
  | 'newtonian'
  | 'projectile'
  | 'moving-clocks'
  | 'two-perspectives'
  | 'gravity-clocks'
  | 'evolving-space'

defineProps<{ experimentId: ExperimentId }>()

const { locale } = useLocale()
const props = defineProps<{ experimentId: ExperimentId }>()

type GuideCopy = {
  establishedTitle: string
  established: string[]
  interpretationTitle: string
  interpretation: string[]
  visualTitle: string
  visual: string
}

const copy: Record<ExperimentId, Record<'id' | 'ja', GuideCopy>> = {
  'space-vs-time': {
    id: {
      establishedTitle: 'Apa yang ditunjukkan fisika',
      established: [
        'Posisi selalu diukur terhadap kerangka acuan. Pada grafik posisi–waktu, waktu bertambah ke kanan dan posisi ditunjukkan pada sumbu vertikal. Kemiringan garis adalah kecepatan: garis datar berarti posisi tetap, bukan waktu berhenti.',
        'Untuk gerak dengan kecepatan konstan, x(t) = x₀ + vt. Jika kecepatan berubah tanda, benda berbalik arah dan kemiringan grafik ikut berubah tanda. Jarak tempuh menjumlahkan seluruh lintasan, sedangkan perpindahan hanya membandingkan posisi akhir dengan posisi awal.',
        'Pengamat yang bergerak dengan kecepatan konstan u dapat memakai koordinat Galilea x′ = x − ut dan v′ = v − u. Dalam mekanika Newtonian, waktu t yang sama dipakai oleh kedua kerangka.'
      ],
      interpretationTitle: 'Pertanyaan konseptual',
      interpretation: [
        'Apakah gerak itu mutlak? Posisi dan kecepatan bergantung pada kerangka acuan, sedangkan peristiwa yang terjadi dan selang waktu Newtonian tetap sama dalam transformasi Galilea.',
        'Grafik adalah representasi pengukuran, bukan lintasan fisik tambahan. Membaca sumbu, satuan, titik awal, dan kemiringan dengan benar lebih penting daripada sekadar melihat bentuk garis.'
      ],
      visualTitle: 'Cara membaca visualisasi',
      visual: [
        'Lintasan memperlihatkan posisi benda pada rel sepanjang waktu. Grafik posisi–waktu merekam riwayat posisi; kemiringan lokalnya menyatakan kecepatan. Tabel nilai menyediakan pasangan waktu dan posisi yang sama dalam bentuk numerik.',
        'Jika panel pengamat bergerak ditampilkan, bandingkan koordinat dan kecepatan relatif terhadap pengamat itu. Jangan menafsirkan perubahan koordinat sebagai perubahan peristiwa fisik.'
      ]
    },
    ja: {
      establishedTitle: '物理が示すこと',
      established: [
        '位置は常に基準系に対して測定します。位置–時間グラフでは、時間が横軸、位置が縦軸です。線の傾きは速度を表します。水平な線は位置が一定であることを示し、時間が止まったことを意味しません。',
        '一定速度の運動は x(t) = x₀ + vt で表されます。速度の符号が変わると物体は向きを変え、グラフの傾きの符号も変わります。移動距離は経路全体の長さですが、変位は始点と終点の位置の差です。',
        '速度 u で動く観測者は、ガリレイ変換 x′ = x − ut、v′ = v − u を使えます。ニュートン力学では、両方の基準系で同じ時間 t を用います。'
      ],
      interpretationTitle: '考えるべき問い',
      interpretation: [
        '運動は絶対的でしょうか。位置と速度は基準系に依存しますが、ガリレイ変換では起きた事象とニュートン的な時間間隔は変わりません。',
        'グラフは測定結果の表現であり、物理的な経路そのものではありません。線の形だけでなく、軸、単位、初期位置、傾きを正しく読むことが重要です。'
      ],
      visualTitle: '図の読み方',
      visual: [
        'トラックの図は、時間とともに変化する物体の位置を示します。位置–時間グラフは位置の履歴を記録し、その局所的な傾きが速度です。数値表には同じ時間と位置の組が数値で示されます。',
        '移動する観測者の表示がある場合は、その観測者に対する座標と速度を比較してください。座標の変化を、事象そのものの変化と取り違えないでください。'
      ]
    }
  },
  displacement3d: {
    id: {
      establishedTitle: 'Apa yang ditunjukkan fisika',
      established: [
        'Posisi tiga dimensi dapat dinyatakan dengan vektor r = (x, y, z). Perpindahan Δr = r_akhir − r_awal hanya bergantung pada kedua titik ujung, bukan pada jalur yang ditempuh.',
        'Jarak adalah panjang seluruh lintasan dan selalu tidak lebih kecil daripada besar perpindahan. Dua perjalanan dengan rute berbeda dapat memiliki perpindahan yang sama jika titik awal dan akhirnya sama.',
        'Mengubah orientasi atau asal koordinat mengubah komponen numerik vektor, tetapi tidak mengubah panjang geometrisnya. Komponen x, y, dan z adalah proyeksi vektor pada sumbu yang dipilih.'
      ],
      interpretationTitle: 'Pertanyaan konseptual',
      interpretation: [
        'Koordinat bukan sifat yang berdiri sendiri dari objek; koordinat bergantung pada kerangka yang digunakan untuk menggambarkan objek. Besaran geometris seperti panjang vektor tetap sama di bawah rotasi koordinat.',
        'Visualisasi 3D adalah proyeksi pada layar dua dimensi. Sudut pandang dapat mengubah tampilan, sehingga gunakan sumbu, kisi, dan komponen untuk menafsirkan kedalaman.'
      ],
      visualTitle: 'Cara membaca visualisasi',
      visual: [
        'Titik hijau menandai posisi awal dan objek biru menandai posisi saat ini. Panah oranye menunjukkan perpindahan langsung dari awal ke posisi sekarang; garis putus-putus menunjukkan komponen sepanjang sumbu x, y, dan z.',
        'Gunakan tampilan atas, depan, samping, dan 3D untuk memeriksa koordinat yang sama dari sudut berbeda. Memutar kamera tidak mengubah posisi fisik atau besar perpindahan.'
      ]
    },
    ja: {
      establishedTitle: '物理が示すこと',
      established: [
        '三次元の位置はベクトル r = (x, y, z) で表せます。変位 Δr = r_終点 − r_始点 は両端の点だけで決まり、途中の経路には依存しません。',
        '距離は経路全体の長さであり、変位の大きさより小さくなることはありません。始点と終点が同じなら、異なる経路でも変位は同じです。',
        '座標の向きや原点を変えるとベクトルの数値成分は変わりますが、幾何学的な長さは変わりません。x、y、z 成分は選んだ各軸への射影です。'
      ],
      interpretationTitle: '考えるべき問い',
      interpretation: [
        '座標は物体だけに備わった性質ではなく、記述に使う基準系に依存します。一方、座標の回転によってベクトルの長さのような幾何学的量は変わりません。',
        '三次元表示は二次元画面への投影です。視点によって見え方が変わるため、奥行きを判断するときは軸、格子、成分も確認してください。'
      ],
      visualTitle: '図の読み方',
      visual: [
        '緑の点は始点、青い物体は現在位置を示します。オレンジ色の矢印は始点から現在位置への変位を表し、破線は x、y、z 各方向の成分を示します。',
        '上面・正面・側面・三次元表示を切り替えると、同じ座標を異なる視点から確認できます。カメラを回転させても、物体の位置や変位の大きさは変わりません。'
      ]
    }
  },
  pendulum: {
    id: {
      establishedTitle: 'Apa yang ditunjukkan fisika',
      established: [
        'Untuk ayunan kecil, periode bandul sederhana mendekati T = 2π√(L/g). Periode bertambah jika panjang L bertambah dan berkurang jika percepatan gravitasi g bertambah. Massa bandul tidak muncul dalam rumus ideal ini.',
        'Rumus tersebut merupakan pendekatan sudut kecil. Pada amplitudo besar, periode sedikit lebih panjang dan bergantung pada sudut awal. Karena itu, jam bandul yang dipindahkan ke lingkungan dengan gravitasi berbeda dapat berjalan tidak tepat.',
        'Detik SI ditetapkan melalui frekuensi transisi atom sesium, bukan melalui bandul. Jam atom menyediakan acuan yang sangat stabil untuk membandingkan proses periodik lain.'
      ],
      interpretationTitle: 'Pertanyaan konseptual',
      interpretation: [
        'Setiap jam adalah sistem fisik yang berubah secara teratur. Pertanyaan apakah waktu merupakan sesuatu yang mengalir secara mandiri atau cara untuk mengukur perubahan adalah persoalan interpretasi; eksperimen menguji hubungan terukur antarjam.',
        'Jam yang berbeda dapat berdetak dengan laju berbeda ketika berada pada kondisi gerak atau gravitasi berbeda. Relativitas memperluas pelajaran ini: tidak ada satu laju waktu universal untuk semua pengamat.'
      ],
      visualTitle: 'Cara membaca visualisasi',
      visual: [
        'Animasi bandul menunjukkan sudut terhadap posisi setimbang. Grafik sudut–waktu memperlihatkan osilasi; satu periode penuh adalah waktu antara dua keadaan fase yang sama, misalnya dua lintasan berturut-turut melewati titik tengah ke arah yang sama.',
        'Jam atom dan jam bandul menampilkan akumulasi waktu masing-masing. Selisih keduanya adalah drift relatif, bukan kesalahan pada jam atom yang dijadikan acuan.'
      ]
    },
    ja: {
      establishedTitle: '物理が示すこと',
      established: [
        '小さな振れ角では、単振り子の周期は T = 2π√(L/g) に近似されます。長さ L が増すと周期は長くなり、重力加速度 g が大きいと短くなります。理想的な式にはおもりの質量は現れません。',
        'この式は小角近似です。振幅が大きい場合、周期はわずかに長くなり、初期角度にも依存します。そのため、重力の異なる場所へ振り子時計を移すと正確さが失われることがあります。',
        'SI 秒は振り子ではなく、セシウム原子の遷移周波数によって定義されています。原子時計は、ほかの周期的な過程を比較するための非常に安定した基準です。'
      ],
      interpretationTitle: '考えるべき問い',
      interpretation: [
        '時計はどれも、規則的に変化する物理系です。時間が独立して流れるものなのか、変化を測る方法なのかという問いは解釈の問題です。実験では時計同士の測定可能な関係を調べます。',
        '運動状態や重力環境が異なれば、異なる時計の進み方も異なり得ます。相対論はこの教訓を拡張し、すべての観測者に共通する単一の時間速度はないことを示します。'
      ],
      visualTitle: '図の読み方',
      visual: [
        '振り子のアニメーションは、平衡位置からの角度を示します。角度–時間グラフは振動を表し、1 周期は同じ位相状態に戻るまでの時間です。たとえば、中心を同じ向きに通過する連続した時刻の間隔です。',
        '原子時計と振り子時計には、それぞれが積み上げた時間が表示されます。両者の差は相対的なずれであり、基準として用いる原子時計の誤差を意味しません。'
      ]
    }
  },
  newtonian: {
    id: {
      establishedTitle: 'Apa yang ditunjukkan fisika',
      established: [
        'Hukum kedua Newton menyatakan ΣF = ma: percepatan sebanding dengan gaya resultan dan berbanding terbalik dengan massa. Untuk massa tetap, menggandakan gaya resultan menggandakan percepatan; untuk gaya tetap, menggandakan massa membagi dua percepatan.',
        'Yang menentukan percepatan adalah jumlah vektor semua gaya, bukan satu gaya dorong yang dipilih. Dalam model ideal ini, kereta bergerak pada lintasan horizontal dan pengaruh yang tidak dimodelkan—seperti hambatan atau gesekan—diabaikan.',
        'Jika percepatan konstan dan benda mulai dari keadaan diam, v = at dan Δx = ½at². Perbandingan percobaan dengan rasio gaya terhadap massa yang sama seharusnya menghasilkan percepatan yang sama.'
      ],
      interpretationTitle: 'Pertanyaan konseptual',
      interpretation: [
        'Gerak tidak memerlukan gaya resultan yang terus-menerus. Gaya resultan mengubah kecepatan; ketika resultan nol, benda mempertahankan kecepatan konstan dalam kerangka inersial.',
        'Model sederhana membantu mengisolasi hubungan sebab-akibat, tetapi tidak mewakili setiap detail kereta nyata. Periksa asumsi sebelum menerapkan hasilnya pada situasi sehari-hari.'
      ],
      visualTitle: 'Cara membaca visualisasi',
      visual: [
        'Panah menunjukkan arah gaya resultan pada kereta. Panel hasil menampilkan percepatan, kecepatan, dan perpindahan setelah waktu yang dipilih. Tabel percobaan memungkinkan perbandingan saat satu variabel diubah.',
        'Bandingkan percobaan dengan mengubah satu variabel pada satu waktu. Nilai percepatan, bukan sekadar kecepatan akhir, adalah ukuran langsung dari hukum kedua Newton.'
      ]
    },
    ja: {
      establishedTitle: '物理が示すこと',
      established: [
        'ニュートンの第 2 法則は ΣF = ma です。加速度は合力に比例し、質量に反比例します。質量一定で合力を 2 倍にすると加速度も 2 倍になり、合力一定で質量を 2 倍にすると加速度は半分になります。',
        '加速度を決めるのは、選んだ一つの押す力ではなく、すべての力のベクトル和です。この理想モデルでは台車は水平なレール上を動き、抵抗や摩擦などモデル化していない影響は無視します。',
        '加速度が一定で静止状態から出発する場合、v = at、Δx = ½at² です。力と質量の比が同じ試行では、同じ加速度が得られるはずです。'
      ],
      interpretationTitle: '考えるべき問い',
      interpretation: [
        '運動を続けるために合力が常に必要なわけではありません。合力は速度を変化させます。慣性系で合力がゼロなら、物体は一定速度を保ちます。',
        '単純なモデルは因果関係を切り分けるのに役立ちますが、実際の台車の細部すべてを表すわけではありません。日常の状況に結果を適用する前に、仮定を確認してください。'
      ],
      visualTitle: '図の読み方',
      visual: [
        '矢印は台車に働く合力の向きを示します。結果パネルには指定した時間後の加速度、速度、変位が表示されます。試行表では、変数を変えたときの結果を比較できます。',
        '一度に一つの変数だけを変えて試行を比べてください。ニュートンの第 2 法則を直接表す量は、最終速度だけでなく加速度です。'
      ]
    }
  },
  projectile: {
    id: {
      establishedTitle: 'Apa yang ditunjukkan fisika',
      established: [
        'Dalam model gerak peluru tanpa hambatan udara, percepatan horizontal nol dan percepatan vertikal sebesar −g. Komponen gerak horizontal tetap seragam, sedangkan komponen vertikal berubah karena gravitasi.',
        'Lintasan parabola muncul dari penggabungan x(t) = x₀ + v₀ cos(θ)t dan y(t) = y₀ + v₀ sin(θ)t − ½gt². Pada ketinggian awal dan akhir yang sama, jangkauan ideal maksimum terjadi pada sudut 45°; hasil ini tidak berlaku umum jika ketinggian berbeda atau hambatan udara dimasukkan.',
        'Energi mekanik tetap dalam model tanpa hambatan. Energi kinetik dan potensial saling berubah, tetapi jumlahnya konstan. Di planet lain, nilai g mengubah waktu terbang, tinggi maksimum, dan jangkauan.'
      ],
      interpretationTitle: 'Pertanyaan konseptual',
      interpretation: [
        'Gerak horizontal dan vertikal dapat dianalisis terpisah karena percepatan gravitasi hanya bekerja secara vertikal dalam model ini. Keduanya tetap terjadi pada waktu yang sama dan membentuk satu lintasan.',
        'Lintasan ideal bukan prediksi lengkap untuk setiap lemparan nyata. Hambatan udara, putaran, bentuk benda, dan perubahan ketinggian dapat mengubah hasil.'
      ],
      visualTitle: 'Cara membaca visualisasi',
      visual: [
        'Jejak lintasan menunjukkan posisi proyektil dari waktu ke waktu. Komponen kecepatan horizontal dan vertikal membantu menjelaskan mengapa lintasan melengkung; penanda puncak menunjukkan saat kecepatan vertikal sesaat nol.',
        'Bandingkan lintasan hanya setelah memeriksa kecepatan awal, sudut, ketinggian awal, nilai gravitasi, dan apakah hambatan udara aktif. Grafik energi menunjukkan pertukaran energi kinetik dan potensial.'
      ]
    },
    ja: {
      establishedTitle: '物理が示すこと',
      established: [
        '空気抵抗を無視した投射運動モデルでは、水平方向の加速度はゼロ、鉛直方向の加速度は −g です。水平成分は一定で、鉛直成分は重力によって変化します。',
        '放物線軌道は x(t) = x₀ + v₀ cos(θ)t と y(t) = y₀ + v₀ sin(θ)t − ½gt² の組み合わせから生じます。発射点と着地点の高さが同じなら、理想的な射程は 45° で最大になります。高さが異なる場合や空気抵抗がある場合には一般に成り立ちません。',
        '抵抗のないモデルでは力学的エネルギーが保存されます。運動エネルギーと位置エネルギーは相互に変化しますが、その和は一定です。別の惑星では g の値によって飛行時間、最高点、射程が変わります。'
      ],
      interpretationTitle: '考えるべき問い',
      interpretation: [
        'このモデルでは重力加速度が鉛直方向だけに働くため、水平運動と鉛直運動を分けて解析できます。ただし両方は同時に起き、一つの軌道を形作ります。',
        '理想軌道は、あらゆる実際の投射を完全に予測するものではありません。空気抵抗、回転、物体の形状、高さの変化によって結果は変わります。'
      ],
      visualTitle: '図の読み方',
      visual: [
        '軌跡は時間とともに変化する投射体の位置を示します。水平・鉛直速度成分を見ると軌道が曲がる理由が分かります。頂点マーカーは鉛直速度が一瞬ゼロになる時点です。',
        '軌道を比較する前に、初速度、角度、初期高度、重力、空気抵抗の有無を確認してください。エネルギーグラフは運動エネルギーと位置エネルギーの交換を示します。'
      ]
    }
  },
  'moving-clocks': {
    id: {
      establishedTitle: 'Apa yang ditunjukkan fisika',
      established: [
        'Dalam relativitas khusus, jam yang bergerak relatif terhadap pengamat mengakumulasi waktu wajar lebih sedikit di antara peristiwa yang dibandingkan dalam kerangka pengamat tersebut. Untuk gerak lurus berkecepatan konstan, Δτ = Δt/γ dengan γ = 1/√(1 − v²/c²).',
        'Efek ini bukan kerusakan mekanis pada jam. Semua proses fisik pada jam yang bergerak mengalami faktor waktu wajar yang sama. Perbandingan harus menyebutkan kerangka acuan dan peristiwa yang dipasangkan.',
        'Ketika dua jam bertemu kembali, mereka dapat membandingkan pembacaan secara langsung. Selama lintasan yang berbeda, simetri antara pengamat dapat terputus; riwayat gerak dan perubahan kerangka menjadi penting.'
      ],
      interpretationTitle: 'Pertanyaan konseptual',
      interpretation: [
        'Mengapa masing-masing pengamat dapat menggambarkan jam lain sebagai jam yang bergerak lebih lambat? Relativitas keserentakan menjelaskan bahwa pengamat tidak selalu sepakat tentang peristiwa jauh mana yang terjadi “sekarang”.',
        'Diagram ruang-waktu membantu memisahkan waktu koordinat, waktu wajar sepanjang lintasan, dan aturan untuk menyinkronkan jam yang berjauhan.'
      ],
      visualTitle: 'Cara membaca visualisasi',
      visual: [
        'Garis dunia menunjukkan riwayat setiap jam dalam diagram ruang-waktu. Kemiringan garis berkaitan dengan kecepatan; pembacaan jam ditampilkan sebagai waktu wajar yang terkumpul di sepanjang garis dunia.',
        'Saat mengganti kerangka, garis simultanitas berubah kemiringan. Gunakan garis tersebut untuk membaca peristiwa yang dianggap serentak dalam kerangka itu, bukan dengan membandingkan posisi horizontal semata.'
      ]
    },
    ja: {
      establishedTitle: '物理が示すこと',
      established: [
        '特殊相対論では、観測者に対して運動する時計は、観測者の基準系で比較した事象の間に、より少ない固有時を刻みます。一定速度の直線運動では Δτ = Δt/γ、γ = 1/√(1 − v²/c²) です。',
        'これは時計の機械的な故障ではありません。運動する時計上のあらゆる物理過程が同じ固有時の効果を受けます。比較するときは基準系と対応させる事象を明示する必要があります。',
        '二つの時計が再会すれば、表示を直接比較できます。異なる経路をたどる間は観測者間の対称性が崩れることがあり、運動の履歴と基準系の変化が重要になります。'
      ],
      interpretationTitle: '考えるべき問い',
      interpretation: [
        'なぜ各観測者は、相手の時計が遅れていると説明できるのでしょうか。同時性の相対性によって、遠く離れた事象のどれが「今」起きているかについて観測者は一致しないことがあります。',
        '時空図を使うと、座標時、世界線に沿って積算される固有時、離れた時計を同期する規則を区別できます。'
      ],
      visualTitle: '図の読み方',
      visual: [
        '世界線は時空図上で各時計の履歴を示します。線の傾きは速度に関係し、時計の表示は世界線に沿って積算された固有時として示されます。',
        '基準系を切り替えると、同時性を表す線の傾きが変わります。その線を使って、その基準系で同時とみなされる事象を読み取ってください。横方向の位置だけで比較してはいけません。'
      ]
    }
  },
  'two-perspectives': {
    id: {
      establishedTitle: 'Apa yang ditunjukkan fisika',
      established: [
        'Relativitas khusus dapat dirumuskan dengan transformasi Lorentz untuk ruang dan waktu, atau dengan geometri ruang-waktu. Kedua bahasa ini menghasilkan prediksi terukur yang sama jika digunakan secara konsisten.',
        'Dalam kecepatan rendah dibandingkan c, transformasi Lorentz mendekati transformasi Galilea. Pada kecepatan relativistik, faktor Lorentz γ mengubah hubungan koordinat dan pengukuran waktu.',
        'Eksperimen seperti interferometer Michelson–Morley, pengamatan partikel berumur pendek, dan jam atom bergerak mendukung prediksi relativitas khusus. Perselisihan tentang cara menafsirkan ruang dan waktu tidak otomatis berarti perselisihan tentang hasil pengukuran.'
      ],
      interpretationTitle: 'Pertanyaan konseptual',
      interpretation: [
        'Apakah ruang dan waktu entitas terpisah atau bagian dari satu ruang-waktu? Formulasi matematis dapat menekankan aspek berbeda, tetapi perbandingan ilmiah harus berfokus pada besaran yang dapat diukur.',
        'Kesetaraan prediksi bukan bukti bahwa setiap interpretasi filosofis identik. Ia menunjukkan bahwa dua deskripsi dalam eksperimen ini tidak dapat dibedakan hanya melalui hasil pengukuran yang ditampilkan.'
      ],
      visualTitle: 'Cara membaca visualisasi',
      visual: [
        'Panel-panel membandingkan prediksi Galilea, Lorentzian, dan ruang-waktu untuk skenario serta kecepatan yang sama. Nilai numerik harus dibaca dengan satuan dan asumsi skenario yang menyertainya.',
        'Panel pengukuran menampilkan bukti eksperimen yang digunakan sebagai pembanding. Label cocok atau tidak cocok menilai kesesuaian prediksi dengan pengukuran, bukan keindahan atau preferensi terhadap suatu interpretasi.'
      ]
    },
    ja: {
      establishedTitle: '物理が示すこと',
      established: [
        '特殊相対論は、空間と時間に対するローレンツ変換としても、時空の幾何学としても定式化できます。どちらの表現も一貫して用いれば、同じ測定可能な予測を与えます。',
        '光速 c に比べて低速では、ローレンツ変換はガリレイ変換に近づきます。相対論的速度ではローレンツ因子 γ が座標と時間測定の関係を変えます。',
        'マイケルソン–モーリー干渉計、短寿命粒子の観測、運動する原子時計などの実験は特殊相対論の予測を支持しています。空間と時間の解釈をめぐる違いが、測定結果の違いを意味するとは限りません。'
      ],
      interpretationTitle: '考えるべき問い',
      interpretation: [
        '空間と時間は別々の存在でしょうか、それとも一つの時空の一部でしょうか。数学的な定式化は異なる側面を強調できますが、科学的な比較では測定可能な量に注目します。',
        '予測が等しいことは、あらゆる哲学的解釈が同一である証明ではありません。この実験で示す測定結果だけでは、二つの記述を区別できないことを意味します。'
      ],
      visualTitle: '図の読み方',
      visual: [
        '各パネルは同じ状況と速度について、ガリレイ的・ローレンツ的・時空的な予測を比較します。数値は対応する単位とシナリオの仮定とともに読んでください。',
        '測定パネルは予測との比較に使う実験的証拠を示します。「一致」「不一致」の表示は予測と測定の適合性を評価するもので、解釈の好みや見た目を評価するものではありません。'
      ]
    }
  },
  'gravity-clocks': {
    id: {
      establishedTitle: 'Apa yang ditunjukkan fisika',
      established: [
        'Dalam medan gravitasi, laju jam bergantung pada potensial gravitasi. Untuk jam yang diam pada ketinggian berbeda di luar benda bulat tak berotasi, model Schwarzschild memberikan laju yang berbeda; jam yang lebih dekat ke massa berjalan lebih lambat dibandingkan jam yang lebih jauh.',
        'Perbandingan dua jam statis ini memiliki asumsi khusus: ruang-waktu Schwarzschild, jam ditahan pada radius tetap, dan efek gerak orbit tidak disertakan. Satelit GPS yang mengorbit juga memiliki koreksi relativistik akibat geraknya.',
        'Sistem GPS harus memperhitungkan efek gravitasi dan efek kinematik agar waktu satelit dan jam di permukaan tetap dapat digunakan bersama untuk penentuan posisi yang akurat.'
      ],
      interpretationTitle: 'Pertanyaan konseptual',
      interpretation: [
        'Pernyataan “jam di bawah berjalan lebih lambat” selalu memerlukan definisi lokasi, kondisi gerak, dan cara membandingkan jam. Grafik laju lokal bukan dengan sendirinya pengukuran sinyal yang diterima oleh pengamat jauh.',
        'Koreksi GPS merupakan contoh penerapan relativitas, bukan bukti bahwa gravitasi saja menentukan selisih semua jam satelit. Kontribusi gravitasi dan gerak harus dipisahkan.'
      ],
      visualTitle: 'Cara membaca visualisasi',
      visual: [
        'Grafik laju jam membandingkan laju jam diam pada ketinggian yang dipilih dengan jam acuan jauh. Dua jam A dan B menampilkan waktu yang terakumulasi; indikator “lebih cepat” menunjukkan jam mana yang mengumpulkan waktu lebih banyak.',
        'Pada mode GPS, baca koreksi gravitasi dan kinematik secara terpisah. Jangan menerapkan kesimpulan dua jam statis secara langsung pada satelit yang bergerak.'
      ]
    },
    ja: {
      establishedTitle: '物理が示すこと',
      established: [
        '重力場では時計の進み方は重力ポテンシャルに依存します。回転しない球対称天体の外側で、異なる高さに静止させた時計を比べると、シュワルツシルト模型では進み方が異なります。質量に近い時計は遠い時計より遅く進みます。',
        'この静止時計の比較には特定の仮定があります。時空はシュワルツシルト時空で、時計は一定半径に保持され、軌道運動の効果は含まれません。軌道上の GPS 衛星には運動による相対論的補正も必要です。',
        '正確な測位のため、GPS は重力による効果と運動学的効果の両方を考慮し、衛星時計と地上時計の時刻を整合させています。'
      ],
      interpretationTitle: '考えるべき問い',
      interpretation: [
        '「低い場所の時計は遅い」という主張には、場所、運動状態、時計の比較方法を明確にする必要があります。局所的な時計の進み方のグラフは、遠方の観測者が受信する信号の測定そのものではありません。',
        'GPS 補正は相対論の応用例ですが、衛星時計の差を重力だけで説明できるという意味ではありません。重力の寄与と運動の寄与を分けて考えます。'
      ],
      visualTitle: '図の読み方',
      visual: [
        '時計速度グラフは、選択した高さに静止する時計の進み方を、十分遠方の基準時計と比較します。A と B の時計表示は積算時間を示し、「進んでいる」表示はより多くの時間を刻んだ時計を示します。',
        'GPS モードでは、重力補正と運動学的補正を別々に読んでください。静止した二つの時計についての結論を、運動する衛星にそのまま当てはめないでください。'
      ]
    }
  },
  'evolving-space': {
    id: {
      establishedTitle: 'Apa yang ditunjukkan fisika',
      established: [
        'Dalam model kosmologi homogen dan isotropik, faktor skala a(t) menggambarkan bagaimana jarak antara lokasi-lokasi yang ikut mengembang berubah terhadap waktu kosmik. Untuk dua galaksi komoving, jarak fisiknya sebanding dengan a(t).',
        'Laju ekspansi dinyatakan oleh parameter Hubble H = ȧ/a. Ekspansi ruang bukan berarti galaksi yang terikat gravitasi, tata surya, atau benda sehari-hari ikut membesar; sistem terikat mempertahankan ukuran melalui gaya internal.',
        'Model kosmologi yang berbeda menghasilkan riwayat faktor skala dan laju Hubble yang berbeda. Pengamatan latar gelombang mikro kosmik, kelimpahan unsur ringan, supernova jauh, dan struktur skala besar digunakan untuk menguji model.'
      ],
      interpretationTitle: 'Pertanyaan konseptual',
      interpretation: [
        'Model relativitas umum klasik menelusuri alam semesta ke keadaan sangat rapat dan panas. Ketika faktor skala mendekati nol, deskripsi klasik mencapai batas; teori tersebut tidak cukup untuk memastikan apa yang terjadi pada batas itu.',
        'Apakah ruang benar-benar “meregang” atau galaksi bergerak saling menjauh dapat bergantung pada pilihan koordinat dan cara menjelaskan geometri. Prediksi yang dapat diuji—misalnya hubungan jarak, pergeseran merah, dan laju ekspansi—menjadi dasar perbandingan.',
        'Akselerasi ekspansi saat ini biasanya dimodelkan dengan komponen energi gelap, tetapi sifat fisik energi gelap masih belum diketahui. Jangan menyamakan keberhasilan model matematis dengan penjelasan final tentang penyebabnya.'
      ],
      visualTitle: 'Cara membaca visualisasi',
      visual: [
        'Pola galaksi memperlihatkan jarak relatif yang berubah ketika faktor skala a berubah. Memilih galaksi “rumah” hanya mengubah titik acuan pengukuran; tidak ada galaksi pusat atau tepi pada pola homogen yang ditampilkan.',
        'Grafik faktor skala menunjukkan evolusi a terhadap waktu kosmik, sedangkan pembacaan Hubble dan pergeseran merah merangkum besaran model pada saat yang dipilih. Bandingkan model pada zaman kosmik yang sama.',
        'Jika model mencapai batas validitas atau singularitas, tampilan “model gagal” menandai batas deskripsi yang digunakan, bukan simulasi ledakan fisik yang telah diamati.'
      ]
    },
    ja: {
      establishedTitle: '物理が示すこと',
      established: [
        '一様・等方な宇宙論モデルでは、スケール因子 a(t) が宇宙時刻とともに共動位置間の距離がどのように変化するかを表します。二つの共動銀河の物理的距離は a(t) に比例します。',
        '膨張率はハッブル・パラメータ H = ȧ/a で表されます。宇宙空間の膨張によって、重力で束縛された銀河、太陽系、日常の物体まで大きくなるわけではありません。束縛系は内部の力によって大きさを保ちます。',
        '異なる宇宙論モデルは、スケール因子とハッブル率の異なる時間発展を予測します。宇宙マイクロ波背景放射、軽元素の存在量、遠方超新星、大規模構造などの観測を使ってモデルを検証します。'
      ],
      interpretationTitle: '考えるべき問い',
      interpretation: [
        '古典的な一般相対論モデルでは、宇宙を非常に高温・高密度の状態までさかのぼれます。スケール因子がゼロに近づくと古典的記述は限界に達し、その境界で何が起きるかを理論だけで確定することはできません。',
        '空間そのものが「伸びる」のか、銀河が互いに遠ざかるのかという表現は、座標の選択や幾何学の説明方法に依存することがあります。距離、赤方偏移、膨張率の関係など、検証可能な予測が比較の基礎です。',
        '現在の膨張加速は通常、ダークエネルギー成分を含むモデルで表されますが、その物理的性質はまだ分かっていません。数学的モデルの成功を、原因の最終的な説明と同一視しないでください。'
      ],
      visualTitle: '図の読み方',
      visual: [
        '銀河のパターンは、スケール因子 a の変化に伴う相対距離の変化を示します。「ホーム」とする銀河を選ぶ操作は測定の基準点を変えるだけです。一様なパターンに中心や端があることを意味しません。',
        'スケール因子グラフは宇宙時刻に対する a の変化を示し、ハッブル率や赤方偏移の表示は選択した時刻のモデル量を要約します。同じ宇宙時刻でモデルを比較してください。',
        'モデルが有効範囲や特異点の境界に達したときの「モデルが破綻」は、使用している記述の限界を示します。観測された物理的爆発のシミュレーションではありません。'
      ]
    }
  }
}

const guide = computed(() => locale.value === 'en' ? null : copy[props.experimentId][locale.value])
</script>

<template>
  <section v-if="guide" class="localized-guide prose" aria-labelledby="localized-guide-title">
    <h2 id="localized-guide-title">{{ guide.establishedTitle }}</h2>
    <p v-for="(paragraph, index) in guide.established" :key="'established-' + index">{{ paragraph }}</p>
    <h2>{{ guide.interpretationTitle }}</h2>
    <p v-for="(paragraph, index) in guide.interpretation" :key="'interpretation-' + index">{{ paragraph }}</p>
    <div class="visual-description" role="note" :aria-label="guide.visualTitle">
      <h3>{{ guide.visualTitle }}</h3>
      <p v-for="(paragraph, index) in guide.visual" :key="'visual-' + index">{{ paragraph }}</p>
    </div>
  </section>
</template>

<style scoped>
.localized-guide {
  margin: 1.25rem 0;
  padding: 1rem 1.15rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md, 12px);
  background: var(--surface);
}
.localized-guide h2 {
  margin: 0.25rem 0 0.65rem;
  font-size: 1.15rem;
}
.localized-guide h2:not(:first-child) {
  margin-top: 1.25rem;
}
.localized-guide p {
  line-height: 1.7;
}
.visual-description {
  margin-top: 1.25rem;
  padding: 0.9rem 1rem;
  border-inline-start: 3px solid var(--accent);
  background: var(--surface-2);
  border-radius: var(--radius-sm, 6px);
}
.visual-description h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}
.visual-description p:last-child {
  margin-bottom: 0;
}
</style>
