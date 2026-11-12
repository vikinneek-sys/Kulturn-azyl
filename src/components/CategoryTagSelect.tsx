'use client'

import { SelectField } from '@payloadcms/ui/fields/Select'
import { useFormFields } from '@payloadcms/ui'
import type { SelectFieldClient } from 'payload'
import { useEffect, useState } from 'react'
import { allArticleTags, getArticleTagsForCategory } from '@/lib/articleTags'

type Props = {
  field: SelectFieldClient
  path: string
  value?: string | string[]
  onChange?: (value: string | string[]) => void
}

type Category = {
  id: number | string
  slug: string
}

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

async function fetchCategories(): Promise<Category[]> {
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
}

export function CategoryTagSelect(props: Props) {
  const categoryValue = useFormFields(([fields]) => fields.category?.value)
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
  const selectedValue = Array.isArray(props.value) ? props.value[0] : props.value
  const selectedOption = allArticleTags.find((option) => option.value === selectedValue)
  const availableOptions =
    selectedOption && !options.some((option) => option.value === selectedValue)
      ? [...options, selectedOption]
      : options

  return (
    <>
      <SelectField
        {...props}
        field={{ ...props.field, options: availableOptions }}
        onChange={props.onChange}
      />
      {loadError && <p role="alert">{loadError}</p>}
      {!categorySlug && !loadError && <p>Nejdřív vyberte rubriku pro nabídku jejích štítků.</p>}
      {selectedOption && !options.some((option) => option.value === selectedValue) && (
        <p role="alert">Tento štítek nepatří do vybrané rubriky. Vyberte jiný nebo ho odeberte.</p>
      )}
    </>
  )
}
