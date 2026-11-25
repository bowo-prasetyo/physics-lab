<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { useLocale } from '@/composables/useLocale'

const { locale } = useLocale()
const id = useId()
const selected = ref<Record<string, string>>({})
const submitted = ref<Record<string, boolean>>({})
const copy = computed(() => ({
  en: {
    title: 'Interpret graphs across physics',
    intro: 'The shape and slope of a graph tell a physical story. These examples connect three experiments to quantities students often confuse.',
    check: 'Check interpretation', retry: 'Try again', correct: 'Correct — read the explanation to connect the graph to the model.',
    incorrect: 'Not quite — compare the axes and the trend before trying again.',
    cases: [
      { key: 'force', title: 'Force Lab · acceleration against net force', x: 'Net force (N)', y: 'Acceleration (m/s²)', prompt: 'For a fixed mass, what does the straight-line trend tell you?', options: [{ id: 'a', text: 'Acceleration is proportional to net force.', feedback: 'Newton’s second law gives a = Fnet / m. With mass fixed, doubling net force doubles acceleration.' }, { id: 'b', text: 'Acceleration is independent of mass and force.', feedback: 'The graph changes as force changes; it is not a constant acceleration.' }, { id: 'c', text: 'Force increases because acceleration is constant.', feedback: 'The axes show force as the input and acceleration as the response. The trend rises, so acceleration is not constant.' }], answer: 'a', points: '40,150 100,120 160,90 220,60' },
      { key: 'projectile', title: 'Projectile Lab · vertical position against time', x: 'Time (s)', y: 'Height (m)', prompt: 'What does the downward-curving graph tell you about vertical velocity?', options: [{ id: 'a', text: 'Vertical velocity stays constant.', feedback: 'A straight line would indicate constant vertical velocity. The changing slope shows vertical velocity changes.' }, { id: 'b', text: 'Vertical velocity changes steadily under gravity.', feedback: 'Correct model: the slope is vertical velocity, and the increasingly negative slope shows downward acceleration.' }, { id: 'c', text: 'Gravity acts only at the highest point.', feedback: 'Gravity acts throughout the flight, including at the highest point where vertical velocity is momentarily zero.' }], answer: 'b', points: '40,35 85,55 130,90 175,125 220,145' },
      { key: 'pendulum', title: 'Pendulum · period against length', x: 'Length (m)', y: 'Period (s)', prompt: 'As the pendulum gets longer, what happens to its period?', options: [{ id: 'a', text: 'The period increases, but not in direct proportion to length.', feedback: 'For small swings T = 2π√(L/g). Period grows with the square root of length, not linearly.' }, { id: 'b', text: 'The period decreases as length increases.', feedback: 'The plotted trend rises: a longer pendulum takes more time per cycle.' }, { id: 'c', text: 'The period is always the same.', feedback: 'The period depends on length and gravitational acceleration in the small-angle model.' }], answer: 'a', points: '40,138 85,112 130,90 175,70 220,52' },
    ],
  },
  id: {
    title: 'Menafsirkan grafik dalam berbagai topik fisika',
    intro: 'Bentuk dan kemiringan grafik menceritakan fenomena fisika. Contoh berikut menghubungkan tiga eksperimen dengan besaran yang sering tertukar.',
    check: 'Periksa interpretasi', retry: 'Coba lagi', correct: 'Benar — baca penjelasan untuk menghubungkan grafik dengan model.', incorrect: 'Belum tepat — periksa sumbu dan kecenderungan grafik sebelum mencoba lagi.',
    cases: [
      { key: 'force', title: 'Laboratorium Gaya · percepatan terhadap gaya resultan', x: 'Gaya resultan (N)', y: 'Percepatan (m/s²)', prompt: 'Untuk massa tetap, apa arti tren garis lurus ini?', options: [{ id: 'a', text: 'Percepatan sebanding dengan gaya resultan.', feedback: 'Hukum kedua Newton memberi a = Fresultan / m. Untuk massa tetap, gaya dua kali lipat menghasilkan percepatan dua kali lipat.' }, { id: 'b', text: 'Percepatan tidak bergantung pada massa dan gaya.', feedback: 'Grafik berubah saat gaya berubah; percepatannya bukan konstan.' }, { id: 'c', text: 'Gaya meningkat karena percepatan konstan.', feedback: 'Sumbu menunjukkan gaya sebagai masukan dan percepatan sebagai respons. Tren naik berarti percepatan tidak konstan.' }], answer: 'a', points: '40,150 100,120 160,90 220,60' },
      { key: 'projectile', title: 'Peluncur Proyektil · posisi vertikal terhadap waktu', x: 'Waktu (s)', y: 'Ketinggian (m)', prompt: 'Apa arti kurva yang makin menurun bagi kecepatan vertikal?', options: [{ id: 'a', text: 'Kecepatan vertikal tetap.', feedback: 'Garis lurus menunjukkan kecepatan vertikal tetap. Kemiringan yang berubah menunjukkan kecepatannya berubah.' }, { id: 'b', text: 'Kecepatan vertikal berubah secara teratur akibat gravitasi.', feedback: 'Model yang tepat: kemiringan adalah kecepatan vertikal, dan kemiringan yang makin negatif menunjukkan percepatan ke bawah.' }, { id: 'c', text: 'Gravitasi hanya bekerja di titik tertinggi.', feedback: 'Gravitasi bekerja sepanjang lintasan, termasuk di titik tertinggi ketika kecepatan vertikal sesaat nol.' }], answer: 'b', points: '40,35 85,55 130,90 175,125 220,145' },
      { key: 'pendulum', title: 'Bandul · periode terhadap panjang', x: 'Panjang (m)', y: 'Periode (s)', prompt: 'Saat bandul semakin panjang, apa yang terjadi pada periodenya?', options: [{ id: 'a', text: 'Periode bertambah, tetapi tidak sebanding langsung dengan panjang.', feedback: 'Untuk ayunan kecil T = 2π√(L/g). Periode bertambah mengikuti akar panjang, bukan secara linear.' }, { id: 'b', text: 'Periode berkurang saat panjang bertambah.', feedback: 'Tren grafik naik: bandul yang lebih panjang memerlukan waktu lebih lama untuk satu siklus.' }, { id: 'c', text: 'Periode selalu sama.', feedback: 'Dalam model sudut kecil, periode bergantung pada panjang dan percepatan gravitasi.' }], answer: 'a', points: '40,138 85,112 130,90 175,70 220,52' },
    ],
  },
  ja: {
    title: '物理のさまざまなグラフを読み解く',
    intro: 'グラフの形と傾きは物理現象を表します。次の例では、3つの実験を、混同しやすい物理量と結び付けます。',
    check: '解釈を確認', retry: 'もう一度', correct: '正解です。解説を読み、グラフとモデルを結び付けましょう。', incorrect: 'もう少しです。軸と変化の傾向を比べてから、もう一度試しましょう。',
    cases: [
      { key: 'force', title: '力の実験室 · 合力と加速度', x: '合力 (N)', y: '加速度 (m/s²)', prompt: '質量が一定のとき、この直線的な傾向は何を示しますか？', options: [{ id: 'a', text: '加速度は合力に比例する。', feedback: 'ニュートンの第2法則は a = F合力 / m です。質量が一定なら、合力を2倍にすると加速度も2倍になります。' }, { id: 'b', text: '加速度は質量や力に依存しない。', feedback: '力が変わるとグラフも変化するため、加速度は一定ではありません。' }, { id: 'c', text: '加速度が一定なので力が増加する。', feedback: '横軸は入力の力、縦軸は応答の加速度です。右上がりなので加速度は一定ではありません。' }], answer: 'a', points: '40,150 100,120 160,90 220,60' },
      { key: 'projectile', title: '投射運動 · 高さと時間', x: '時間 (s)', y: '高さ (m)', prompt: '下向きに曲がるグラフは、鉛直速度について何を示しますか？', options: [{ id: 'a', text: '鉛直速度は一定である。', feedback: '直線なら鉛直速度は一定です。傾きが変わるので速度も変化します。' }, { id: 'b', text: '重力によって鉛直速度が一定の割合で変化する。', feedback: '傾きは鉛直速度です。傾きがより負になることは、下向きの加速度を示します。' }, { id: 'c', text: '重力は最高点でのみ働く。', feedback: '重力は飛行中ずっと働きます。最高点では鉛直速度が一瞬ゼロになるだけです。' }], answer: 'b', points: '40,35 85,55 130,90 175,125 220,145' },
      { key: 'pendulum', title: '振り子 · 長さと周期', x: '長さ (m)', y: '周期 (s)', prompt: '振り子が長くなると、周期はどうなりますか？', options: [{ id: 'a', text: '周期は長くなるが、長さに正比例はしない。', feedback: '小振幅では T = 2π√(L/g) です。周期は長さの平方根に比例し、長さに正比例するわけではありません。' }, { id: 'b', text: '長さが増えると周期は短くなる。', feedback: 'グラフは右上がりです。長い振り子ほど1周期に時間がかかります。' }, { id: 'c', text: '周期は常に同じである。', feedback: '小角度モデルでは周期は長さと重力加速度に依存します。' }], answer: 'a', points: '40,138 85,112 130,90 175,70 220,52' },
    ],
  },
}))

