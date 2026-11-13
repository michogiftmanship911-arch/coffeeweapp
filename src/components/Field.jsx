/** Labelled glass input / textarea / select with inline validation message. */
export default function Field({ label, name, error, hint, as: Tag = 'input', icon: Icon, right, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-cream-100/90">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-gold-300/80" />}
        <Tag
          id={name}
          name={name}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`field ${Icon ? 'pl-10' : ''} ${right ? 'pr-12' : ''} ${error ? 'field-error' : ''}`}
          {...props}
        />
        {right && <div className="absolute right-1.5 top-1.5">{right}</div>}
      </div>
      {error ? (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-xs text-rose-300">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-cream-200/60">{hint}</p>
      )}
    </div>
  )
}
