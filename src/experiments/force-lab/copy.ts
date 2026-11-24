import type { Locale } from '@/i18n/locales'

const copy: Record<string, readonly [string, string]> = {
  'Force Lab: free-body diagrams and multiple forces': ['Laboratorium Gaya: diagram benda bebas dan beberapa gaya', '力の実験室：自由物体図と複数の力'],
  'A push is only one part of the story. Draw every force on a block, find their vector sum, and predict how its motion changes.': ['Dorongan hanyalah sebagian dari cerita. Gambarkan setiap gaya pada balok, hitung jumlah vektornya, lalu prediksi perubahan geraknya.', '押す力だけがすべてではありません。ブロックに働くすべての力を図示し、ベクトル和を求め、運動の変化を予測しましょう。'],
  'Before running the model, predict the direction of the block’s acceleration along the surface.': ['Sebelum menjalankan model, prediksikan arah percepatan balok sepanjang permukaan.', 'モデルを実行する前に、面に沿ったブロックの加速度の向きを予測してください。'],
  'Your prediction': ['Prediksi Anda', 'あなたの予測'],
  'Up the slope / to the right': ['Ke atas bidang miring / ke kanan', '斜面を上る方向／右向き'],
  'Down the slope / to the left': ['Ke bawah bidang miring / ke kiri', '斜面を下る方向／左向き'],
  'Zero acceleration': ['Tidak ada percepatan', '加速度はゼロ'],
  'Your prediction matches the model.': ['Prediksi Anda sesuai dengan model.', '予測はモデルの結果と一致しました。'],
  'The model gives a different result. Compare the force arrows and net force.': ['Model memberikan hasil berbeda. Bandingkan panah gaya dan gaya resultan.', 'モデルの結果は予測と異なります。力の矢印と合力を比べてください。'],
  'Observed direction': ['Arah hasil pengamatan', '観察された向き'],
  'Prediction saved. Adjust the setup if needed, then run the experiment to test it.': ['Prediksi tersimpan. Sesuaikan pengaturan jika perlu, lalu jalankan eksperimen untuk mengujinya.', '予測を保存しました。必要に応じて設定を調整し、実験を実行して確かめてください。'],
  'Horizontal surface': ['Permukaan horizontal', '水平面'],
  'Inclined plane': ['Bidang miring', '斜面'],
  'Free-body diagram · forces on the block': ['Diagram benda bebas · gaya yang bekerja pada balok', '自由物体図 · ブロックに働く力'],
  'Free-body diagram showing applied force, friction, normal force and weight components': ['Diagram benda bebas yang menunjukkan gaya terapan, gesekan, gaya normal, dan komponen berat', '加える力、摩擦力、垂直抗力、重力の成分を示す自由物体図'],
  'Applied force': ['Gaya terapan', '加える力'],
  'Friction': ['Gaya gesek', '摩擦力'],
  'Normal force': ['Gaya normal', '垂直抗力'],
  'Weight along slope': ['Komponen berat sepanjang bidang', '斜面に平行な重力成分'],
  'Weight into surface': ['Komponen berat tegak lurus bidang', '斜面に垂直な重力成分'],
  'Vector lengths are scaled for readability; values are shown below.': ['Panjang vektor diskalakan agar mudah dibaca; nilainya ditampilkan di bawah.', 'ベクトルの長さは見やすいように調整しています。数値は下に表示されます。'],
  'Net force along surface': ['Gaya resultan sepanjang permukaan', '面に沿った合力'],
  'Acceleration': ['Percepatan', '加速度'],
  'Velocity after': ['Kecepatan setelah', '経過後の速度'],
  'Displacement after': ['Perpindahan setelah', '経過後の変位'],
  'Positive values point up the slope or to the right. Negative values point down the slope or to the left.': ['Nilai positif mengarah ke atas bidang atau ke kanan. Nilai negatif mengarah ke bawah bidang atau ke kiri.', '正の値は斜面を上る方向または右向き、負の値は斜面を下る方向または左向きです。'],
  'Trial recorded': ['Percobaan tercatat', '試行を記録しました'],
  'Net force': ['Gaya resultan', '合力'],
  'Surface': ['Permukaan', '面'],
  'Block mass': ['Massa balok', 'ブロックの質量'],
  'Static friction coefficient': ['Koefisien gesekan statis', '静止摩擦係数'],
  'Kinetic friction coefficient': ['Koefisien gesekan kinetis', '動摩擦係数'],
  'Friction regime': ['Jenis gaya gesek', '摩擦の状態'],
  'Static friction · at rest': ['Gesekan statis · diam', '静止摩擦 · 静止中'],
  'Kinetic friction · sliding': ['Gesekan kinetis · bergeser', '動摩擦 · 滑っている'],
  'Maximum static friction': ['Gaya gesek statis maksimum', '最大静止摩擦力'],
  'Static': ['Statis', '静止'],
  'Kinetic': ['Kinetis', '動摩擦'],
  'Recorded trials': ['Percobaan tercatat', '記録した試行'],
  'Clear trials': ['Hapus percobaan', '試行を消去'],
  'Trial': ['Percobaan', '試行'],
  'Mass': ['Massa', '質量'],
  'Incline angle': ['Sudut kemiringan', '傾斜角'],
  'Elapsed time': ['Waktu berlalu', '経過時間'],
  'Run this trial': ['Jalankan percobaan ini', 'この試行を実行'],
  'Reset prediction': ['Ulangi prediksi', '予測をリセット'],
  'Change one setting at a time to see when static friction reaches its limit and sliding begins.': ['Ubah satu pengaturan setiap kali untuk melihat kapan gaya gesek statis mencapai batasnya dan benda mulai bergeser.', '一度に 1 つの設定を変え、静止摩擦力が上限に達して滑り始める条件を確認してください。'],
  'Beginner: balanced forces cancel. Static friction can take any value needed for rest, up to its maximum. If the tendency to slide exceeds that maximum, kinetic friction acts while the block slides.': ['Pemula: gaya-gaya seimbang saling meniadakan. Gaya gesek statis dapat mengambil nilai yang diperlukan agar benda tetap diam, hingga batas maksimumnya. Jika kecenderungan bergeser melampaui batas itu, gaya gesek kinetis bekerja saat balok bergeser.', '初級：つり合った力は打ち消し合います。静止摩擦力は最大値まで、静止に必要な大きさを取ります。滑ろうとする力が最大値を超えると、ブロックが滑る間は動摩擦力が働きます。'],
  'Intermediate: resolve each force into components parallel and perpendicular to the surface, then compare the tangential tendency with the maximum static friction.': ['Menengah: uraikan setiap gaya menjadi komponen sejajar dan tegak lurus permukaan, lalu bandingkan kecenderungan gaya tangensial dengan gaya gesek statis maksimum.', '中級：各力を面に平行な成分と垂直な成分に分解し、接線方向の力の傾向を最大静止摩擦力と比較します。'],
  'Advanced: at rest, friction is a constraint force that takes the value required by tangential equilibrium, provided that value does not exceed the Coulomb limit. Beyond the threshold, the model switches to kinetic friction opposite the impending motion.': ['Lanjutan: saat diam, gaya gesek adalah gaya kendala yang mengambil nilai sesuai kebutuhan kesetimbangan tangensial, selama nilainya tidak melampaui batas Coulomb. Setelah melewati ambang, model beralih ke gaya gesek kinetis yang berlawanan dengan arah gerak yang akan terjadi.', '上級：静止中、摩擦力は接線方向のつり合いに必要な値を取る拘束力であり、その値はクーロン限界を超えません。限界を超えると、モデルは滑り出す向きと反対向きの動摩擦力に切り替わります。'],
  'What the model teaches': ['Apa yang diajarkan model ini', 'このモデルから学べること'],
  'Model assumptions and limits': ['Asumsi dan keterbatasan model', 'モデルの前提と限界'],
  'A free-body diagram includes every external force acting on the selected object.': ['Diagram benda bebas mencakup setiap gaya eksternal yang bekerja pada benda yang dipilih.', '自由物体図には、選択した物体に働くすべての外力を描きます。'],
  'The normal force is perpendicular to the surface; it is not automatically equal to the weight.': ['Gaya normal tegak lurus permukaan; nilainya tidak selalu sama dengan berat benda.', '垂直抗力は面に垂直に働き、常に重力と同じ大きさとは限りません。'],
  'Friction opposes sliding, while the net force determines acceleration.': ['Gaya gesek melawan kecenderungan gerak relatif; gaya resultan menentukan percepatan.', '摩擦力は滑ろうとする動きに逆らい、合力が加速度を決めます。'],
  'Static friction adjusts to the force needed for rest; it is not always at its maximum.': ['Gaya gesek statis menyesuaikan diri dengan gaya yang diperlukan agar benda tetap diam; nilainya tidak selalu maksimum.', '静止摩擦力は物体を静止させるために必要な大きさに調整され、常に最大値になるわけではありません。'],
  'When the static limit is exceeded, kinetic friction acts opposite the sliding direction.': ['Ketika batas gesek statis terlampaui, gaya gesek kinetis bekerja berlawanan arah dengan gerak geser.', '静止摩擦の限界を超えると、動摩擦力は滑る向きと反対に働きます。'],
  'An object can move while its acceleration is zero, or accelerate while moving in the opposite direction.': ['Benda dapat bergerak dengan percepatan nol, atau mengalami percepatan yang berlawanan arah dengan geraknya.', '物体は加速度ゼロでも運動でき、運動方向と反対向きに加速することもあります。'],
  'This is a point-mass translational model in an inertial frame. The block starts from rest. Static friction adjusts up to μsN; after the threshold is exceeded, kinetic friction has magnitude μkN and opposes the impending direction of motion. The applied force is parallel to the surface and the incline angle is fixed. The model switches regimes at breakaway without simulating the short transition, and assumes constant kinetic friction. Rotation, ropes, pulleys, air resistance and changing contact are not modelled.': ['Ini adalah model translasi massa titik dalam kerangka inersial. Balok mulai dari keadaan diam. Gaya gesek statis menyesuaikan hingga μsN; setelah ambang terlampaui, gaya gesek kinetis bermagnitudo μkN dan berlawanan dengan arah gerak yang akan terjadi. Gaya terapan sejajar permukaan dan sudut bidang tetap. Model berganti rezim saat mulai bergeser tanpa menyimulasikan transisi singkat tersebut, serta menganggap gaya gesek kinetis konstan. Rotasi, tali, katrol, hambatan udara, dan perubahan kontak tidak dimodelkan.', 'これは慣性系における質点の並進モデルです。ブロックは静止状態から始まります。静止摩擦力は μsN まで調整され、限界を超えると大きさ μkN の動摩擦力が滑り出す向きと反対に働きます。加える力は面に平行で、斜面の角度は一定です。モデルは滑り出し時に摩擦の状態を切り替え、その短い過渡過程は扱わず、動摩擦力は一定と仮定します。回転、ロープ、滑車、空気抵抗、接触状態の変化は扱いません。'],
  'The block starts from rest and the net force is constant during each trial. The displayed velocity and displacement therefore follow constant-acceleration kinematics.': ['Balok mulai dari keadaan diam dan gaya resultan konstan selama setiap percobaan. Karena itu, kecepatan dan perpindahan yang ditampilkan mengikuti kinematika percepatan konstan.', 'ブロックは静止状態から始まり、各試行中の合力は一定です。そのため、表示される速度と変位は等加速度運動に従います。'],
  'Friction is limited by the coefficient times the normal force; below that limit it balances the tendency to slide.': ['Gaya gesek dibatasi oleh koefisien dikalikan gaya normal; di bawah batas tersebut, gaya gesek menyeimbangkan kecenderungan untuk bergeser.', '摩擦力の上限は摩擦係数と垂直抗力の積です。その上限以下では、摩擦力が滑ろうとする力とつり合います。'],
}

/** Localized browser/document title for the Force Lab route. */
export function getForceLabDocumentTitle(locale: Locale): string {
  const titles: Record<Locale, string> = {
    en: 'Force Lab · Physica',
    id: 'Laboratorium Gaya · Physica',
    ja: '力の実験室 · Physica',
  }
  return titles[locale]
}

export function localizeForceLabText(value: string, locale: Locale): string {
  if (locale === 'en') return value
  const translation = copy[value]
  return translation ? translation[locale === 'id' ? 0 : 1] : value
}