const text = computed(() => copy.value[locale.value as keyof typeof copy.value] ?? copy.value.en)
function choose(key: string, answer: string): void { selected.value[key] = answer }
function check(key: string): void { if (selected.value[key]) submitted.value[key] = true }
function retry(key: string): void { selected.value[key] = ''; submitted.value[key] = false }
</script>

<template>
  <section class="graph-interpretation" :aria-labelledby="`${id}-title`">
    <header><h3 :id="`${id}-title`">{{ text.title }}</h3><p>{{ text.intro }}</p></header>
    <article v-for="item in text.cases" :key="item.key" class="graph-card">
      <h4>{{ item.title }}</h4>
      <div class="plot-wrap">
        <svg viewBox="0 0 260 180" role="img" :aria-label="`${item.title}: ${item.y} versus ${item.x}`">
          <path d="M40 18 V150 H235" fill="none" stroke="currentColor" stroke-width="1.5" />
          <path d="M40 50 H230 M40 90 H230 M40 130 H230" fill="none" stroke="currentColor" opacity=".16" stroke-dasharray="3 4" />
          <polyline :points="item.points" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          <text x="135" y="174" text-anchor="middle" font-size="10" fill="currentColor">{{ item.x }}</text>
          <text x="12" y="88" text-anchor="middle" font-size="10" fill="currentColor" transform="rotate(-90 12 88)">{{ item.y }}</text>
        </svg>
      </div>
      <p class="prompt">{{ item.prompt }}</p>
      <fieldset :disabled="submitted[item.key]"><legend class="sr-only">{{ item.prompt }}</legend>
        <label v-for="option in item.options" :key="option.id" class="option" :class="{ selected: selected[item.key] === option.id }">
          <input type="radio" :name="`${id}-${item.key}`" :value="option.id" :checked="selected[item.key] === option.id" @change="choose(item.key, option.id)" />
          <span>{{ option.text }}</span>
        </label>
      </fieldset>
      <div class="actions">
        <button v-if="!submitted[item.key]" type="button" class="btn btn-primary btn-small" :disabled="!selected[item.key]" @click="check(item.key)">{{ text.check }}</button>
        <button v-else type="button" class="btn btn-small" @click="retry(item.key)">{{ text.retry }}</button>
      </div>
      <div v-if="submitted[item.key]" class="feedback" role="status" aria-live="polite">
        <strong>{{ selected[item.key] === item.answer ? text.correct : text.incorrect }}</strong>
        <p>{{ item.options.find((option) => option.id === selected[item.key])?.feedback }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.graph-interpretation { display:grid; gap:14px; padding:16px; border:1px solid var(--border); border-radius:var(--radius); }
.graph-interpretation header h3 { margin:0 0 5px; }
.graph-interpretation header p { margin:0; color:var(--text-muted); }
.graph-card { display:grid; gap:9px; padding:14px; background:var(--surface-2); border-radius:var(--radius-sm); min-width:0; }
.graph-card h4,.prompt { margin:0; }
.plot-wrap { max-width:360px; width:100%; }
svg { display:block; width:100%; height:auto; overflow:visible; }
fieldset { display:grid; gap:7px; border:0; padding:0; margin:0; }
.option { display:flex; gap:9px; align-items:flex-start; padding:9px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); cursor:pointer; background:var(--surface); }
.option.selected { border-color:var(--accent); }
.option input { margin-top:4px; }
.actions { display:flex; gap:8px; }
.btn-small { min-height:36px; padding:0 12px; }
.feedback { padding:10px; border-left:4px solid var(--warn); background:var(--surface); border-radius:var(--radius-sm); }
.feedback p { margin:5px 0 0; }
.sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
</style>
