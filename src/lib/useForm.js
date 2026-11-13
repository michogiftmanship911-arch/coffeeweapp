import { useCallback, useState } from 'react'

/**
 * Tiny form helper: values, per-field errors (shown after blur / submit),
 * and a submit wrapper that only calls your handler when everything is valid.
 * `validate(values)` must return an object of { field: 'message' } (empty = valid).
 */
export function useForm(initial, validate) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const onChange = useCallback(
    (e) => {
      const { name, value } = e.target
      setValues((prev) => {
        const next = { ...prev, [name]: value }
        if (touched[name]) setErrors((er) => ({ ...er, [name]: validate(next)[name] }))
        return next
      })
    },
    [touched, validate],
  )

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const onBlur = useCallback(
    (e) => {
      const { name } = e.target
      setTouched((t) => ({ ...t, [name]: true }))
      setErrors((er) => ({ ...er, [name]: validate(values)[name] }))
    },
    [validate, values],
  )

  const submit = (handler) => (e) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    setTouched(Object.keys(values).reduce((a, k) => ({ ...a, [k]: true }), {}))
    if (!Object.values(errs).some(Boolean)) handler(values)
  }

  const reset = useCallback(() => {
    setValues(initial)
    setErrors({})
    setTouched({})
  }, [initial])

  return { values, errors, onChange, onBlur, setValue, submit, reset }
}
