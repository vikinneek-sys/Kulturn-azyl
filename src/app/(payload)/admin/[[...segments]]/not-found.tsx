import config from '@payload-config'
import { NotFoundPage } from '@payloadcms/next/views'

export default function NotFound() {
  return NotFoundPage({ config })
}
