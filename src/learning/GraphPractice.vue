<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@/composables/useLocale'
const { locale } = useLocale()
const copy = {
 en: { title:'Read a position–time graph', intro:'Use the same graph to answer three questions. The slope of a position–time graph is velocity.', x:'Time (s)', y:'Position (m)', table:'Time (s) / Position (m)', position:'Position', check:'Check graph reading', points:'Points', questions:[
  {prompt:'What happens between 2 s and 4 s?',options:['The object is at rest.','It moves at constant positive velocity.','It moves backwards.'],answer:0,why:'The graph is horizontal: position stays at 4 m while time passes, so velocity is zero.'},
  {prompt:'What is the velocity from 0 s to 2 s?',options:['+2 m/s','+4 m/s','−2 m/s'],answer:0,why:'Velocity is the slope: (4 − 0) m / (2 − 0) s = +2 m/s.'},
  {prompt:'What does the downward segment from 4 s to 6 s mean?',options:['The object returns toward the origin at −2 m/s.','The object speeds up in the positive direction.','Time runs backwards.'],answer:0,why:'Position decreases from 4 m to 0 m in 2 s. The slope is −2 m/s, so the object moves in the negative direction.'}],correct:'Correct — use the graph as evidence.',incorrect:'Not quite. Compare the line’s slope and the axis values.',next:'Next question',restart:'Try graph questions again',score:'Score'},
 id: { title:'Membaca grafik posisi–waktu', intro:'Gunakan grafik yang sama untuk menjawab tiga pertanyaan. Kemiringan grafik posisi–waktu adalah kecepatan.', x:'Waktu (s)', y:'Posisi (m)', table:'Waktu (s) / Posisi (m)', position:'Posisi', check:'Periksa pembacaan grafik', points:'Titik', questions:[
  {prompt:'Apa yang terjadi antara 2 s dan 4 s?',options:['Benda sedang diam.','Benda bergerak dengan kecepatan positif konstan.','Benda bergerak mundur.'],answer:0,why:'Grafik mendatar: posisi tetap 4 m sementara waktu berjalan, sehingga kecepatannya nol.'},
  {prompt:'Berapa kecepatan dari 0 s hingga 2 s?',options:['+2 m/s','+4 m/s','−2 m/s'],answer:0,why:'Kecepatan adalah kemiringan: (4 − 0) m / (2 − 0) s = +2 m/s.'},
  {prompt:'Apa arti segmen menurun dari 4 s hingga 6 s?',options:['Benda kembali menuju titik asal dengan kecepatan −2 m/s.','Benda semakin cepat ke arah positif.','Waktu berjalan mundur.'],answer:0,why:'Posisi turun dari 4 m menjadi 0 m dalam 2 s. Kemiringannya −2 m/s, jadi benda bergerak ke arah negatif.'}],correct:'Benar — gunakan grafik sebagai bukti.',incorrect:'Belum tepat. Bandingkan kemiringan garis dan nilai pada sumbu.',next:'Pertanyaan berikutnya',restart:'Ulangi pertanyaan grafik',score:'Skor'},
 ja: { title:'位置–時間グラフを読み取る', intro:'同じグラフを使って3つの質問に答えましょう。位置–時間グラフの傾きは速度を表します。', x:'時間 (s)', y:'位置 (m)', table:'時間 (s) / 位置 (m)', position:'位置', check:'グラフの読み取りを確認', points:'点', questions:[
  {prompt:'2秒から4秒の間に何が起きていますか？',options:['物体は静止している。','正の一定速度で動いている。','後ろ向きに動いている。'],answer:0,why:'線は水平です。時間が進んでも位置は4 mのままなので、速度はゼロです。'},
  {prompt:'0秒から2秒までの速度はいくらですか？',options:['+2 m/s','+4 m/s','−2 m/s'],answer:0,why:'速度は傾きです：(4 − 0) m / (2 − 0) s = +2 m/s。'},
  {prompt:'4秒から6秒の下降する線は何を意味しますか？',options:['物体は−2 m/sで原点に戻る。','正の方向に加速する。','時間が逆向きに進む。'],answer:0,why:'2秒間で位置が4 mから0 mになります。傾きは−2 m/sなので、負の方向に動いています。'}],correct:'正解です。グラフを根拠にできています。',incorrect:'もう一度、線の傾きと軸の値を比べましょう。',next:'次の質問',restart:'グラフ問題をもう一度',score:'得点'}
} as const
const text = computed(() => copy[locale.value])
const index = ref(0), selected = ref<number | null>(null), submitted = ref(false), score = ref(0)
const question = computed(() => text.value.questions[index.value]!)
const correct = computed(() => submitted.value && selected.value === question.value.answer)
function submit() { if (selected.value === null || submitted.value) return; submitted.value = true; if (correct.value) score.value += 1 }
function next() { if (index.value === 2) { index.value = 0; score.value = 0 } else index.value += 1; selected.value = null; submitted.value = false }
</script>
<template>
 <section class="graph-practice" aria-labelledby="graph-practice-title">
  <div><h5 id="graph-practice-title">{{ text.title }}</h5><p class="intro">{{ text.intro }}</p></div>
  <figure class="plot"><svg viewBox="0 0 640 280" role="img" :aria-label="text.y + ' against ' + text.x + '. ' + text.points + ': (0,0), (2,4), (4,4), (6,0).'">
   <g class="grid"><line v-for="x in [0,1,2,3,4,5,6]" :key="'x'+x" :x1="60+x*85" :x2="60+x*85" y1="20" y2="230"/><line v-for="y in [0,1,2,3,4,5]" :key="'y'+y" x1="60" x2="570" :y1="230-y*42" :y2="230-y*42"/></g>
   <path d="M60 230 L230 62 L400 62 L570 230" class="graph-line"/>
   <g class="ticks"><text v-for="x in [0,1,2,3,4,5,6]" :key="'tx'+x" :x="60+x*85" y="250">{{ x }}</text><text v-for="y in [0,1,2,3,4,5]" :key="'ty'+y" x="48" :y="234-y*42">{{ y }}</text></g>
   <text x="315" y="275" class="axis-label">{{ text.x }}</text><text x="14" y="125" class="axis-label" transform="rotate(-90 14 125)">{{ text.y }}</text>
  </svg><figcaption><table><caption>{{ text.table }}</caption><thead><tr><th scope="col">0</th><th scope="col">2</th><th scope="col">4</th><th scope="col">6</th></tr></thead><tbody><tr><th scope="row">{{ text.position }}</th><td>0</td><td>4</td><td>4</td><td>0</td></tr></tbody></table></figcaption></figure>
  <p class="progress">{{ text.score }}: {{ score }} / 3 · {{ index+1 }} / 3</p><p class="prompt">{{ question.prompt }}</p>
  <fieldset :disabled="submitted"><legend class="sr-only">{{ question.prompt }}</legend><label v-for="(option,i) in question.options" :key="i" class="option" :class="{selected:selected===i}"><input v-model="selected" type="radio" :value="i"/><span>{{ option }}</span></label></fieldset>
  <div class="actions"><button v-if="!submitted" type="button" class="btn btn-primary btn-small" :disabled="selected===null" @click="submit">{{ text.check }}</button><button v-else type="button" class="btn btn-small" @click="next">{{ index===2 ? text.restart : text.next }}</button></div>
  <p v-if="submitted" class="feedback" :class="correct?'good':'try'" role="status" aria-live="polite"><strong>{{ correct?text.correct:text.incorrect }}</strong> {{ question.why }}</p>
 </section>
