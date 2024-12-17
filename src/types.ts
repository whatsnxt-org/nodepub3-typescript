export interface DcTagAttribute {
  /** language with a value conforming to [BCP47]. */
  'xml:lang'?: 'en' | 'zh' | string
  /**
   * specifies the base text direction of the content and attribute values of the carrying element and its descendants.
   * allowed values are ltr (left-to-right) and rtl (right-to-left).
   */
  dir?: 'ltr' | 'rtl'
}

export interface DcMeta {
  /** tag value */
  value: string
  /** tag attribute */
  attribute?: DcTagAttribute
}

export interface DcTag<T> extends DcMeta {
  /** tag meta */
  meta?: T
}

export type Meta = string | DcMeta

export type Tag<T> = string | DcTag<T>

export type SimpleTag = string | DcTag<undefined>

export interface TitleMeta {
  /** the form or nature of a title. */
  'title-type'?: 'main' | 'subtitle' | 'short' | 'collection' | 'edition' | 'expanded' | Meta
  /** display sequence */
  'display-seq'?: number | Meta
}

export interface CreatorMeta {
  /** the nature of work performed by a creator or contributor (e.g., that the person is the author or editor or illustrator of a work). */
  role?: 'aut' | 'edi' | 'ill' | string
  /** a creator's name in another language */
  'alternate-script'?: Meta
  /** a normalized form of the name */
  'file-as'?: Meta
}

export interface SubjectMeta {
  /** identify the system or scheme the element's value is drawn from using the authority property. */
  authority?: Meta
  /** when a scheme is identified, a subject code MUST be attached using the term property */
  term?: Meta
}

export interface Resource {
  /** name resource */
  name: string
  /** base64 encoded resource, or Buffer */
  data: string | Buffer
}

export interface Metadata {
  /** the name given to the EPUB Publication. */
  title: Tag<TitleMeta> | Tag<TitleMeta>[]
  /** cover image */
  cover: Resource
  /** the identifier associated with the given Rendition, such as a UUID, DOI or ISBN. default is a random UUID */
  id?: string
  /** the language with a value conforming to [BCP47]. default is 'en' */
  language?: 'en' | 'zh' | string
  /** description */
  description?: SimpleTag
  /** the name of a person, organization, etc. responsible for the creation of the content of the Rendition. */
  creator?: Tag<CreatorMeta> | Tag<CreatorMeta>[]
  /** the name of a person, organization, etc. that played a secondary role in the creation of the content of an EPUB Publication. */
  contributor?: Tag<CreatorMeta> | Tag<CreatorMeta>[]
  /** the subject of the EPUB Publication. The value of the subject SHOULD be the human-readable heading or label, but MAY be the code value if the subject taxonomy does not provide a separate descriptive label. */
  subject?: Tag<SubjectMeta> | Tag<SubjectMeta>[]
  /** publisher */
  publisher?: SimpleTag
  /** the publication date of the EPUB Publication. */
  publicationDate?: Date
  /** copyright */
  copyright?: SimpleTag
  /** book source URL */
  source?: string
  /** indicate that the given EPUB Publication is of a specialized type (e.g., annotations or a dictionary packaged in EPUB format). */
  type?: string
  /** force generate RTL Document */
  rtl?: boolean
  /** disable cover chapter */
  disableCoverChapter?: boolean
  /** cover chapter's title. default zh title is '封面', Otherwise, the default is 'Cover'. */
  coverChapterTitle?: 'cover' | '封面' | string
  /** disable table of contents chapter */
  disableContentChapter?: boolean
  /** table of contents chapter's title. default zh title is '目录', Otherwise, the default is 'Table of Contents'. */
  contentChapterTitle?: 'Table of Contents' | '目录' | string
  /** disable the title(\<h1\>title\</h1\>) at the beginning of each chapter. */
  disableAutoTitle?: boolean
}

export interface Chapter {
  /** chapter title */
  title: string
  /** chapter content */
  content: string
  /** is normal text (each line will convert to "\<p\>line\</p\>") */
  isNormalText?: boolean
  /** chapter's depth in table of contents, root depth is 0  */
  depth?: number
}

export interface ChapterTree extends Chapter {
  /** position in source chapters */
  position: number
  /** subChapters */
  children: ChapterTree[]
}

export interface RenderedFile {
  /** file path in zip */
  path: string
  /** file content */
  content: string
}
