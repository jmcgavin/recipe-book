import { Checkbox, Combobox, Group, Input, Pill, PillsInput, useCombobox } from '@mantine/core'
import { useEffect, useState } from 'react'

import styles from './styles.module.scss'
import { getTagIcon } from '../../../utils/icons'

type Props = {
  className?: string
  data: string[]
  onChange: (value: string[]) => void
}

export const TagSelector = ({ className, data, onChange }: Props) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  })

  const [value, setValue] = useState<string[]>([])

  const handleValueSelect = (val: string) =>
    setValue((current) => (current.includes(val) ? current.filter((v) => v !== val) : [...current, val]))

  const handleValueRemove = (val: string) => setValue((current) => current.filter((v) => v !== val))

  const values = value.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)} classNames={{ label: styles.item }}>
      {getTagIcon({ tag: item })}
      {item}
    </Pill>
  ))

  useEffect(() => {
    onChange(value)
  }, [value, onChange])

  const options = data.map((item) => (
    <Combobox.Option value={item} key={item} active={value.includes(item)}>
      <Group gap='sm'>
        <Checkbox
          checked={value.includes(item)}
          onChange={() => {}}
          aria-hidden
          tabIndex={-1}
          style={{ pointerEvents: 'none' }}
        />
        <span className={styles.item}>
          {getTagIcon({ tag: item, size: 20 })}
          {item}
        </span>
      </Group>
    </Combobox.Option>
  ))

  return (
    <div className={className}>
      <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false} size='md'>
        <Combobox.DropdownTarget>
          <PillsInput
            pointer
            onClick={() => combobox.toggleDropdown()}
            size='md'
            label='Filter recipes'
            rightSection={<Combobox.Chevron />}
            rightSectionPointerEvents='none'
          >
            <Pill.Group>
              {values.length > 0 ? values : <Input.Placeholder>Select recipe tags</Input.Placeholder>}

              <Combobox.EventsTarget>
                <PillsInput.Field
                  type='hidden'
                  onBlur={() => combobox.closeDropdown()}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' && value.length > 0) {
                      event.preventDefault()
                      handleValueRemove(value[value.length - 1])
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        <Combobox.Dropdown>
          <Combobox.Options>{options}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </div>
  )
}
