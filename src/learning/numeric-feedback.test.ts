import { describe, expect, it } from 'vitest'
import { classifyNumericResponse, numericFeedback } from './numeric-feedback'
describe('quantitative answer feedback',()=>{
 it('diagnoses invalid input, reversed signs and powers-of-ten errors',()=>{expect(classifyNumericResponse(2,'abc')).toBe('invalid');expect(classifyNumericResponse(-2,'2')).toBe('sign');expect(classifyNumericResponse(2,'20')).toBe('tenfold');expect(classifyNumericResponse(200,'2')).toBe('tenfold')})
 it('recognizes near answers and localizes coaching',()=>{expect(classifyNumericResponse(10,'11')).toBe('near');expect(numericFeedback(-2,'2','id')).toContain('tandanya terbalik');expect(numericFeedback(2,'20','ja')).toContain('10倍')})
})
