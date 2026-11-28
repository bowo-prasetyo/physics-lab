export interface LocalizationCandidate {
  file: string
  line: number
  column: number
  kind: 'template-text' | 'static-attribute'
  tag: string
  text: string
}

export function findUnlocalizedPrecisionOutput(source: string, file?: string): Array<{ file: string; line: number; expression: string }>
export function isReviewableCopy(value: string): boolean
export function extractTemplateCandidates(template: string, file: string, lineOffset?: number): LocalizationCandidate[]
