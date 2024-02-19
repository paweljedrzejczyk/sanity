import {toPlainText} from '@portabletext/react'
import {hues} from '@sanity/color'
import {isPortableTextTextBlock} from '@sanity/types'
import {Stack, Text, type Theme} from '@sanity/ui'
import {useMemo} from 'react'
import styled, {css} from 'styled-components'

import {COMMENTS_HIGHLIGHT_HUE_KEY} from '../../constants'
import {type CommentDocument} from '../../types'

function truncate(str: string, length = 250) {
  if (str.length <= length) return str
  return `${str.slice(0, length)}...`
}

interface BlockQuoteStackProps {
  $hasReferencedValue: boolean
  theme: Theme
}

const BlockQuoteStack = styled(Stack)<BlockQuoteStackProps>(({theme, $hasReferencedValue}) => {
  const isDark = theme.sanity.v2?.color._dark

  const hue = $hasReferencedValue ? COMMENTS_HIGHLIGHT_HUE_KEY : 'gray'
  const borderColor = isDark ? hues[hue][700].hex : hues[hue][300].hex

  return css`
    border-left: 2px solid ${borderColor};
    word-break: break-word;
  `
})

interface CommentsListItemReferencedValueProps {
  hasReferencedValue: boolean | undefined
  value: CommentDocument['contentSnapshot']
}

export function CommentsListItemReferencedValue(props: CommentsListItemReferencedValueProps) {
  const {hasReferencedValue, value} = props

  const resolvedValue = useMemo(() => {
    if (Array.isArray(value) && value?.filter(isPortableTextTextBlock).length > 0) {
      const text = value?.map(toPlainText).join(' ')
      const truncated = truncate(text)

      return (
        <Text size={1} muted>
          {truncated}
        </Text>
      )
    }

    return null
  }, [value])

  if (!resolvedValue) return null

  return (
    <BlockQuoteStack
      $hasReferencedValue={Boolean(hasReferencedValue)}
      flex={1}
      forwardedAs="blockquote"
      padding={1}
      paddingLeft={2}
      sizing="border"
    >
      {resolvedValue}
    </BlockQuoteStack>
  )
}