</template>
<style scoped>
.graph-practice{display:grid;gap:10px;padding:14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface);min-width:0}h5{margin:0;font-size:1rem}.intro,.prompt,.progress{margin:0}.intro,.progress{color:var(--text-muted);font-size:.88rem}.plot{margin:0;min-width:0}svg{display:block;width:100%;height:auto}.grid line{stroke:var(--grid)}.graph-line{fill:none;stroke:var(--accent);stroke-width:4;stroke-linecap:round;stroke-linejoin:round}.ticks{fill:var(--text-muted);font-size:13px;text-anchor:middle}.ticks text:nth-child(n+8){text-anchor:end}.axis-label{fill:var(--text-muted);font-size:13px;text-anchor:middle}figcaption{overflow-x:auto;font-size:.82rem;color:var(--text-muted)}table{border-collapse:collapse;font-variant-numeric:tabular-nums}th,td{padding:3px 9px;border-bottom:1px solid var(--border);text-align:center}fieldset{display:grid;gap:6px;margin:0;padding:0;border:0}.option{display:flex;gap:9px;align-items:flex-start;padding:9px 11px;border:1px solid var(--border);border-radius:var(--radius-sm);cursor:pointer}.option.selected{border-color:var(--accent);background:var(--accent-soft)}.option input{margin-top:4px;accent-color:var(--accent)}.actions{display:flex}.btn-small{min-height:38px;padding:0 12px}.btn:disabled{opacity:.5;cursor:not-allowed}.feedback{margin:0;padding:10px 12px;border-left:4px solid var(--warn);background:var(--surface-2)}.feedback.good{border-left-color:var(--success)}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
</style>
