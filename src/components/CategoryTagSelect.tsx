'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import type { SelectFieldClient } from 'payload'
import { useEffect, useState } from 'react'
import { allArticleTags, getArticleTagsForCategory } from '@/lib/articleTags'

type Props = {
  field: SelectFieldClient
  path: string
  readOnly?: boolean
}

type Category = {
  id: number | string
  slug: string
}

let categoriesRequest: Promise<Category[]> | undefined

function isCategory(value: unknown): value is Category {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    (typeof value.id === 'number' || typeof value.id === 'string') &&
    'slug' in value &&
    typeof value.slug === 'string'
  )
}

function fetchCategories(): Promise<Category[]> {
  if (!categoriesRequest) {
    categoriesRequest = (async () => {
      const response = await fetch('/api/categories?limit=100&depth=0')
      if (!response.ok) {
        throw new Error(`Rubriky se nepodařilo načíst (${response.status}).`)
      }

      const result: unknown = await response.json()
      if (
        typeof result !== 'object' ||
        result === null ||
        !('docs' in result) ||
        !Array.isArray(result.docs)
      ) {
        throw new Error('Odpověď se seznamem rubrik nemá očekávaný formát.')
      }

      return result.docs.filter(isCategory)
    })().catch((error: unknown) => {
      categoriesRequest = undefined
      throw error
    })
  }

  return categoriesRequest
}

export function CategoryTagSelect(props: Props) {
  const categoryValue = useFormFields(([fields]) => fields.category?.value)
  const { errorMessage, setValue, showError, value } = useField<string | null>({
    potentiallyStalePath: props.path,
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    fetchCategories()
      .then((loadedCategories) => {
        if (active) setCategories(loadedCategories)
      })
      .catch((error: unknown) => {
        if (!active) return
        setLoadError(error instanceof Error ? error.message : 'Rubriky se nepodařilo načíst.')
      })

    return () => {
      active = false
    }
  }, [])

  const relationId =
    typeof categoryValue === 'object' && categoryValue !== null && 'value' in categoryValue
      ? categoryValue.value
      : categoryValue
  const categorySlug = isCategory(categoryValue)
    ? categoryValue.slug
    : categories.find((category) => String(category.id) === String(relationId))?.slug
  const options = getArticleTagsForCategory(categorySlug)
  const selectedValue = typeof value === 'string' ? value : ''
  const selectedOption = allArticleTags.find((option) => option.value === selectedValue)
  const availableOptions =
    selectedOption && !options.some((option) => option.value === selectedValue)
      ? [...options, selectedOption]
      : options

  return (
    <div className="field-type select">
      <label className="field-label" htmlFor={props.path}>
        Štítek
      </label>
      <select
        id={props.path}
        name={props.path}
        value={selectedValue}
        disabled={props.readOnly}
        aria-invalid={showError || undefined}
        aria-describedby={showError ? `${props.path}-error` : undefined}
        onChange={(event) => setValue(event.currentTarget.value || null)}
      >
        <option value="">Vyberte štítek</option>
        {availableOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {showError && errorMessage && (
        <p id={`${props.path}-error`} className="field-error" role="alert">
          {errorMessage}
        </p>
      )}
      {loadError && <p role="alert">{loadError}</p>}
      {!categorySlug && !loadError && <p>Nejdřív vyberte rubriku pro nabídku jejích štítků.</p>}
      {selectedOption && !options.some((option) => option.value === selectedValue) && (
        <p role="alert">Tento štítek nepatří do vybrané rubriky. Vyberte jiný nebo ho odeberte.</p>
      )}
    </div>
  )
}
