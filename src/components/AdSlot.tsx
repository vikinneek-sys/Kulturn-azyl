type AdSlotProps = {
  slot?: string
  format?: 'auto' | 'fluid' | 'rectangle'
}

export function AdSlot({ slot, format = 'auto' }: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

  if (!client || !slot) return null

  return (
    <aside className="ad-slot" aria-label="Reklama">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: '(adsbygoogle = window.adsbygoogle || []).push({});',
        }}
      />
    </aside>
  )
}