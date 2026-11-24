<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { getPilotExperiments, addParticipantResult, cohortToCsv, createEmptyCohort, newParticipantSeed, orderOptions, scoreQuestions, type AssessmentPhase, type PilotExperiment } from './pilot'

type Stage = 'intro' | 'pre' | 'post' | 'done'
const { locale } = useLocale()
const copy = {
  en: {
    eyebrow: 'VOLUNTARY CLASSROOM PILOT', title: 'Learning assessment pilot',
    lead: 'A short, anonymous check of conceptual understanding and transfer. This is an improvement activity, not a grade.',
    privacyTitle: 'Before you begin', privacy: 'Participation is optional. Do not enter your name, email, school, or other identifying details. Answers stay in this browser tab; Physica does not send them to a server or save them to browser storage. Only cohort totals can be exported. This acknowledgement does not replace any school, guardian, or research approval required in your setting.',
    consent: 'I understand the purpose and privacy notes, and I choose to participate.',
    experiment: 'Choose an experiment', immediate: 'Immediate assessment', delayed: 'Optional delayed check (unmatched)',
    immediateHelp: 'Complete the pre-check, explore the experiment, then answer parallel and transfer questions.',
    delayedHelp: 'Use after a delay (for example, 1–2 weeks). This is an independent, unmatched sample; do not interpret it as individual retention.',
    start: 'Start assessment', preTitle: 'Before the experiment', preHelp: 'Answer from your current understanding.',
    experimentStep: 'Explore the experiment', experimentHelp: 'Open the experiment in a new tab. Make a prediction, test it, and read the explanation before returning here.',
    openExperiment: 'Open experiment in a new tab', continue: 'Continue to post-check',
    postTitle: 'After the experiment', postHelp: 'These questions use parallel concepts and a changed situation. Work from your understanding, not memory of the options.',
    explanation: 'Explain your reasoning', rubricTitle: 'Facilitator rubric score', rubricHelp: 'A teacher or facilitator should score the explanation using the published 0–3 rubric. Do not score yourself.',
    rubric: ['0 · Unsupported', '1 · Descriptive', '2 · Partly explanatory', '3 · Well justified'],
    explanationPrompt: 'Write a brief explanation in your own words. The text is used only for the facilitator’s rubric judgment and is never saved or exported.',
    submit: 'Add anonymous result to cohort', required: 'Answer every question, write a brief explanation, and select a facilitator rubric score before submitting.',
    completed: 'Result added to this browser session', completedHelp: 'No individual response was retained. The cohort summary contains totals only. Invite the next participant or export the aggregate.',
    next: 'Prepare next participant', summary: 'Current cohort summary', participants: 'Immediate participants', delayedParticipants: 'Delayed checks (unmatched)',
    export: 'Export aggregate CSV', empty: 'No results yet. Complete a voluntary assessment to begin the cohort summary.',
    rubricDistribution: 'Explanation rubric distribution', preAverage: 'Mean pre-check', postAverage: 'Mean post-check', transferRate: 'Transfer success',
    noRubric: 'No facilitator scores yet', phaseNote: 'Delayed checks are reported separately and are not matched to immediate participants.',
    rubricScale: '0 Unsupported · 1 Descriptive · 2 Partly explanatory · 3 Well justified',
    consentRequired: 'Participation consent is required to begin.', selectPhase: 'Assessment timing',
    teacherLink: 'Run the learning assessment pilot',
  },
  id: {
    eyebrow: 'UJI COBA KELAS SUKARELA', title: 'Uji coba asesmen pembelajaran',
    lead: 'Pemeriksaan singkat dan anonim tentang pemahaman konsep dan penerapan. Ini kegiatan perbaikan, bukan penilaian.',
    privacyTitle: 'Sebelum memulai', privacy: 'Keikutsertaan bersifat sukarela. Jangan masukkan nama, email, sekolah, atau informasi identitas lainnya. Jawaban hanya berada di tab peramban ini; Physica tidak mengirimkannya ke server atau menyimpannya di penyimpanan peramban. Hanya jumlah agregat yang dapat diekspor. Pernyataan ini tidak menggantikan persetujuan sekolah, wali, atau etik penelitian yang diwajibkan di lingkungan Anda.',
    consent: 'Saya memahami tujuan dan catatan privasi ini, serta memilih untuk berpartisipasi.',
    experiment: 'Pilih eksperimen', immediate: 'Asesmen langsung', delayed: 'Pemeriksaan tertunda opsional (tidak berpasangan)',
    immediateHelp: 'Selesaikan pemeriksaan awal, jelajahi eksperimen, lalu jawab pertanyaan paralel dan penerapan.',
    delayedHelp: 'Gunakan setelah jeda (misalnya 1–2 minggu). Ini sampel mandiri yang tidak berpasangan; jangan menafsirkannya sebagai retensi individu.',
    start: 'Mulai asesmen', preTitle: 'Sebelum eksperimen', preHelp: 'Jawab berdasarkan pemahaman saat ini.',
    experimentStep: 'Jelajahi eksperimen', experimentHelp: 'Buka eksperimen di tab baru. Buat prediksi, uji, dan baca penjelasan sebelum kembali ke sini.',
    openExperiment: 'Buka eksperimen di tab baru', continue: 'Lanjut ke pemeriksaan akhir',
    postTitle: 'Setelah eksperimen', postHelp: 'Pertanyaan ini menggunakan konsep paralel dan situasi yang diubah. Gunakan pemahaman, bukan ingatan terhadap pilihan.',
    explanation: 'Jelaskan penalaran', rubricTitle: 'Skor rubrik fasilitator', rubricHelp: 'Guru atau fasilitator menilai penjelasan menggunakan rubrik 0–3. Jangan menilai diri sendiri.',
    rubric: ['0 · Tanpa dukungan', '1 · Deskriptif', '2 · Penjelasan sebagian', '3 · Beralasan kuat'],
    explanationPrompt: 'Tuliskan penjelasan singkat dengan kata-kata sendiri. Teks ini hanya digunakan fasilitator untuk menilai rubrik dan tidak pernah disimpan atau diekspor.',
    submit: 'Tambahkan hasil anonim ke agregat', required: 'Jawab semua pertanyaan, tulis penjelasan singkat, dan pilih skor rubrik fasilitator sebelum mengirim.',
    completed: 'Hasil ditambahkan ke sesi peramban ini', completedHelp: 'Tidak ada jawaban individu yang disimpan. Ringkasan kelompok hanya berisi jumlah. Undang peserta berikutnya atau ekspor agregat.',
    next: 'Siapkan peserta berikutnya', summary: 'Ringkasan kelompok saat ini', participants: 'Peserta asesmen langsung', delayedParticipants: 'Pemeriksaan tertunda (tidak berpasangan)',
    export: 'Ekspor CSV agregat', empty: 'Belum ada hasil. Selesaikan asesmen sukarela untuk memulai ringkasan kelompok.',
    rubricDistribution: 'Distribusi rubrik penjelasan', preAverage: 'Rata-rata pemeriksaan awal', postAverage: 'Rata-rata pemeriksaan akhir', transferRate: 'Keberhasilan penerapan',
    noRubric: 'Belum ada skor fasilitator', phaseNote: 'Pemeriksaan tertunda dilaporkan terpisah dan tidak dipasangkan dengan peserta asesmen langsung.',
    rubricScale: '0 Tanpa dukungan · 1 Deskriptif · 2 Penjelasan sebagian · 3 Beralasan kuat',
    consentRequired: 'Persetujuan partisipasi diperlukan untuk memulai.', selectPhase: 'Waktu asesmen',
    teacherLink: 'Jalankan uji coba asesmen pembelajaran',
  },
  ja: {
    eyebrow: '任意参加の授業パイロット', title: '学習評価パイロット',
    lead: '概念理解と応用を確認する、短時間・匿名のチェックです。成績評価ではなく、学習体験の改善を目的とします。',
    privacyTitle: '開始する前に', privacy: '参加は任意です。氏名、メールアドレス、学校名など、個人を特定できる情報を入力しないでください。回答はこのブラウザータブ内だけで扱われ、Physica のサーバーへ送信されたり、ブラウザーの保存領域に保存されたりしません。エクスポートできるのは集計値のみです。この確認は、学校・保護者・研究倫理上必要な承認に代わるものではありません。',
    consent: '目的とプライバシーに関する説明を理解し、参加を希望します。',
    experiment: '実験を選択', immediate: '実験直後の評価', delayed: '任意の遅延チェック（個人照合なし）',
    immediateHelp: '事前チェックを行い、実験を体験してから、対応する事後問題と応用問題に答えます。',
    delayedHelp: '一定期間後（例：1〜2週間）に実施します。独立した未照合サンプルであり、個人の保持率として解釈しないでください。',
    start: '評価を開始', preTitle: '実験の前に', preHelp: '現在の理解に基づいて回答してください。',
    experimentStep: '実験を体験', experimentHelp: '実験を新しいタブで開きます。予測し、試し、説明を読んでからこのページに戻ってください。',
    openExperiment: '新しいタブで実験を開く', continue: '事後チェックへ進む',
    postTitle: '実験の後に', postHelp: '対応する概念と条件を変えた問題です。選択肢の暗記ではなく、理解に基づいて考えてください。',
    explanation: '考え方を説明', rubricTitle: 'ファシリテーターによる評価', rubricHelp: '教師または進行役が公開済みの0〜3ルーブリックで説明を評価します。自己採点はしないでください。',
    rubric: ['0 · 根拠なし', '1 · 記述的', '2 · 部分的な説明', '3 · 十分な根拠あり'],
    explanationPrompt: '自分の言葉で簡潔に説明してください。この文章は進行役の評価にのみ使われ、保存・エクスポートされません。',
    submit: '匿名の結果を集計に追加', required: 'すべての問題に回答し、短い説明を書き、進行役の評価を選択してください。',
    completed: 'このブラウザーセッションに結果を追加しました', completedHelp: '個別の回答は保持されません。集計には合計値のみが含まれます。次の参加者を案内するか、集計をエクスポートしてください。',
    next: '次の参加者を準備', summary: '現在の集計', participants: '実験直後の参加者', delayedParticipants: '遅延チェック（個人照合なし）',
    export: '集計 CSV をエクスポート', empty: 'まだ結果はありません。任意の評価を完了すると集計が始まります。',
    rubricDistribution: '説明ルーブリックの分布', preAverage: '事前チェック平均', postAverage: '事後チェック平均', transferRate: '応用問題の正答率',
    noRubric: '評価スコアはまだありません', phaseNote: '遅延チェックは別集計であり、実験直後の参加者とは照合されません。',
    rubricScale: '0 根拠なし · 1 記述的 · 2 部分的な説明 · 3 十分な根拠あり',
    consentRequired: '開始するには参加への同意が必要です。', selectPhase: '評価のタイミング',
    teacherLink: '学習評価パイロットを実施',
  },
} as const

