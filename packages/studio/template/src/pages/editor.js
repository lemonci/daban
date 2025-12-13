import { useState } from 'react'
import { BareLayout } from '@site/src/components/bare-layout.mjs'
import { Editor } from '@freesewing/react/components/Editor'
import { localDesigns } from '@site/src/local-designs.mjs'
import { Examples } from '@freesewing/examples'
import { Rendertest } from '@freesewing/rendertest'
import { Bonny } from '@freesewing/bonny'
import { Legend } from '@freesewing/legend'
import { Library } from '@freesewing/library'

/*
 * This hinges on two things:
 * - BareLayout: Gives us a docusaurus header/footer and so on, but the full page for content
 * - Editor: FreeSewing's drop-in pattern editor
 */
const EditorPage = () => {
  /*
   * People want to see the title of the Design they are working
   * on in the tab of their browser. Which means the page title.
   * So we pass down a 'setTitle' method that allows to change the
   * page title from within the editor.
   */
  const [title, setTitle] = useState('Pattern Editor')

  return (
    <BareLayout title={title}>
      <Editor
        setTitle={setTitle}
        localDesigns={{
          ...localDesigns,
          bonny: Bonny,
          examples: Examples,
          legend: Legend,
          library: Library,
          rendertest: Rendertest,
        }}
      />
    </BareLayout>
  )
}

export default EditorPage
