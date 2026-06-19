import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function RedakcePage() {
  const payload = await getPayloadClient()
  const users = await payload.find({
    collection: 'users',
    depth: 1,
    limit: 50,
    sort: 'name',
  })

  return (
    <>
      <section className="page-header">
        <div className="container">
          <p className="eyebrow">lidé za webem</p>
          <h1>Redakce</h1>
          <p className="page-intro">
            Autoři, fotografové, editoři a další podezřelé kulturní existence.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid">
          {users.docs.map((user: any) => {
            const avatar = typeof user.avatar === 'object' ? user.avatar : null
            return (
              <article className="static-card" key={user.id}>
                {avatar?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar.url} alt={avatar.alt || user.name} className="article-image" />
                )}
                <h2>{user.name}</h2>
                <p className="eyebrow">{user.role}</p>
                {user.bio && <p>{user.bio}</p>}
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}
