# Nodepub3

Nodepub3 is used to create EPUB 3 e-books in nodejs that reference to [kcartlidge/nodepub](https://github.com/kcartlidge/nodepub) and [mohannadize/nodepub-lite](https://github.com/mohannadize/nodepub-lite).

## About Nodepub3

Nodepub3 is a Node module which can be used to create EPUB 3 documents.

- Files open fine in Calibre
- PNG/JPG cover images - recommend 600x800, 600x900, or similar as minimum
- Custom CSS style can be provided
- Inline any resource within the EPUB
- Exclude cover and table of contents from auto contents page
- Support nested table of contents hierarchies
- Support for Most Used Right To Left Languages with `<body dir="rtl">`

## Installation

```sh
npm i nodepub3
# or use pnpm
pnpm i nodepub3
```

Then import it for use:

```typescript
import Nodepub3 from 'nodepub3'
```

## Defining your EPUB

- Documents consist of _metadata_ and _sections_
  - Metadata is an object with various properties detailing the book
  - Chapters are chunks of HTML

Here's some sample metadata:

```typescript
import fs from 'fs-extra'
import Nodepub3, { Metadata } from 'nodepub3'

const metadata: Metadata = {
  id: 'isbn:278-123456789',
  cover: {
    name: 'cover.png',
    // base64 encoded resource, or Buffer
    data: fs.readFileSync('cover.png')
  },
  title: 'Unnamed Document',
  creator: {
    value: 'Anonymous',
    meta: {
      'file-as': 'Anonymous'
    }
  },
  subject: ['Sample', 'Example', 'Test'],
  copyright: 'Anonymous, 1980',
  publisher: 'My Fake Publisher',
  publicationDate: new Date('2000-12-31'),
  language: 'en',
  description: 'A test book.',
  source: 'http://www.kcartlidge.com'
}
```

Call the `constructor` method with the aforementioned metadata object detailing your book.

```typescript
const epub = new Nodepub3(metadata)
```

### Fill in the content

The bulk of the work is adding your content.

Call `addChapter` on your new document with a title and the HTML/TEXT contents for each chapter in turn.

```typescript
epub.addChapter(title, content[, isNormalText, depth])
```

For example:

```typescript
epub.addChapters(
  {
    title: 'Copyright',
    content: '<p>...</p>\n<p>...</p>'
  },
  {
    title: 'Chapter 1',
    content: '...\n...',
    // content will convert to "<p>...</p>\n<p>...</p>"
    isNormalText: true
  }
)
```

Support nested table of contents hierarchies.

```typescript
/**
 * Table of Contens:
 * 1
 * 2
 *   2.1
 *   2.2
 *     2.2.1
 * 3
 */
epub.addChapters(
  { title: '1', content: '' },
  { title: '2', content: '' },
  { title: '2.1', content: '', depth: 1 },
  { title: '2.2', content: '', depth: 1 },
  { title: '2.2.1', content: '', depth: 2 },
  { title: '3', content: '' }
)
```

### Optionally add some extra CSS style

You can inject basic CSS style into your book.

```typescript
epub.addStyle('p { text-indent: 2em; }')
```

### Inside any resource such as image、audio、video or font

For example:

```typescript
epub.addResource('f1.png', fs.readFileSync('image.png'))

epub.addResources(
  {
    name: 'f2.mp3',
    data: fs.readFileSync('audio.mp3')
  },
  {
    name: 'f3.mp4',
    data: fs.readFileSync('video.mp4')
  },
  {
    name: 'f4.ttf',
    data: fs.readFileSync('font.ttf')
  }
)
```

use resource in chapter case:

```html
<img src="../res/f1.png" />
<audio src="../res/f2.mp3" controls="controls" />
<video src="../res/f3.mp4" controls="controls" />
```

use resource in CSS style case:

```css
@font-face {
  font-family: 'f4';
  src: url('res/f4.ttf');
}
```

## Generating your EPUB

Note that Nodepub3 is _asynchronous_, actionable using `async`/`await`.

```typescript
// This will generate an epub file `example.epub`
;(async () => {
  try {
    await epub.create('example.epub')
  } catch (e) {
    console.error(e)
  }
})()
```