const localeKey = computed(() => locale.value === 'id' || locale.value === 'ja' ? locale.value : 'en')
const text = computed(() => copy[localeKey.value])
const experiments = computed(() => getPilotExperiments(localeKey.value))
const experimentId = ref<PilotExperiment['id']>('force-lab')
const phase = ref<AssessmentPhase>('immediate')
const consent = ref(false)
const stage = ref<Stage>('intro')
const answers = reactive<Record<string, string>>({})
const explanation = ref('')
const rubricScore = ref('')
const preScore = ref(0)
const cohort = ref(createEmptyCohort())
const notice = ref('')
// Each participant sees the answer options in their own order.
const seed = ref(newParticipantSeed())
const experiment = computed(() => experiments.value.find(item => item.id === experimentId.value)!)
const questions = computed(() => stage.value === 'pre' ? experiment.value.pre : [...experiment.value.post, experiment.value.transfer])
const allAnswered = computed(() => questions.value.every(item => answers[item.id] !== undefined))
const totals = computed(() => cohort.value[experimentId.value])
const hasResults = computed(() => Object.values(cohort.value).some(item => item.immediateCount > 0 || item.delayedCount > 0))
const rubricCounts = computed(() => totals.value.immediateRubricCounts.map((count, index) => count + (totals.value.delayedRubricCounts[index] ?? 0)))
const rubricTotal = computed(() => rubricCounts.value.reduce((sum, count) => sum + count, 0))

