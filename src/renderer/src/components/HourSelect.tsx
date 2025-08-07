import React from 'react'

type HourSelectProps = {
  value: string
  onChange: (value: string) => void
  id?: string
  label?: string
  className?: string
}

export function HourSelect({ value, onChange, id, label, className }: HourSelectProps) {
  // Gera array ['00:00', '01:00', ..., '23:00']
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0') + ':00'
  )

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">Selecione uma hora</option>
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>
    </div>
  )
}
