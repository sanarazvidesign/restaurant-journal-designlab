import { useState } from 'react'
import { fileToDataUrl } from '../lib/image'
import { buttonClass } from './ui'

export function PhotoInput({
  value,
  onChange,
  label = 'Photo',
}: {
  value: string | null
  onChange: (dataUrl: string | null) => void
  label?: string
}) {
  const [error, setError] = useState<string | null>(null)

  async function pick(file: File | undefined) {
    if (!file) return
    try {
      setError(null)
      onChange(await fileToDataUrl(file))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add that photo.')
    }
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="size-16 rounded-xl object-cover" />
        ) : (
          <div className="grid size-16 place-items-center rounded-xl bg-slate-100 text-xs text-slate-400">None</div>
        )}
        <label className={buttonClass('secondary', 'cursor-pointer')}>
          {value ? 'Change' : 'Add photo'}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              void pick(e.target.files?.[0])
              e.target.value = ''
            }}
          />
        </label>
        {value && (
          <button type="button" onClick={() => onChange(null)} className="text-sm font-medium text-red-700">
            Remove
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  )
}
