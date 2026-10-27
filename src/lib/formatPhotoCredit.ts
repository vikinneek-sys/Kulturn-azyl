export function formatPhotoCredit(credit?: string | null) {
  const formattedCredit = credit?.replace(/^\s*foto\s*:\s*/i, '').trim()
  return formattedCredit || null
}
