import type { Locale } from '@/i18n/locales'

const copy: Record<string, readonly [string, string]> = {
  'Geodesic Motion Lab: falling through curved spacetime': ['Laboratorium Gerak Geodesik: jatuh dalam ruang-waktu melengkung', '測地線運動実験室：曲がった時空を落下する'],
  'An orbiting spacecraft is in free fall. Change its orbit and compare the path predicted by Newtonian gravity with the path of a freely moving object in Schwarzschild spacetime.': ['Wahana yang mengorbit berada dalam keadaan jatuh bebas. Ubah orbitnya dan bandingkan lintasan yang diprediksi gravitasi Newton dengan lintasan benda yang bergerak bebas dalam ruang-waktu Schwarzschild.', '軌道を回る宇宙船は自由落下しています。軌道を変え、ニュートン重力が予測する経路と、シュワルツシルト時空を自由運動する物体の経路を比較します。'],
  'If the spacecraft starts close to a circular orbit but its angular momentum is changed slightly, what happens after several revolutions?': ['Jika wahana memulai dari orbit yang hampir melingkar tetapi momentum sudutnya sedikit diubah, apa yang terjadi setelah beberapa revolusi?', '宇宙船がほぼ円軌道から出発し、角運動量を少し変えると、数周後に何が起こるでしょうか。'],
  'Predict the shape of the relativistic path.': ['Prediksikan bentuk lintasan relativistik.', '相対論的な軌道の形を予測してください。'],
  'What is a geodesic?': ['Apa itu geodesik?', '測地線とは何でしょうか。'],
  'The Schwarzschild geodesic equation': ['Persamaan geodesik Schwarzschild', 'シュワルツシルト測地線方程式'],
  'Newtonian limit': ['Limit Newton', 'ニュートン極限'],
  'Key idea': ['Gagasan utama', '重要な考え方'],
  'Closest approach': ['Jarak pendekatan terdekat', '最接近距離'],
  'Periapsis passages': ['Jumlah lintasan periapsis', '近日点通過回数'],
  'If gravity is not a force pushing the spacecraft along its path, why does its path curve around a massive body?': ['Jika gravitasi bukan gaya yang mendorong wahana sepanjang lintasannya, mengapa lintasan itu melengkung mengelilingi benda bermassa besar?', '重力が宇宙船を軌道に沿って押す力ではないとしたら、なぜその経路は大きな質量の周りで曲がるのでしょうか。'],
  'A circular orbit': ['Orbit melingkar', '円軌道'],
  'A slowly precessing ellipse': ['Elips yang berpresesi perlahan', 'ゆっくり歳差運動する楕円軌道'],
  'A rapidly changing spiral': ['Spiral yang berubah cepat', '急速に変化するらせん軌道'],
  'The orbit remains circular in this ideal setup.': ['Orbit tetap melingkar dalam pengaturan ideal ini.', 'この理想的な設定では軌道は円形を保ちます。'],
  'The relativistic path precesses: each closest approach shifts slightly.': ['Lintasan relativistik mengalami presesi: setiap titik pendekatan terdekat bergeser sedikit.', '相対論的な軌道は歳差運動し、最接近点が少しずつ移動します。'],
  'The trajectory is not a force diagram. It is the path followed by a freely falling test particle through the chosen spacetime geometry.': ['Lintasan ini bukan diagram gaya. Ini adalah jalur yang ditempuh partikel uji yang jatuh bebas melalui geometri ruang-waktu yang dipilih.', 'この軌道は力の図ではありません。選択した時空幾何の中を自由落下する試験粒子の経路です。'],
  'Initial orbital radius': ['Jari-jari orbit awal', '初期軌道半径'],
  'Angular momentum': ['Momentum sudut', '角運動量'],
  'Initial radial velocity': ['Kecepatan radial awal', '初期の動径速度'],
  'Schwarzschild radii': ['Jari-jari Schwarzschild', 'シュワルツシルト半径'],
  'Circular': ['Melingkar', '円形'],
  'Bound orbit': ['Orbit terikat', '束縛軌道'],
  'Newtonian reference': ['Acuan Newton', 'ニュートン力学の基準'],
  'Relativistic geodesic': ['Geodesik relativistik', '相対論的測地線'],
  'Predict the orbit before changing the parameters.': ['Prediksikan orbit sebelum mengubah parameter.', 'パラメーターを変更する前に軌道を予測してください。'],
  'Run the experiment': ['Jalankan eksperimen', '実験を実行'],
  'Your prediction matches the result.': ['Prediksi Anda sesuai dengan hasil.', '予測は結果と一致しています。'],
  'The path precesses because spacetime curvature changes the orbit relative to the Newtonian reference.': ['Lintasan mengalami presesi karena kelengkungan ruang-waktu mengubah orbit dibandingkan acuan Newton.', '時空の曲率によってニュートン力学の基準軌道に対する軌道が変化し、歳差運動が生じます。'],
  'What this model assumes': ['Asumsi model ini', 'このモデルの前提'],
  'The model describes a test particle in the vacuum exterior of a static, spherical, non-rotating mass (Schwarzschild geometry). It uses an equatorial timelike geodesic and ignores the particle’s back-reaction, radiation, other bodies, spin, and the interior of the mass.': ['Model ini menggambarkan partikel uji di wilayah vakum luar massa yang statis, bulat, dan tidak berotasi (geometri Schwarzschild). Model menggunakan geodesik timelike pada bidang ekuator serta mengabaikan reaksi balik partikel, radiasi, benda lain, rotasi, dan bagian dalam massa.', 'このモデルは、静的・球対称・非回転質量の真空外部（シュワルツシルト幾何）にある試験粒子を記述します。赤道面上の時間的測地線を用い、粒子の反作用、放射、他の天体、質量の自転や内部は無視します。'],
  'The plotted Newtonian curve is a comparison model with the same initial radius, radial velocity and angular momentum; it is not a second relativistic observer.': ['Kurva Newton merupakan model pembanding dengan jari-jari awal, kecepatan radial, dan momentum sudut yang sama; kurva ini bukan pengamat relativistik kedua.', '表示されるニュートン軌道は、初期半径・動径速度・角運動量を同じにした比較モデルであり、別の相対論的観測者ではありません。'],
  'The Schwarzschild radius is a horizon, not a solid surface. The exterior-coordinate model is not continued through it.': ['Jari-jari Schwarzschild adalah horizon, bukan permukaan padat. Model koordinat eksterior tidak dilanjutkan melewatinya.', 'シュワルツシルト半径は地表ではなく地平面です。外部座標モデルはその内側には延長しません。'],
  'A geodesic is the locally straightest possible path through spacetime. A freely falling object follows one when no non-gravitational force acts on it.': ['Geodesik adalah lintasan yang secara lokal paling lurus dalam ruang-waktu. Benda yang jatuh bebas mengikutinya ketika tidak ada gaya non-gravitasi yang bekerja.', '測地線は時空における局所的に最も直線的な経路です。非重力的な力が働かない自由落下物体は測地線に沿って進みます。'],
  'For a circular orbit the angular momentum is fixed by the radius. A small change from that value produces a bound orbit whose closest-approach direction slowly rotates in general relativity.': ['Untuk orbit melingkar, momentum sudut ditentukan oleh jari-jari. Perubahan kecil dari nilai itu menghasilkan orbit terikat dengan arah titik terdekat yang berputar perlahan dalam relativitas umum.', '円軌道では角運動量は半径によって決まります。その値を少し変えると束縛軌道になり、一般相対論では最接近方向がゆっくり回転します。'],
  'Newtonian gravity predicts a closed ellipse for an ideal two-body orbit. In Schwarzschild spacetime, the orbit generally precesses; the perihelion advances after each revolution.': ['Gravitasi Newton memprediksi elips tertutup untuk orbit dua benda ideal. Dalam ruang-waktu Schwarzschild, orbit umumnya mengalami presesi; perihelion bergeser maju setiap revolusi.', 'ニュートン重力は理想的な二体軌道に閉じた楕円を予測します。シュワルツシルト時空では通常、軌道は歳差運動し、1周ごとに近日点が前進します。'],
  'The Newtonian limit is recovered far from the mass, where the relativistic correction becomes small.': ['Limit Newton diperoleh jauh dari massa, ketika koreksi relativistik menjadi kecil.', '質量から十分離れると相対論的補正が小さくなり、ニュートン極限が得られます。'],
}
export function localizeGeodesicText(value: string, locale: Locale): string {
  if (locale === 'en') return value
  const translated = copy[value]
  return translated ? translated[locale === 'id' ? 0 : 1] : value
}
