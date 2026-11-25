// @vitest-environment jsdom
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import { setLocale } from '@/i18n'
import GraphPractice from './GraphPractice.vue'
describe('graph interpretation practice',()=>{
 it('renders an accessible position-time plot, values and questions',async()=>{setLocale('en');const html=await renderToString(createSSRApp(GraphPractice));expect(html).toContain('Position (m) against Time (s)');expect(html).toContain('slope of a position–time graph is velocity');expect(html).toContain('2 s and 4 s');expect(html).toContain('<td>4</td>')})
 it('localizes graph interpretation in Indonesian and Japanese',async()=>{setLocale('id');expect(await renderToString(createSSRApp(GraphPractice))).toContain('Membaca grafik posisi–waktu');setLocale('ja');expect(await renderToString(createSSRApp(GraphPractice))).toContain('位置–時間グラフを読み取る');setLocale('en')})
})
