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
  'Friction coefficient': ['Koefisien gesekan', '摩擦係数'],
  'Recorded trials': ['Percobaan tercatat', '記録した試行'],
  'Clear trials': ['Hapus percobaan', '試行を消去'],
  'Trial': ['Percobaan', '試行'],
  'Mass': ['Massa', '質量'],
  'Kinetic friction coefficient': ['Koefisien gesekan', '摩擦係数'],
  'Incline angle': ['Sudut kemiringan', '傾斜角'],
  'Elapsed time': ['Waktu berlalu', '経過時間'],
  'Run this trial': ['Jalankan percobaan ini', 'この試行を実行'],
  'Reset prediction': ['Ulangi prediksi', '予測をリセット'],
  'Change one setting at a time to see which force changes and how the net force responds.': ['Ubah satu pengaturan setiap kali untuk melihat gaya mana yang berubah dan bagaimana respons gaya resultannya.', '一度に 1 つの設定を変え、どの力が変化し、合力がどう応答するかを確認してください。'],
  'Beginner: balanced forces cancel. If the net force is not zero, the block accelerates in the direction of the net force.': ['Pemula: gaya-gaya seimbang saling meniadakan. Jika gaya resultan tidak nol, balok mengalami percepatan searah gaya resultan.', '初級：つり合った力は打ち消し合います。合力がゼロでなければ、ブロックは合力の向きに加速します。'],
  'Intermediate: resolve each force into components parallel and perpendicular to the surface, then add the components.': ['Menengah: uraikan setiap gaya menjadi komponen sejajar dan tegak lurus permukaan, lalu jumlahkan komponennya.', '中級：各力を面に平行な成分と垂直な成分に分解し、それぞれを合計します。'],
  'Advanced: in a local orthonormal basis, the constraint fixes the normal acceleration to zero. The tangential equation determines the acceleration; the normal equation determines the constraint force.': ['Lanjutan: dalam basis ortonormal lokal, kendala menetapkan percepatan normal sebesar nol. Persamaan tangensial menentukan percepatan; persamaan normal menentukan gaya kendala.', '上級：局所正規直交基底では、拘束条件により法線方向の加速度はゼロになります。接線方向の式が加速度を、法線方向の式が拘束力を決定します。'],
  'What the model teaches': ['Apa yang diajarkan model ini', 'このモデルから学べること'],
  'Model assumptions and limits': ['Asumsi dan keterbatasan model', 'モデルの前提と限界'],
  'A free-body diagram includes every external force acting on the selected object.': ['Diagram benda bebas mencakup setiap gaya eksternal yang bekerja pada benda yang dipilih.', '自由物体図には、選択した物体に働くすべての外力を描きます。'],
  'The normal force is perpendicular to the surface; it is not automatically equal to the weight.': ['Gaya normal tegak lurus permukaan; nilainya tidak selalu sama dengan berat benda.', '垂直抗力は面に垂直に働き、常に重力と同じ大きさとは限りません。'],
  'Friction opposes sliding, while the net force determines acceleration.': ['Gaya gesek melawan kecenderungan gerak relatif; gaya resultan menentukan percepatan.', '摩擦力は滑ろうとする動きに逆らい、合力が加速度を決めます。'],
  'An object can move while its acceleration is zero, or accelerate while moving in the opposite direction.': ['Benda dapat bergerak dengan percepatan nol, atau mengalami percepatan yang berlawanan arah dengan geraknya.', '物体は加速度ゼロでも運動でき、運動方向と反対向きに加速することもあります。'],
  'This is a point-mass translational model in an inertial frame. The block starts from rest; one simplified friction coefficient sets the maximum friction force, which balances the tendency to slide below that limit. The applied force is parallel to the surface and the incline angle is fixed. Distinct static and kinetic friction coefficients, rotation, ropes, pulleys, air resistance and changing contact are not modelled.': ['Ini adalah model translasi massa titik dalam kerangka inersial. Balok mulai dari keadaan diam; satu koefisien gesekan sederhana menentukan gaya gesek maksimum dan menyeimbangkan kecenderungan bergeser di bawah batas tersebut. Gaya terapan sejajar permukaan dan sudut bidang tetap. Perbedaan koefisien gesekan statis dan kinetis, rotasi, tali, katrol, hambatan udara, dan perubahan kontak tidak dimodelkan.', 'これは慣性系における質点の並進モデルです。ブロックは静止状態から始まり、1 つの簡略化した摩擦係数で摩擦力の上限を定め、その範囲内では滑ろうとする力とつり合わせます。加える力は面に平行で、斜面の角度は一定です。静止摩擦係数と動摩擦係数の違い、回転、ロープ、滑車、空気抵抗、接触状態の変化は扱いません。'],
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
