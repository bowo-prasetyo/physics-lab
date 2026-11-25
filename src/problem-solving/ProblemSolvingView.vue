<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { useLevel } from '@/composables/useLevel'
import { atLeast } from '@/levels'
import { getLocalizedModules } from '@/i18n/home-catalog'
import { getProblemSet } from './problem-bank'
import ProblemCard from './ProblemCard.vue'

const { locale, t } = useLocale()
const level = useLevel()
const modules = computed(() => getLocalizedModules(locale.value))
const problems = computed(() => getProblemSet(locale.value).filter((problem) => atLeast(level.value, problem.minLevel)))
const ui = computed(() => ({
  eyebrow: locale.value === 'en' ? 'Build confidence with the mathematics' : locale.value === 'id' ? 'Bangun kepercayaan diri dengan matematika' : '数学に自信をつける',
  title: locale.value === 'en' ? 'Physics Problem-Solving Lab' : locale.value === 'id' ? 'Laboratorium Pemecahan Masalah Fisika' : '物理の問題解決ラボ',
  intro: locale.value === 'en' ? 'Turn physical ideas into quantitative answers. Choose a problem, identify the model, work with the quantities, and check your result. Worked solutions explain each step and its assumptions.' : locale.value === 'id' ? 'Ubah gagasan fisika menjadi jawaban kuantitatif. Pilih soal, tentukan model, olah besaran, lalu periksa hasilnya. Pembahasan menjelaskan setiap langkah dan asumsi yang digunakan.' : '物理の考え方を定量的な答えに結び付けましょう。問題を選び、モデルを特定し、物理量を使って解き、結果を確認します。解答例では各手順と仮定を説明します。',
  count: locale.value === 'en' ? '{count} problems available at your current mathematical level.' : locale.value === 'id' ? 'Tersedia {count} soal pada tingkat matematika Anda saat ini.' : '現在の数学レベルで{count}問に取り組めます。',
  noProblems: locale.value === 'en' ? 'No problems are available at this level yet.' : locale.value === 'id' ? 'Belum ada soal untuk tingkat ini.' : 'このレベルの問題はまだありません。',
  given: locale.value === 'en' ? 'Given' : locale.value === 'id' ? 'Diketahui' : '与えられた値',
  find: locale.value === 'en' ? 'Find' : locale.value === 'id' ? 'Ditanyakan' : '求める量',
  formula: locale.value === 'en' ? 'Formula and worked steps' : locale.value === 'id' ? 'Rumus dan langkah penyelesaian' : '公式と解答手順',
  hint: locale.value === 'en' ? 'Show hint' : locale.value === 'id' ? 'Tampilkan petunjuk' : 'ヒントを見る',
  check: locale.value === 'en' ? 'Check answer' : locale.value === 'id' ? 'Periksa jawaban' : '答えを確認',
  retry: locale.value === 'en' ? 'Try again' : locale.value === 'id' ? 'Coba lagi' : 'もう一度解く',
  correct: locale.value === 'en' ? 'Correct — well done.' : locale.value === 'id' ? 'Benar — bagus sekali.' : '正解です。',
  incorrect: locale.value === 'en' ? 'Not quite. Recheck the quantities and units, or open the worked solution.' : locale.value === 'id' ? 'Belum tepat. Periksa kembali besaran dan satuannya, atau buka pembahasan.' : '正しくありません。物理量と単位を確認するか、解答例を開いてください。',
  worked: locale.value === 'en' ? 'Show worked solution' : locale.value === 'id' ? 'Tampilkan pembahasan' : '解答例を見る',
  answer: locale.value === 'en' ? 'Expected result' : locale.value === 'id' ? 'Hasil yang diharapkan' : '正答',
  inputHelp: locale.value === 'en' ? 'Enter a number; use a decimal point or comma. The unit is shown beside the field.' : locale.value === 'id' ? 'Masukkan angka; gunakan titik atau koma desimal. Satuan ditampilkan di samping kolom.' : '数値を入力してください。小数点はピリオドまたはカンマを使用できます。単位は入力欄の横に表示されます。',
  level: level.value === 'beginner' ? t('app.level.beginner') : level.value === 'intermediate' ? t('app.level.intermediate') : t('app.level.advanced'),
}))
</script>

<template>
  <article class="problem-lab container">
    <header class="page-head">
      <p class="eyebrow">{{ ui.eyebrow }}</p>
      <h1>{{ ui.title }}</h1>
      <p class="lead">{{ ui.intro }}</p>
      <p class="level-note">{{ ui.level }} · {{ ui.count.replace('{count}', String(problems.length)) }}</p>
    </header>

    <section v-if="problems.length" class="problem-list" :aria-label="ui.title">
      <section v-for="module in modules" :key="module.number" class="module-section">
        <template v-if="problems.some((p) => p.module === module.number)">
          <header class="module-head">
            <p class="eyebrow">{{ locale === 'en' ? 'Module' : locale === 'id' ? 'Modul' : 'モジュール' }} {{ module.number }}</p>
            <h2>{{ module.title }}</h2>
          </header>
          <ProblemCard v-for="problem in problems.filter((p) => p.module === module.number)" :key="problem.id"
            :problem="problem" :locale="locale" :level-label="problem.minLevel === 'beginner' ? t('app.level.beginner') : problem.minLevel === 'intermediate' ? t('app.level.intermediate') : t('app.level.advanced')" :labels="ui" />
        </template>
      </section>
    </section>
    <p v-else class="empty-state">{{ ui.noProblems }}</p>
    <p class="privacy-note">{{ locale === 'en' ? 'Your answers stay in this page session only. They are not saved or sent anywhere.' : locale === 'id' ? 'Jawaban Anda hanya tersedia selama sesi halaman ini. Jawaban tidak disimpan atau dikirim ke mana pun.' : '回答はこのページのセッション中のみ保持されます。保存や送信はされません。' }}</p>
  </article>
</template>

<style scoped>
.problem-lab { display:grid; gap:28px; padding-top:36px; padding-bottom:56px; }
.page-head { max-width:820px; }
.eyebrow { margin:0 0 8px; color:var(--accent); font-size:.78rem; font-weight:750; letter-spacing:.07em; text-transform:uppercase; }
.page-head h1 { max-width:22ch; margin-bottom:12px; font-size:clamp(2rem,5vw,3rem); letter-spacing:-.035em; }
.lead { max-width:75ch; color:var(--text-muted); font-size:1.05rem; }
.level-note { margin:0; padding:10px 12px; border-left:3px solid var(--accent); background:var(--surface); font-size:.9rem; }
.problem-list { display:grid; gap:28px; }
.module-section { display:grid; gap:12px; }
.module-head h2 { margin:0; }
.module-head .eyebrow { margin-bottom:4px; }
.empty-state { padding:20px; border:1px solid var(--border); border-radius:var(--radius); color:var(--text-muted); }
.privacy-note { margin:0; color:var(--text-muted); font-size:.82rem; }
@media(max-width:560px) { .problem-lab { gap:20px; padding-top:24px; } }
</style>
