type Role = 'admin' | 'editor' | 'redaktor'

type UserLike = {
  id?: string | number
  role?: Role
} | null | undefined

export const role = (user: UserLike) => user?.role

export const isLoggedIn = ({ req: { user } }: any) => Boolean(user)
export const isAdmin = (user: UserLike) => role(user) === 'admin'
export const isEditor = (user: UserLike) => role(user) === 'editor'
export const isRedaktor = (user: UserLike) => role(user) === 'redaktor'
export const isAdminOrEditorUser = (user: UserLike) => isAdmin(user) || isEditor(user)

export const anyone = () => true
export const admins = ({ req: { user } }: any) => isAdmin(user as UserLike)
export const adminsAndEditors = ({ req: { user } }: any) => isAdminOrEditorUser(user as UserLike)
export const authenticated = ({ req: { user } }: any) => Boolean(user)

export const adminsEditorsOrAuthor = ({ req: { user } }: any) => {
  if (!user) return false
  if (isAdminOrEditorUser(user as UserLike)) return true

  // Redaktor muze upravovat jen dokumenty, kde je nastaven jako autor.
  return {
    author: {
      equals: user.id,
    },
  }
}
