import { MultiSelect } from '@mantine/core'
import { Tag } from 'lucide-react'

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
    styles={{ dropdown: { maxHeight: 500, overflowY: 'auto' } }}
    withScrollArea={false}
  />
)
