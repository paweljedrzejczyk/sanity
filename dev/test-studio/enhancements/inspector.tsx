import React from 'react'
import {CloseIcon} from '@sanity/icons'
import {
  DocumentEnhancementHookContext,
  DocumentEnhancementHookDefinition,
  defineDocumentEnhancement,
} from 'sanity'
import {Box, Button, Card, Flex, Stack, Text} from '@sanity/ui'

function useMyHook(props: DocumentEnhancementHookContext): DocumentEnhancementHookDefinition {
  const {onClose, onOpen, isOpen} = props

  return {
    title: 'Hello',
    onClick: () => (isOpen ? onClose() : onOpen()),
  }
}

export const inspector = defineDocumentEnhancement({
  name: 'dialog-2',
  use: useMyHook,
  view: {
    type: 'inspector',
    component: ({onClose}) => (
      <Box>
        <Stack space={2}>
          <Card padding={2} paddingLeft={3} borderBottom>
            <Flex align="center">
              <Box flex={1}>
                <Text size={1} weight="semibold">
                  Inspector
                </Text>
              </Box>

              <Button icon={CloseIcon} onClick={onClose} fontSize={1} mode="bleed" />
            </Flex>
          </Card>

          <Box padding={5}>
            <Text muted size={1}>
              This is a custom inspector
            </Text>
          </Box>
        </Stack>
      </Box>
    ),
  },
  // menuItem: {
  //   title: 'Inspector',
  //   icon: EyeOpenIcon,
  //   tone: 'primary',
  // },
})
