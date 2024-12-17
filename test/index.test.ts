import path from 'path'
import fs from 'fs-extra'
import Nodepub3, { Metadata } from 'src/index'

test('example', async () => {
  // Metadata example.
  const metadata: Metadata = {
    id: 'isbn:278-123456789',
    cover: {
      name: 'cover.png',
      data: fs.readFileSync(path.resolve('test', 'cover.png'))
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

  const copyright = `<h1>Unnamed Document</h1>
<h2>Anonymous</h2>
<h3>© Anonymous, 1980</h3>
<p>
  All rights reserved.
</p>
<p>
  No part of this book may be reproduced in any form or by any electronic or
  mechanical means, including information storage and retrieval systems, without
  written permission from the author, except where covered by fair usage or
  equivalent.
</p>
<p>
  This book is a work of fiction.
  Any resemblance to actual persons  (living or dead) is entirely coincidental.
</p>
`

  const more = `<h2>Thanks for reading <em>Unnamed Document</em>.</h2>
<p>
  I hope you enjoyed the book, but however you felt please consider leaving a
  review where you purchased it and help other readers discover it.
</p>
<p>
  You can find links to more books (and often special offers/discounts) by
  visiting my site at <a href="http://kcartlidge.com/books">KCartlidge.com/books</a>.
</p>
`

  const about = `<p>
  This is just some random blurb about the author.
</p>
<p>
  You can find more at the author's site.
</p>
<p>
  Oh, and here's a picture of a hat:
</p>
<p>
  <img src="../res/hat.png" alt="A hat." />
</p>
`
  // Dummy text (lorem ipsum).
  let lipsum = ''
  for (let i = 0; i < 3; i += 1) {
    lipsum += `<p>iteration ${i}</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis iaculis pharetra. Proin malesuada tortor ut nibh viverra eleifend.</p><p>Duis efficitur, arcu vitae viverra consectetur, nisi mi pharetra metus, vel egestas ex velit id leo. Curabitur non tortor nisi. Mauris ornare, tellus vel fermentum suscipit, ligula est eleifend dui, in elementum nunc risus in ipsum. Pellentesque finibus aliquet turpis sed scelerisque. Pellentesque gravida semper elit, ut consequat est mollis sit amet. Nulla facilisi.</p>`
  }

  // Set up the EPUB basics.
  const epub = new Nodepub3(metadata)
  epub.addStyle(`body { font-family:Verdana,Arial,Sans-Serif; font-size:11pt; }
#title,#title h1,#title h2,#title h3 { text-align:center; }
h1,h3,p { margin-bottom:1em; }
h2 { margin-bottom:2em; }
p { text-indent: 0; }`)

  epub.addResource('hat.png', fs.readFileSync(path.resolve('test', 'hat.png')))

  epub.addChapter(
    'Title Page',
    "<div id='title'><h1>Unnamed Document</h1><h2>Book</h2><h3>Anonymous</h3><p>© Anonymous, 1980</p></div>"
  )

  epub.addChapters({
    title: 'Copyright',
    content: copyright
  })

  epub.addChapters({
    title: 'Chapter 1',
    content: `${lipsum}<p><a href='c4.xhtml'>A test internal link</a>.</p>`
  })

  epub.addChapters(
    {
      title: 'Chapter 2',
      content: `${lipsum}`
    },
    {
      title: 'Chapter 2-1',
      content: `<p><strong>2-1</strong></p>${lipsum}`,
      depth: 1
    },
    {
      title: 'Chapter 2-2',
      content: `<p><strong>2-2</strong></p>${lipsum}`,
      depth: 1
    },
    {
      title: 'Chapter 2-2-1',
      content: `<p><strong>2-2-1</strong></p>${lipsum}`,
      depth: 2
    },
    {
      title: 'More Books to Read',
      content: more
    },
    {
      title: 'About the Author',
      content: about
    }
  )

  epub.addChapter('Normal Text', 'line1\nline2\nline3\nline4', true)

  await epub.create('output/example.epub')
})
