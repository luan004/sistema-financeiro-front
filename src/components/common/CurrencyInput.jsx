import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

function formatCurrency(value) {
  if (!value) {
    return ''
  }

  const digits = String(value).replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  const cents = digits.slice(-2).padStart(2, '0')
  const integer = digits.slice(0, -2) || '0'

  const formattedInteger = integer.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    '.',
  )

  return `${formattedInteger},${cents}`
}

function parseCurrency(value) {
  const digits = String(value).replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  const limitedDigits = digits.slice(0, 14)

  const cents = limitedDigits.slice(-2).padStart(2, '0')
  const integer = limitedDigits.slice(0, -2) || '0'

  return `${integer}.${cents}`
}

function getDigitsFromValue(value) {
  if (!value) {
    return ''
  }

  const normalized = String(value).replace(',', '.')
  const [integer = '', decimal = ''] = normalized.split('.')

  return `${integer.replace(/\D/g, '')}${decimal
    .replace(/\D/g, '')
    .padEnd(2, '0')
    .slice(0, 2)}`
}

export function CurrencyInput({
  value = '',
  onValueChange,
  className,
  ...props
}) {
  const inputRef = useRef(null)

  const [displayValue, setDisplayValue] = useState(() =>
    formatCurrency(getDigitsFromValue(value)),
  )

  useEffect(() => {
    const digits = getDigitsFromValue(value)

    setDisplayValue(formatCurrency(digits))
  }, [value])

  function moveCursorToEnd() {
    requestAnimationFrame(() => {
      const input = inputRef.current

      if (!input) {
        return
      }

      const position = input.value.length

      input.setSelectionRange(position, position)
    })
  }

  function handleChange(event) {
    let digits = event.target.value.replace(/\D/g, '')

    if (digits.length > 14) {
      digits = digits.slice(0, 14)
    }

    const formatted = formatCurrency(digits)
    const parsed = parseCurrency(formatted)

    setDisplayValue(formatted)
    onValueChange?.(parsed)

    moveCursorToEnd()
  }

  function handleKeyDown(event) {
    const input = event.currentTarget

    if (event.key === 'Backspace') {
      event.preventDefault()

      const digits = input.value.replace(/\D/g, '')

      if (!digits) {
        return
      }

      const newDigits = digits.slice(0, -1)

      const formatted = formatCurrency(newDigits)
      const parsed = parseCurrency(formatted)

      setDisplayValue(formatted)
      onValueChange?.(parsed)

      moveCursorToEnd()

      return
    }

    if (event.key === 'Delete') {
      event.preventDefault()
      return
    }

    if (
      event.key.length === 1 &&
      !/[0-9]/.test(event.key)
    ) {
      event.preventDefault()
    }
  }

  function handleFocus() {
    moveCursorToEnd()
  }

  function handleClick() {
    moveCursorToEnd()
  }

  return (
    <div
      className={cn(
        'flex h-9 w-full min-w-0 items-center rounded-md border border-input bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30',
        className,
      )}
    >
      <span className="pl-2.5 text-sm text-muted-foreground">
        R$
      </span>

      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onClick={handleClick}
        placeholder="0,00"
        className="h-full w-full min-w-0 bg-transparent px-1.5 py-1 text-base outline-none placeholder:text-muted-foreground md:text-sm"
        {...props}
      />
    </div>
  )
}