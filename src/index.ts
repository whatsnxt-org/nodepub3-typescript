import path from 'path'
import fs from 'fs-extra'
import AdmZip from 'adm-zip'
import pug from 'pug'
import { v4 as uuid } from 'uuid'
import { RenderedFile, Metadata, Resource, Chapter } from './types'
import {
  isRTLLanguage,
  getMimeType,
  addRenderedFileToZip,
  addResourcesToZip,
  getChapterTree
} from './utils'

class Nodepub3 {
  private metadata: Metadata

  /** chapter's css style */
  private style: string = ''

  /** save the resources to "res" directory. */
  private resources: Resource[] = []

  /** save the chapter to "text" directory, named "c[index (start from 1)].xhtml". */
  private chapters: Chapter[] = []

  /**
   * Construct a new document
   * @example
   * import Nodepub3, { Metadata } from 'nodepub3'
   *
   * const metadata: Metadata = {
   *    title: 'Example Book',
   *    cover: {
   *      name: 'cover.png',
   *      data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYA...'
   *    }
   * }
   * const epub = new Nodepub3(metadata)
   *
   * @param metadata
   * page is being constructed.
   */
  constructor(metadata: Metadata) {
    this.metadata = {
      ...{
        id: `uuid:${uuid()}`,
        language: 'en'
      },
      ...metadata
    }
    if (this.metadata.rtl == null || this.metadata.rtl === undefined) {
      this.metadata.rtl = isRTLLanguage(this.metadata.language)
    }
  }

  /**
   * Add css content to the EPUB. This will be shared by all chapters.
   * @param style css to be inserted into the stylesheet
   */
  addStyle(style: string) {
    this.style += style
  }

  /**
   * Add a resource to the EPUB.
   * @param name name resource
   * @param data base64 encoded resource, or Buffer
   */
  addResource(name: string, data: string | Buffer) {
    this.resources.push({ name, data })
  }

  /**
   * Add one or more resources to the EPUB.
   * @param resource one or more resources to be used in the epub
   */
  addResources(...resources: Resource[]) {
    this.resources.push(...resources)
  }

  /**
   * Add a chapter with the given title and(HTML/TEXT content.
   * @param title chapter title
   * @param content chapter content
   * @param isNormalText is normal text (each line will convert to "\<p\>line\</p\>")
   * @param depth chapter's depth in table of contents, root depth is 0
   */
  addChapter(title: string, content: string, isNormalText?: boolean, depth?: number) {
    this.chapters.push({ title, content, isNormalText, depth })
  }

  /**
   * Add one or more chapters with the given title and HTML/TEXT content.
   * @param chapter one or more chapters
   */
  addChapters(...chapters: Chapter[]) {
    this.chapters.push(...chapters)
  }

  /**
   * @param cIndex chapter index to render
   */
  private getRenderOptions(cIndex?: number) {
    return {
      pretty: true,
      doctype: 'xml',
      document: this,
      utils: { uuid, getMimeType, getChapterTree },
      chapter: cIndex == null || cIndex === undefined ? undefined : this.chapters[cIndex]
    }
  }

  /**
   * render content by pug template
   * @param pathOrIndex file path in zip or chapter index to render
   */
  private renderTemplate(pathOrIndex: string | number): RenderedFile {
    if (typeof pathOrIndex === 'string') {
      return {
        path: pathOrIndex,
        content: pug.renderFile(
          path.resolve(__dirname, `../templates/${path.basename(pathOrIndex)}.pug`),
          this.getRenderOptions()
        )
      }
    }
    return {
      path: `text/c${pathOrIndex + 1}.xhtml`,
      content: pug.renderFile(path.resolve(__dirname, '../templates/chapter.xhtml.pug'), {
        cache: true,
        filename: 'chapter.xhtml',
        ...this.getRenderOptions(pathOrIndex)
      })
    }
  }

  /**
   * Generates a new epub document.
   * @example <caption>Generates a book called "example.epub"</caption>
   * epub.create("example.epub");
   * @param filePath The epub file path to save.
   * @returns Resolves if the book has been bundled successfully

   */
  async create(filePath: string) {
    // Start creating the zip.
    const zip = new AdmZip()

    // Fixed file
    const templates = [
      'META-INF/container.xml',
      'content.opf',
      'mimetype',
      'nav.xhtml',
      'style.css'
    ]
    if (!this.metadata.disableCoverChapter) templates.push('cover_page.xhtml')
    if (!this.metadata.disableContentChapter) templates.push('text/toc.xhtml')
    templates.forEach(it => {
      addRenderedFileToZip(zip, this.renderTemplate(it))
    })
    addResourcesToZip(zip, '', this.metadata.cover)

    // Chapters
    this.chapters.forEach((_it, i) => {
      addRenderedFileToZip(zip, this.renderTemplate(i))
    })

    addResourcesToZip(zip, 'res/', ...this.resources)

    await fs.ensureFile(filePath)
    await zip.writeZipPromise(filePath)
  }
}

export default Nodepub3
export { Metadata, Resource, Chapter } from './types'
