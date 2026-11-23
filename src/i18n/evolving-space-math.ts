import type { Locale } from './locales'

/** Explanatory prose in the Evolving Space mathematics panel. */
const translations: Record<string, readonly [string, string]> = {
  'In the standard cosmological model, the scale factor': ['Dalam model kosmologi standar, faktor skala', '標準的な宇宙論モデルでは、スケール因子'],
  'describes how the proper distance between galaxies that follow the general cosmic expansion (and are not gravitationally or otherwise bound) changes with time:': ['menjelaskan bagaimana jarak wajar antara galaksi yang mengikuti ekspansi kosmik umum (dan tidak terikat oleh gravitasi atau ikatan lainnya) berubah seiring waktu:', 'は、宇宙全体の膨張に従い（重力などで束縛されていない）銀河間の固有距離が時間とともにどのように変化するかを表します：'],
  'Here': ['Di sini', 'ここで'],
  'is the distance today, when': ['adalah jarak saat ini, ketika', 'は現在の距離で、'],
  'For your distant galaxy, right now:': ['Untuk galaksi jauh yang Anda pilih saat ini:', '選択した遠方銀河について、現在の値は次のとおりです：'],
  'Hubble’s law follows': ['Hukum Hubble diturunkan', 'ハッブルの法則の導出'],
  'For galaxies following the general cosmic expansion, the rate at which their proper distance changes is proportional to that distance: a galaxy twice as far away has twice the recession rate. This is': ['Untuk galaksi yang mengikuti ekspansi kosmik umum, laju perubahan jarak wajarnya sebanding dengan jarak tersebut: galaksi yang berjarak dua kali lebih jauh memiliki laju resesi dua kali lebih besar. Inilah', '宇宙膨張に従う銀河では、固有距離の変化率はその距離に比例します。距離が2倍の銀河は、後退率も2倍になります。これが'],
  'Hubble’s law': ['Hukum Hubble', 'ハッブルの法則'],
  'Light is stretched too': ['Cahaya juga meregang', '光も引き伸ばされる'],
  'As the universe evolves, the wavelength of light measured by observers following the cosmic expansion increases in proportion to the scale factor. This cosmological redshift is a consequence of the changing spacetime geometry—not light being dragged through a stretching material. Light emitted when the scale factor was': ['Seiring evolusi alam semesta, panjang gelombang cahaya yang diukur oleh pengamat yang mengikuti ekspansi kosmik meningkat sebanding dengan faktor skala. Pergeseran merah kosmologis ini merupakan akibat perubahan geometri ruang-waktu—bukan karena cahaya terseret melalui suatu bahan yang meregang. Cahaya yang dipancarkan ketika faktor skalanya adalah', '宇宙の進化に伴い、宇宙膨張に従う観測者が測定する光の波長はスケール因子に比例して長くなります。この宇宙論的赤方偏移は、伸びる物質の中を光が引きずられるためではなく、時空の幾何学が変化することによるものです。スケール因子が'],
  'therefore has a wavelength today larger by a factor': ['maka panjang gelombangnya saat ini lebih besar dengan faktor', 'だったときに放射された光の現在の波長は、'],
  'Key idea': ['Gagasan utama', '重要な考え方'],
  'There is no central explosion or preferred centre. In the idealized FLRW model, proper distances between comoving, unbound galaxies increase as the scale factor changes. This describes the geometry of spacetime; it does not mean space is a material substance flowing or stretching galaxies. Each such galaxy sees the same large-scale pattern.': ['Tidak ada ledakan di pusat ataupun pusat yang diistimewakan. Dalam model FLRW ideal, jarak wajar antara galaksi yang bergerak bersama ekspansi dan tidak saling terikat meningkat seiring perubahan faktor skala. Ini menggambarkan geometri ruang-waktu; bukan berarti ruang adalah zat yang mengalir atau meregangkan galaksi. Setiap galaksi semacam itu melihat pola skala besar yang sama.', '中心での爆発や特別な中心はありません。理想化されたFLRWモデルでは、共動し、互いに束縛されていない銀河間の固有距離は、スケール因子の変化とともに増加します。これは時空の幾何学を表すものであり、空間が物質のように流れたり銀河を引き伸ばしたりするという意味ではありません。そのような銀河はどれも同じ大規模構造を観測します。'],
  'Hubble’s law from the scale factor': ['Hukum Hubble dari faktor skala', 'スケール因子から導くハッブルの法則'],
  'with the Hubble rate': ['dengan laju Hubble', 'ハッブル率'],
  'For your distant galaxy now (with': ['Untuk galaksi jauh yang Anda pilih saat ini (dengan', '選択した遠方銀河の現在の値です（'],
  'is the rate of change of proper distance on constant-cosmic-time slices (the recession rate), not a local measurement of a galaxy moving past a nearby observer. Beyond the': ['adalah laju perubahan jarak wajar pada irisan waktu kosmik konstan (laju resesi), bukan pengukuran lokal atas galaksi yang bergerak melewati pengamat di dekatnya. Di luar', 'は、宇宙時刻一定の空間断面における固有距離の変化率（後退率）であり、近くの観測者のそばを銀河が通過する局所的な速度の測定ではありません。'],
  'Hubble distance': ['jarak Hubble', 'ハッブル距離'],
  'this rate can exceed': ['laju ini dapat melebihi', 'この率は'],
  'That does not violate relativity: no nearby observer measures a passing galaxy or light signal moving through their local space faster than light.': ['Hal itu tidak melanggar relativitas: tidak ada pengamat lokal yang mengukur galaksi atau sinyal cahaya yang melintas di ruang lokalnya bergerak lebih cepat daripada cahaya.', 'これは相対性理論に反しません。近傍の観測者が、自分の局所的な空間を通過する銀河や光信号を光速より速く測定することはありません。'],
  'The Friedmann equation': ['Persamaan Friedmann', 'フリードマン方程式'],
  'General relativity relates the expansion rate to what the universe contains:': ['Relativitas umum menghubungkan laju ekspansi dengan kandungan alam semesta:', '一般相対性理論は、膨張率を宇宙の物質・エネルギーの内容と関連付けます：'],
  'Radiation dilutes as': ['Kerapatan radiasi berkurang sebanding dengan', '放射の密度は'],
  '(fewer photons per volume, and each one stretched), matter as': ['(jumlah foton per volume berkurang dan setiap foton meregang), materi sebanding dengan', '（体積あたりの光子数が減り、各光子の波長も伸びるため）、物質の密度は'],
  'and dark energy not at all. Each on its own gives': ['sedangkan energi gelap tidak mengalami pengenceran. Jika masing-masing mendominasi, hasilnya adalah', '、ダークエネルギーはまったく希釈されません。それぞれが単独で支配的な場合、スケール因子は'],
  'The FLRW metric: space evolving in time': ['Metrik FLRW: ruang yang berevolusi terhadap waktu', 'FLRW計量：時間とともに進化する空間'],
  'is a time-independent, maximally symmetric 3-dimensional spatial metric with constant curvature. Its scalar curvature on a constant-time slice is': ['adalah metrik ruang tiga dimensi yang tidak bergantung pada waktu, bersimetri maksimal, dan memiliki kelengkungan konstan. Skalar kelengkungannya pada irisan waktu konstan adalah', 'は、時間に依存しない、最大対称性を持つ一定曲率の3次元空間計量です。時刻一定の断面におけるスカラー曲率は'],
  'The flat special case': ['Kasus khusus datar', '平坦な特殊ケース'],
  'has': ['memiliki', 'では'],
  'giving the simpler metric': ['sehingga menghasilkan metrik yang lebih sederhana', 'となり、より簡潔な計量が得られます'],
  'In the ADM 3 + 1 language of Experiments E and C: the lapse is': ['Dalam istilah ADM 3 + 1 dari Eksperimen E dan C: lapse bernilai', '実験EおよびCで扱ったADMの3＋1形式では、ラプス関数は'],
  'the shift is zero, and the spatial metric is': ['shift bernilai nol, dan metrik ruangnya adalah', 'シフトベクトルはゼロで、空間計量は'],
  'Clocks of all comoving galaxies tick at the same rate; the spatial geometry may be flat, positively curved, or negatively curved.': ['Jam pada semua galaksi yang bergerak bersama ekspansi berdetak dengan laju yang sama; geometri ruang dapat datar, melengkung positif, atau melengkung negatif.', '共動するすべての銀河の時計は同じ速さで進みます。空間幾何は平坦、正曲率、または負曲率のいずれでもあり得ます。'],
  'The age of the universe': ['Usia alam semesta', '宇宙の年齢'],
  'For this model,': ['Untuk model ini,', 'このモデルでは、'],
  'compared with the Hubble time': ['dibandingkan dengan waktu Hubble', 'ハッブル時間と比較すると'],
  'This model has no Big Bang: going backwards,': ['Model ini tidak memiliki Dentuman Besar: jika ditelusuri mundur,', 'このモデルにはビッグバンがありません。時間を遡ると、'],
  'shrinks exponentially but never reaches zero.': ['menyusut secara eksponensial tetapi tidak pernah mencapai nol.', 'は指数関数的に小さくなりますが、ゼロには達しません。'],
  'Slowing down or speeding up': ['Melambat atau semakin cepat', '減速か加速か'],
  'means the expansion is slowing;': ['berarti ekspansi melambat;', 'は膨張が減速していることを意味し、'],
  'speeding up. The transition is found by solving': ['berarti semakin cepat. Titik peralihannya ditemukan dengan menyelesaikan', 'は加速していることを意味します。転換点は次の方程式を解いて求めます'],
  'for its positive root. If radiation is negligible, this reduces to': ['untuk mencari akar positifnya. Jika radiasi dapat diabaikan, persamaan ini menyederhana menjadi', 'の正の解を求めます。放射を無視できる場合、これは次の式に簡約されます'],
  'Where the model ends': ['Batas akhir model', 'モデルの限界'],
  'As': ['Ketika', 'a が'],
  'the density grows as': ['kerapatan meningkat sebanding dengan', '密度は'],
  'or faster and becomes infinite. The singularity theorems of Penrose and Hawking show that, given classical general relativity and ordinary matter, this cannot be avoided. Most physicists read it as the point where classical general relativity stops applying, not as a physical event. In canonical quantum gravity, the Wheeler–DeWitt equation': ['atau lebih cepat hingga menjadi tak terhingga. Teorema singularitas Penrose dan Hawking menunjukkan bahwa, dengan relativitas umum klasik dan materi biasa, hal ini tidak dapat dihindari. Kebanyakan fisikawan menafsirkannya sebagai titik ketika relativitas umum klasik tidak lagi berlaku, bukan sebagai peristiwa fisik. Dalam gravitasi kuantum kanonis, persamaan Wheeler–DeWitt', 'またはそれより速く増大し、無限大になります。ペンローズとホーキングの特異点定理は、古典的一般相対性理論と通常の物質を仮定すると、これを避けられないことを示しています。多くの物理学者は、これを物理的な出来事ではなく、古典的一般相対性理論が適用できなくなる点と解釈します。正準量子重力では、ホイーラー＝ドウィット方程式'],
  'contains no time variable at all: this is the': ['sama sekali tidak memuat variabel waktu: inilah', 'には時間変数がまったく含まれていません。これが'],
  'problem of time': ['masalah waktu', '時間の問題'],
  'One proposal is that time emerges, for example with the scale factor itself acting as a clock.': ['Salah satu usulan menyatakan bahwa waktu muncul dari sesuatu yang lebih mendasar, misalnya dengan faktor skala itu sendiri berperan sebagai jam.', '時間はより基本的なものから創発するという提案があります。たとえば、スケール因子そのものを時計として扱う考え方です。'],
}

export function localizeEvolvingSpaceMathText(value: string, locale: Locale): string {
  if (locale === 'en') return value
  const translation = translations[value]
  return translation ? translation[locale === 'id' ? 0 : 1] : value
}

export const EVOLVING_SPACE_MATH_TRANSLATION_KEYS = Object.keys(translations)
