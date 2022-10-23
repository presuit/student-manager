import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { UserContext } from '../Providers/UserProvider'

export function useUser() {
  const { isLoading, user } = useContext(UserContext)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [isLoading, user])

  return user
}
