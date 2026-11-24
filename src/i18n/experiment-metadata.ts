import type { Locale } from './locales'
import { getLocalizedModules } from './home-catalog'

export type ExperimentMetadataId =
  | 'space-vs-time'
  | 'displacement3d'
  | 'pendulum'
  | 'newtonian'
  | 'force-lab'
  | 'momentum-collisions'
  | 'projectile'
  | 'moving-clocks'
  | 'two-perspectives'
  | 'length-contraction'
  | 'gravity-clocks'
  | 'geodesic-motion'
  | 'evolving-space'

const experimentPaths: Record<ExperimentMetadataId, string> = {
  'space-vs-time': '/space/space-vs-time',
  displacement3d: '/space/displacement-3d',
  pendulum: '/time/pendulum',
  newtonian: '/mechanics/newtonian',
  'force-lab': '/mechanics/force-lab',
  'momentum-collisions': '/mechanics/momentum-collisions',
  projectile: '/mechanics/projectile',
  'moving-clocks': '/relativity/moving-clocks',
  'two-perspectives': '/relativity/two-perspectives',
  'length-contraction': '/relativity/length-contraction',
  'gravity-clocks': '/gravity/clock-rates',
  'geodesic-motion': '/gravity/geodesic-motion',
  'evolving-space': '/cosmology/evolving-space',
}

const moduleLabels: Record<ExperimentMetadataId, readonly [string, string, string]> = {
  'space-vs-time': ['Experiment A', 'Eksperimen A', '実験 A'],
  displacement3d: ['Displacement in 3D', 'Perpindahan dalam 3D', '3次元の変位'],
  pendulum: ['Pendulum clocks', 'Jam bandul', '振り子時計'],
  newtonian: ['Newtonian foundations', 'Dasar-dasar Newton', 'ニュートン力学の基礎'],
  'force-lab': ['Force Lab', 'Laboratorium Gaya', '力の実験室'],
  'momentum-collisions': ['Momentum and collisions', 'Momentum dan tumbukan', '運動量と衝突'],
  projectile: ['Projectile motion', 'Gerak proyektil', '放物運動'],
  'moving-clocks': ['Experiment B', 'Eksperimen B', '実験 B'],
  'two-perspectives': ['Experiment E · Two perspectives', 'Eksperimen E · Dua perspektif', '実験 E · 二つの視点'],
  'length-contraction': ['Experiment F · Length contraction', 'Eksperimen F · Kontraksi panjang', '実験 F · 長さの収縮'],
  'gravity-clocks': ['Experiment C', 'Eksperimen C', '実験 C'],
  'geodesic-motion': ['Experiment G · Geodesic motion', 'Eksperimen G · Gerak geodesik', '実験 G · 測地線運動'],
  'evolving-space': ['Experiment D', 'Eksperimen D', '実験 D'],
}

/**
 * Build the experiment eyebrow from the active localized module catalogue.
 * Keeping the module title and experiment label as separate fields avoids
 * partially translated composite strings when catalogue wording changes.
 */
export function getExperimentModuleEyebrow(id: ExperimentMetadataId, locale: Locale): string {
  const path = experimentPaths[id]
  const module = getLocalizedModules(locale).find((entry) =>
    entry.experiments.some((experiment) => experiment.path === path),
  )
  if (!module) return ''
  const prefix = locale === 'ja' ? 'モジュール' : locale === 'id' ? 'Modul' : 'Module'
  const suffix = moduleLabels[id][locale === 'en' ? 0 : locale === 'id' ? 1 : 2]
  return `${prefix} ${module.number} · ${module.title} · ${suffix}`
}

export type ExperimentSection = 'predict' | 'experiment' | 'mathematicsDisclosure' | 'mathematics' | 'meaningDisclosure' | 'meaning' | 'establishedPhysics' | 'interpretation' | 'nextSteps'

const sectionLabels: Record<Exclude<Locale, 'en'>, Record<ExperimentSection, string>> = {
  id: {
    predict: 'Prediksi',
    experiment: 'Eksperimen',
    mathematicsDisclosure: '3 · Pelajari matematika',
    mathematics: 'Matematika',
    meaningDisclosure: '4 · Pelajari makna dan interpretasi',
    meaning: 'Apa maknanya?',
    establishedPhysics: 'Fisika yang telah mapan',
    interpretation: 'Interpretasi: terbuka untuk diperdebatkan',
    nextSteps: 'Langkah berikutnya',
  },
  ja: {
    predict: '予測',
    experiment: '実験',
    mathematicsDisclosure: '3 · 数学を探究する',
    mathematics: '数学',
    meaningDisclosure: '4 · 意味と解釈を探究する',
    meaning: '何がわかるでしょうか？',
    establishedPhysics: '確立された物理学',
    interpretation: '解釈：議論の余地あり',
    nextSteps: '次のステップ',
  },
}

/** Explicit labels for the repeated structural headings in experiment lessons. */
export function experimentSectionLabel(section: ExperimentSection, locale: Locale): string {
  if (locale === 'en') {
    const english: Record<ExperimentSection, string> = {
      predict: 'Predict',
      experiment: 'Experiment',
      mathematicsDisclosure: '3 · Explore the mathematics',
      mathematics: 'The mathematics',
      meaningDisclosure: '4 · Explore the meaning and interpretation',
      meaning: 'What does it tell us?',
      establishedPhysics: 'Established physics',
      interpretation: 'Interpretation: open to debate',
      nextSteps: 'Next steps',
    }
    return english[section]
  }
  return sectionLabels[locale][section]
}