function clearAnswers(): void {
  for (const key of Object.keys(answers)) delete answers[key]
  explanation.value = ''
  rubricScore.value = ''
  notice.value = ''
}
function begin(): void {
  if (!consent.value) { notice.value = text.value.consentRequired; return }
  preScore.value = 0
  clearAnswers()
  seed.value = newParticipantSeed()
  stage.value = phase.value === 'immediate' ? 'pre' : 'post'
}
function continueToPost(): void {
  preScore.value = scoreQuestions(experiment.value.pre, answers)
  clearAnswers()
  stage.value = 'post'
}
function finish(): void {
  if (!allAnswered.value || !explanation.value.trim() || rubricScore.value === '') { notice.value = text.value.required; return }
  addParticipantResult(cohort.value, {
    experimentId: experiment.value.id, phase: phase.value,
    preCorrect: phase.value === 'immediate' ? preScore.value : 0,
    postCorrect: scoreQuestions(experiment.value.post, answers),
    transferCorrect: scoreQuestions([experiment.value.transfer], answers),
    explanationScore: Number(rubricScore.value),
  })
  clearAnswers()
  preScore.value = 0
  stage.value = 'done'
}
function nextParticipant(): void {
  clearAnswers()
  preScore.value = 0
  consent.value = false
  stage.value = 'intro'
}
function exportCsv(): void {
  const blob = new Blob([cohortToCsv(cohort.value)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'physica-learning-assessment-aggregate.csv'
  anchor.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <article class="assessment container">
    <header class="assessment-head"><p class="eyebrow">{{ text.eyebrow }}</p><h1>{{ text.title }}</h1><p class="lead">{{ text.lead }}</p></header>
    <section class="card privacy-card" aria-labelledby="privacy-title"><h2 id="privacy-title">{{ text.privacyTitle }}</h2><p>{{ text.privacy }}</p></section>
    <section v-if="stage === 'intro'" class="card assessment-card">
      <label class="field-label" for="pilot-experiment">{{ text.experiment }}</label>
      <select id="pilot-experiment" v-model="experimentId">
        <option v-for="item in experiments" :key="item.id" :value="item.id">{{ item.title }} — {{ item.module }}</option>
      </select>
      <p class="outcome">{{ experiment.outcome }}</p>
      <fieldset class="phase-fieldset"><legend>{{ text.selectPhase }}</legend>
        <label class="choice"><input v-model="phase" type="radio" value="immediate" /><span><strong>{{ text.immediate }}</strong><small>{{ text.immediateHelp }}</small></span></label>
        <label class="choice"><input v-model="phase" type="radio" value="delayed" /><span><strong>{{ text.delayed }}</strong><small>{{ text.delayedHelp }}</small></span></label>
      </fieldset>
      <label class="consent"><input v-model="consent" type="checkbox" /><span>{{ text.consent }}</span></label>
      <button class="btn btn-primary" type="button" @click="begin">{{ text.start }}</button>
      <p v-if="notice" class="notice" role="alert">{{ notice }}</p>
    </section>
    <section v-else-if="stage === 'pre'" class="card assessment-card">
      <h2>{{ text.preTitle }}</h2><p class="muted">{{ text.preHelp }}</p>
      <fieldset v-for="(item, index) in questions" :key="item.id" class="question"><legend>{{ index + 1 }}. {{ item.prompt }}</legend>
        <label v-for="option in orderOptions(item, seed)" :key="option.value" class="answer"><input v-model="answers[item.id]" type="radio" :name="item.id" :value="option.value" /><span>{{ option.label }}</span></label>
      </fieldset>
      <div class="step-panel"><h3>{{ text.experimentStep }}</h3><p>{{ text.experimentHelp }}</p><a class="btn" :href="experiment.route" target="_blank" rel="noopener noreferrer">{{ text.openExperiment }}</a></div>
      <button class="btn btn-primary" type="button" :disabled="!allAnswered" @click="continueToPost">{{ text.continue }}</button>
    </section>
    <section v-else-if="stage === 'post'" class="card assessment-card">
      <h2>{{ text.postTitle }}</h2><p class="muted">{{ text.postHelp }}</p>
      <fieldset v-for="(item, index) in questions" :key="item.id" class="question"><legend>{{ index + 1 }}. {{ item.prompt }}</legend>
        <label v-for="option in orderOptions(item, seed)" :key="option.value" class="answer"><input v-model="answers[item.id]" type="radio" :name="item.id" :value="option.value" /><span>{{ option.label }}</span></label>
      </fieldset>
      <div class="explanation-panel">
        <label class="field-label" for="learner-explanation">{{ text.explanation }}</label><p class="muted">{{ experiment.explanationPrompt }}</p>
        <textarea id="learner-explanation" v-model="explanation" rows="4" :placeholder="experiment.explanationPrompt" />
        <label class="field-label" for="rubric-score">{{ text.rubricTitle }}</label><p class="muted">{{ text.rubricHelp }}</p>
        <select id="rubric-score" v-model="rubricScore"><option value="" disabled>—</option><option v-for="(label, index) in text.rubric" :key="index" :value="String(index)">{{ label }}</option></select>
        <small class="muted">{{ text.rubricScale }}</small>
      </div>
      <button class="btn btn-primary" type="button" :disabled="!allAnswered || !explanation.trim() || rubricScore === ''" @click="finish">{{ text.submit }}</button>
      <p v-if="notice" class="notice" role="alert">{{ notice }}</p>
    </section>
    <section v-else-if="stage === 'done'" class="card assessment-card" aria-live="polite"><h2>{{ text.completed }}</h2><p>{{ text.completedHelp }}</p><button class="btn btn-primary" type="button" @click="nextParticipant">{{ text.next }}</button></section>
    <section class="card summary-card" aria-labelledby="summary-title">
      <div class="summary-head"><div><h2 id="summary-title">{{ text.summary }}</h2><p class="muted">{{ experiment.title }}</p></div><button class="btn" type="button" :disabled="!hasResults" @click="exportCsv">{{ text.export }}</button></div>
      <p v-if="!hasResults" class="muted">{{ text.empty }}</p>
      <template v-else>
        <div class="summary-grid">
          <div><strong>{{ totals.immediateCount }}</strong><span>{{ text.participants }}</span></div>
          <div><strong>{{ totals.delayedCount }}</strong><span>{{ text.delayedParticipants }}</span></div>
          <div><strong>{{ totals.immediateCount ? (totals.preTotal / totals.immediateCount).toFixed(2) + ' / 2' : '—' }}</strong><span>{{ text.preAverage }}</span></div>
          <div><strong>{{ totals.immediateCount ? (totals.postTotal / totals.immediateCount).toFixed(2) + ' / 2' : '—' }}</strong><span>{{ text.postAverage }}</span></div>
          <div><strong>{{ totals.immediateCount ? Math.round(totals.transferTotal / totals.immediateCount * 100) + '%' : '—' }}</strong><span>{{ text.transferRate }}</span></div>
        </div>
        <h3>{{ text.rubricDistribution }}</h3>
        <p v-if="rubricTotal === 0" class="muted">{{ text.noRubric }}</p>
        <ul v-else class="rubric-list"><li v-for="(count, index) in rubricCounts" :key="index"><span>{{ text.rubric[index] }}</span><strong>{{ count }}</strong></li></ul>
        <p class="muted small">{{ text.phaseNote }}</p>
      </template>
    </section>
  </article>
</template>

<style scoped>
.assessment { display: flex; flex-direction: column; gap: 20px; padding-top: 40px; padding-bottom: 56px; }
.assessment-head { max-width: 780px; }
.eyebrow { color: var(--accent); font-size: .78rem; font-weight: 750; letter-spacing: .06em; }
.lead { max-width: 70ch; color: var(--text-muted); font-size: 1.08rem; }
.privacy-card { max-width: 900px; border-left: 4px solid var(--accent); }
.assessment-card, .summary-card { max-width: 900px; width: 100%; }
.field-label { display: block; margin: 14px 0 6px; font-weight: 700; }
select, textarea { width: 100%; max-width: 680px; min-height: 44px; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 9px 11px; background: var(--surface); color: var(--text); font: inherit; }
textarea { resize: vertical; }
.outcome { margin-top: 10px; color: var(--text-muted); }
.phase-fieldset, .question { border: 0; border-top: 1px solid var(--border); margin: 20px 0; padding: 14px 0 0; }
.phase-fieldset legend, .question legend { padding: 0 4px 0 0; font-weight: 700; }
.choice, .answer, .consent { display: flex; align-items: flex-start; gap: 10px; padding: 9px 4px; cursor: pointer; }
.choice input, .answer input, .consent input { flex: 0 0 auto; width: 18px; height: 18px; margin-top: 3px; accent-color: var(--accent); }
.choice span { display: grid; gap: 3px; }
.choice small { color: var(--text-muted); }
.consent { margin: 18px 0; }
.step-panel, .explanation-panel { margin: 22px 0; padding: 16px; border-radius: var(--radius-sm); background: var(--surface-2); }
.step-panel h3 { margin-bottom: 5px; }
.step-panel .btn { margin-top: 6px; }
.notice { margin-top: 12px; color: var(--warn); font-weight: 650; }
.summary-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
.summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(145px, 1fr)); gap: 12px; margin: 18px 0 24px; }
.summary-grid div { display: grid; gap: 4px; padding: 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); }
.summary-grid strong { font-size: 1.35rem; font-variant-numeric: tabular-nums; }
.summary-grid span { color: var(--text-muted); font-size: .84rem; }
.rubric-list { list-style: none; margin: 0; padding: 0; max-width: 520px; }
.rubric-list li { display: flex; justify-content: space-between; gap: 16px; padding: 7px 0; border-bottom: 1px solid var(--border); }
.small { font-size: .82rem; }
@media (max-width: 560px) { .assessment { padding-top: 24px; } .summary-head .btn { width: 100%; } .assessment-card, .summary-card, .privacy-card { padding: 16px; } }
</style>
