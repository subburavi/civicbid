import { useState } from 'react'
import { Toggle } from '../ui/Toggle'
import { useDropzone } from 'react-dropzone'
import { useToast } from '../../context/ToastContext'

function FileField({ field, value, onChange }) {
  const { addToast } = useToast()
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: field.accept
      ? Object.fromEntries(
          field.accept.split(',').map(ext => {
            const map = { '.pdf': 'application/pdf', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' }
            return [map[ext.trim()] || ext.trim(), [ext.trim()]]
          })
        )
      : undefined,
    multiple: false,
    onDrop: files => {
      if (files[0]) {
        onChange(files[0])
        addToast({ message: `File "${files[0].name}" attached`, type: 'success' })
      }
    },
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all text-center ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />
      {value ? (
        <div className="flex items-center gap-2 justify-center">
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 20 20">
            <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-medium text-green-600">{value.name}</span>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onChange(null) }}
            className="text-gray-400 hover:text-gray-600 ml-1"
          >✕</button>
        </div>
      ) : (
        <div>
          <svg className="w-6 h-6 text-gray-300 mx-auto mb-1" fill="none" viewBox="0 0 24 24">
            <path d="M12 4v12M8 10l4-6 4 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <p className="text-xs text-gray-400">
            {isDragActive ? 'Drop here' : 'Drag & drop or click to upload'}
          </p>
          {field.accept && <p className="text-[10px] text-gray-300 mt-0.5">{field.accept}</p>}
        </div>
      )}
    </div>
  )
}

export function FormGenerator({ fields, values, onChange }) {
  return (
    <div className="space-y-4">
      {fields.map(field => (
        <div key={field.id}>
          <label className="label">
            {field.label}
            {field.required && <span className="text-red-400 ml-0.5">*</span>}
          </label>

          {field.type === 'text' && (
            <input
              type="text"
              placeholder={field.placeholder}
              value={values[field.id] || ''}
              onChange={e => onChange(field.id, e.target.value)}
              className="input-field"
            />
          )}

          {field.type === 'number' && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
              <input
                type="number"
                placeholder={field.placeholder}
                value={values[field.id] || ''}
                onChange={e => onChange(field.id, e.target.value)}
                className="input-field pl-7"
              />
            </div>
          )}

          {field.type === 'boolean' && (
            <div className="bg-gray-50 rounded-xl p-3">
              <Toggle
                id={field.id}
                checked={!!values[field.id]}
                onChange={v => onChange(field.id, v)}
                label={field.description || field.label}
              />
            </div>
          )}

          {field.type === 'select' && (
            <select
              value={values[field.id] || ''}
              onChange={e => onChange(field.id, e.target.value)}
              className="input-field"
            >
              <option value="">Select an option...</option>
              {field.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          {field.type === 'file' && (
            <>
              {field.description && <p className="text-xs text-gray-400 mb-2">{field.description}</p>}
              <FileField
                field={field}
                value={values[field.id] || null}
                onChange={v => onChange(field.id, v)}
              />
            </>
          )}
        </div>
      ))}
    </div>
  )
}
