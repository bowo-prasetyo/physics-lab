export type ExperimentSupportCopy = {
  focus: string
  prompt: string
  action: string
  reflect: string
}

type LocalizedSupportCopy = Record<'id' | 'ja', ExperimentSupportCopy>

const supportCopy: Record<string, LocalizedSupportCopy> = {
  'space-vs-time': {
    id: {
      focus: 'Posisi selalu dinyatakan terhadap kerangka acuan. Waktu tetap berlalu meskipun benda berhenti bergerak.',
      prompt: 'Ketika benda berhenti bergerak, apa yang terjadi pada posisinya dan pada jam yang mengukur waktu?',
      action: 'Jalankan benda dengan beberapa kecepatan, hentikan di tengah perjalanan, lalu bandingkan geraknya dengan grafik posisi–waktu.',
      reflect: 'Apa arti kemiringan grafik posisi–waktu? Bagaimana grafik membedakan benda yang diam dari waktu yang terus berlalu?'
    },
    ja: {
      focus: '位置は常に基準系に対して表されます。物体が停止していても時間は経過し続けます。',
      prompt: '物体が動くのをやめたとき、その位置と時間を測る時計にはそれぞれ何が起こるでしょうか。',
      action: '速度を変えて物体を動かし、途中で停止させてから、その運動を位置–時間グラフと比較してください。',
      reflect: '位置–時間グラフの傾きは何を表しますか。物体の静止と時間の経過は、グラフ上でどう区別できますか。'
    }
  },
  'displacement-3d': {
    id: {
      focus: 'Posisi, panjang lintasan, dan perpindahan adalah tiga cara berbeda untuk menggambarkan perjalanan.',
      prompt: 'Jika sebuah benda menempuh dua rute berbeda menuju tujuan yang sama, besaran apa yang seharusnya tetap sama?',
      action: 'Gerakkan benda melalui beberapa titik, catat jarak dan perpindahannya, lalu geser atau putar kerangka koordinat.',
      reflect: 'Koordinat mana yang berubah ketika kerangka diganti, dan besaran geometris mana yang tetap tidak berubah?'
    },
    ja: {
      focus: '位置、経路の長さ、変位は、移動を表す異なる量です。',
      prompt: '物体が異なる二つの経路で同じ目的地に到達した場合、どの量は同じままでしょうか。',
      action: '物体を複数の点へ移動させ、距離と変位を記録してから、座標系の原点や向きを変えてください。',
      reflect: '座標系を変えたとき、どの座標が変化し、どの幾何学的な量は不変のままでしたか。'
    }
  },
  pendulum: {
    id: {
      focus: 'Bandul adalah jam fisik: periodenya bergantung pada panjang, percepatan gravitasi setempat, dan—di luar pendekatan sudut kecil—amplitudo.',
      prompt: 'Apakah menambah massa beban akan membuat bandul ideal berayun lebih cepat?',
      action: 'Ubah panjang, massa, dan sudut pelepasan secara terpisah; bandingkan periode terukur dengan prediksi sudut kecil.',
      reflect: 'Kapan pendekatan sudut kecil menjadi kurang akurat, dan mengapa jam mungkin perlu dikalibrasi ulang di lingkungan baru?'
    },
    ja: {
      focus: '振り子は物理的な時計です。周期は長さと局所的な重力加速度に依存し、小角近似を超えると振幅にも依存します。',
      prompt: 'おもりの質量を増やすと、理想的な振り子はより速く振れるでしょうか。',
      action: '長さ、質量、放す角度を一つずつ変え、測定した周期を小角近似の予測と比較してください。',
      reflect: '小角近似はどのような場合に不正確になりますか。また、新しい環境で時計の再調整が必要になるのはなぜでしょうか。'
    }
  },
  newtonian: {
    id: {
      focus: 'Percepatan ditentukan oleh gaya resultan dan massa, bukan sekadar oleh apakah benda sedang bergerak.',
      prompt: 'Pada massa tetap, apa yang terjadi pada percepatan jika gaya resultan digandakan? Bagaimana jika massanya yang digandakan?',
      action: 'Ubah satu variabel setiap kali, catat percepatannya, lalu bandingkan percobaan dengan rasio gaya terhadap massa yang sama.',
      reflect: 'Mengapa gaya resultan harus digunakan, bukan hanya gaya dorong yang diberikan? Penyederhanaan apa yang digunakan model ini?'
    },
    ja: {
      focus: '加速度を決めるのは合力と質量であり、物体が動いているかどうかだけではありません。',
      prompt: '質量一定で合力を 2 倍にすると加速度はどうなりますか。逆に質量を 2 倍にした場合はどうでしょうか。',
      action: '一度に一つの変数だけを変えて加速度を記録し、力と質量の比が同じ試行を比較してください。',
      reflect: 'なぜ加えた押す力だけでなく合力を使う必要があるのでしょうか。このモデルではどのような理想化をしていますか。'
    }
  },
  projectile: {
    id: {
      focus: 'Dalam model ideal tanpa hambatan udara, gerak horizontal dan vertikal memiliki peran berbeda: gravitasi mengubah kecepatan vertikal.',
      prompt: 'Jika bola diluncurkan secara horizontal, apakah bola mulai jatuh seketika atau baru setelah gerak majunya melambat?',
      action: 'Bandingkan sudut peluncuran dan lingkungan gravitasi; kemudian aktifkan hambatan udara dan bandingkan lintasannya.',
      reflect: 'Hasil mana yang bergantung pada pendekatan tanpa hambatan? Mengapa kecepatan horizontal dapat tetap ada bersamaan dengan percepatan ke bawah?'
    },
    ja: {
      focus: '空気抵抗のない理想モデルでは、水平運動と鉛直運動は異なる役割を持ちます。重力が変化させるのは鉛直速度です。',
      prompt: 'ボールを水平に投げた場合、前進速度が遅くなってから落下するのでしょうか。それとも直ちに落下し始めるのでしょうか。',
      action: '発射角度と重力環境を比較し、その後、空気抵抗を有効にして軌道の違いを調べてください。',
      reflect: 'どの結果が空気抵抗を無視する近似に依存していますか。なぜ水平方向の速度と下向きの加速度は同時に存在できるのでしょうか。'
    }
  },
  'moving-clocks': {
    id: {
      focus: 'Bandingkan waktu wajar yang terakumulasi sepanjang garis dunia, dan bedakan dari deskripsi menggunakan waktu koordinat.',
      prompt: 'Jika dua jam berpisah lalu bertemu kembali, apakah keduanya harus mencatat selang waktu yang sama?',
      action: 'Ubah kecepatan kapal dan kerangka pengamat, lalu bandingkan garis dunia serta irisan keserentakan untuk peristiwa yang sama.',
      reflect: 'Peristiwa mana yang dialami bersama oleh kedua pengamat, dan bagian deskripsi mana yang bergantung pada kerangka yang dipilih?'
    },
    ja: {
      focus: '世界線に沿って積算される固有時を比較し、座標時による記述と区別してください。',
      prompt: '二つの時計が離れてから再会した場合、記録する経過時間は必ず同じになるでしょうか。',
      action: '宇宙船の速度と観測者の基準系を変え、同じ事象に対する世界線と同時性の断面を比較してください。',
      reflect: '両方の観測者が共有する事象はどれですか。また、記述のどの部分が選んだ基準系に依存しますか。'
    }
  },
  'two-perspectives': {
    id: {
      focus: 'Bandingkan prediksi dari deskripsi Galilea, Lorentzian tentang ruang dan waktu, serta ruang-waktu tanpa menyamakan bahasa matematis dengan perbedaan eksperimen.',
      prompt: 'Dapatkah dua deskripsi matematis memiliki interpretasi berbeda tetapi menghasilkan prediksi terukur yang sama?',
      action: 'Pilih setiap skenario, bandingkan ketiga deskripsi pada beberapa kecepatan, lalu tampilkan bukti pengukurannya.',
      reflect: 'Prediksi mana yang sesuai dengan pengamatan, dan perbedaan mana yang menyangkut interpretasi alih-alih hasil pengukuran?'
    },
    ja: {
      focus: 'ガリレイ的記述、ローレンツ的な空間・時間の記述、時空による記述の予測を比較し、数学的な表現の違いと実験結果の違いを混同しないでください。',
      prompt: '二つの数学的記述は解釈が異なっていても、同じ測定可能な予測を与えることがあるでしょうか。',
      action: '各シナリオを選び、複数の速度で三つの記述を比較してから、測定の証拠を表示してください。',
      reflect: 'どの予測が観測と一致しますか。また、測定結果ではなく解釈に関する違いはどれでしょうか。'
    }
  },
  'gravity-clock-rates': {
    id: {
      focus: 'Bandingkan laju jam dalam kondisi Schwarzschild statis yang dinyatakan, dan perhatikan selalu asumsi modelnya.',
      prompt: 'Jam mana yang akan mengakumulasi waktu lebih banyak jika dua jam diam ditempatkan pada ketinggian berbeda?',
      action: 'Ubah ketinggian kedua jam, bandingkan laju yang diprediksi, lalu periksa koreksi GPS gravitasi dan kinematik secara terpisah.',
      reflect: 'Apa yang dipertahankan tetap dalam perbandingan ini, dan mengapa koreksi GPS tidak semata-mata berasal dari gravitasi?'
    },
    ja: {
      focus: '指定された静的シュワルツシルト条件で時計の進み方を比較し、モデルの仮定を常に確認してください。',
      prompt: '異なる高さに静止させた二つの時計では、どちらがより多くの時間を刻むでしょうか。',
      action: '二つの時計の高さを変えて予測される進み方を比較し、GPS の重力補正と運動学的補正を別々に確認してください。',
      reflect: 'この比較では何を一定に保っていますか。また、GPS の補正が重力だけによるものではないのはなぜでしょうか。'
    }
  },
  'evolving-space': {
    id: {
      focus: 'Bedakan ekspansi jarak antara lokasi komoving dari gerak benda melalui ruang statis.',
      prompt: 'Jika faktor skala menjadi dua kali lipat, apa yang terjadi pada jarak antara dua galaksi komoving?',
      action: 'Jalankan sedikitnya dua model kosmologi dan bandingkan riwayat faktor skala serta parameter Hubble pada zaman kosmik yang sama.',
      reflect: 'Kesimpulan mana yang mengikuti model yang dipilih, dan bukti pengamatan apa yang diperlukan untuk mengujinya?'
    },
    ja: {
      focus: '共動位置間の距離の膨張と、静的な空間内を物体が移動することを区別してください。',
      prompt: 'スケール因子が 2 倍になると、二つの共動銀河の間隔はどうなるでしょうか。',
      action: '少なくとも二つの宇宙論モデルを実行し、同じ宇宙時刻でスケール因子とハッブル・パラメータの履歴を比較してください。',
      reflect: '選択したモデルから導かれる結論はどれですか。それを検証するにはどのような観測証拠が必要でしょうか。'
    }
  }
}

export function localizeExperimentSupport(
  experimentId: string,
  field: keyof ExperimentSupportCopy,
  fallback: string,
  locale: 'en' | 'id' | 'ja',
): string {
  if (locale === 'en') return fallback
  return supportCopy[experimentId]?.[locale]?.[field] ?? fallback
}

export function getExperimentSupportCopy(experimentId: string, locale: 'id' | 'ja'): ExperimentSupportCopy | undefined {
  return supportCopy[experimentId]?.[locale]
}
