import AdmZip from 'adm-zip'
import mime from 'mime'
import { Resource, RenderedFile, Chapter, ChapterTree } from './types'

export function isRTLLanguage(ISOCode?: string) {
  const rtlLanguageList = {
    ar: 'Arabic',
    arc: 'Aramaic',
    dv: 'Divehi',
    fa: 'Persian',
    ha: 'Hausa',
    he: 'Hebrew',
    khw: 'Khowar',
    ks: 'Kashmiri',
    ku: 'Kurdish',
    ps: 'Pashto',
    ur: 'Urdu',
    yi: 'Yiddish'
  }
  return ISOCode
    ? Object.prototype.isPrototypeOf.call(rtlLanguageList, ISOCode.toLowerCase())
    : false
}

export function getMimeType(resource: Resource) {
  return mime.getType(resource.name)
}

export function addRenderedFileToZip(zip: AdmZip, file: RenderedFile) {
  zip.addFile(file.path, Buffer.from(file.content))
}

export function addResourcesToZip(zip: AdmZip, parentInZip: string, ...resources: Resource[]) {
  resources.forEach(it => {
    if (typeof it.data === 'string') {
      zip.addFile(`${parentInZip}${it.name}`, Buffer.from(it.data, 'base64'))
    } else {
      zip.addFile(`${parentInZip}${it.name}`, it.data)
    }
  })
}

export function getChapterTree(chapters: Chapter[], pIndex: number = -1, tgtDepth: number = 0) {
  const result: ChapterTree[] = []
  for (let i = pIndex + 1; i < chapters.length; i += 1) {
    const chapter = chapters[i]
    const depth = chapter.depth ?? 0
    if (depth < tgtDepth) break
    if (depth === tgtDepth) {
      result.push({
        ...chapter,
        position: i + 1,
        children: getChapterTree(chapters, i, tgtDepth + 1)
      })
    }
  }
  return result
}
