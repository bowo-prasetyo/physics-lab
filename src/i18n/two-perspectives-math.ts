import type { Locale } from './locales'

/** Explanatory copy used by the Two Perspectives mathematics panel. */
const translations: Record<string, readonly [string, string]> = {
  'A description here means a set of mathematical rules for turning a situation into predictions you can measure. The three descriptions start from different ideas:': [
    'Deskripsi di sini berarti sekumpulan aturan matematika untuk mengubah suatu situasi menjadi prediksi yang dapat diukur. Ketiga deskripsi ini berangkat dari gagasan yang berbeda:',
    'ここでいう記述とは、状況を測定可能な予測に変換するための数学的な規則の集まりです。3つの記述は、それぞれ異なる考え方から出発します。',
  ],
  'Description': ['Deskripsi', '記述'],
  'Basic idea': ['Gagasan dasar', '基本的な考え方'],
  'Everyday speeds': ['Kecepatan sehari-hari', '日常的な速度'],
  'Near light speed': ['Mendekati kecepatan cahaya', '光速に近い速度'],
  'Galilean': ['Galilea', 'ガリレイ'],
  'Space + time, Lorentz-related': ['Ruang + waktu, terkait Lorentz', '空間＋時間（ローレンツ変換で関連）'],
  'Spacetime': ['Ruang-waktu', '時空'],
  'One time for everyone; speeds add': ['Waktu yang sama bagi semua orang; kecepatan dijumlahkan', 'すべての人に共通の時間。速度は単純に加算される'],
  'Excellent (except for light)': ['Sangat baik (kecuali untuk cahaya)', '非常に正確（光を除く）'],
  'Wrong': ['Keliru', '誤り'],
  'Separate space and time, mixed when you change observer': ['Ruang dan waktu terpisah, tetapi bercampur saat berganti pengamat', '空間と時間は別々だが、観測者を変えると混ざり合う'],
  'One geometry; everyone agrees on the interval': ['Satu geometri; semua orang sepakat tentang interval', '1つの幾何学で、全員が時空間隔に同意する'],
  'Correct': ['Benar', '正しい'],
  'Key idea': ['Gagasan utama', '重要な考え方'],
  'Measurements decide between descriptions. The Galilean description fails near the speed of light. The other two never disagree with each other, so measurements alone cannot choose between them: they are two ways of writing the same physics.': [
    'Pengukuran menentukan deskripsi mana yang sesuai. Deskripsi Galilea tidak berlaku saat mendekati kecepatan cahaya. Dua deskripsi lainnya tidak pernah saling bertentangan, sehingga pengukuran saja tidak dapat memilih salah satunya: keduanya merupakan dua cara untuk menyatakan fisika yang sama.',
    'どの記述が適切かは測定によって決まります。ガリレイの記述は光速に近づくと成り立ちません。残る2つの記述は互いに食い違わないため、測定だけではどちらかを選べません。両者は同じ物理を表す2つの方法です。',
  ],
  'From Galilean to Lorentz': ['Dari Galilea ke Lorentz', 'ガリレイ変換からローレンツ変換へ'],
  'Galilean:': ['Galilea:', 'ガリレイ変換：'],
  'Lorentz:': ['Transformasi Lorentz:', 'ローレンツ変換：'],
  'For': ['Untuk', 'v が c より十分小さいとき、'],
  ', so the clock correction is tiny (second order in': [', sehingga koreksi jam sangat kecil (berorde kedua dalam', 'となるため、時計の補正はごくわずかです（'],
  '). The term': ['). Suku', '）。一方、項'],
  'is different: for distant events it can be large even at modest speeds. It is the relativity of simultaneity, and Galilean physics leaves it out entirely.': [
    'berbeda: untuk peristiwa yang berjauhan, nilainya dapat besar bahkan pada kecepatan sedang. Inilah relativitas keserentakan, yang sepenuhnya diabaikan dalam fisika Galilea.',
    'は性質が異なります。遠く離れた事象では、速度がそれほど大きくなくてもこの項は大きくなり得ます。これは同時性の相対性を表し、ガリレイ物理学では完全に無視されています。',
  ],
  'Momentum uses the moving body’s own time': ['Momentum memakai waktu milik benda yang bergerak', '運動量は動く物体自身の時間を使う'],
  'Momentum divides the distance moved by the time on the moving body’s own clock, which runs slow by γ. So': ['Momentum membagi jarak tempuh dengan waktu pada jam milik benda yang bergerak, yang berjalan lebih lambat sebesar γ. Jadi', '運動量は、進んだ距離を動く物体自身の時計の時間で割ったものです。その時計は γ 倍遅れて進みます。したがって'],
  'Why speeds do not simply add': ['Mengapa kecepatan tidak sekadar dijumlahkan', '速度は単純に加算できない理由'],
  'Differentiating the Lorentz transformation gives the velocity rule': ['Dengan mendiferensialkan transformasi Lorentz, kita memperoleh aturan penjumlahan kecepatan', 'ローレンツ変換を微分すると、速度の変換則が得られます。'],
  'For light (': ['Untuk cahaya (', '光（'],
  ') at your current ship speed:': [') pada kecepatan kapal saat ini:', '）について、現在の宇宙船の速度では、'],
  'Simultaneity': ['Keserentakan', '同時性'],
  'so with': ['sehingga jika', 'したがって、'],
  'Events simultaneous for the Earth (': ['Peristiwa yang serentak menurut Bumi (', '地球から見て同時に起こる事象（'],
  ') are not simultaneous for the ship. At your speed,': [') tidak serentak menurut kapal. Pada kecepatan Anda,', '）は、宇宙船から見ると同時ではありません。現在の速度では、'],
  'Why the two relativistic descriptions must agree': ['Mengapa kedua deskripsi relativistik harus selaras', '2つの相対論的記述が一致しなければならない理由'],
  'In matrix form, a boost is a hyperbolic rotation. Its input vector is': ['Dalam bentuk matriks, boost merupakan rotasi hiperbolik. Vektor masukannya adalah', '行列表示では、ブーストは双曲回転です。その入力ベクトルは'],
  'and its rapidity is': [', dan rapiditasnya adalah', 'また、そのラピディティは'],
  'It preserves the metric': ['Transformasi ini mempertahankan metrik', 'この変換は次の計量を保ちます'],
  'With': ['Dengan', 'ここで'],
  'Writing': ['Dengan menuliskan', 'さらに、'],
  'turns': ['mengubah', 'と置くと、'],
  'into the Lorentz transformation of the space + time description, term by term. Every measurable prediction is either an': [
    'menjadi transformasi Lorentz pada deskripsi ruang + waktu, suku demi suku. Setiap prediksi yang dapat diukur merupakan',
    'は空間＋時間による記述のローレンツ変換そのものになります。測定可能な予測はすべて、次のいずれかです：',
  ],
  'invariant': ['invarian', '不変量'],
  '(a proper time, the vanishing interval of light, the sign of': ['(waktu wajar, interval cahaya yang bernilai nol, tanda dari', '（固有時、光の時空間隔がゼロであること、'],
  ') or a': ['）または', 'の符号）、あるいは'],
  'component in a stated frame': ['komponen dalam kerangka acuan tertentu', '指定された慣性系での成分'],
  '(the time between the flashes for the ship). Both formalisms compute both kinds, and they compute them with the same group of transformations. So their predictions cannot differ.': [
    '(waktu antara kilatan cahaya menurut kapal). Kedua formalisme menghitung kedua jenis besaran tersebut dengan kelompok transformasi yang sama. Karena itu, prediksinya tidak mungkin berbeda.',
    '（宇宙船から見た2回の閃光の間の時間）です。どちらの形式体系も、同じ変換群を使って両方を計算します。したがって、予測が異なることはありません。',
  ],
  '“Space + time” is spacetime with an observer chosen': ['“Ruang + waktu” adalah ruang-waktu dengan pengamat yang dipilih', '「空間＋時間」とは、観測者を選んだ時空のこと'],
  'Choose an observer with 4-velocity': ['Pilih seorang pengamat dengan 4-kecepatan', '4元速度'],
  '. Their time is the component along': ['. Waktu menurut pengamat tersebut adalah komponen sepanjang', 'を持つ観測者を選びます。その観測者の時間は'],
  ', and their space is everything orthogonal to it:': [', sedangkan ruangnya adalah semua komponen yang tegak lurus terhadapnya:', '方向の成分であり、空間はそれに直交するすべての成分です：'],
  'Different observers make different splits. The space + time description is one such split, made explicitly.': [
    'Pengamat yang berbeda membagi ruang-waktu dengan cara yang berbeda. Deskripsi ruang + waktu merupakan salah satu pembagian tersebut, yang dinyatakan secara eksplisit.',
    '観測者が異なれば、空間と時間の分け方も異なります。空間＋時間による記述は、そのような分割の1つを明示したものです。',
  ],
  'Looking ahead: the 3 + 1 split in general relativity': ['Selanjutnya: pemisahan 3 + 1 dalam relativitas umum', '次の話題：一般相対論における3＋1分解'],
  'and': ['dan', 'と'],
  'In curved spacetime the ADM formalism splits spacetime into a stack of spatial slices. In the (−, +, +, +) sign convention usual in GR,': [
    'Dalam ruang-waktu melengkung, formalisme ADM membagi ruang-waktu menjadi tumpukan irisan spasial. Dengan konvensi tanda (−, +, +, +) yang umum digunakan dalam relativitas umum,',
    '曲がった時空では、ADM形式によって時空を空間的な切片の積み重ねに分割します。一般相対論で通常用いられる符号規約（−, +, +, +）では、',
  ],
  'with the lapse': ['dengan lapse', 'ここで、ラプス関数'],
  '(how much proper time passes between slices), the shift': ['(berapa banyak waktu wajar yang berlalu di antara irisan), shift', '（切片間で経過する固有時を表す）、シフトベクトル'],
  ', and the spatial metric': [', dan metrik spasial', '、空間計量'],
  ', which evolves in time. The choice of slicing is again free, and measurable predictions do not depend on it. Module 5 builds on this.': [
    ', yang berevolusi terhadap waktu. Pemilihan irisan juga bebas, dan prediksi yang dapat diukur tidak bergantung padanya. Modul 5 akan mengembangkan gagasan ini.',
    'は時間とともに変化します。切片の選び方も任意であり、測定可能な予測はその選択に依存しません。モジュール5では、この内容をさらに発展させます。',
  ],
}

export function localizeTwoPerspectivesMathText(value: string, locale: Locale): string {
  if (locale === 'en') return value
  const translation = translations[value]
  return translation ? translation[locale === 'id' ? 0 : 1] : value
}

export const TWO_PERSPECTIVES_MATH_TRANSLATION_KEYS = Object.keys(translations)
