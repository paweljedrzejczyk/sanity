import {Box, Flex, rem, Stack, Text} from '@sanity/ui'
import {styled} from 'styled-components'
import {getDevicePixelRatio} from 'use-device-pixel-ratio'

import {Media} from '../_common/Media'
import {PREVIEW_SIZES} from '../constants'
import {renderPreviewNode} from '../helpers'
import {type PreviewMediaDimensions, type PreviewProps} from '../types'

const DEFAULT_MEDIA_DIMENSIONS: PreviewMediaDimensions = {
  ...PREVIEW_SIZES.block.media,
  aspect: 1,
  fit: 'crop',
  dpr: getDevicePixelRatio(),
}

const HeaderFlex = styled(Flex).attrs({align: 'center'})`
  min-height: ${rem(PREVIEW_SIZES.block.media.height)};
`

/**
 * @hidden
 * @beta */
export function BlockPreview(props: Omit<PreviewProps<'block'>, 'renderDefault'>) {
  const {
    actions,
    title,
    subtitle,
    description,
    mediaDimensions = DEFAULT_MEDIA_DIMENSIONS,
    media,
    status,
    children,
  } = props

  return (
    <Stack data-testid="block-preview" space={1}>
      <HeaderFlex data-testid="block-preview__header">
        {media && <Media dimensions={mediaDimensions} layout="block" media={media as any} />}

        <Box flex={1} paddingLeft={media ? 2 : 1}>
          <Text size={1} textOverflow="ellipsis" weight="medium">
            {title ? renderPreviewNode(title, 'block') : 'Untitled'}
          </Text>

          {subtitle && (
            <Box marginTop={2}>
              <Text muted size={1} textOverflow="ellipsis">
                {renderPreviewNode(subtitle, 'block')}
              </Text>
            </Box>
          )}

          {description && (
            <Box marginTop={3}>
              <Text muted size={1} textOverflow="ellipsis">
                {renderPreviewNode(description, 'block')}
              </Text>
            </Box>
          )}
        </Box>

        <Flex gap={1} paddingLeft={1}>
          {status && (
            <Box paddingX={2} paddingY={3}>
              {renderPreviewNode(status, 'block')}
            </Box>
          )}

          {actions as any}
        </Flex>
      </HeaderFlex>

      {children && <div data-testid="block-preview__children">{children}</div>}
    </Stack>
  )
}
