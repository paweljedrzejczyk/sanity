import {PortableTextEditor, usePortableTextEditor} from '@sanity/portable-text-editor'
import {Path} from '@sanity/types'
import {useEffect, useRef} from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import {isEqual} from 'lodash'
import {PortableTextMemberItem} from '../PortableTextInput'
import {usePortableTextMemberItems} from './usePortableTextMembers'

interface Props {
  focusPath: Path
  boundaryElement?: HTMLElement
  editorRootPath: Path
  onItemClose: () => void
}

// This hook will track the focusPath and make sure editor content is visible and focused accordingly.
export function useTrackFocusPath(props: Props): void {
  const {focusPath, editorRootPath, boundaryElement, onItemClose} = props
  const portableTextMemberItems = usePortableTextMemberItems()
  const editor = usePortableTextEditor()

  useEffect(() => {
    // Don't do anything if no internal focusPath
    if (focusPath.length === 0) {
      return
    }
    // Find the most specific opened member item and scroll to it
    const memberItem = portableTextMemberItems
      .filter((item) => item.member.open)
      .sort((a, b) => b.member.item.path.length - a.member.item.path.length)[0]
    if (memberItem && memberItem.elementRef?.current) {
      if (boundaryElement) {
        // Scroll the boundary element into view
        scrollIntoView(boundaryElement, {
          scrollMode: 'if-needed',
        })
        // Scroll the member into view
        scrollIntoView(memberItem.elementRef?.current, {
          scrollMode: 'if-needed',
          boundary: boundaryElement,
        })
      }
      const editorSelection = PortableTextEditor.getSelection(editor)
      const hasSelectionInSameBlock = isEqual(editorSelection?.focus.path[0], focusPath[0])
      // Only manipulate the editor selection if we are not in the same block as the user have currently selected.
      // Otherwise we may interfere when the user is creating new links or inline objects that is supposed to open.
      if (!hasSelectionInSameBlock) {
        // Make a selection in the editor
        PortableTextEditor.select(editor, {
          anchor: {path: focusPath, offset: 0},
          focus: {path: focusPath, offset: 0},
        })
        if (memberItem.kind === 'textBlock') {
          PortableTextEditor.focus(editor)
          // "auto-close" regular text blocks or they get sticky here when trying to focus on an other field
          // There is no natural way of closing them (however opening something else would close them)
          onItemClose()
        }
      }
    }
  }, [
    boundaryElement,
    editor,
    editorRootPath.length,
    focusPath,
    onItemClose,
    portableTextMemberItems,
  ])
}
