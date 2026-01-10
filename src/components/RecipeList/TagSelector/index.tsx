import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { useState } from 'react'

type Props = {
  options: string[]
}

const TagSelector = ({ options }: Props) => {
  console.log('TagSelector options:', options)
  const [selectedValues, setSelectedValues] = useState<typeof options>([])

  return (
    <Listbox value={selectedValues} onChange={setSelectedValues} multiple>
      <ListboxButton>{options.map((option) => option).join(', ')}</ListboxButton>
      <ListboxOptions anchor="bottom">
        {options.map((option) => (
          <ListboxOption key={option} value={option}>
            {option}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}

export default TagSelector
