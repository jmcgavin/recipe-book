import { Group, MultiSelect, MultiSelectProps, Text } from '@mantine/core'
import { Tag } from 'lucide-react'

const renderOption: MultiSelectProps['renderOption'] = ({ option }) => (
  <Group gap='sm'>
    <Text size='sm'>{option.value}</Text>
  </Group>
)

type Props = {
  data: string[]
  onChange: (value: string[]) => void
}

export const TagSelector = ({ data, onChange }: Props) => (
  <MultiSelect
    withAlignedLabels
    withCheckIcon
    checkIconPosition='left'
    data={data}
    label='Filter recipes by tag'
    leftSection={<Tag />}
    onChange={onChange}
    placeholder='Select recipe tags'
    renderOption={renderOption}
    styles={{ dropdown: { maxHeight: 500, overflowY: 'auto' } }}
    withScrollArea={false}
  />
)
