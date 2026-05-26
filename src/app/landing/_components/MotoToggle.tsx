'use client'

const TYPES = ['Roadster', 'Trail', 'Sportive', 'Touring', 'Café Racer', 'Autre']

interface MotoToggleProps {
  value: string[]
  onChange: (v: string[]) => void
}

export function MotoToggle({ value, onChange }: MotoToggleProps) {
  const toggle = (type: string) => {
    if (value.includes(type)) {
      onChange(value.filter(t => t !== type))
    } else {
      onChange([...value, type])
    }
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {TYPES.map(type => {
        const selected = value.includes(type)
        return (
          <button
            key={type}
            type="button"
            onClick={() => toggle(type)}
            className={[
              'py-2.5 px-3 rounded-xl text-sm font-medium border transition-all duration-150',
              selected
                ? 'bg-[#2A2A28] text-white border-[#2A2A28]'
                : 'bg-[#F4F1EC] text-[#2A2A28] border-[#E8E4DC] hover:border-[#2A2A28]',
            ].join(' ')}
          >
            {type}
          </button>
        )
      })}
    </div>
  )
}
